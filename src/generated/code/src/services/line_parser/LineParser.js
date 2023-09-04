
import ProjectService from '../project_service/ProjectService';
import LineParserHelpers from './line_parser_helpers/LineParserHelpers';

/**
 * LineParser class
 * This class is used to parse markdown lines and update the text-fragments stored in the project-service.
 */
class LineParser {
  constructor() {
    this.fragmentsIndex = [];
  }

  /**
   * Function to create new text-fragments
   * @param {string} line - The line that is being processed
   */
  createTextFragment(line) {
    const trimmedLine = line.trim().toLowerCase();
    const depthLevel = (trimmedLine.match(/#/g) || []).length;
    const title = trimmedLine.replace(/#/g, '');
    const key = this.calculateKey({ title, depthLevel }, this.fragmentsIndex.length);
    const outOfDate = true;
    const lines = [];

    const textFragment = { title, depthLevel, key, outOfDate, lines };
    ProjectService.addTextFragment(textFragment);
    this.fragmentsIndex.push(textFragment);
  }

  /**
   * Function to calculate the key of a text-fragment
   * @param {Object} textFragment - The text-fragment
   * @param {number} index - The index position
   */
  calculateKey(textFragment, index) {
    let currentDepth = textFragment.depthLevel;
    let result = textFragment.title;

    for (let idx = index; idx >= 0; idx--) {
      const prevFragment = ProjectService.getTextFragmentAt(idx);
      if (prevFragment.depthLevel < currentDepth) {
        currentDepth = prevFragment.depthLevel;
        result = `${prevFragment.title} > ${result}`;
        if (currentDepth === 1) break;
      }
    }

    return result;
  }

  /**
   * Function to parse a line
   * @param {string} line - The line to parse
   * @param {number} index - The index of the line
   */
  parse(line, index) {
    if (line === '') {
      LineParserHelpers.handleEmptyLine(this, index);
    } else if (line.startsWith('#')) {
      LineParserHelpers.handleTitleLine(this, line, index);
    } else {
      LineParserHelpers.handleRegularLine(this, line, index);
    }
  }
}

export default LineParser;
