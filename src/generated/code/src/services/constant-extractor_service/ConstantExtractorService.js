
import TransformerBaseService from '../transformer-base_service/TransformerBaseService';

/**
 * ConstantExtractorService class
 * Inherits from TransformerBaseService
 */
class ConstantExtractorService extends TransformerBaseService {
  constructor() {
    super('constants', [], true);
  }

  /**
   * Extract all the locations in the text that contain quotes
   * @param {Array} lines - The lines of text to extract quotes from
   * @returns {Array} The extracted quotes
   */
  extractQuotes(lines) {
    let quotes = [];
    let current_quote = null;
    let cur_lines = [];
    let line_nr = 0;

    for (let line of lines) {
      line = line.trimLeft();
      if (line.startsWith('>')) {
        line = line.slice(1);
        if (line.length > 0 && line[0] === ' ') {
          line = line.slice(1);
        }
        cur_lines.push(line);
        if (!current_quote) {
          if (line_nr > 0 && !lines[line_nr - 1].trim()) {
            current_quote = { start: line_nr - 1 };
          } else {
            current_quote = { start: line_nr };
          }
        }
      } else if (!line && current_quote) {
        current_quote['end'] = line_nr;
        quotes.push([current_quote, cur_lines]);
        current_quote = null;
        cur_lines = [];
      }
      line_nr += 1;
    }

    if (current_quote) {
      current_quote['end'] = line_nr;
      quotes.push([current_quote, cur_lines]);
    }

    return quotes;
  }

  /**
   * Render the result of the extracted quotes
   * @param {Object} textFragment - The text fragment to render
   * @returns {Array} The rendered result
   */
  renderResult(textFragment) {
    const result = this.extractQuotes(textFragment.lines);
    this.cache.setResult(textFragment.key, result);
    return result;
  }

  /**
   * Get an up-to-date result value for the specified key
   * @param {Object} fragment - The fragment to get the result for
   * @returns {Promise} The result value
   */
  async getResult(fragment) {
    let quotes = [];
    if (!this.cache.isOutOfDate(fragment.key)) {
      quotes = this.cache.getFragmentResults(fragment.key);
    } else {
      quotes = await this.renderResult(fragment);
    }

    if (!quotes) {
      return fragment.lines.join('\n');
    } else {
      let lines = fragment.lines;
      let new_lines = [];
      let consts = [...quotes];
      let current_const = consts.shift();
      let cur_line = 0;

      while (cur_line < lines.length) {
        if (current_const && cur_line === current_const['start']) {
          new_lines[new_lines.length - 1] += ` the value of the constant resources.${current_const["name"]}`;
          cur_line = current_const['end'] + 1;
          if (consts.length > 0) {
            current_const = consts.shift();
          } else {
            current_const = null;
          }
        } else {
          new_lines.push(lines[cur_line]);
          cur_line += 1;
        }
      }

      return new_lines.join('\n');
    }
  }
}

export default ConstantExtractorService;
