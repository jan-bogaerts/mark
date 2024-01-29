
import fs from 'fs';
import path from 'path';
import projectService from '../ProjectService';
import folderService from '../../folder_service/FolderService';
import cybertronService from '../../cybertron_service/CybertronService';
import lineParser from '../../line_parser/LineParser';
import gptService from '../../gpt_service/GPTService';
import positionTrackingService from '../../position-tracking_service/PositionTrackingService';
import projectConfigurationService from '../project_configuration_service/ProjectConfigurationService';
import keyService from '../../key_service/KeyService';

class StorageService {
  constructor() {
    gptService.onMarkDirty = this.markDirty;
    this.loading = false;
    this.saveTimer = null;
  }

  clear() {
    projectService.textFragments = [];
    projectService.filename = null;
    projectService.content = '';
    lineParser.clear();
    positionTrackingService.clear();
    folderService.clear();
    cybertronService.transformers.forEach(transformer => transformer.cache.clearCache());
    gptService.modelsMap = {};
    projectConfigurationService.loadConfig({});
  }

  new() {
    projectService.blockEvents = true;
    this.loading = true;
    try {
      this.clear();
      const resourcesPath = window.electron.resourcesPath;
      const templatePath = path.join(resourcesPath, 'templates', 'default.md');
      if (fs.existsSync(templatePath)) {
        const content = fs.readFileSync(templatePath, 'utf8');
        projectService.content = content;
        content.split('\n').forEach((line, index) => lineParser.parse(line, index));
      }
    } finally {
      projectService.blockEvents = false;
      projectService.dispatchEvent('content-changed');
      this.loading = false;
      projectService.setIsDirty(false);
    }
  }

  open(filePath) {
    projectService.blockEvents = true;
    this.loading = true;
    try {
      this.clear();
      folderService.setLocation(filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      projectService.content = content;
      projectService.filename = filePath;
      this.loadKeys(filePath);
      content.split('\n').forEach((line, index) => lineParser.parse(line, index));
      cybertronService.transformers.forEach(transformer => transformer.cache.loadCache());
      this.loadModelsMap(filePath);
      this.loadProjectConfig(filePath);
      this.updateOutOfDate();
    } finally {
      keyService.loadUuidFromLocs = null;
      projectService.blockEvents = false;
      projectService.dispatchEvent('content-changed');
      this.loading = false;
      projectService.setIsDirty(false);
    }
  }

  loadModelsMap(filePath) {
    const modelsMapPath = filePath.replace('.md', '_models.json');
    if (fs.existsSync(modelsMapPath)) {
      const modelsMap = JSON.parse(fs.readFileSync(modelsMapPath, 'utf8'));
      gptService.modelsMap = modelsMap;
    }
  }

  loadKeys(filePath) {
    const keysPath = filePath.replace('.md', '_keys.json');
    if (fs.existsSync(keysPath)) {
      const keys = JSON.parse(fs.readFileSync(keysPath, 'utf8'));
      keyService.loadUuidFromLocs = keys;
    }
  }

  loadProjectConfig(filePath) {
    const configPath = folderService.projectConfig;
    if (fs.existsSync(configPath)) {
      const configString = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(configString);
      projectConfigurationService.loadConfig(config);
    }
  }

  updateOutOfDate() {
    projectService.textFragments.forEach(fragment => {
      const outOfDateTransformers = cybertronService.transformers.filter(transformer => transformer.cache.isOutOfDate(fragment.key));
      if (outOfDateTransformers.length === cybertronService.transformers.length) {
        projectService.markOutOfDate(fragment);
      } else if (outOfDateTransformers.length > 0) {
        fragment.outOfDateTransformers = outOfDateTransformers;
        projectService.markOutOfDate(fragment);
      } else {
        fragment.isOutOfDate = false;
      }
    });
  }

  markDirty() {
    if (this.loading) return;
    projectService.setIsDirty(true);
    if (projectService.autoSave && projectService.filename && !this.saveTimer) {
      this.saveTimer = setTimeout(() => {
        this.save(projectService.filename);
      }, 5000);
    }
  }

  async save(file) {
    if (!projectService.filename && folderService.folder) {
      folderService.moveTo(file);
    } else if (projectService.filename && projectService.filename !== file) {
      folderService.copyTo(file);
    } else if (!folderService.folder) {
      folderService.init();
    }
    await fs.promises.writeFile(file, projectService.content, 'utf8');
    for (const transformer of cybertronService.transformers) {
      await transformer.cache.saveCache();
    }
    await this.saveModelsMap(file);
    await this.saveProjectConfig(file);
    await this.saveKeys(file);
    projectService.filename = file;
    projectService.setIsDirty(false);
    this.saveTimer = null;
  }

  async saveModelsMap(file) {
    const modelsMapPath = file.replace('.md', '_models.json');
    const modelsMapString = JSON.stringify(gptService.modelsMap);
    await fs.promises.writeFile(modelsMapPath, modelsMapString, 'utf8');
  }

  async saveKeys(file) {
    const keysPath = file.replace('.md', '_keys.json');
    const keysString = JSON.stringify(keyService.getLocations());
    await fs.promises.writeFile(keysPath, keysString, 'utf8');
  }

  async saveProjectConfig(file) {
    const configPath = folderService.projectConfig;
    const configString = JSON.stringify(projectConfigurationService.config);
    await fs.promises.writeFile(configPath, configString, 'utf8');
  }
}

export default new StorageService();
