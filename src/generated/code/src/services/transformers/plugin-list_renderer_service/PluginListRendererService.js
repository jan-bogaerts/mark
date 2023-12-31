
import fs from 'fs';
import path from 'path';
import TransformerBaseService from '../../transformer-base_service/TransformerBaseService';
import folderService from '../../folder_service/FolderService';

/**
 * PluginListRendererService class
 * Inherits from TransformerBaseService
 * Responsible for generating a file containing all the plugins that need to be loaded
 */
class PluginListRendererService extends TransformerBaseService {
  /**
   * Constructor for PluginListRendererService
   * @param {Array} dependencies - Array of dependencies
   */
  constructor() {
    super('plugin-list renderer', ['plugin renderer'], true);
    this.isFullRender = true;
  }

  load() {
    super.load();
    this.pluginRendererService = this.dependencies[0];
  }

  /**
   * Saves the array to file
   * @param {Array} items - Array of items to be saved
   */
  saveFile(items) {
    const rootFolder = folderService.output;
    if (!fs.existsSync(rootFolder)) {
      fs.mkdirSync(rootFolder);
    }
    const filePath = path.join(rootFolder, "plugins.json");
    fs.writeFileSync(filePath, JSON.stringify(items));
  }

  /**
   * Builds the array of files, (a file for each fragment), provided by the plugin-renderer and saves it to the output folder
   * @param {Array} fragments - Array of fragments
   */
  async renderResults(fragments) {
    const items = [];
    const output = folderService.output;
    for (const fragment of fragments) {
      let item = await this.pluginRendererService.getResult(fragment);
      if (item && !item.endsWith('shared.js')) {
        item = path.relative(output, item);
        items.push(item);
        this.cache.setResult(fragment.key, item, item);
      } else {
        this.cache.setResult(fragment.key, "", "");
      }
    }
    this.saveFile(items);
  }

  buildMessage(fragment) {
    return ['', []];
  }
}

export default PluginListRendererService;
