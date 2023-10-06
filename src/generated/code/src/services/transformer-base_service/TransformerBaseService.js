
import CybertronService from '../cybertron_service/CybertronService';
import BuildStackService from '../build-stack_service/BuildStackService';
import ResultCacheService from '../result-cache_service/ResultCacheService';
import GPTService from '../gpt_service/GPTService';

/**
 * TransformerBaseService class
 */
class TransformerBaseService {
  /**
   * TransformerBaseService constructor
   * @param {string} name - The name of the transformer
   * @param {Array<string>} dependencies - A list of names of transformers
   * @param {boolean} isJson - Whether the result values should be treated as json structures
   * @param {string} language - The language in which the result data should be shown
   * @param {number} temperature - The temperature to use for the llm requests
   */
  constructor(name, dependencies, isJson, language = 'markdown', temperature = 0) {
    this.name = name;
    this.isJson = isJson;
    this.language = language;
    this.temperature = temperature;
    this.dependencies = dependencies.map(dependency => {
      const transformer = CybertronService.getTransformer(dependency);
      if (!transformer) {
        throw new Error(`Transformer ${dependency} not found`);
      }
      return transformer;
    });
    this.cache = new ResultCacheService(this, this.dependencies);
  }

  /**
   * Render result
   * @param {Object} textFragment - The text fragment
   * @returns {Promise<Object>} The result
   */
  async renderResult(textFragment) {
    const [message, keys] = await this.buildMessage(textFragment);
    if (!message) {
      return null;
    }
    const result = await GPTService.sendRequest(this, textFragment.key, message);
    const key = keys.join(' | ');
    this.cache.setResult(key, result);
    return result;
  }

  /**
   * Get result
   * @param {Object} fragment - The fragment
   * @returns {Promise<Object>} The result
   */
  async getResult(fragment) {
    if (!this.cache.isOutOfDate(fragment.key)) {
      return this.cache.getFragmentResults(fragment.key);
    }
    if (!BuildStackService.tryRegister(this.name, fragment.key)) {
      return;
    }
    try {
      const result = await this.renderResult(fragment);
      return result;
    } finally {
      BuildStackService.unRegister(this, fragment.key);
    }
  }

  /**
   * Calculate maximum tokens
   * @param {Object} inputTokens - The input tokens
   * @returns {number} The maximum tokens
   */
  calculateMaxTokens(inputTokens) {
    let totalInput = 0;
    for (const value of Object.values(inputTokens)) {
      totalInput += value;
    }
    return totalInput * 2;
  }

    /**
   * Build a message from a text fragment
   * @param {Object} textFragment - The text fragment
   * @returns {Array} The message and the keys
   */
    async buildMessage(textFragment) {
      // This method is likely to be overridden in each subclass of TransformerBaseService
      throw new Error('Method not implemented');
    }
}

export default TransformerBaseService;
