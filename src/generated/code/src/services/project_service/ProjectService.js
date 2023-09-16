
import dialogService from '../dialog_service/DialogService';
import cybertronService from '../cybertron_service/CybertronService';

class ProjectService extends EventTarget {
  constructor() {
    super();
    this.textFragments = [];
    this.content = '';
    this.autoSave = localStorage.getItem('autoSave') === 'true';
  }

  deleteTextFragment(fragment) {
    const index = this.textFragments.indexOf(fragment);
    if (index > -1) {
      this.textFragments.splice(index, 1);
      this.emit('fragment-deleted', fragment.key);
    }
  }

  addTextFragment(fragment, index) {
    if (index >= this.textFragments.length) {
      this.textFragments.push(fragment);
    } else {
      this.textFragments.splice(index, 0, fragment);
    }
    this.emit('fragment-inserted', fragment);
  }

  markOutOfDate(fragment) {
    fragment.isOutOfDate = true;
    this.emit('fragment-out-of-date', fragment.key);
  }

  getFragment(key) {
    return this.textFragments.find(t => t.key == key);
  }

  tryAddToOutOfDate(key, transformer) {
    const fragment = this.getFragment(key);
    if (!fragment) {
      dialogService.showError('Unknown key: ' + key);
      return;
    }
    if (!fragment.isOutOfDate) {
      fragment.outOfDateTransformers = [transformer];
      this.markOutOfDate(fragment);
    } else if (fragment.outOfDateTransformers.length > 0) {
      fragment.outOfDateTransformers.push(transformer);
      if (fragment.outOfDateTransformers.length == cybertronService.transformers.length) {
        fragment.outOfDateTransformers = [];
        this.emit('fragment-out-of-date', key);
      }
    }
  }

  isAnyFragmentOutOfDate() {
    return this.textFragments.some(fragment => fragment.isOutOfDate);
  }

  getAutoSaveState() {
    return this.autoSave;
  }

  setAutoSaveState(state) {
    this.autoSave = state;
    localStorage.setItem('autoSave', state);
  }

  getProjectData() {
    return this.textFragments;
  }
}
const projectService = new ProjectService();
export default  projectService;
