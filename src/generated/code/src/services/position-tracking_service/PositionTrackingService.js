
const { ipcRenderer } = require('electron');
const { SelectionService } = require('../Selection_service/SelectionService');

/**
 * PositionTrackingService class
 * Singleton class responsible for tracking the text-fragment that the user is currently working on.
 */
class PositionTrackingService {
  constructor() {
    if (!PositionTrackingService.instance) {
      this.activeFragment = null;
      this.currentLine = null;
      this.eventTarget = new EventTarget();
      PositionTrackingService.instance = this;
    }

    return PositionTrackingService.instance;
  }

  /**
   * Updates the current position of the cursor in the editor.
   * @param {Object} position - The new position of the cursor.
   */
  updatePosition(position) {
    if (this.currentLine !== position.line) {
      this.currentLine = position.line;
      const newFragment = SelectionService.fragmentsIndex[this.currentLine];
      if (this.activeFragment !== newFragment) {
        this.setActiveFragment(newFragment);
      }
    }
  }

  /**
   * Sets the active fragment in the PositionTrackingService.
   * @param {Object} fragment - The new active fragment.
   */
  setActiveFragment(fragment) {
    this.activeFragment = fragment;
    this.eventTarget.dispatchEvent(new Event('changed'));
  }

  /**
   * Returns the current key being tracked by the PositionTrackingService.
   * @returns {Object} The current active fragment.
   */
  getCurrentKey() {
    return this.activeFragment;
  }

  /**
   * Allows a function to be called whenever the tracked position changes.
   * @param {Function} callback - The function to call when the position changes.
   */
  subscribe(callback) {
    this.eventTarget.addEventListener('changed', callback);
  }

  /**
   * Removes a previously subscribed function from being called when the tracked position changes.
   * @param {Function} callback - The function to remove from the event listeners.
   */
  unsubscribe(callback) {
    this.eventTarget.removeEventListener('changed', callback);
  }
}

const positionTrackingService = new PositionTrackingService();
Object.freeze(positionTrackingService);

module.exports = positionTrackingService;
