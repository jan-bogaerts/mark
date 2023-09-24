
import dialogService from '../dialog_service/DialogService';
import CybertronService from '../cybertron_service/CybertronService';

class ProjectService {
  constructor() {
    this.textFragments = [];
    this.content = '';
    this.filename = '';
    this.eventTarget = new EventTarget();
  }

  deleteTextFragment(fragment) {
    this.textFragments = this.textFragments.filter(frag => frag.key !== fragment.key);
    this.eventTarget.dispatchEvent(new CustomEvent('fragment-deleted', { detail: fragment.key }));
  }

  addTextFragment(fragment, index) {
    if (index >= this.textFragments.length) {
      this.textFragments.push(fragment);
    } else {
      this.textFragments.splice(index, 0, fragment);
    }
    this.eventTarget.dispatchEvent(new CustomEvent('fragment-inserted', { detail: fragment.key }));
  }

  markOutOfDate(fragment) {
    fragment.isOutOfDate = true;
    this.eventTarget.dispatchEvent(new CustomEvent('fragment-out-of-date', { detail: fragment.key }));
  }

  getFragment(key) {
    return this.textFragments.find(t => t.key == key);
  }

  tryAddToOutOfDate(key, transformer) {
    let fragment = this.getFragment(key);
    if (!fragment) {
      dialogService.showError('Unknown key: ' + key);
      return;
    }
    if (!fragment.isOutOfDate) {
      fragment.outOfDateTransformers = [transformer];
      this.markOutOfDate(fragment);
    } else if (fragment.outOfDateTransformers.length > 0) {
      fragment.outOfDateTransformers.push(transformer);
      if (fragment.outOfDateTransformers.length == CybertronService.tranformers.length) {
        fragment.outOfDateTransformers = [];
        this.eventTarget.dispatchEvent(new CustomEvent('fragment-out-of-date', { detail: key }));
      }
    }
  }

  isAnyFragmentOutOfDate() {
    return this.textFragments.some(fragment => fragment.isOutOfDate);
  }

  getProjectData() {
    return this.textFragments;
  }

  getAutoSaveState() {
    return localStorage.getItem('autoSave') === 'true';
  }

  setAutoSaveState(state) {
    localStorage.setItem('autoSave', state);
  }

  getFileName() {
    return this.filename;
  }
}

const projectService = new ProjectService();
export default projectService;
