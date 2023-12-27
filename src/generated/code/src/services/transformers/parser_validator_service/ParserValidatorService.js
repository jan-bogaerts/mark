
import TransformerBaseService from '../../transformer-base_service/TransformerBaseService';

/**
 * ParserValidatorService class
 * Inherits from TransformerBaseService
 * Used to verify the internal markdown parser
 */
class ParserValidatorService extends TransformerBaseService {
  /**
   * ParserValidatorService constructor
   * Calls the parent constructor with the service name, dependencies and isJson flag
   */
  constructor() {
    super('parser validator', [], false);
  }

  /**
   * renderResult function
   * Takes a text fragment and returns a string representation of it
   * Caches the result for future use
   * @param {Object} fragment - The text fragment to render
   * @return {string} The rendered result
   */
  renderResult(fragment) {
    const result = fragment.lines.join('\n');
    this.cache.setResult(fragment.key, result, [...fragment.lines]);
    return result;
  }
  
  buildMessage(fragment) {
    return [fragment.lines.join('\n'), []];
  }
}

export default ParserValidatorService;
