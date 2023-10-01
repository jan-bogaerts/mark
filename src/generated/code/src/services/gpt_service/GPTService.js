
import OpenAI from 'openai';
import { retry } from 'async-es';
import DialogService from '../dialog_service/DialogService';

class GPTService {
  constructor() {
    this.defaultModel = localStorage.getItem('defaultModel');
    this.modelsMap = {};
    this.apiKey = localStorage.getItem('apiKey');
    this.errorShown = false;
    if (this.apiKey) {
      this.openai = new OpenAI({ apiKey: this.apiKey, dangerouslyAllowBrowser: true });
    }
  }

  setDefaultModel(model) {
    this.defaultModel = model;
    localStorage.setItem('defaultModel', model);
  }

  getDefaultModel() {
    return this.defaultModel;
  }

  setModelForTransformer(model, transformer) {
    let map = this.modelsMap[transformer.name] || {};
    map['__default'] = model;
    this.modelsMap[transformer.name] = map;
  }

  getModelForTransformer(transformer) {
    return this.modelsMap[transformer.name]?.['__default'];
  }

  setModelForFragment(model, transformer, key) {
    let map = this.modelsMap[transformer.name] || {};
    map[key] = model;
    this.modelsMap[transformer.name] = map;
  }

  getModelForFragment(transformer, key) {
    return this.modelsMap[transformer.name]?.[key];
  }

  getModelForRequest(transformerName, fragmentKey) {
    if (transformerName in this.modelsMap) {
      let section = this.modelsMap[transformerName];
      if (fragmentKey in section) {
        return section[fragmentKey];
      }
      if ('__default' in section) {
        return section['__default'];
      }
    }
    return this.getDefaultModel();
  }

  async sendRequest(messages, transformerName, fragmentKey) {
    const model = this.getModelForRequest(transformerName, fragmentKey);
    try {
      return await retry(async () => {
        return await this.openai.createChatCompletion({ model, messages });
      }, { retries: 3 });
    } catch (error) {
      throw new Error('Failed to send request to OpenAI');
    }
  }

  async getModels() {
    if (!this.models) {
      if (!this.apiKey && !this.errorShown) {
        DialogService.showDialog('Please provide a valid OpenAI API key');
        this.errorShown = true;
        return [];
      }
      this.models = (await this.openai.models.list())?.data?.map((model) => model.id) ?? [];
      this.models.sort();
    }
    return this.models;
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey;
    localStorage.setItem('apiKey', apiKey);
    this.openai = new OpenAI({ apiKey: this.apiKey, dangerouslyAllowBrowser: true });
    this.errorShown = false;
  }

  getApiKey() {
    return this.apiKey;
  }
}

export default new GPTService();
