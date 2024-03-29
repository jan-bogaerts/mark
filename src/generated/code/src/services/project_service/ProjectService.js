import AsyncEventTarget from '../async-event-target/AsyncEventTarget';
import CybertronService from '../cybertron_service/CybertronService';
import DialogService from '../dialog_service/DialogService';

class ProjectService {
  constructor() {
    this.textFragments = [];
    this.content = '';
    this.filename = '';
    this.isDirty = false;
    this.blockEvents = false;
    this.eventTarget = new AsyncEventTarget();
    this.autoSave = this.getAutoSaveState();
    this.timeoutBuilding = null;
    this.timeoutUpToDate = null;
    this.timeoutObjectsBuilding = {};
    this.timeoutObjectsUpToDate = {};
  }

  /**
   * Returns the current state of the auto-save feature.
   * @returns {boolean} The state of the auto-save feature.
   */
  getAutoSaveState() {
    return localStorage.getItem('autoSave') === 'true';
  }
  
  /**
   * Sets the state of the auto-save feature.
   * @param {boolean} state The new state of the auto-save feature.
   */
  setAutoSaveState(state) {
    this.autoSave = state;
    localStorage.setItem('autoSave', state);
  }

  /**
   * Returns the name of the current project file.
   * @returns {string} The name of the current project file.
   */
  getFileName() {
    return this.filename;
  }

  /**
   * Adds a text fragment to the project at the specified index.
   * @param {Object} fragment The text fragment to add.
   * @param {number} index The index at which to add the text fragment.
   */
  addTextFragment(fragment, index) {
    if (index >= this.textFragments.length) {
      this.textFragments.push(fragment);
    } else {
      this.textFragments.splice(index, 0, fragment);
    }
    this.dispatchEvent('fragment-inserted', fragment.key);
  }

  /**
   * Deletes a text fragment.
   * @param {Object} fragment The text fragment to delete.
   */
  deleteTextFragment(fragment) {
    const index = this.textFragments.indexOf(fragment);
    if (index > -1) {
      this.textFragments.splice(index, 1);
      this.dispatchEvent('fragment-deleted', fragment.key);
    }
  }

  markOutOfDate(fragment) {
    fragment.isOutOfDate = true;
    this.dispatchEvent('fragment-out-of-date', fragment.key);
  }

  /**
    uses a setTimeout to delay the calling of the fragment-building event. Uses a list to keep track of the objects to rase the event for, together with timeinfo that is updated
    every time the fragment is added to the queue before it's time was fully passed.
    This allows us to use only 1 timeout (is costly to create)
    only clear the keys for which the time has passed
   * @param {object} fragment the fragment to queue for building
   * @param {object} transformer the transformer that is requesting the build
   */
  queueFragmentBuilding(fragment, transformer) {
    const key = fragment.key;
    const name = transformer.name;
    const timeoutKey = key + name;
    if (this.timeoutObjectsUpToDate[timeoutKey]) delete this.timeoutObjectsUpToDate[timeoutKey];
    if (this.timeoutObjectsBuilding[timeoutKey]) {
      this.timeoutObjectsBuilding[timeoutKey].time = Date.now();
      return;
    }
    this.timeoutObjectsBuilding[timeoutKey] = { time: Date.now(), fragment, transformer };
    if (!this.timeoutBuilding) {
      this.timeoutBuilding = setInterval(() => {
        const now = Date.now();
        for (let key in this.timeoutObjectsBuilding) {
          const obj = this.timeoutObjectsBuilding[key];
          if (now - obj.time > 200) {
            delete this.timeoutObjectsBuilding[key];
            this.dispatchEvent('fragment-building', obj.fragment.key);
          }
        }
        if (Object.keys(this.timeoutObjectsBuilding).length === 0) {
          clearTimeout(this.timeoutBuilding);
          this.timeoutBuilding = null;
        }
      }, 200);
    }
    
  }

