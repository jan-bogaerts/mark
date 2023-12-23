import CybertronService from '../cybertron_service/CybertronService';
import DialogService from '../dialog_service/DialogService';

class ProjectService {
  constructor() {
    this.textFragments = [];
    this.content = '';
    this.filename = '';
    this.isDirty = false;
    this.blockEvents = false;
    this.eventTarget = new EventTarget();
    this.autoSave = this.getAutoSaveState();
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

  markUpToDate(fragment, transformer) {
    fragment.buildCount--;
    fragment.isBuilding = fragment.buildCount >= 0;
    if (!fragment.outOfDateTransformers?.length > 0) {
      fragment.outOfDateTransformers = [...CybertronService.transformers];
    }
    fragment.outOfDateTransformers = fragment.outOfDateTransformers.filter(t => t !== transformer);
    if (fragment.outOfDateTransformers.length === 0) {
      fragment.isOutOfDate = false;
      this.dispatchEvent('fragment-up-to-date', fragment.key);
    } else {
      // the state has changed for transformers, let them update
      this.dispatchEvent('fragment-building', { fragment: fragment, transformer: transformer });
    }
  }

  markIsBuilding(fragment, transformer) {
    fragment.isBuilding = true;
    fragment.buildCount = (fragment.buildCount || 0) + 1;
    this.dispatchEvent('fragment-building', { fragment: fragment, transformer: transformer });
  }

  getFragment(key) {
    return this.textFragments.find(t => t.key == key);
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
    } else if (fragment.outOfDateTransformers.length > 0) {
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
      this.eventTarget.dispatchEvent(eventObject);
    }
  }

  setIsDirty(isDirty) {
    if (this.isDirty === isDirty) return;
    this.isDirty = isDirty;
    this.dispatchEvent('is-dirty-changed', isDirty);
  }
}

export default new ProjectService();