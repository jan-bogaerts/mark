import CybertronService from '../cybertron_service/CybertronService';
import ProjectService from '../project_service/ProjectService';

/**
 * BuildService class
 */
class BuildService {
  constructor() {
    this._debug = localStorage.getItem('debug') === 'true';
    this._isBuilding = false;
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
   * Indicates if the build service is currently building
   */
  get isBuilding() {
    return this._isBuilding;
  }

  /**
   * Builds all fragments
   */
  async buildAll() {
    this._isBuilding = true;
    try {
      if (CybertronService.activeEntryPoint.renderResults) {
        await CybertronService.activeEntryPoint.renderResults(ProjectService.textFragments);
      } else {
        for (let fragment of ProjectService.textFragments) {
          await CybertronService.activeEntryPoint.renderResult(fragment);
        }
      }
    } finally {
      this._isBuilding = false;
    }
  }

  /**
   * Builds a specific fragment
   * @param {Object} fragment - The fragment to build
   */
  async buildFragment(fragment) {
    this._isBuilding = true;
    try {
      await CybertronService.activeEntryPoint.renderResult(fragment);
    } finally {
      this._isBuilding = false;
    }
  }

  /**
   * Runs a specific transformer on a specific fragment
   * @param {Object} fragment - The fragment to transform
   * @param {Object} transformer - The transformer to use
   */
  async runTransformer(fragment, transformer) {
    this._isBuilding = true;
    try {
      await transformer.renderResult(fragment);
    } finally {
      this._isBuilding = false;
    }
  }
}

export default new BuildService();