  queueFragmentUpToDate(fragment, transformer) {
    const key = fragment.key;
    const name = transformer.name;
    const timeoutKey = key + name;
    if(this.timeoutObjectsBuilding[timeoutKey]) delete this.timeoutObjectsBuilding[timeoutKey];
    if (this.timeoutObjectsUpToDate[timeoutKey]) {
      this.timeoutObjectsUpToDate[timeoutKey].time = Date.now();
      return;
    }
    this.timeoutObjectsUpToDate[timeoutKey] = { time: Date.now(), fragment, transformer };
    if (!this.timeoutUpToDate) {
      this.timeoutUpToDate = setInterval(() => {
        const now = Date.now();
        for (let key in this.timeoutObjectsUpToDate) {
          const obj = this.timeoutObjectsUpToDate[key];
          if (now - obj.time > 200) {
            delete this.timeoutObjectsUpToDate[key];
            this.dispatchEvent('fragment-up-to-date', obj.fragment.key);
          }
        }
        if (Object.keys(this.timeoutObjectsUpToDate).length === 0) {
          clearTimeout(this.timeoutUpToDate);
          this.timeoutUpToDate = null;
        }
      }, 200);
    }
  }

  markUpToDate(fragment, transformer) {
    fragment.buildCount--;
    fragment.isBuilding = fragment.buildCount > 0;
    if (!fragment.outOfDateTransformers?.length > 0) {
      fragment.outOfDateTransformers = [...CybertronService.transformers];
    }
    fragment.outOfDateTransformers = fragment.outOfDateTransformers.filter(t => t !== transformer);
    if (fragment.outOfDateTransformers.length === 0) {
      fragment.isOutOfDate = false;
      this.queueFragmentUpToDate(fragment, transformer);
    } else {
      // the state has changed for transformers, let them update
      this.queueFragmentBuilding(fragment, transformer);
    }
  }

  markIsBuilding(fragment, transformer) {
    fragment.isBuilding = true;
    fragment.buildCount = (fragment.buildCount || 0) + 1;
    this.queueFragmentBuilding(fragment, transformer);
  }

  getFragment(key) {
    return this.textFragments.find(t => t.key == key);
  }

  getParent(key) {
    const fragment = this.getFragment(key);
    if (!fragment || fragment.depth === 1) return null;
    const index = this.textFragments.indexOf(fragment);
    if (index === 0) return null;
    for (let i = index - 1; i >= 0; i--) {
      if (this.textFragments[i].depth < fragment.depth) return this.textFragments[i];
    }
    return null;
  }

  tryAddToOutOfDate(key, transformer) {
    const fragment = this.getFragment(key);
    if (!fragment) {
      DialogService.showError('Unknown key: ' + key);
      return;
    }
    if (!fragment.isOutOfDate) {
      fragment.outOfDateTransformers = [transformer];
      this.markOutOfDate(fragment);
    } else if (fragment.outOfDateTransformers.length > 0 && !fragment.outOfDateTransformers.includes(transformer)) {
      fragment.outOfDateTransformers.push(transformer);
      if (fragment.outOfDateTransformers.length === CybertronService.transformers.length) {
        fragment.outOfDateTransformers = [];
      }
      this.dispatchEvent('fragment-out-of-date', key);
    }
  }

  isAnyFragmentOutOfDate() {
    return this.textFragments.some(fragment => fragment.isOutOfDate);
  }

  dispatchEvent(event, value) {
    if (!this.blockEvents) {
      const eventObject = value ? new CustomEvent(event, { detail: value }) : new Event(event);
      // use setTimeout cause this is not an async function, and the event listeners are async and we want them to be called after the current function is done and in sequence
      setTimeout(async () => {
        await this.eventTarget.dispatchEvent(eventObject);
      }, 0);
    }
  }

  setIsDirty(isDirty) {
    if (this.isDirty === isDirty) return;
    this.isDirty = isDirty;
    this.dispatchEvent('is-dirty-changed', isDirty);
  }
}

export default new ProjectService();