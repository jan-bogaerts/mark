
import ResultCacheService from '../result-cache_service/ResultCacheService';
import GPTService from '../gpt_service/GPTService';
import cybertronService from '../cybertron_service/CybertronService';

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
    this.language = 'markdown';
    this.dependencies = dependencies.map((dependency) => {
      const transformer = cybertronService.transformers.find((t) => t.name === dependency);
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

export default TransformerBaseService;
