
const fs = require('fs');
const path = require('path');
const { ProjectService } = require('../project_service/ProjectService');
const { FolderService } = require('../folder_service/FolderService');

class ResultCacheService {
  constructor(transformerName, dependencies) {
    this.transformerName = transformerName;
    this.dependencies = dependencies;
    this.cache = {};
    this.secondaryCache = {};
    this.overwrites = {};
    this.subscribers = [];
    this.filePath = path.join(FolderService.cache, `${transformerName}.json`);

    ProjectService.on('textFragmentChanged', this.handleTextFragmentChanged.bind(this));
    dependencies.forEach(dependency => {
      dependency.cache.subscribe(this.handleDependencyChanged.bind(this));
    });

    this.loadCacheFromFile();
  }

  handleTextFragmentChanged(fragmentKey) {
    const cacheKeys = this.secondaryCache[fragmentKey];
    if (cacheKeys) {
      cacheKeys.forEach(key => {
        const result = this.cache[key];
        if (result && result.state !== 'out-of-date') {
          result.state = 'out-of-date';
          this.notifySubscribers(key);
        }
      });
    }
  }

  handleDependencyChanged(fragmentKey) {
    this.handleTextFragmentChanged(fragmentKey);
  }

  notifySubscribers(key) {
    this.subscribers.forEach(subscriber => subscriber(key));
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  unsubscribe(callback) {
    this.subscribers = this.subscribers.filter(subscriber => subscriber !== callback);
  }

  setResult(key, result) {
    if (!this.cache[key]) {
      this.cache[key] = { result, state: 'still-valid' };
      this.secondaryCache[key.split(' | ')[0]].push(key);
    } else {
      this.cache[key].result = result;
      this.cache[key].state = 'still-valid';
    }
    this.saveCacheToFile();
  }

  overwriteResult(key, result) {
    this.overwrites[key] = result;
    this.saveCacheToFile();
  }

  getResult(key) {
    return this.overwrites[key] || (this.cache[key] && this.cache[key].result);
  }

  isOutOfDate(key) {
    return this.cache[key] && this.cache[key].state === 'out-of-date';
  }

  getFragmentResults(fragmentKey) {
    const result = {};
    const cacheKeys = this.secondaryCache[fragmentKey];
    if (cacheKeys) {
      cacheKeys.forEach(key => {
        const cacheValue = this.getResult(key);
        const keyParts = key.split(' | ');
        let addTo = result;
        keyParts.slice(0, -1).forEach(part => {
          if (!addTo[part]) {
            addTo[part] = {};
          }
          addTo = addTo[part];
        });
        addTo[keyParts[keyParts.length - 1]] = cacheValue;
      });
    }
    return result;
  }

  loadCacheFromFile() {
    if (fs.existsSync(this.filePath)) {
      const data = JSON.parse(fs.readFileSync(this.filePath));
      this.cache = data.cache;
      this.secondaryCache = data.secondaryCache;
      this.overwrites = data.overwrites;
    }
  }

  saveCacheToFile() {
    const data = {
      cache: this.cache,
      secondaryCache: this.secondaryCache,
      overwrites: this.overwrites,
    };
    fs.writeFileSync(this.filePath, JSON.stringify(data));
  }
}

module.exports = ResultCacheService;
