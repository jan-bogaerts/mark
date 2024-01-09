import DialogService from '../dialog_service/DialogService';
import FolderService from '../folder_service/FolderService';
import ProjectService from '../project_service/ProjectService';

/**
 * BuildService class
 */
class BuildService {
  constructor() {
    this._debug = localStorage.getItem('debug') === 'true';
    this._isBuilding = false;
    this._showDebugger = false;
    this.eventTarget = new EventTarget();
    this.debugResolver = null;
    this.debugRejector = null;

    window.electron.onDebuggerVisibility(this.setDebuggerVisibility.bind(this));
  }

  set showDebugger(value) {
	  if (this._showDebugger === value) return;
    this._showDebugger = value;
    window.electron.showDebugger(value);
    this.eventTarget.dispatchEvent(new CustomEvent('show-debugger', { detail: { showDebugger: value } }));
  }

  get showDebugger() {
    return this._showDebugger;
  }

  set debug(value) {
    if (this._debug === value) return;
    this._debug = value;
    localStorage.setItem('debug', value);
  }

  get debug() {
    return this._debug;
  }

  get isPaused() {
    return !!this.debugResolver;
  }

  set isBuilding(value) {
	  if (this._isBuilding === value) return;
    this._isBuilding = value;
    this.eventTarget.dispatchEvent(new CustomEvent('is-building', { detail: { isBuilding: value } }));
  }

  get isBuilding() {
    return this._isBuilding;
  }

  async buildAll(transformer) {
    this.isBuilding = true;
    try {
      FolderService.init(); // make certain that folders exist when building
      if (transformer.isFullRender) {
        await transformer.getResults(ProjectService.textFragments);
      } else {
        for (let fragment of ProjectService.textFragments) {
          await transformer.getResult(fragment);
        }
      }
    } catch (error) {
      if (error !== 'stopped') DialogService.showErrorDialog(error);
    } finally {
      this.isBuilding = false;
    }
  }


  async runTransformer(fragment, transformer) {
    // console.profile('runTransformer');
    console.time('runTransformer');
    this.isBuilding = true;
    try {
      FolderService.init(); // make certain that folders exist when building
      await transformer.getResult(fragment);
    } catch (error) {
      if (error !== 'stopped') DialogService.showErrorDialog(error);
    } finally {
      this.isBuilding = false;
      console.timeEnd('runTransformer');
      // console.profileEnd('runTransformer');
    }

  }

  async tryPause() {
    if (this.debug) {
      const pause = new Promise((resolve, reject) => {
        this.debugResolver = resolve;
        this.debugRejector = reject;
      });
      this.eventTarget.dispatchEvent(new CustomEvent('is-pausing'));
      await pause;
      this.eventTarget.dispatchEvent(new CustomEvent('has-resumed'));
    }
  }

  runNext() {
    if (this.debugResolver) {
      this.debugResolver();
      this.debugResolver = null;
      this.debugRejector = null;
    }
  }

  stopRun() {
    if (this.debugRejector) {
      this.debugRejector('stopped');
      this.debugResolver = null;
      this.debugRejector = null;
    }
  }

  setDebuggerVisibility(ev, value) {
    console.log('setDebuggerVisibility', value);
    this._showDebugger = value;
	  this.eventTarget.dispatchEvent(new CustomEvent('show-debugger', { detail: { showDebugger: value } }));
  }

  dispose() {
    window.electron.removeOnDebuggerVisibility(this.setDebuggerVisibility.bind(this));
  }
}

export default new BuildService();