import LineParserHelpers from './line_parser_helpers/LineParserHelpers';
import ProjectService from '../project_service/ProjectService';
import KeyService from '../key_service/KeyService';

/**
 * LineParser class
 */
class LineParser {
  /**
   * constructor
   */
  constructor() {
    this.fragmentsIndex = [];
  }

  /**
   * createTextFragment
   * @param {string} line
   * @param {number} index
   * @returns {object} textFragment
   */
  createTextFragment(line, index) {
    let trimmedLine = line.trim().toLowerCase();
    let depthLevel = (trimmedLine.match(/#/g) || []).length;
    let title = trimmedLine.replace(/#/g, '').trim();
    let textFragment = {
      title: title,
      depthLevel: depthLevel,
      isOutOfDate: true,
      lines: [],
      outOfDateTransformers: []
    };
    KeyService.assignKey(textFragment, index);
    ProjectService.addTextFragment(textFragment, index);
    return textFragment;
  }

  /**
   * clear
   */
  clear() {
    this.fragmentsIndex = [];
  }

  /**
   * getStartLine
   * @param {object} fragment
   * @returns {number} index
   */
  getStartLine(fragment) {
    return this.fragmentsIndex.indexOf(fragment);
  }

  /**
   * parse
   * @param {string} line
   * @param {number} index
   */
  parse(line, index) {
    let trimmedLine = line.trim();
    if (trimmedLine === '') {
      LineParserHelpers.handleEmptyLine(this, index);
    } else if (trimmedLine.startsWith('#')) {
      LineParserHelpers.handleTitleLine(this, trimmedLine, index);
    } else {
      if (line[line.length - 1] === '\r') {
        line = line.slice(0, -1);
      }
      LineParserHelpers.handleRegularLine(this, line, index);
    }
  }

  /**
   * insertLine
   * @param {string} line
   * @param {number} index
   */
  insertLine(line, index) {
    this.fragmentsIndex.splice(index, 0, null);
    this.parse(line, index);
  }

  /**
   * deleteLine
   * @param {number} index
   */
  deleteLine(index) {
    LineParserHelpers.deleteLine(this, index);
    this.fragmentsIndex.splice(index, 1);
  }
}

const lineParser = new LineParser();
export default lineParser;
