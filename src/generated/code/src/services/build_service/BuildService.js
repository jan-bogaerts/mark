import CybertronService from '../cybertron_service/CybertronService';
import ProjectService from '../project_service/ProjectService';

/**
 * BuildService class
 */
class BuildService {
  constructor() {
    this._debug = localStorage.getItem('debug') === 'true';
    this._isBuilding = false;
    this.eventTarget = new EventTarget();
  }

  /**
   * Toggles the debug mode
   */
  set debug(value) {
    if (this._debug === value) return;
    this._debug = value;
    localStorage.setItem('debug', value);
  }

  get debug() {
    return this._debug;
  }

  /**
   * Indicates if the build service is currently building
   */
  set isBuilding(value) {
    this._isBuilding = value;
    this.eventTarget.dispatchEvent(new CustomEvent('is-building', { detail: { isBuilding: value } }));
  }

  get isBuilding() {
    return this._isBuilding;
  }

  /**
   * Builds all fragments
   */
  async buildAll() {
    this.isBuilding = true;
    try {
      if (CybertronService.activeEntryPoint.isFullRender) {
        await CybertronService.activeEntryPoint.getResults();
      } else {
        for (let fragment of ProjectService.textFragments) {
          await CybertronService.activeEntryPoint.getResult(fragment);
        }
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
      await CybertronService.activeEntryPoint.getResult(fragment);
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
      await transformer.getResult(fragment);
    } finally {
      this.isBuilding = false;
    }
  }
}

export default new BuildService();