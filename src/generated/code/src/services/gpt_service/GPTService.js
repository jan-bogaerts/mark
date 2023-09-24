
import OpenAI from 'openai';
import { retry } from 'async-es';
import DialogService from '../dialog_service/DialogService';

class GPTService {
  constructor() {
    this.apiKey = localStorage.getItem('apiKey');
    this.openai = this.apiKey ? new OpenAI({apiKey: this.apiKey, dangerouslyAllowBrowser: true}) : null;
    this.models = null;
    this.errorShown = false;
  }

  /**
   * Send a request to the OpenAI API.
   * @param {Array} messages - The list of messages to send.
   * @returns {Promise} The API response.
   */
  async sendRequest(messages) {
    if (!this.openai) {
      throw new Error('OpenAI not initialized. Please set the API key.');
    }

    return retry(async () => {
      return this.openai.createChatCompletion({ model: 'text-davinci-002', messages });
    }, { retries: 3 });
  }

  /**
   * Get the list of available models.
   * @returns {Promise} The list of models.
   */
  async getModels() {
    if (!this.openai && !this.errorShown) {
      DialogService.showErrorDialog('Please provide a valid OpenAI API key.');
      this.errorShown = true;
      this.models = [];
      return [];
    }

    if (this.models) {
      return this.models;
    }

    this.models = (await this.openai.models.list())?.data?.map((model) => model.id) ?? [];
    this.models.sort();
    return this.models;
  }

  getDefaultModel () {
    return 'text-davinci-002';
  }

  /**
   * Get the current API key.
   * @returns {string} The API key.
   */
  getApiKey() {
    return this.apiKey;
  }

  /**
   * Set the API key.
   * @param {string} apiKey - The new API key.
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
    localStorage.setItem('apiKey', apiKey);
    this.openai = new OpenAI({apiKey, dangerouslyAllowBrowser: true});
    this.errorShown = false;
  }
}

export default new GPTService();
