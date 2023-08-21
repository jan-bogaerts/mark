
const { EventEmitter } = require('events');
const { ipcRenderer } = require('electron');

/**
 * PositionTrackingService class
 * This service is responsible for tracking the text-fragment that the user is currently working on.
 */
class PositionTrackingService {
  /**
   * PositionTrackingService constructor
   */
  constructor() {
    this.currentLine = null;
    this.currentTextFragment = null;
    this.eventTarget = new EventEmitter();
  }

  /**
   * Set currently selected line
   * @param {number} line - The line number
   * @param {Array} projectData - The project's data list
   */
  setCurrentLine(line, projectData) {
    if (this.currentLine !== line) {
      this.currentLine = line;
      const relatedObject = projectData.find(item => item.line === line);

      if (relatedObject && relatedObject.parent !== this.currentTextFragment) {
        this.currentTextFragment = relatedObject.parent;
        this.eventTarget.emit('changed', this.currentTextFragment);
      }
    }
  }

  /**
   * Subscribe to position changes
   * @param {Function} callback - The callback function
   */
  subscribe(callback) {
    this.eventTarget.on('changed', callback);
  }

  /**
   * Unsubscribe from position changes
   * @param {Function} callback - The callback function
   */
  unsubscribe(callback) {
    this.eventTarget.removeListener('changed', callback);
  }
}

module.exports = PositionTrackingService;
