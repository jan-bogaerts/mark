
const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');
const FolderService = require('../folder_service/FolderService');
const ProjectService = require('../project_service/ProjectService');

/**
 * ResultCacheService class
 */
class ResultCacheService extends EventEmitter {
  constructor(transformerName, inputTransformers) {
    super();
    this.transformerName = transformerName;
    this.cache = {};
    this.secondaryCache = {};
    this.overwrites = {};
    this.isDirty = false;
    this.inputTransformers = inputTransformers;
    this.cacheFilePath = path.join(FolderService.cache, `${transformerName}.json`);

    ProjectService.subscribe('fragment-deleted', this.handleFragmentDeleted.bind(this));
    ProjectService.subscribe('key-changed', this.handleKeyChanged.bind(this));
    ProjectService.subscribe('fragment-out-of-date', this.handleTextFragmentChanged.bind(this));

    inputTransformers.forEach(transformer => {
      transformer.cache.subscribe('fragment-out-of-date', this.handleTextFragmentChanged.bind(this));
    });

    this.loadCacheFromFile();
  }

  loadCacheFromFile() {
    if (fs.existsSync(this.cacheFilePath)) {
      const cacheData = JSON.parse(fs.readFileSync(this.cacheFilePath));
      this.cache = cacheData.cache;
      this.secondaryCache = cacheData.secondaryCache;
      this.overwrites = cacheData.overwrites;
    } else {
      this.clearCache();
    }
  }

  saveCacheToFile() {
    if (this.isDirty) {
      const cacheData = {
        cache: this.cache,
        secondaryCache: this.secondaryCache,
        overwrites: this.overwrites,
      };
      fs.writeFileSync(this.cacheFilePath, JSON.stringify(cacheData));
      this.isDirty = false;
    }
  }

  clearCache() {
    this.cache = {};
    this.secondaryCache = {};
    this.overwrites = {};
    this.isDirty = true;
  }

  handleFragmentDeleted(fragment) {
    fragment.state = 'deleted';
    this.isDirty = true;
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
      this.isDirty = true;
    }
  }

  handleTextFragmentChanged(fragmentKey) {
    const cacheKeys = this.secondaryCache[fragmentKey];
    if (cacheKeys) {
      for (const key of cacheKeys) {
        if (this.cache[key].state !== 'out-of-date') {
          this.cache[key].state = 'out-of-date';
          this.isDirty = true;
          this.emit('fragment-out-of-date', key);
        }
      }
    }
  }

  setResult(key, result) {
    let isModified = true;
    if (!this.cache[key]) {
      this.cache[key] = { result, state: 'still-valid' };
      const keyParts = key.split(' | ');
      for (const part of keyParts) {
        if (!this.secondaryCache[part]) {
          this.secondaryCache[part] = [key];
        } else {
          this.secondaryCache[part].push(key);
        }
      }
    } else if (this.cache[key].result !== result) {
      this.cache[key].result = result;
      this.cache[key].state = 'still-valid';
    } else {
      isModified = false;
    }
    if (isModified) {
      this.isDirty = true;
      this.emit(key);
    }
  }

  getResult(key) {
    if (this.overwrites[key]) {
      return this.overwrites[key];
    }
    return this.cache[key] ? this.cache[key].result : null;
  }

  overwriteResult(key, value) {
    this.overwrites[key] = value;
    this.isDirty = true;
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
}

module.exports = ResultCacheService;
