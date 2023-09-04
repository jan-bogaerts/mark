
const { ipcRenderer } = require('electron');
const React = require('react');
const { ResultCacheService } = require('../result-cache_service/ResultCacheService');
const { GPTService } = require('../gpt_service/GPTService');

/**
 * TransformerBaseService class
 */
class TransformerBaseService {
  /**
   * Constructor
   * @param {string} name - The name of the transformer
   * @param {Array} dependencies - The list of names of transformers
   */
  constructor(name, dependencies) {
    this.name = name;
    this.dependencies = dependencies.map((dependency) => {
      const transformer = transformers.find((t) => t.name === dependency);
      if (!transformer) {
        throw new Error(`Transformer ${dependency} not found`);
      }
      return transformer;
    });
    this.cache = new ResultCacheService(this.name, this.dependencies);
  }

  /**
   * Build message
   * @param {string} textFragment - The text fragment
   * @returns {Array} - The message and keys
   */
  buildMessage(textFragment) {
    // Implement this method in the child class
    throw new Error('Method not implemented');
  }

  /**
   * Render result
   * @param {string} textFragment - The text fragment
   */
  async renderResult(textFragment) {
    const [message, keys] = this.buildMessage(textFragment);
    const result = await GPTService.sendRequest(this.name, textFragment.key, message);
    const key = keys.join(' | ');
    this.cache.setResult(key, result);
  }
}

module.exports = TransformerBaseService;
