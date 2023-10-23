import CybertronService from '../cybertron_service/CybertronService';
import ProjectService from '../project_service/ProjectService';
import BuildStackService from '../build-stack_service/BuildStackService';

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
    this.eventTarget.dispatchEvent(new Event('is-building'));
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
      if (CybertronService.activeEntryPoint.renderResults) {
        try {
           BuildStackService.tryRegister(CybertronService.activeEntryPoint);
           await CybertronService.activeEntryPoint.renderResults(ProjectService.textFragments);
        } finally {
          BuildStackService.unRegister(CybertronService.activeEntryPoint);
		    }
      } else {
        for (let fragment of ProjectService.textFragments) {
          BuildStackService.tryRegister(CybertronService.activeEntryPoint, fragment);
          try {
            await CybertronService.activeEntryPoint.renderResult(fragment);
          } finally {
            BuildStackService.unRegister(CybertronService.activeEntryPoint, fragment);
          }
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
      BuildStackService.tryRegister(CybertronService.activeEntryPoint, fragment);
      await CybertronService.activeEntryPoint.renderResult(fragment);
    } finally {
      BuildStackService.unRegister(CybertronService.activeEntryPoint, fragment);
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
      BuildStackService.tryRegister(transformer, fragment);
      await transformer.renderResult(fragment);
    } finally {
      BuildStackService.unRegister(transformer, fragment);
      this.isBuilding = false;
    }
  }
}

export default new BuildService();