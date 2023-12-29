import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
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

    const resourcesPath = window.electron.resourcesPath;
    const filePath = path.join(resourcesPath, 'modelinfo', 'modelMaxSize.json');
    if (fs.existsSync(filePath)) {
      this.modelMaxSize = JSON.parse(fs.readFileSync(filePath, 'utf8'));
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
    let result = { total: 0 };
    let encoding = encodingForModel(model);
    for (let message of messages) {
      result[message.role] = encoding.encode(message.content).length;
      result.total += result[message.role];
    }
    return result;
  }

  getModelOptions(model) {
    const result = {
      maxTokens: 4096,
    }
    if (this.modelMaxSize) {
      result.maxTokens = this.modelMaxSize[model] ?? result.maxTokens;
    }
    return result;
  }

  removeJSONBlockWrapper(str) {
    if (str.startsWith('```json') && str.endsWith('```')) {
      return str.substring('```json'.length, str.length - '```'.length);
    }
    return str;
  }


  async sendRequest(transformer, fragmentKey, messages) {
    if (!this.openai) {
      return;
    }
    let model = this.getModelForRequest(transformer.name, fragmentKey);
    const modelOptions = this.getModelOptions(model);
    let tokens = this.calculateTokens(messages, model);
    let inputData = {
      model: model,
      messages: messages,
      max_tokens: Math.round(transformer.calculateMaxTokens(tokens, modelOptions)),
      temperature: transformer.temperature || 0
    };
    let config = {
      maxRetries: 3,
    };
    const logMsg = LogService.beginMsg(transformer.name, fragmentKey, inputData);
    await BuildService.tryPause();
    let response = await this.openai.chat.completions.create(inputData, config);
    let reply;
    let replyStr;
    if (response) {
      reply = response.choices[0]?.message?.content;
      replyStr = reply;
      if (transformer.isJson) {
        try {
          reply = JSON.parse(this.removeJSONBlockWrapper(reply));
        } catch (e) {
          DialogService.error('Invalid JSON response from OpenAI API', e.message);
        }
      }
    }
    LogService.logMsgResponse(logMsg, replyStr);
    await BuildService.tryPause();
    return reply;
  }

  async getModels() {
    if (!this.models) {
      if (!this.apiKey) {
        if (!this.errorShown) {
          DialogService.error('configuration error', 'Please provide a valid OpenAI API key');
          this.errorShown = true;
        }
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