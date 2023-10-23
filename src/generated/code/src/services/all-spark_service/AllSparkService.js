import CybertronService from '../cybertron_service/CybertronService';
import folderService from '../folder_service/FolderService';
import ConstantExtractorService from '../constant-extractor_service/ConstantExtractorService';
import PluginRendererService from '../transformers/plugin-renderer_service/PluginRendererService';
import PluginListRendererService from '../transformers/plugin-list_renderer_service/PluginListRendererService';
import PluginTransformerService from '../transformers/plugin-transformer_service/PluginTransformerService';
import fs from 'fs';
import path from 'path';

/**
 * AllSparkService class
 * This class is responsible for creating all the transformers and registering them into the cybertron service.
 */
class AllSparkService {
  constructor() {
    this.plugins = null;
    this.load();
  }

  /**
   * GetPlugins function
   * This function returns a list of plugin definitions.
   */
  async getPlugins() {
    if (!this.plugins) {
      await this.loadPlugins();
    }
    return this.plugins;
  }

  /**
   * LoadPlugins function
   * This function loads the plugins from the project-local file or the globally available set of plugins.
   */
  async loadPlugins() {
    let pluginsPath = path.join(folderService.pluginsOutput, 'plugins.json');
    if (!fs.existsSync(pluginsPath)) {
      const userDataPath = await window.electron.getPath('userData');
      pluginsPath = path.join(userDataPath, 'plugins', 'plugins.json');
    }
    if (fs.existsSync(pluginsPath)) {
      const plugins = fs.readFileSync(pluginsPath);
      this.plugins = JSON.parse(plugins);
    } else  {
      this.plugins = [];
    }
  }

  /**
   * LoadPlugin function
   * This function loads a plugin from a script tag.
   * @param {string} definition - The path to the plugin script.
   */
  loadPlugin(definition) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = definition;
      script.onload = () => {
        resolve(window[definition]);
      };
      script.onerror = (error) => {
        reject(error);
      };
      document.body.appendChild(script);
    });
  }

  /**
   * Load function
   * This function creates the transformers and register them with the cybertron-service.
   */
  async load() {
    CybertronService.register(new ConstantExtractorService(), false);
    CybertronService.register(new PluginRendererService(), true);
    CybertronService.register(new PluginListRendererService(), true);


    const pluginDefs = await this.getPlugins();
    for (const pluginDef of pluginDefs) {
      const pluginObj = await this.loadPlugin(pluginDef);
      const pluginTransformer = new PluginTransformerService(pluginObj);
      CybertronService.register(pluginTransformer, pluginTransformer.isEntryPoint);
    }
  }
}

export default new AllSparkService();