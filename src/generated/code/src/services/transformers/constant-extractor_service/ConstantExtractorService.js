
import TransformerBaseService from '../../transformer-base_service/TransformerBaseService';
import BuildStackService from '../../build-stack_service/BuildStackService';
import keyService from '../../key_service/KeyService';

/**
 * ConstantExtractorService class
 * This service extracts all constant definitions (between quotes) from the source code,
 * renders them to a json file and replaces them with references to the json-entries in the source texts.
 */
class ConstantExtractorService extends TransformerBaseService {
  constructor() {
    super('constants', [], true);
  }

  /**
   * Extract all the locations in the text that contain quotes
   * @param {string} key - The key of the text fragment
   * @param {Array} lines - The lines of the text fragment
   * @returns {Array} quotes - The list of quotes
   */
  extractQuotes(fragment) {
    const { key, lines } = fragment;
    let quotes = [];
    let current_quote = null;
    let cur_lines = [];
    let line_nr = 0;
    let count = 0;

    for (let line of lines) {
      line = line.trimLeft();
      if (line.startsWith('>')) {
        line = line.slice(1);
        if (line.startsWith(' ')) {
          line = line.slice(1);
        }
        cur_lines.push(line);
        if (!current_quote) {
          current_quote = (line_nr > 0 && !lines[line_nr - 1].trim()) ? {'start': line_nr - 1} : {'start': line_nr};
        }
      } else if (!line && current_quote) {
        count += 1;
        this.collectResponse(current_quote, line_nr, cur_lines, fragment, count, quotes);
        current_quote = null;
        cur_lines = [];
      }
      line_nr += 1;
    }

    if (current_quote) {
      count += 1;
      this.collectResponse(current_quote, line_nr, cur_lines, fragment, count, quotes);
    }

    return quotes;
  }

  /**
   * Add a quote to the list of quotes
   * @param {Object} toAdd - The quote to add
   * @param {number} end - The end line of the quote
   * @param {Array} lines - The lines of the quote
   * @param {object} fragment - The text fragment
   * @param {number} count - The count of the quote
   * @param {Array} quotes - The list of quotes
   */
  collectResponse(toAdd, end, lines, fragment, count, quotes) {
    let title = keyService.calculateLocation(fragment);
    title = 'res_' + title.replaceAll(' > ', '_').replaceAll(' ', '_').replaceAll('-', '_').trim();
    toAdd['end'] = end;
    toAdd['lines'] = lines;
    toAdd['name'] = `${title}_${count}`;
    quotes.push(toAdd);
  }

  /**
   * Render the result of the extraction
   * @param {Object} textFragment - The text fragment to render
   * @returns {Array} result - The result of the extraction
   */
  renderResult(textFragment) {
    const result = this.extractQuotes(textFragment);
    this.cache.setResult(textFragment.key, result, [...textFragment.lines]);
    return result;
  }

  /**
   * Get an up-to-date result value for the specified key. Use the cache when possible.
   * @param {Object} fragment - The text fragment to get the result for
   * @returns {string} result - The result of the extraction
   */
  async getResult(fragment) {
    let quotes = [];
    if (BuildStackService.mode === 'validating' || !this.cache.isOutOfDate(fragment.key)) {
      quotes = this.cache.getFragmentResults(fragment.key);
    } else {
      if (!BuildStackService.tryRegister(this, fragment)) {
        return;
      }
      try {
        quotes = await this.renderResult(fragment);
      } finally {
        BuildStackService.unRegister(this, fragment);
      }
    }

    if (!quotes || quotes.length === 0) {
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
          current_const = consts.length > 0 ? consts.shift() : null;
        } else {
          new_lines.push(lines[cur_line]);
          cur_line += 1;
        }
      }

      return new_lines.join('\n');
    }
  }

  buildMessage(fragment) {
    return [fragment.lines.join('\n'), []];
  }
}

export default ConstantExtractorService;
