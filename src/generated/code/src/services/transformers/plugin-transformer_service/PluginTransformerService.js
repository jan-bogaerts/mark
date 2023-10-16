
import TransformerBaseService from '../../transformer-base_service/TransformerBaseService';
import projectService from '../../project_service/ProjectService';
import folderService from '../../folder_service/FolderService';
import gptService from '../../gpt_service/GPTService';
import cybertronService from '../../cybertron_service/CybertronService';

/**
 * PluginTransformerService class
 * This class forms a wrapper around a JavaScript object that was provided by a plugin.
 * The plugin provides the configuration info of the transformer.
 * The transformer asks the plugin to build the transformer's result and it allows the plugin to overwrite the default behaviour at various points.
 */
class PluginTransformerService extends TransformerBaseService {
  /**
   * Constructor for PluginTransformerService
   * @param {Object} plugin - Object created by the plugin code that provides access to the functions that should be used
   */
  constructor(plugin) {
    const description = plugin.getDescription();
    if (!description) {
      throw new Error('Invalid plugin: no description provided');
    }
    super(description.name, description.dependencies, description.isJson);
    this.plugin = plugin;
    this.description = description;
    for (const dep of this.dependencies) {
      this.plugin.deps[dep.name] = dep;
    }
    plugin.services = {
      projectService,
      folderService,
      gptService,
      cybertronService,
      cache: this.cache,
    };
  }

  /**
   * Calculate maximum tokens
   * @param {Number} inputTokens - Number of input tokens
   * @returns {Number} Maximum tokens
   */
  calculateMaxTokens(inputTokens) {
    if (this.plugin.calculateMaxTokens) {
      return this.plugin.calculateMaxTokens(inputTokens);
    }
    return super.calculateMaxTokens(inputTokens);
  }

  /**
   * Build message
   * @param {Object} fragment - Fragment object
   * @returns {Object} Message
   */
  buildMessage(fragment) {
    if (!this.plugin.buildMessage) {
      throw new Error('Invalid plugin: buildMessage function not provided');
    }
    return this.plugin.buildMessage(fragment);
  }

  /**
   * Render result
   * @param {Object} fragment - Fragment object
   * @returns {Object} Rendered result
   */
  renderResult(fragment) {
    if (this.plugin.renderResult) {
      return this.plugin.renderResult(fragment);
    }
    return super.renderResult(fragment);
  }
}

export default PluginTransformerService;
