
const fs = require('electron').remote.require('fs');
const path = require('path');
const FolderService = require('../folder_service/FolderService');
const ProjectService = require('../project_service/ProjectService');

/**
 * ResultCacheService class
 */
class ResultCacheService {
  constructor(transformer, inputServices) {
    this.transformer = transformer;
    this.cache = {};
    this.secondaryCache = {};
    this.overwrites = {};
    this.isDirty = false;
    this.lastSaveDate = null;
    this.eventTarget = new EventTarget();

    this.loadCache();

    ProjectService.eventTarget.addEventListener('fragment-deleted', this.handleFragmentDeleted.bind(this));
    ProjectService.eventTarget.addEventListener('key-changed', this.handleKeyChanged.bind(this));
    ProjectService.eventTarget.addEventListener('fragment-out-of-date', this.handleTextFragmentChanged.bind(this));

    inputServices.forEach(service => {
      service.cache.eventTarget.addEventListener('fragment-out-of-date', this.handleTextFragmentChanged.bind(this));
    });
  }

  loadCache() {
    const cachePath = path.join(FolderService.cache, `${this.transformer.name}.json`);
    if (fs.existsSync(cachePath)) {
      const data = JSON.parse(fs.readFileSync(cachePath));
      this.cache = data.cache;
      this.secondaryCache = data.secondaryCache;
      this.overwrites = data.overwrites;
      this.lastSaveDate = data.lastSaveDate;
    } else {
      this.clearCache();
    }
  }

  saveCache() {
    if (!this.isDirty) return;
    const cachePath = path.join(FolderService.cache, `${this.transformer.name}.json`);
    const data = {
      cache: this.cache,
      secondaryCache: this.secondaryCache,
      overwrites: this.overwrites,
      lastSaveDate: this.lastSaveDate,
    };
    fs.writeFile(cachePath, JSON.stringify(data), err => {
      if (err) throw err;
      this.isDirty = false;
    });
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
          ProjectService.tryAddToOutOfDate(fragmentKey, this.transformer);
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
      this.eventTarget.dispatchEvent(key);
    }
  }

  getResult(key) {
    if (this.overwrites[key]) {
      return this.overwrites[key];
    }
    return this.cache[key] ? this.cache[key].result : null;
  }

  isOutOfDate(keyPart) {
    if (this.secondaryCache[keyPart]) {
      for (const key of this.secondaryCache[keyPart]) {
        if (this.cache[key].state !== 'still-valid') {
          return true;
        }
      }
      return false;
    }
    return true;
  }

  getFragmentResults(fragmentKey) {
    if (this.overwrites[fragmentKey]) {
      return this.overwrites[fragmentKey];
    }
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
