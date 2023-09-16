
const LineParser = require('../../line_parser/LineParser');
const ProjectService = require('../ProjectService');
const StorageService = require('../storage_service/StorageService');

/**
 * ChangeProcessorService class
 * Responsible for processing changes in the project content
 * Ensures that the project structure remains in sync with the source
 */
class ChangeProcessorService {
  /**
   * Process changes in the project content
   * @param {Array} changes - Array of changes made to the project content
   * @param {string} full - The new value of the project content
   */
  static process(changes, full) {
    ProjectService.content = full;

    changes.forEach(change => {
      const lines = change.text.split('\n');
      let curLine = change.range.startLineNumber - 1;
      const lineEnd = change.range.endLineNumber - 1;
      let lineIdx = 0;

      // Replace lines that are overwritten
      while (lineIdx < lines.length && curLine < lineEnd) {
        LineParser.parse(lines[lineIdx], curLine);
        lineIdx += 1;
        curLine += 1;
      }

      // Delete or insert lines
      while (curLine < lineEnd) {
        LineParser.deleteLine(curLine);
        curLine += 1;
      }

      while (lineIdx < lines.length) {
        LineParser.insert(lines[lineIdx], curLine);
        lineIdx += 1;
      }

      // Mark project as dirty after changes
      StorageService.markDirty();
    });
  }
}

module.exports = ChangeProcessorService;
