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
    this.plugins = '';
    this.output = '';
  }

  get projectFile() {
    return path.join(this.folder, `${this.projectName}.json`);
  }

  get projectConfig() {
    return path.join(this.folder, `${this.projectName}_config.json`);
  }

  get pluginsOutput() {
    return path.join(this.plugins, 'output');
  }

  clear() {
    this.folder = fs.mkdtempSync(path.join(os.tmpdir(), 'project-'));
    this.projectName = 'new project';
    this.cache = path.join(this.folder, 'cache');
    this.output = path.join(this.folder, 'output');
    this.plugins = path.join(this.folder, 'plugins');
    fs.mkdirSync(this.cache);
    fs.mkdirSync(this.output);
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
      fs.cpSync(this.cache, newCache, {recursive: true});
	  fs.rmdirSync(this.cache, {recursive: true});
    }

    const newPlugins = path.join(newFolder, 'plugins');
    if (fs.existsSync(this.plugins)) {
      if (!fs.existsSync(newPlugins)) {
        fs.mkdirSync(newPlugins);
      }
	  fs.cpSync(this.plugins, newPlugins, {recursive: true});
	  fs.rmdirSync(this.plugins, {recursive: true});
    }

    const newOutput = path.join(newFolder, 'output');
    if (fs.existsSync(this.output)) {
      if (!fs.existsSync(newOutput)) {
        fs.mkdirSync(newOutput);
      }
	  fs.cpSync(this.output, newOutput, {recursive: true});
      fs.rmdirSync(this.output, {recursive: true});
    }

    this.folder = newFolder;
    this.projectName = newProjectName;
    this.cache = newCache;
    this.plugins = newPlugins;
    this.output = newOutput;
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
      fs.cpSync(this.cache, newCache, {recursive: true});
    }

    const newPlugins = path.join(newFolder, 'plugins');
    if (fs.existsSync(this.plugins)) {
      fs.mkdirSync(newPlugins);
      fs.cpSync(this.plugins, newPlugins, {recursive: true});
    }

    const newOutput = path.join(newFolder, 'output');
    fs.mkdirSync(newOutput);
    if (fs.existsSync(this.output)) {
      fs.cpSync(this.output, newOutput, {recursive: true});
    }

    this.folder = newFolder;
    this.projectName = newProjectName;
    this.cache = newCache;
    this.plugins = newPlugins;
    this.output = newOutput;
  }

  setLocation(location) {
    this.folder = path.dirname(location);
    this.projectName = path.basename(location, '.md');
    this.cache = path.join(this.folder, 'cache');
    this.plugins = path.join(this.folder, 'plugins');
    this.output = path.join(this.folder, 'output');
  }
}

export default new FolderService();