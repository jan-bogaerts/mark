import CybertronService from '../cybertron_service/CybertronService';
import BuildStackService from '../build-stack_service/BuildStackService';
import ResultCacheService from '../result-cache_service/ResultCacheService';
import GPTService from '../gpt_service/GPTService';
import ProjectService from '../project_service/ProjectService';

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
    this.dependencies = dependencies;
    this.cache = new ResultCacheService(this);
  }

  /**
   * load all dependencies and create the cache
   * @param {Array<string>} dependencies - A list of names of transformers
   */
  load() {
    this.dependencies = this.dependencies.map(dependency => {
      const transformer = CybertronService.getTransformer(dependency);
      if (!transformer) {
        throw new Error(`Transformer "${dependency}" not found`);
      }
      return transformer;
    });
    this.cache.load(this.dependencies);
  }

  async renderResults() {
    throw new Error('Method not implemented');
  }

  async renderResult(textFragment) {
    const keyedMessage = await this.buildMessage(textFragment);
    if (!keyedMessage) {
      return null;
    }
    let [message, keys] = keyedMessage;
    const result = await GPTService.sendRequest(this, textFragment.key, message);
    this.cache.setResult(textFragment.key, result, message, keys);
    return result;
  }

  async hasPromptChanged(key, prompt) {
    BuildStackService.mode = 'validating';
    try {
      const args = this.keyToMessageParams(key.split(' | '));
      const keyedMessage = await this.buildMessage(...args);
      if (!keyedMessage) {
        return false;
      }
      const [message] = keyedMessage;
      return JSON.stringify(message) !== JSON.stringify(prompt);
    } finally {
      BuildStackService.mode = 'normal';
    }
  }

  keyToMessageParams(key) {
    return key.map(part => {
      const fragment = ProjectService.getFragment(part);
      return fragment || null; // if deleted, return null
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

  async getResults(fragments) {
    for (const fragment of fragments) {
      if (!BuildStackService.tryRegister(this, fragment)) {
        return;
      }
    }
    try {
      const result = await this.renderResults(fragments);
      return result;
    } finally {
      for (const fragment of fragments) {
        BuildStackService.unRegister(this, fragment);
      }
      
    }
  }

  calculateMaxTokens(inputTokens, modelOptions) {
    let totalInput = 0;
    for (const value of Object.values(inputTokens)) {
      totalInput += value;
    }
    return totalInput * 2;
  }

  async buildMessage(textFragment) {
    throw new Error('Method not implemented');
  }
}

export default TransformerBaseService;