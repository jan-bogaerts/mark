import CybertronService from '../cybertron_service/CybertronService';
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

  async buildFragment(fragment) {
    this.isBuilding = true;
    try {
      await CybertronService.activeEntryPoint.getResult(fragment);
    } finally {
      this.isBuilding = false;
    }
  }

  async runTransformer(fragment, transformer) {
    this.isBuilding = true;
    try {
      await transformer.getResult(fragment);
    } finally {
      this.isBuilding = false;
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
      this.debugRejector();
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