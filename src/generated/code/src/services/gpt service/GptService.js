
const openai = require('openai');
const axios = require('axios');
const retry = require('async-retry');

/**
 * GptService class
 */
class GptService {
  constructor() {
    this.services = [];
    this.defaultModel = '';
    this.apiKey = '';
  }

  /**
   * Register a service
   * @param {Object} service - The service to register
   */
  registerService(service) {
    this.services.push(service);
  }

  /**
   * Unregister a service
   * @param {string} serviceName - The name of the service to unregister
   */
  unregisterService(serviceName) {
    this.services = this.services.filter(service => service.name !== serviceName);
  }

  /**
   * Get the currently active service
   * @returns {Object} The currently active service
   */
  getActiveService() {
    return this.services.find(service => service.isActive);
  }

  /**
   * Fetch available models from the GptService
   * @returns {Promise<Array>} The available models
   */
  async getModels() {
    const response = await axios.get('https://api.openai.com/v1/models');
    return response.data.models;
  }

  /**
   * Fetch the default model from the GptService
   * @returns {string} The default model
   */
  getDefaultModel() {
    return this.defaultModel;
  }

  /**
   * Set the default model in the GptService
   * @param {string} model - The model to set as default
   */
  setDefaultModel(model) {
    this.defaultModel = model;
  }

  /**
   * Retrieve the current API key from the GptService
   * @returns {string} The current API key
   */
  getApiKey() {
    return this.apiKey;
  }

  /**
   * Set the API key in the GptService
   * @param {string} apiKey - The new API key
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * Send an API request to OpenAI
   * @param {Array} messages - The list of messages to send
   * @returns {Promise<Object>} The response from the API
   */
  async sendRequest(messages) {
    return retry(async () => {
      const gpt3 = new openai.Gpt3(this.getApiKey());
      const response = await gpt3.createChatCompletion({
        model: this.getDefaultModel(),
        messages: messages
      });
      return response;
    }, {
      retries: 3
    });
  }
}

module.exports = new GptService();
