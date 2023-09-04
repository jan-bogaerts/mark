
const { ipcRenderer } = require('electron');
const { LineParser } = require('../line_parser/LineParser');
const { FolderService } = require('../folder_service/FolderService');

class ProjectService {
  constructor() {
    this.autoSave = localStorage.getItem('autoSave') === 'true';
    this.filename = '';
    this.textFragments = [];
  }

  getAutoSaveState() {
    return this.autoSave;
  }

  newProject() {
    this.textFragments = [];
    FolderService.clear();
    ipcRenderer.send('project-data-changed');
  }

  loadProject(filePath) {
    FolderService.setLocation(filePath);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    lines.forEach((line, index) => {
      const parsedLine = LineParser.parse(line, index);
      this.textFragments.push(parsedLine);
    });
    ipcRenderer.send('project-data-changed');
  }

  getFilename() {
    return this.filename;
  }

  saveProject(filePath) {
    if (!this.filename) {
      FolderService.move(filePath);
    } else if (this.filename !== filePath) {
      FolderService.copy(filePath);
    }
    const fileContent = this.textFragments.map(fragment => fragment.toString()).join('\n');
    fs.writeFileSync(filePath, fileContent);
    this.filename = filePath;
  }

  setAutoSaveState(state) {
    this.autoSave = state;
    localStorage.setItem('autoSave', state);
  }

  subscribe(callback) {
    ipcRenderer.on('project-data-changed', callback);
  }

  unsubscribe(callback) {
    ipcRenderer.removeListener('project-data-changed', callback);
  }

  setCode(code) {
    this.textFragments = LineParser.parse(code);
    ipcRenderer.send('project-data-changed');
  }

  getProjectData() {
    return this.textFragments.map((fragment, index) => ({
      title: fragment.title,
      key: this.calculateKey(fragment, index),
      levelCount: fragment.levelCount,
    }));
  }

  on(eventName, callback) {
    ipcRenderer.on(eventName, callback);
  }

  addTextFragment(textFragment) {
    this.textFragments.push(textFragment);
    ipcRenderer.send('project-data-changed');
  }

  getTextFragmentAt(index) {
    return this.textFragments[index];
  }

  emit(eventName, ...args) {
    ipcRenderer.send(eventName, ...args);
  }

  calculateKey(fragment, index) {
    return `${fragment.title}-${index}`;
  }

  deleteTextFragment(index) {
    this.textFragments.splice(index, 1);
    ipcRenderer.send('project-data-changed');
  }

  markOutOfDate(index) {
    this.textFragments[index].outOfDate = true;
    ipcRenderer.send('project-data-changed');
  }

  createTextFragment(line, index) {
    const textFragment = LineParser.parse(line, index);
    this.textFragments.push(textFragment);
    ipcRenderer.send('project-data-changed');
  }
}

module.exports = new ProjectService();
