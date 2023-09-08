
import LineParserHelpers from 'line_parser_helpers/LineParserHelpers';
import ProjectService from '../project_service/ProjectService';

class LineParser {
  constructor() {
    this.fragmentsIndex = [];
  }

  /**
   * Creates a new text fragment and adds it to the project service.
   * @param {string} line - The line to be processed.
   * @param {number} index - The index at which the object should be placed.
   */
  createTextFragment(line, index) {
    const trimmedLine = line.trim().toLowerCase();
    const depth = (trimmedLine.match(/#/g) || []).length;
    const title = trimmedLine.replace(/#/g, '');
    const key = this.calculateKey({ title, depth }, index);
    const textFragment = {
      title,
      depth,
      key,
      outOfDate: true,
      lines: [],
    };
    ProjectService.addTextFragment(textFragment, index);
  }

  /**
   * Calculates the key of a text fragment.
   * @param {Object} textFragment - The text fragment to calculate the key for.
   * @param {number} index - The index of the text fragment.
   * @returns {string} The calculated key.
   */
  calculateKey(textFragment, index) {
    let currentDepth = textFragment.depth;
    let result = textFragment.title;
    for (let idx = index; idx >= 0; idx--) {
      const prevFragment = ProjectService.textFragments[idx];
      if (prevFragment.depth < currentDepth) {
        currentDepth = prevFragment.depth;
        result = `${prevFragment.title} > ${result}`;
        if (currentDepth === 1) break;
      }
    }
    return result;
  }

  /**
   * Clears the fragments index.
   */
  clear() {
    this.fragmentsIndex = [];
  }

  /**
   * Parses a line of text.
   * @param {string} line - The line to parse.
   * @param {number} index - The index of the line.
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

  /**
   * Deletes a line at a given index.
   * @param {number} index - The index of the line to delete.
   */
  deleteLine(index) {
    ProjectService.textFragments.splice(index, 1);
  }

  /**
   * Inserts a line of text at a given index.
   * @param {string} line - The line to insert.
   * @param {number} index - The index at which to insert the line.
   */
  insert(line, index) {
    ProjectService.textFragments.splice(index, 0, line);
    this.parse(line, index);
  }
}

export default new LineParser();
