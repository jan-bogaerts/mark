
const remote = window.require("@electron/remote");
const fs = remote.require('fs');
const FolderService = require('../../folder_service/FolderService');
const CybertronService = require('../../cybertron_service/CybertronService');
const PositionTrackingService = require('../../position-tracking_service/PositionTrackingService');
const ProjectService = require('../ProjectService');
const LineParser = require('../../line_parser/LineParser');

class StorageService {
  constructor() {
    this.saveTimer = null;
  }

  /**
   * Clears all references to data that was previously loaded
   */
  clear() {
    ProjectService.textFragments = [];
    ProjectService.content = '';
    LineParser.clear();
    PositionTrackingService.clear();
    FolderService.clear();
    CybertronService.transformers.forEach(transformer => transformer.cache.clearCache());
  }

  /**
   * Sets up everything for a new project
   */
  new() {
    this.clear();
    ProjectService.eventTarget.dispatchEvent(new Event('content-changed'));
  }

  /**
   * Loads all the data from disk
   * @param {string} filePath - The path of the file to be loaded
   */
  open(filePath) {
    this.clear();
    FolderService.setLocation(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    ProjectService.content = content;
    content.split('\n').forEach((line, index) => LineParser.parse(line, index));
    CybertronService.transformers.forEach(transformer => transformer.cache.loadCacheFromFile());
    this.updateOutOfDate();
    ProjectService.eventTarget.dispatchEvent(new Event('content-changed'))
  }

  /**
   * Updates the list of out-of-date transformers for each text-fragment
   */
  updateOutOfDate() {
    ProjectService.textFragments.forEach(fragment => {
      const outOfDateTransformers = CybertronService.transformers.filter(transformer => transformer.cache.isOutOfDate(fragment.key));
      if (outOfDateTransformers.length === CybertronService.transformers.length) {
        ProjectService.markOutOfDate(fragment);
      } else if (outOfDateTransformers.length > 0) {
        fragment.outOfDateTransformers = outOfDateTransformers;
        ProjectService.markOutOfDate(fragment);
      }
    });
  }

  /**
   * Marks the project as dirty after changes have been made
   */
  markDirty() {
    if (ProjectService.autoSave && ProjectService.filename && !this.saveTimer) {
      this.saveTimer = setTimeout(() => {
        this.save(ProjectService.filename);
      }, 5000);
    }
  }

  /**
   * Saves the project to disk
   * @param {string} file - The path where the project will be saved
   */
  async save(file) {
    if (!ProjectService.filename) {
      FolderService.moveTo(file);
    } else if (ProjectService.filename !== file) {
      FolderService.copyTo(file);
    }
    await fs.promises.writeFile(file, ProjectService.content, 'utf8');
    for (const transformer of CybertronService.transformers) {
      await transformer.cache.saveCacheToFile();
    }
    ProjectService.filename = file;
    this.saveTimer = null;
  }
}

export default new StorageService();
