
import FolderService from '../folder_service/FolderService';
import CybertronService from '../cybertron_service/CybertronService';
import LineParser from '../line_parser/LineParser';

class ProjectService {
  constructor() {
    this.textFragments = [];
    this.content = '';
    this.filename = '';
    this.autoSave = localStorage.getItem('autoSave') === 'true';
    this.eventTarget = new EventTarget();
  }

  getAutoSaveState() {
    return this.autoSave;
  }

  setAutoSaveState(state) {
    this.autoSave = state;
    localStorage.setItem('autoSave', state);
  }

  getFilename() {
    return this.filename;
  }

  getContent() {
    return this.content;
  }

  newProject() {
    this.clear();
    FolderService.clear();
    CybertronService.transformers.forEach(transformer => transformer.cache.clearCache());
    this.emit('content-changed');
  }

  loadProject(filePath) {
    this.clear();
    FolderService.setLocation(filePath);
    this.content = fs.readFileSync(filePath, 'utf-8');
    this.content.split('\n').forEach((line, index) => LineParser.parse(line, index));
    CybertronService.transformers.forEach(transformer => transformer.cache.loadCacheFromFile());
    this.emit('content-changed');
  }

  saveProject(file) {
    if (!this.filename) {
      FolderService.move(file);
    } else if (this.filename !== file) {
      FolderService.copy(file);
    }
    fs.writeFileSync(file, this.textFragments.map(fragment => `${fragment.title}\n${fragment.lines.join('\n')}`).join('\n'));
    this.filename = file;
  }

  processChanges(changes, full) {
    changes.forEach(change => {
      const lines = change.text.split('\n');
      let curLine = change.range.startLineNumber - 1;
      let lineEnd = change.range.endLineNumber - 1;
      let lineIdx = 0;
      while (lineIdx < lines.length && curLine < lineEnd) {
        LineParser.parse(lines[lineIdx], curLine);
        lineIdx++;
        curLine++;
      }
      while (curLine < lineEnd) {
        LineParser.deleteLine(curLine);
        curLine++;
      }
      while (lineIdx < lines.length) {
        LineParser.insert(lines[lineIdx], curLine);
        lineIdx++;
        curLine++;
      }
    });
    this.content = full;
    this.markDirty();
  }

  markDirty() {
    if (this.autoSave && this.filename) {
      setTimeout(() => this.saveProject(this.filename), 5000);
    }
  }

  clear() {
    this.textFragments = [];
    this.content = '';
    LineParser.clear();
    PositionTrackingService.clear();
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
    this.emit('fragment-inserted', fragment.key);
  }

  markOutOfDate(fragment) {
    fragment.isOutOfDate = true;
    this.emit('fragment-out-of-date', fragment.key);
  }

  emit(eventName, detail) {
    this.eventTarget.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  subscribe(eventName, callback) {
    this.eventTarget.addEventListener(eventName, callback);
  }

  unsubscribe(eventName, callback) {
    this.eventTarget.removeEventListener(eventName, callback);
  }
}

export default new ProjectService();
