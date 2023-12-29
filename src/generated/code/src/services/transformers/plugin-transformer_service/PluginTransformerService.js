import TransformerBaseService from '../../transformer-base_service/TransformerBaseService';
import projectService from '../../project_service/ProjectService';
import folderService from '../../folder_service/FolderService';
import gptService from '../../gpt_service/GPTService';
import cybertronService from '../../cybertron_service/CybertronService';
import keyService from '../../key_service/KeyService';
import BuildStackService from '../../build-stack_service/BuildStackService';

/**
 * PluginTransformerService class
 * This class forms a wrapper around a JavaScript object that was provided by a plugin.
 * The plugin provides the configuration info of the transformer.
 * The transformer asks the plugin to build the transformer's result and it allows the plugin to overwrite the default behaviour at various points.
 */
class PluginTransformerService extends TransformerBaseService {
  constructor(plugin) {
    if (typeof plugin.getDescription !== 'function') {
      throw new Error('Invalid plugin: getDescription function not provided');
    }
    const description = plugin.getDescription();
    if (!description) {
      throw new Error('Invalid plugin: no description provided');
    }
    super(description.name, description.dependencies, description.isJson, description.language, description.temperature || 0, description.isFullRender);
    this.plugin = plugin;
    this.description = description;
    
    plugin.services.projectService = projectService;
    plugin.services.folderService = folderService;
    plugin.services.gptService = gptService;
    plugin.services.cybertronService = cybertronService;
    plugin.services.keyService = keyService;
    plugin.services.cache = this.cache;
  }

  load() { 
    super.load();
    for (const dep of this.dependencies) {
      this.plugin.deps[dep.name] = dep;
    }
    if (this.plugin.load) {
      this.plugin.load();
    }
  }

  calculateMaxTokens(inputTokens) {
    if (this.plugin.calculateMaxTokens) {
      return this.plugin.calculateMaxTokens(inputTokens);
    }
    return super.calculateMaxTokens(inputTokens);
  }

  buildMessage(fragment) {
    if (!this.plugin.buildMessage) {
      throw new Error('Invalid plugin: buildMessage function not provided');
    }
    return this.plugin.buildMessage(fragment);
  }

  async renderResult(fragment) {
    if (this.plugin.renderResult) {
      const [result, message] = await this.plugin.renderResult(fragment);
      this.cache.setResult(fragment.key, result, message);
      return result;
    }
    if (this.plugin.iterator) {
      const result = {};
      const resultSetter = (keys, itemResult) => {
        const key = keys.join(' | ');
        this.cache.setResult(key, itemResult, null);
        result[keys[keys.length - 1]] = itemResult;
      };
      const iteratorStepHandler = async (...args) => {
        let [message, keys] = await this.plugin.buildMessage(...args);
        if (!message) {
          return;
        }
        let itemResult = await gptService.sendRequest(this, fragment.key, message);
        if (this.plugin.cleanResponse) {
          itemResult = this.plugin.cleanResponse(itemResult, ...args);
        }
        if (keys) {
          keys.unshift(fragment.key);
        } else {
          keys = [fragment.key];
        }
        resultSetter(keys, itemResult);
      };
      this.cache.deleteResultsFor(fragment.key);
      await this.plugin.iterator(fragment, iteratorStepHandler, resultSetter);
      return result;
    } else {
      return super.renderResult(fragment);
    }
  }

  async updateResult(fragment) {
    if (this.plugin.updateResult) {
      return this.plugin.updateResult(fragment);
    }
    if (this.plugin.iterator) {
      const result = {};
      const oldResultKeys = this.cache.secondaryCache[fragment.key]?.filter(x => x.startsWith(fragment.key)) || [];
      const resultSetter = (keys, itemResult, fromCache = false) => {
        const key = keys.join(' | ');
        if (!fromCache) {
          this.cache.setResult(key, itemResult, null);
        }
        result[keys[keys.length - 1]] = itemResult;
        const index = oldResultKeys.indexOf(key);
        if (index > -1) {
          oldResultKeys.splice(index, 1);
        }
      };
      const iteratorStepHandler = async (...args) => {
        let [message, keys] = await this.plugin.buildMessage(...args);
        if (!message) {
          return;
        }
        if (keys) {
          keys.unshift(fragment.key);
        } else {
          keys = [fragment.key];
        }
        const key = keys.join(' | ');
        let itemResult;
        let isFromCache = false;
        if (this.cache.isOutOfDate(key)) {
          itemResult = await gptService.sendRequest(this, fragment.key, message);
          if (this.plugin.cleanResponse) {
            itemResult = this.plugin.cleanResponse(itemResult, ...args);
          }
        } else {
          isFromCache = true;
          itemResult = this.cache.getResult(key);
        }
        resultSetter(keys, itemResult, isFromCache);
      };
      await this.plugin.iterator(fragment, iteratorStepHandler, resultSetter);
      this.cache.deleteAfterUpdate(fragment.key, oldResultKeys);
      return result;
    } else {
      return super.updateResult(fragment);
    }
  }

  async hasPromptChanged(key, prompt) {
    let isChanged = false;
    if (this.plugin.hasPromptChanged) {
      return this.plugin.hasPromptChanged(key, prompt);
    }
    if (this.plugin.iterator) {
      BuildStackService.mode = 'validating';
      try {
        const fragment = this.keyToMessageParams(key.split(' | '))[0]; // first item in the compound key is always the key of the fragment
        const resultSetter = (keys, itemResult) => {
          // get the result from the cache and compare both, if they are different, the prompt has changed
          const key = keys.join(' | ');
          const oldResult = this.cache.getResult(key);
          if (JSON.stringify(oldResult) !== JSON.stringify(itemResult)) {
            isChanged = true;
          }
        }
        const iteratorStepHandler = async (...args) => {
          let [message, keys] = await this.plugin.buildMessage(...args);
          if (keys) {
            keys.unshift(key);
          } else {
            keys = [key];
          }
          const newKey = keys.join(' | ');
          if (newKey === key && !isChanged) {
            isChanged = JSON.stringify(message) !== JSON.stringify(prompt);
          }
        }
        await this.plugin.iterator(fragment, iteratorStepHandler, resultSetter);
      } finally {
        BuildStackService.mode = 'normal';
      }
      return isChanged;
    } else {
      return super.hasPromptChanged(key, prompt);
    }
  }
}

export default PluginTransformerService;