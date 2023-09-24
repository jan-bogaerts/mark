
import LineParser from '../line_parser/LineParser';

/**
 * PositionTrackingService class
 */
class PositionTrackingService {
  constructor() {
    this.currentLine = null;
    this.activeFragment = null;
    this.activeTransformer = null;
    this.eventTarget = new EventTarget();
  }

  /**
   * Set the currently selected line
   * @param {number} lineIndex - The line index
   */
  setCurrentLine(lineIndex) {
    if (this.currentLine !== lineIndex) {
      const fragment = LineParser.fragmentsIndex[lineIndex];
      if (this.activeFragment !== fragment) {
        this.activeFragment = fragment;
        this.triggerChangeEvent();
      }
    }
    this.currentLine = lineIndex;
  }

  /**
   * Clear the current line and active fragment
   */
  clear() {
    this.currentLine = null;
    this.activeFragment = null;
  }

  /**
   * Trigger the change event
   */
  triggerChangeEvent() {
    const event = new CustomEvent('change', { detail: this.activeFragment });
    this.eventTarget.dispatchEvent(event);
  }

  /**
   * Set the active fragment
   * @param {object} fragment - The fragment object
   */
  setActiveFragment(fragment) {
    if (this.activeFragment !== fragment) {
      this.activeFragment = fragment;
      this.triggerChangeEvent();
    }
  }
}

export default new PositionTrackingService();