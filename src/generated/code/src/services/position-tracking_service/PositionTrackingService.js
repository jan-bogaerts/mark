
import LineParser from '../line_parser/LineParser';

/**
 * PositionTrackingService class
 * This class is responsible for tracking the text-fragment and transformer that the user is currently working on / with.
 */
class PositionTrackingService {
  constructor() {
    this.currentLine = null;
    this.activeFragment = null;
    this.activeTransformer = null;
    this.eventTarget = new EventTarget();
  }

  /**
   * Sets the currently selected line
   * @param {number} lineIndex - The line index to set
   */
  setCurrentLine(lineIndex) {
    if (this.currentLine !== lineIndex) {
      let fragment = LineParser.fragmentsIndex[lineIndex];
      if (!fragment) {
        fragment = LineParser.fragmentsIndex[lineIndex - 1];
      }
      if (this.activeFragment !== fragment) {
        this.activeFragment = fragment;
        const changeEvent = new CustomEvent('change', { detail: fragment });
        this.eventTarget.dispatchEvent(changeEvent);
      }
      this.currentLine = lineIndex;
    }
  }

  /**
   * Clears the activeFragment and currentLine
   */
  clear() {
    this.activeFragment = null;
    this.currentLine = null;
  }

  /**
   * Sets the active fragment
   * @param {object} fragment - The fragment to set
   */
  setActiveFragment(fragment) {
    if (this.activeFragment !== fragment) {
      const startPos = LineParser.getStartLine(fragment);
      if (startPos > -1) {
        const moveToEvent = new CustomEvent('moveTo', { detail: startPos + 1 });
        this.eventTarget.dispatchEvent(moveToEvent);
      }
      this.activeFragment = fragment;
      const changeEvent = new CustomEvent('change', { detail: fragment });
        this.eventTarget.dispatchEvent(changeEvent);
    }
  }

  /**
   * Sets the active transformer
   * @param {object} transformer - The transformer to set
   */
  setActiveTransformer(transformer) {
    if (this.activeTransformer !== transformer) {
      this.activeTransformer = transformer;
      const changeEvent = new CustomEvent('change', { detail: transformer });
      this.eventTarget.dispatchEvent(changeEvent);
    }
  }
}

export default new PositionTrackingService();
