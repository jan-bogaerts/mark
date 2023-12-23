import OpenAI from 'openai';
import { encodingForModel } from "js-tiktoken";
import DialogService from '../dialog_service/DialogService';
import LogService from '../log_service/LogService';
import BuildService from '../build_service/BuildService';

class GPTService {
  constructor() {
    this.defaultModel = localStorage.getItem('defaultModel');
    this.modelsMap = {};
    this.apiKey = localStorage.getItem('apiKey');
    this.errorShown = false;
    this.onMarkDirty = null;
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
    if (!this.modelsMap[transformer.name]) {
      this.modelsMap[transformer.name] = {};
    }
    this.modelsMap[transformer.name]['__default'] = model;
    if (this.onMarkDirty) {
      this.onMarkDirty();
    }
  }

  getModelForTransformer(transformer) {
    return this.modelsMap[transformer.name]?.['__default'];
  }

  setModelForFragment(model, transformer, key) {
    if (!this.modelsMap[transformer.name]) {
      this.modelsMap[transformer.name] = {};
    }
    this.modelsMap[transformer.name][key] = model;
    if (this.onMarkDirty) {
      this.onMarkDirty();
    }
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

  calculateTokens(messages, model) {
    let result = {};
    let encoding = encodingForModel(model);
    for (let message of messages) {
      result[message.role] = encoding.encode(message.content).length;
    }
    return result;
  }

  async sendRequest(transformer, fragmentKey, messages) {
    if (!this.openai) {
      return;
    }
    let model = this.getModelForRequest(transformer.name, fragmentKey);
    let tokens = this.calculateTokens(messages, model);
    let inputData = {
      model: model,
      messages: messages,
      max_tokens: transformer.calculateMaxTokens(tokens),
      temperature: transformer.temperature || 0
    };
    let config = {
      maxRetries: 3,
    };
    const logMsg = LogService.beginMsg(transformer.name, fragmentKey, inputData);
    await BuildService.tryPause();
    let response = await this.openai.chat.completions.create(inputData, config);
    let reply;
    if (response) {
      reply = response.choices[0]?.message?.content;
      if (transformer.isJson) {
        try {
          reply = JSON.parse(reply);
        } catch (e) {
          DialogService.error('Invalid JSON response from OpenAI API', e.message);
        }
      }
    }
    LogService.logMsgResponse(logMsg, reply);
    await BuildService.tryPause();
    return reply;
  }

  async getModels() {
    if (!this.models) {
      if (!this.apiKey && !this.errorShown) {
        DialogService.error('Please provide a valid OpenAI API key');
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