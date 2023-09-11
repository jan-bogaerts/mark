
const FolderService = require('../folder_service/FolderService');
const LineParser = require('../line_parser/LineParser');
const PositionTrackingService = require('../position-tracking_service/PositionTrackingService');

class ProjectService {
  constructor() {
    this.textFragments = [];
    this.content = '';
    this.filename = '';
    this.autoSave = localStorage.getItem('autoSave') === 'true';
    this.saveTimer = null;
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
    // Assuming cybertron-service and transformers are globally available
    cybertronService.transformers.forEach(transformer => transformer.cache.clearCache());
    this.emit('content-changed');
  }

  loadProject(filePath) {
    this.clear();
    FolderService.setLocation(filePath);
    this.content = fs.readFileSync(filePath, 'utf8');
    this.content.split('\n').forEach((line, index) => LineParser.parse(line, index));
    cybertronService.transformers.forEach(transformer => transformer.cache.loadCache());
    this.emit('content-changed');
  }

  saveProject(file) {
    if (!this.filename) {
      FolderService.moveTo(file);
    } else if (this.filename !== file) {
      FolderService.copyTo(file);
    }
    fs.writeFileSync(file, this.content, 'utf8');
    cybertronService.transformers.forEach(transformer => transformer.cache.saveCache());
    this.filename = file;
    this.saveTimer = null;
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
    if (this.autoSave && this.filename && !this.saveTimer) {
      this.saveTimer = setTimeout(() => this.saveProject(this.filename), 5000);
    }
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

  clear() {
    this.textFragments = [];
    this.content = '';
    LineParser.clear();
    PositionTrackingService.clear();
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

module.exports = new ProjectService();
