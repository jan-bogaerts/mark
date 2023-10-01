
import BuildStackService from '../build-stack_service/BuildStackService';
import CybertronService from '../cybertron_service/CybertronService';
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
   */
  constructor(name, dependencies, isJson) {
    this.name = name;
    this.isJson = isJson;
    this.language = 'markdown'
    this.dependencies = dependencies.map(dep => {
      const transformer = CybertronService.getTransformer(dep);
      if (!transformer) {
        throw new Error(`Transformer ${dep} not found`);
      }
      return transformer;
    });
    this.cache = new ResultCacheService(this.name, this.dependencies);
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

  /**
   * Render a result from a text fragment
   * @param {Object} textFragment - The text fragment
   * @returns {Object} The result
   */
  async renderResult(textFragment) {
    const [message, keys] = await this.buildMessage(textFragment);
    if (!message) {
      return;
    }
    const result = await GPTService.sendRequest(this.name, textFragment.key, message);
    const key = keys.join(' | ');
    this.cache.setResult(key, result);
    return result;
  }

  /**
   * Get a result for a specific key
   * @param {Object} fragment - The fragment
   * @returns {Object} The result
   */
  async getResult(fragment) {
    if (!this.cache.isOutOfDate(fragment.key)) {
      return this.cache.getFragmentResults(fragment.key);
    }
    if (!BuildStackService.tryRegister(this.name, fragment.key)) {
      return; // circular reference, not good, stop the process
    }
    try {
      const result = await this.renderResult(fragment);
      return result;
    } finally {
      BuildStackService.unregister(this, fragment.key);
    }
  }
}

export default TransformerBaseService;
