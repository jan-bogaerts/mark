import CybertronService from '../cybertron_service/CybertronService';
import BuildStackService from '../build-stack_service/BuildStackService';
import ResultCacheService from '../result-cache_service/ResultCacheService';
import GPTService from '../gpt_service/GPTService';
import ProjectService from '../project_service/ProjectService'; // Assuming ProjectService is available for keyToMessageParams

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
   * @param {boolean} isFullRender - Whether a full render function is available
   */
  constructor(name, dependencies, isJson, language = 'markdown', temperature = 0, isFullRender = false) {
    this.name = name;
    this.isJson = isJson;
    this.language = language;
    this.temperature = temperature;
    this.isFullRender = isFullRender;
    this.dependencies = dependencies.map(dependency => {
      const transformer = CybertronService.getTransformer(dependency);
      if (!transformer) {
        throw new Error(`Transformer ${dependency} not found`);
      }
      return transformer;
    });
    this.cache = new ResultCacheService(this, this.dependencies);
  }

  async renderResults() {
    throw new Error('Method not implemented');
  }

  /**
   * Render result
   * @param {Object} textFragment - The text fragment
   * @returns {Promise<Object>} The result
   */
  async renderResult(textFragment) {
    const keyedMessage = await this.buildMessage(textFragment);
    if (!keyedMessage) {
      return null;
    }
    const [message, keys] = keyedMessage;
    const result = await GPTService.sendRequest(this.name, textFragment.key, message);
    const key = keys.join(' | ');
    this.cache.setResult(key, result, message);
    return result;
  }

  hasPromptChanged(key, prompt) {
    BuildStackService.mode = 'validating';
    try {
      const args = this.keyToMessageParams(key.split(' | '));
      const keyedMessage = await this.buildMessage(...args);
      if (!keyedMessage) {
        return false;
      }
      const [message] = keyedMessage;
      return JSON.stringify(message) === JSON.stringify(prompt);
    } finally {
      BuildStackService.mode = 'normal';
    }
  }

  keyToMessageParams(key) {
    return key.map(part => {
      const fragment = ProjectService.getFragment(part);
      return fragment || part;
    });
  }

  async updateResult(fragment) {
    if (!this.cache.isOutOfDate(fragment.key)) {
      return this.cache.getFragmentResults(fragment.key);
    }
    return this.renderResult(fragment);
  }

  async getResult(fragment) {
    if (BuildStackService.mode === 'validating') {
      return this.cache.getFragmentResults(fragment.key);
    }
    if (!BuildStackService.tryRegister(this, fragment)) {
      return;
    }
    try {
      const result = await this.updateResult(fragment);
      return result;
    } finally {
      BuildStackService.unRegister(this, fragment);
    }
  }

  async getResults() {
    if (!BuildStackService.tryRegister(this)) {
      return;
    }
    try {
      const result = await this.renderResults();
      return result;
    } finally {
      BuildStackService.unRegister(this);
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
   * @throws {Error} Method not implemented
   */
  async buildMessage(textFragment) {
    throw new Error('Method not implemented');
  }
}

export default TransformerBaseService;