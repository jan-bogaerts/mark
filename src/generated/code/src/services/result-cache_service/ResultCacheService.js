
const fs = require('fs');
const path = require('path');
const { FolderService } = require('../folder_service/FolderService');
const { ProjectService } = require('../project_service/ProjectService');

class ResultCacheService {
  constructor(transformerName, inputTransformers) {
    this.transformerName = transformerName;
    this.inputTransformers = inputTransformers;
    this.cache = {};
    this.secondaryCache = {};
    this.overwrites = {};
    this.lastSaveDate = null;
    this.subscribers = [];

    this.loadCache();

    ProjectService.subscribe('fragment-deleted', this.handleFragmentDeleted.bind(this));
    ProjectService.subscribe('key-changed', this.handleKeyChanged.bind(this));
    ProjectService.subscribe('fragment-out-of-date', this.handleTextFragmentChanged.bind(this));

    this.inputTransformers.forEach(transformer => {
      transformer.cache.subscribe(this.handleTextFragmentChanged.bind(this));
    });
  }

  loadCache() {
    const cacheFilePath = path.join(FolderService.cache, `${this.transformerName}.json`);
    if (fs.existsSync(cacheFilePath)) {
      const cacheData = JSON.parse(fs.readFileSync(cacheFilePath));
      this.cache = cacheData.cache;
      this.secondaryCache = cacheData.secondaryCache;
      this.overwrites = cacheData.overwrites;
      this.lastSaveDate = cacheData.lastSaveDate;
    } else {
      this.clearCache();
    }
  }

  saveCache() {
    const cacheFilePath = path.join(FolderService.cache, `${this.transformerName}.json`);
    const cacheData = {
      cache: this.cache,
      secondaryCache: this.secondaryCache,
      overwrites: this.overwrites,
      lastSaveDate: this.lastSaveDate,
    };
    fs.writeFileSync(cacheFilePath, JSON.stringify(cacheData));
  }

  clearCache() {
    this.cache = {};
    this.secondaryCache = {};
    this.overwrites = {};
    this.lastSaveDate = null;
  }

  handleFragmentDeleted(fragment) {
    fragment.state = 'deleted';
  }

  handleKeyChanged(params) {
    const oldKeys = this.secondaryCache[params.oldKey];
    if (oldKeys) {
      const newKeys = [];
      for (const oldKey of oldKeys) {
        const newKey = oldKey.replace(params.oldKey, params.fragment.key);
        newKeys.push(newKey);
        this.cache[newKey] = this.cache[oldKey];
        delete this.cache[oldKey];
      }
      this.secondaryCache[params.fragment.key] = newKeys;
      delete this.secondaryCache[params.oldKey];
    }
  }

  handleTextFragmentChanged(fragment) {
    const cacheKeys = this.secondaryCache[fragment.key];
    if (cacheKeys) {
      for (const key of cacheKeys) {
        if (this.cache[key].state !== 'out-of-date') {
          this.cache[key].state = 'out-of-date';
          this.emit('fragment-out-of-date', { key });
        }
      }
    }
  }

  getFragmentResults(fragmentKey) {
    const result = {};
    const cacheKeys = this.secondaryCache[fragmentKey];
    if (cacheKeys) {
      for (const key of cacheKeys) {
        const cacheValue = this.getResult(key);
        const keyParts = key.split(' | ');
        let addTo = result;
        for (const part of keyParts.slice(0, -1)) {
          if (!addTo[part]) {
            addTo[part] = {};
          }
          addTo = addTo[part];
        }
        addTo[keyParts[keyParts.length - 1]] = cacheValue;
      }
    }
    return result;
  }

  getResult(key) {
    return this.overwrites[key] || this.cache[key];
  }

  setResult(key, value) {
    this.cache[key] = value;
    this.saveCache();
  }

  overwriteResult(key, value) {
    this.overwrites[key] = value;
    this.saveCache();
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  unsubscribe(callback) {
    this.subscribers = this.subscribers.filter(subscriber => subscriber !== callback);
  }

  emit(event, params) {
    this.subscribers.forEach(subscriber => subscriber(event, params));
  }
}

module.exports = { ResultCacheService };
