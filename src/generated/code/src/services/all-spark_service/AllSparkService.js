import CybertronService from '../cybertron_service/CybertronService';
import folderService from '../folder_service/FolderService';
import ConstantExtractorService from '../transformers/constant-extractor_service/ConstantExtractorService';
import PluginRendererService from '../transformers/plugin-renderer_service/PluginRendererService';
import PluginListRendererService from '../transformers/plugin-list_renderer_service/PluginListRendererService';
import ConstantsResourceRendererService from '../transformers/constants-resource_renderer/ConstantsResourceRenderer';
import ParserValidatorService from '../transformers/parser_validator_service/ParserValidatorService';
import PluginTransformerService from '../transformers/plugin-transformer_service/PluginTransformerService';
import DialogService from '../dialog_service/DialogService';
import fs from 'fs';
import path from 'path';

class AllSparkService {
  constructor() {
    this.eventTarget = new EventTarget();
    this.transformers = {};
	  this.plugins = null;
  }

  getPlugins() {
    if (!this.plugins) {
      this.getPluginsList();
    }
    return this.plugins;
  }

  getPluginsList() {
    let pluginFolder = folderService.pluginsOutput;
    let pluginsPath = path.join(pluginFolder, 'plugins.json');
    if (!fs.existsSync(pluginsPath)) {
      const userDataPath = window.electron.resourcesPath;
      pluginFolder = path.join(userDataPath, 'plugins');
      pluginsPath = path.join(pluginFolder, 'plugins.json');
    }
    if (fs.existsSync(pluginsPath)) {
      const plugins = fs.readFileSync(pluginsPath);
      this.plugins = JSON.parse(plugins);
      for (let i = 0; i < this.plugins.length; i++) {
        this.plugins[i] = path.join(pluginFolder, this.plugins[i]);
      }
    } else  {
      this.plugins = [];
    }
  }

  async refreshPlugins() {
    for (const plugin of this.plugins) {
      await this.unloadPlugin(plugin);
    }
    this.getPluginsList();
    await this.loadPlugins();
  }

  async loadPlugin(definition) {
    try {
      const plugin = global.require(definition);
      return plugin;
    }
    catch(error){
      console.log(error);
      DialogService.showErrorDialog(`Error loading plugin ${definition}`, error);
    }
  }

  async unloadPlugin(definition) {
    try {
      CybertronService.unregister(this.transformers[definition]);
      delete require.cache[definition];
      delete this.transformers[definition];
    }
    catch(error){
      DialogService.showErrorDialog(`Error unloading plugin ${definition}`, error);
    }
  }

  async load() {
    if (window.electron.isLogMode === true) return;
    CybertronService.register(new ConstantExtractorService(), false);
    CybertronService.register(new PluginRendererService(), true);
    CybertronService.register(new PluginListRendererService(), true);
    CybertronService.register(new ConstantsResourceRendererService(), true);
    CybertronService.register(new ParserValidatorService(), false);

    await this.loadPlugins();
  }

  async loadPlugins() {
    if (window.electron.isPluginMode === true || window.electron.isLogMode === true) return;
    /*const pluginDefs = this.getPlugins();
    for (const pluginDef of pluginDefs) {
      const pluginObj = await this.loadPlugin(pluginDef);
      const pluginTransformer = new PluginTransformerService(pluginObj);
      this.transformers[pluginDef] = pluginTransformer;
      CybertronService.register(pluginTransformer, pluginTransformer.isEntryPoint);
    }*/
    this.eventTarget.dispatchEvent(new Event('transformers-loaded'));
  }
}

export default new AllSparkService();