
const OpenAI = require('openai');
const { retry } = require('async');

class GPTService {
  constructor() {
    this.openai = new OpenAI(process.env.OPENAI_API_KEY);
    this.defaultModel = 'text-davinci-002';
    this.apiKey = process.env.OPENAI_API_KEY;
    this.activeFragment = null;
    this.fragments = [];
    this.transformers = [];
  }

  /**
   * Fetches available models from the GptService.
   */
  async getModels() {
    const models = await this.openai.listModels();
    return models.data;
  }

  /**
   * Fetches the default model from the GptService.
   */
  getDefaultModel() {
    return this.defaultModel;
  }

  /**
   * Sets the default model in the GptService.
   */
  setDefaultModel(model) {
    this.defaultModel = model;
  }

  /**
   * Retrieves the current API key from the GptService.
   */
  getApiKey() {
    return this.apiKey;
  }

  /**
   * Sets the API key in the GptService.
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
    this.openai = new OpenAI(apiKey);
  }

  /**
   * Returns the currently active fragment in the GptService.
   */
  getActiveFragment() {
    return this.activeFragment;
  }

  /**
   * Checks if any fragment in the GptService is out of date.
   */
  isAnyFragmentOutOfDate() {
    return this.fragments.some(fragment => fragment.isOutOfDate);
  }

  /**
   * Checks if a specific fragment in the GptService is out of date.
   */
  isFragmentOutOfDate(fragment) {
    return fragment.isOutOfDate;
  }

  /**
   * Fetches the list of transformers from the GptService.
   */
  getTransformers() {
    return Promise.resolve(this.transformers);
  }

  /**
   * Sends an API request to OpenAI.
   */
  async sendRequest(messages) {
    const task = async () => {
      const response = await this.openai.createChatCompletion({
        model: this.defaultModel,
        messages: messages
      });
      return response.data;
    };

    return retry({ times: 3, interval: 200 }, task);
  }
}

module.exports = new GPTService();
