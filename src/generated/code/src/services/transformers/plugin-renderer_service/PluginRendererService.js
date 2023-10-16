
import fs from 'fs';
import path from 'path';
import resources from '../../../resources.json';
import FolderService from '../../folder_service/FolderService';
import GPTService from '../../gpt_service/GPTService';
import TransformerBaseService from '../../transformer-base_service/TransformerBaseService';

/**
 * PluginRendererService class
 * Translates a plugin definition into a javascript module
 * Inherits from TransformerBaseService
 */
class PluginRendererService extends TransformerBaseService {
  constructor() {
    super('plugin renderer', ['constants'], false);
    this.constantsService = this.dependencies[0];
  }

  /**
   * Save the content to a file
   * @param {string} key - The key to be used as filename
   * @param {string} content - The content to be written to the file
   * @returns {string} - The path of the saved file
   */
  saveFile(key, content) {
    const rootFolder = FolderService.output;
    if (!fs.existsSync(rootFolder)) {
      fs.mkdirSync(rootFolder);
    }
    const fileName = key.replace(" > ", "_").replace(" ", "_");
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
      return content;
    }
  }

  /**
   * Render the result
   * @param {object} fragment - The fragment to be rendered
   * @returns {string} - The filename of the rendered result
   */
  async renderResult(fragment) {
    const [message, keys] = await this.buildMessage(fragment);
    if (!message) {
      return null;
    }
    let result = await GPTService.sendRequest(this, fragment.key, message);
    result = this.cleanResult(result);
    const filename = this.saveFile(fragment.key, result);
    const key = keys.join(' | ');
    this.cache.setResult(key, filename);
    return filename;
  }

  /**
   * Build the message
   * @param {object} fragment - The fragment to be used to build the message
   * @returns {Array} - The built message and keys
   */
  async buildMessage(fragment) {
    const result = [
      { role: 'system', content: resources.MarkdownCode_services_transformers_plugin_renderer_service_0 },
      { role: 'user', content: resources.MarkdownCode_services_transformers_plugin_renderer_service_1.replace('{{title}}', fragment.title).replace('{{content}}', await this.constantsService.getResult(fragment)) }
    ];
    return [result, [fragment.key]];
  }
}

export default PluginRendererService;
