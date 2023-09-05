
// Importing required services
const ProjectService = require('../project_service/ProjectService');
const CybertronService = require('../cybertron_service/CybertronService');

/**
 * BuildService class
 * Processes all the text-fragments of the project-service using a set of transformers
 */
class BuildService {
  constructor() {
    if (!BuildService.instance) {
      BuildService.instance = this;
    }
    return BuildService.instance;
  }

  /**
   * Triggers the building process for all code in the project
   */
  async buildAll() {
    for (let fragment of ProjectService.textFragments) {
      for (let transformer of CybertronService.entryPoints) {
        await transformer.renderResult(fragment);
      }
    }
  }

  /**
   * Triggers the building process for all code files related to the currently active fragment
   * @param {Object} activeFragment - The currently active fragment
   */
  async buildForActiveTopic(activeFragment) {
    for (let transformer of CybertronService.entryPoints) {
      await transformer.renderResult(activeFragment);
    }
  }

  /**
   * Triggers the building process for the selected fragment in the service related to the currently selected
   * @param {Object} activeFragment - The currently active fragment
   */
  async buildForActivePrompt(activeFragment) {
    for (let transformer of CybertronService.entryPoints) {
      await transformer.renderResult(activeFragment);
    }
  }
}

const instance = new BuildService();
Object.freeze(instance);

module.exports = instance;
