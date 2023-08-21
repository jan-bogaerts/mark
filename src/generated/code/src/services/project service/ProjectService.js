
const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

/**
 * ProjectService class
 * This class is responsible for managing the project data and user configurations.
 */
class ProjectService extends EventEmitter {
  constructor() {
    super();
    this.dataList = [];
    this.filename = '';
    this.autoSave = false;
    this.codeStyle = '';
    this.activeFragment = null;
  }

  /**
   * Returns the current state of the auto-save feature.
   */
  getAutoSaveState() {
    return this.autoSave;
  }

  /**
   * Initiates the creation of a new project.
   */
  newProject() {
    this.dataList = [];
    this.emit('data-changed');
  }

  /**
   * Loads a project from a given file path.
   * @param {string} filePath - The path of the file to load.
   */
  loadProject(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    this.dataList = lines.map(line => JSON.parse(line));
    this.filename = filePath;
    this.emit('data-changed');
  }

  /**
   * Returns the filename of the current project.
   */
  getFilename() {
    return this.filename;
  }

  /**
   * Saves the current project to a given file path.
   * @param {string} filePath - The path of the file to save.
   */
  saveProject(filePath) {
    const fileContent = this.dataList.map(item => JSON.stringify(item)).join('\n');
    fs.writeFileSync(filePath, fileContent, 'utf-8');
    this.filename = filePath;
  }

  /**
   * Sets the state of the auto-save feature to a given boolean value.
   * @param {boolean} state - The new state of the auto-save feature.
   */
  setAutoSaveState(state) {
    this.autoSave = state;
  }

  /**
   * Returns the currently selected fragment in the project.
   */
  getActiveFragment() {
    return this.activeFragment;
  }
}

module.exports = new ProjectService();
