
import fs from 'fs';
import path from 'path';
import resources from '../../../resources.json';
import FolderService from '../../folder_service/FolderService';
import GPTService from '../../gpt_service/GPTService';
import ProjectService from '../../project_service/ProjectService';
import TransformerBaseService from '../../transformer-base_service/TransformerBaseService';
import KeyService from '../../key_service/KeyService';

/**
 * PluginRendererService class
 * Inherits from TransformerBaseService
 */
class PluginRendererService extends TransformerBaseService {
  constructor() {
    super('plugin renderer', ['constants'], false, true);
  }

  load() {
    super.load();
    this.constantsService = this.dependencies[0];
  }

  /**
   * Save file to the output folder
   * @param {object} fragment - the fragment that was rendered
   * @param {string} content - The content of the file
   * @returns {string} - The path of the saved file
   */
  saveFile(fragment, content) {
    const rootFolder = FolderService.output;
    if (!fs.existsSync(rootFolder)) {
      fs.mkdirSync(rootFolder);
    }
    const location = KeyService.calculateLocation(fragment);
    const fileName = location.replaceAll(" > ", "_").replaceAll(" ", "_").replaceAll("-", "_");
    const filePath = path.join(rootFolder, fileName + ".js");
    fs.writeFileSync(filePath, content);
    return filePath;
  }

  /**
   * Clean the result content
   * @param {string} content - The content to be cleaned
   * @returns {string} - The cleaned content
   */
  cleanResult(content) {
    if (content) {
      content = content.trim();
      if (content.startsWith("```javascript")) {
        content = content.substring("```javascript".length);
      }
      if (content.endsWith("```")) {
        content = content.substring(0, content.length - "```".length);
      }
    }
    return content;
  }

  /**
   * Render the result
   * @param {object} fragment - The fragment to be rendered
   * @returns {Promise<string>} - The path of the rendered file
   */
  async renderResult(fragment) {
    const location = KeyService.calculateLocation(fragment);
    const hasShared = ProjectService.textFragments.some(f => f.title === 'shared');
    const [message,] = await this.buildMessage(fragment, location.endsWith('> shared'), hasShared);
    if (!message) {
      return null;
    }
    let filename = '';
    if (fragment.lines.length) {
      const result = await GPTService.sendRequest(this, fragment.key, message);
      const cleanedResult = this.cleanResult(result);
      filename = this.saveFile(fragment, cleanedResult);
    };
    this.cache.setResult(fragment.key, filename, message);
    return filename;
  }

  /**
   * Build the message
   * @param {object} fragment - The fragment to be used in the message
   * @param {boolean} asShared - Whether the fragment is shared
   * @param {boolean} hasShared - Whether there is a shared fragment
   * @returns {Promise<Array>} - The built message and keys
   */
  async buildMessage(fragment, asShared, hasShared) {
    if (!fragment) {
      return null;
    }
    const nonEmptyLines = fragment.lines.filter(x => x.trim().length > 0);
    if (nonEmptyLines.length === 0) {
      return [null, []];
    }
    let result = [];
    if (asShared) {
      result = [
        { role: 'system', content: resources.MarkdownCode_services_transformers_plugin_renderer_service_0 },
        { role: 'user', content: resources.MarkdownCode_services_transformers_plugin_renderer_service_1.replace('{{content}}', await this.constantsService.getResult(fragment)) }
      ];
    } else {
      result = [
        { role: 'system', content: resources.MarkdownCode_services_transformers_plugin_renderer_service_2.replace('{{sharedImport}}', hasShared ? `const shared = require('./shared.js');` : '') },
        { role: 'user', content: resources.MarkdownCode_services_transformers_plugin_renderer_service_3.replace('{{title}}', fragment.title).replace('{{content}}', await this.constantsService.getResult(fragment)) }
      ];
    }
    return [result, []];
  }
}

export default PluginRendererService;
