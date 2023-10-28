
import LineParserHelpers from './line_parser_helpers/LineParserHelpers';
import ProjectService from '../project_service/ProjectService';

class LineParser {
  constructor() {
    this.fragmentsIndex = [];
  }

  /**
   * Create a new text fragment and add it to the project service
   * @param {string} line - The line to be processed
   * @param {number} index - The index at which the object should be placed
   */
  createTextFragment(line, index) {
    const trimmedLine = line.trim().toLowerCase();
    const depth = (trimmedLine.match(/#/g) || []).length;
    const title = trimmedLine.replace(/#/g, '').trim();
    const key = this.calculateKey({ title, depth }, index);
    const textFragment = {
      title,
      depth,
      key,
      isOutOfDate: true,
      lines: [],
      outOfDateTransformers: [],
    };
    ProjectService.addTextFragment(textFragment, index);
    return textFragment;
  }

  /**
   * Calculate the key of a text fragment
   * @param {Object} textFragment - The text fragment
   * @param {number} index - The index position
   * @returns {string} - The calculated key
   */
  calculateKey(textFragment, index) {
    let currentDepth = textFragment.depth;
    let result = textFragment.title;
    for (let idx = index; idx >= 0; idx--) {
      const prevFragment = ProjectService.textFragments[idx];
      if (prevFragment && prevFragment.depth < currentDepth) {
        currentDepth = prevFragment.depth;
        result = `${prevFragment.title} > ${result}`;
        if (currentDepth === 1) break;
      }
    }
    return result;
  }

  /**
   * Clear the fragments index list
   */
  clear() {
    this.fragmentsIndex = [];
  }

  getStartLine(fragment) {
    return this.fragmentsIndex.indexOf(fragment);
  }

  /**
   * Parse a line of text
   * @param {string} line - The line to be parsed
   * @param {number} index - The current line number
   */
  parse(line, index) {
    const trimmedLine = line.trim();
    if (trimmedLine === '') {
      LineParserHelpers.handleEmptyLine(this, index);
    } else if (line.startsWith('#')) {
      LineParserHelpers.handleTitleLine(this, trimmedLine, index);
    } else {
      if (line.endsWith('\r')) {
        line = line.slice(0, -1);
      }
      LineParserHelpers.handleRegularLine(this, line, index);
    }
  }

  /**
   * Delete a line from the project content
   * @param {number} index - The line number to be deleted
   */
  deleteLine(index) {
    LineParserHelpers.deleteLine(this, index);
    this.fragmentsIndex.splice(index, 1);
  }

  /**
   * Insert a line of text at a given line number in the project content
   * @param {string} line - The line to be inserted
   * @param {number} index - The line number at which the line should be inserted
   */
  insertLine(line, index) {
    this.fragmentsIndex.splice(index, 0, null);
    this.parse(line, index);
  }
}

export default new LineParser();
