
import fs from 'fs';
import folderService from '../../folder_service/FolderService';
import cybertronService from '../../cybertron_service/CybertronService';
import lineParser from '../../line_parser/LineParser';
import gptService from '../../gpt_service/GPTService';
import projectService from '../ProjectService';

class StorageService {
  constructor() {
    this.saveTimer = null;
  }

  /**
   * Clears all references to data that was previously loaded.
   */
  clear() {
    projectService.textFragments = [];
    projectService.content = '';
    lineParser.clear();
    folderService.clear();
    cybertronService.transformers.forEach(transformer => transformer.cache.clearCache());
    gptService.modelsMap = {};
  }

  /**
   * Sets everything up for a new project.
   */
  new() {
    this.clear();
    projectService.dispatchEvent('content-changed');
    projectService.setIsDirty(false);
  }

  /**
   * Loads all the data from disk.
   * @param {string} filePath - The path of the file to be loaded.
   */
  open(filePath) {
    projectService.blockEvents = true;
    this.loading = true;
    try {
      this.clear();
      folderService.setLocation(filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      projectService.content = content;
      projectService.filename = filePath;
      content.split('\n').forEach((line, index) => lineParser.parse(line, index));
      cybertronService.transformers.forEach(transformer => transformer.cache.loadCache());
      this.loadModelsMap(filePath);
    } finally {
      projectService.blockEvents = false;
      projectService.dispatchEvent('content-changed');
      this.loading = false
      projectService.setIsDirty(false);
    }
    this.updateOutOfDate();
  }

  /**
   * Loads the json file that defines the models to be used with the project.
   * @param {string} filePath - The path of the file to be loaded.
   */
  loadModelsMap(filePath) {
    const jsonFilePath = filePath.replace('.md', '_models.json');
    if (fs.existsSync(jsonFilePath)) {
      const modelsMap = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
      gptService.modelsMap = modelsMap;
    }
  }

  /**
   * Updates the list of out-of-date transformers for each text-fragment.
   */
  updateOutOfDate() {
    projectService.textFragments.forEach(fragment => {
      const outOfDateTransformers = cybertronService.transformers.filter(transformer => transformer.cache.isOutOfDate(fragment.key));
      if (outOfDateTransformers.length === cybertronService.transformers.length) {
        projectService.markOutOfDate(fragment);
      } else if (outOfDateTransformers.length > 0) {
        fragment.outOfDateTransformers = outOfDateTransformers;
        projectService.markOutOfDate(fragment);
      }
    });
  }

  /**
   * Marks the current state of the storage as 'dirty', indicating that changes have been made that are not yet saved.
   */
  markDirty() {
    if (this.loading) return;
    projectService.setIsDirty(true);
    // console.log(projectService.autoSave);
    // console.log(projectService.filename);
    // console.log(!projectService.saveTimer);
    if (projectService.autoSave && projectService.filename && !this.saveTimer) {
      this.saveTimer = setTimeout(() => {
        this.save(projectService.filename);
      }, 5000)
    }
  }

  /**
   * Saves the project to disk.
   * @param {string} file - The path where the project will be saved.
   */
  async save(file) {
    if (!projectService.filename) {
      folderService.moveTo(file);
    } else if (projectService.filename !== file) {
      folderService.copyTo(file);
    }
    await fs.promises.writeFile(file, projectService.content, 'utf8');
    for (const transformer of cybertronService.transformers) {
      await transformer.cache.saveCache();
    }
    await this.saveModelsMap(file);
    projectService.filename = file;
    projectService.setIsDirty(false);
    this.saveTimer = null;
  }

  /**
   * Saves the models map to a json file.
   * @param {string} file - The path where the json file will be saved.
   */
  async saveModelsMap(file) {
    const jsonFilePath = file.replace('.md', '_models.json');
    const modelsMapString = JSON.stringify(gptService.modelsMap);
    await fs.promises.writeFile(jsonFilePath, modelsMapString, 'utf8');
  }
}

export default new StorageService();
