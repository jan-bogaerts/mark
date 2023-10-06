
import fs from 'fs';
import path from 'path';
import os from'os';

/**
 * FolderService class
 */
class FolderService {
  constructor() {
    this.folder = '';
    this.projectName = 'new project';
    this.cache = '';
  }

  get projectFile() {
    return path.join(this.folder, `${this.projectName}.json`);
  }

  get projectConfig() {
    return path.join(this.folder, `${this.projectName}_config.json`);
  }

  clear() {
    this.folder = fs.mkdtempSync(path.join(os.tmpdir(), 'project-'));
    this.projectName = 'new project';
    this.cache = path.join(this.folder, 'cache');
    fs.mkdirSync(this.cache);
  }

  moveTo(newProjectFile) {
    const newFolder = path.dirname(newProjectFile);
    const newProjectName = path.basename(newProjectFile, '.md');

    if (fs.existsSync(this.projectFile)) {
      fs.renameSync(this.projectFile, path.join(newFolder, `${newProjectName}.md`));
    }

    const newProjectConfig = path.join(newFolder, `${newProjectName}_config.json`);
    if (fs.existsSync(this.projectConfig)) {
      fs.renameSync(this.projectConfig, newProjectConfig);
    }

    const newCache = path.join(newFolder, 'cache');
    if (!fs.existsSync(newCache)) {
      fs.mkdirSync(newCache);
    }
    if (fs.existsSync(this.cache)) {
      fs.readdirSync(this.cache).forEach(file => {
        fs.renameSync(path.join(this.cache, file), path.join(newCache, file));
      });
    }

    this.folder = newFolder;
    this.projectName = newProjectName;
    this.cache = newCache;
  }

  copyTo(newProjectFile) {
    const newFolder = path.dirname(newProjectFile);
    const newProjectName = path.basename(newProjectFile, '.json');

    if (fs.existsSync(this.projectFile)) {
      fs.copyFileSync(this.projectFile, path.join(newFolder, `${newProjectName}.json`));
    }

    const newProjectConfig = path.join(newFolder, `${newProjectName}_config.json`);
    if (fs.existsSync(this.projectConfig)) {
      fs.copyFileSync(this.projectConfig, newProjectConfig);
    }

    const newCache = path.join(newFolder, 'cache');
    fs.mkdirSync(newCache);
    if (fs.existsSync(this.cache)) {
      fs.readdirSync(this.cache).forEach(file => {
        fs.copyFileSync(path.join(this.cache, file), path.join(newCache, file));
      });
    }

    this.folder = newFolder;
    this.projectName = newProjectName;
    this.cache = newCache;
  }

  setLocation(location) {
    this.folder = path.dirname(location);
    this.projectName = path.basename(location);
    this.cache = path.join(this.folder, 'cache');
  }
}

export default new FolderService();
