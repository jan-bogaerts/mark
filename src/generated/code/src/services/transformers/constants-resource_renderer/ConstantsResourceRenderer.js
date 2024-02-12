
import fs from 'fs';
import path from 'path';
import FolderService from '../../folder_service/FolderService';
import TransformerBaseService from '../../transformer-base_service/TransformerBaseService';

/**
 * ConstantsResourceRenderer class
 * Inherits from TransformerBaseService
 * Responsible for creating the resource file that contains all the constants found in the fragments
 */
class ConstantsResourceRenderer extends TransformerBaseService {
  /**
   * ConstantsResourceRenderer constructor
   */
  constructor() {
    super('constants resource renderer', ['constants'], true);
    this.isFullRender = true;
  }

  load() {
    super.load();
    this.constantsService = this.dependencies[0];
  }

  /**
   * Save the array to file
   * @param {Object} items - The items to be saved
   */
  saveFile(items) {
    const rootFolder = FolderService.output;
    if (!fs.existsSync(rootFolder)) {
      fs.mkdirSync(rootFolder);
    }
    const filePath = path.join(rootFolder, "resources.json");
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
  }

  /**
   * Builds the json dictionary of constants and saves it
   * @param {Array} fragments - The fragments to be rendered
   */
  async renderResults(fragments) {
    const items = {};
    for (const fragment of fragments) {
      const fragmentResults = {};
      const constants = await this.constantsService.cache.getResult(fragment.key);
      if (constants) {
        for (const constant of constants) {
          const text = constant.lines.join('\n');
          items[constant.name] = text;
          fragmentResults[constant.name] = text;
        }
      }
      this.cache.setResult(fragment.key, fragmentResults, fragmentResults);
    }
    this.saveFile(items);
  }

  buildMessage(fragment) {
    return [[], []];
  }
}

export default ConstantsResourceRenderer;
