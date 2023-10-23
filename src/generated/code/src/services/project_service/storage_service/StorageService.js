import fs from 'fs';
import folderService from '../../folder_service/FolderService';
import cybertronService from '../../cybertron_service/CybertronService';
import lineParser from '../../line_parser/LineParser';
import gptService from '../../gpt_service/GPTService';
import projectService from '../ProjectService';
import positionTrackingService from '../../position-tracking_service/PositionTrackingService';
import projectConfigurationService from '../project_configuration_service/ProjectConfigurationService';

class StorageService {
  constructor() {
    this.saveTimer = null;
    gptService.onMarkDirty = this.markDirty.bind(this);
  }

  clear() {
    projectService.textFragments = [];
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
      content.split('\n').forEach((line, index) => lineParser.parse(line, index));
      for (const transformer of cybertronService.transformers) {
        transformer.cache.loadCache();
      }
      this.loadModelsMap(filePath);
      this.loadProjectConfig(filePath);
      this.updateOutOfDate();
    } finally {
      projectService.blockEvents = false;
      projectService.dispatchEvent('content-changed');
      this.loading = false;
      projectService.setIsDirty(false);
    }
  }

  loadModelsMap(filePath) {
    const jsonFilePath = filePath.replace('.md', '_models.json');
    if (fs.existsSync(jsonFilePath)) {
      const modelsMap = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
      gptService.modelsMap = modelsMap;
    }
  }

  loadProjectConfig(filePath) {
    const jsonFilePath = folderService.projectConfig;
    if (fs.existsSync(jsonFilePath)) {
      const config = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
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
      }
    });
  }

  markDirty() {
    if (this.loading) return;
    projectService.setIsDirty(true);
    if (projectService.autoSave && projectService.filename && !this.saveTimer) {
      this.saveTimer = setTimeout(() => {
        this.save(projectService.filename);
      }, 5000)
    }
  }

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
    await this.saveProjectConfig(file);
    projectService.filename = file;
    projectService.setIsDirty(false);
    this.saveTimer = null;
  }

  async saveModelsMap(file) {
    const jsonFilePath = file.replace('.md', '_models.json');
    const modelsMapString = JSON.stringify(gptService.modelsMap);
    await fs.promises.writeFile(jsonFilePath, modelsMapString, 'utf8');
  }

  async saveProjectConfig(file) {
    const jsonFilePath = folderService.projectConfig;
    const configString = JSON.stringify(projectConfigurationService.config);
    await fs.promises.writeFile(jsonFilePath, configString, 'utf8');
  }
}

export default new StorageService();