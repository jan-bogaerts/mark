
const fs = require('fs');
const path = require('path');
const { ipcMain } = require('electron');

/**
 * ResultCacheService class
 * This class is responsible for managing previously retrieved results for other services.
 */
class ResultCacheService {
  /**
   * Constructor
   * @param {string} cacheFileName - The name of the cache file.
   */
  constructor(cacheFileName) {
    this.cacheFileName = cacheFileName;
    this.primaryDict = {};
    this.secondaryDict = {};
    this.lastSaveDate = null;
    this.loadCacheFromFile();
  }

  /**
   * Load cache from file
   */
  loadCacheFromFile() {
    const filePath = path.join(__dirname, this.cacheFileName);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath);
      const jsonData = JSON.parse(data);
      this.primaryDict = jsonData.primaryDict;
      this.secondaryDict = jsonData.secondaryDict;
      this.lastSaveDate = jsonData.lastSaveDate;
    }
  }

  /**
   * Save cache to file
   */
  saveCacheToFile() {
    const filePath = path.join(__dirname, this.cacheFileName);
    const jsonData = {
      primaryDict: this.primaryDict,
      secondaryDict: this.secondaryDict,
      lastSaveDate: this.lastSaveDate,
    };
    fs.writeFileSync(filePath, JSON.stringify(jsonData));
  }

  /**
   * Update cache
   * @param {string} key - The key of the result.
   * @param {any} result - The result to be cached.
   */
  updateCache(key, result) {
    const keys = key.split('|');
    keys.forEach((k) => {
      if (!this.secondaryDict[k]) {
        this.secondaryDict[k] = [];
      }
      if (!this.secondaryDict[k].includes(key)) {
        this.secondaryDict[k].push(key);
      }
    });

    if (!this.primaryDict[key]) {
      this.primaryDict[key] = {
        result,
        state: 'still-valid',
      };
    } else {
      this.primaryDict[key].result = result;
      this.primaryDict[key].state = 'still-valid';
    }

    this.saveCacheToFile();
  }

  /**
   * Register event handler
   * @param {object} service - The service to register the event handler with.
   */
  registerEventHandler(service) {
    service.on('change', (key) => {
      if (this.secondaryDict[key]) {
        this.secondaryDict[key].forEach((k) => {
          this.primaryDict[k].state = 'out-of-date';
        });
        this.saveCacheToFile();
        ipcMain.emit('cache-update', key);
      }
    });
  }
}

module.exports = ResultCacheService;
