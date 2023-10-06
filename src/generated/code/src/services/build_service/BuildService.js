import CybertronService from '../cybertron_service/CybertronService';
import ProjectService from '../project_service/ProjectService';

/**
 * BuildService class
 */
class BuildService {
  constructor() {
    this.debug = localStorage.getItem('debug') === 'true';
    this.isBuilding = false;
  }

  /**
   * Toggles the debug mode
   */
  set debug(value) {
    this._debug = value;
    localStorage.setItem('debug', value);
  }

  get debug() {
    return this._debug;
  }

  /**
   * Builds all fragments
   */
  async buildAll() {
    this.isBuilding = true;
    try {
      for (let fragment of ProjectService.textFragments) {
        await this.buildFragment(fragment);
      }
    } finally {
      this.isBuilding = false;
    }
  }

  /**
   * Builds a specific fragment
   * @param {Object} fragment - The fragment to build
   */
  async buildFragment(fragment) {
    this.isBuilding = true;
    try {
      for (let transformer of CybertronService.entryPoints) {
        await this.runTransformer(fragment, transformer);
      }
    } finally {
      this.isBuilding = false;
    }
  }

  /**
   * Runs a specific transformer on a specific fragment
   * @param {Object} fragment - The fragment to transform
   * @param {Object} transformer - The transformer to use
   */
  async runTransformer(fragment, transformer) {
    this.isBuilding = true;
    try {
      await transformer.renderResult(fragment);
    } finally {
      this.isBuilding = false;
    }
  }
}

export default new BuildService();