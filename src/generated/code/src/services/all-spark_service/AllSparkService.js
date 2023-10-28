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
    this.plugins = null;
    this.eventTarget = new EventTarget();
    this.load();
  }

  async getPlugins() {
    if (!this.plugins) {
      await this.getPluginsList();
    }
    return this.plugins;
  }

  async getPluginsList() {
    let pluginFolder = folderService.pluginsOutput;
    let pluginsPath = path.join(pluginFolder, 'plugins.json');
    if (!fs.existsSync(pluginsPath)) {
      const userDataPath = await window.electron.getPath('userData');
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
    await this.getPluginsList();
  }

  async loadPlugin(definition) {
    try {
      const plugin = global.require(definition);
      return plugin;
    }
    catch(error){
      DialogService.showErrorDialog(`Error loading plugin ${definition}`, error);
    }
  }

  async unloadPlugin(definition) {
    try {
      const name = require.resolve(definition);
      delete require.cache[name];
    }
    catch(error){
      DialogService.showErrorDialog(`Error unloading plugin ${definition}`, error);
    }
  }

  async load() {
    CybertronService.register(new ConstantExtractorService(), false);
    CybertronService.register(new PluginRendererService(), true);
    CybertronService.register(new PluginListRendererService(), true);
    CybertronService.register(new ConstantsResourceRendererService(), true);
    CybertronService.register(new ParserValidatorService(), false);

    await this.loadPlugins();
  }

  async loadPlugins() {
    const pluginDefs = await this.getPlugins();
    for (const pluginDef of pluginDefs) {
      const pluginObj = await this.loadPlugin(pluginDef);
      const pluginTransformer = new PluginTransformerService(pluginObj);
      CybertronService.register(pluginTransformer, pluginTransformer.isEntryPoint);
    }
    this.eventTarget.dispatchEvent(new Event('transformers-loaded'));
  }
}

export default new AllSparkService();