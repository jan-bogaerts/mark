
import { TransformerBaseService } from '../transformer-base_service/TransformerBaseService';
import resources from '../../generated/code/src/resources.json';

/**
 * CompressService class
 * Inherits from TransformerBaseService
 * Compresses a text fragment
 */
class CompressService extends TransformerBaseService {
  constructor() {
    super('compress', []);
    cybertronService.register(this, true);
  }

  /**
   * Builds a message from a text fragment
   * @param {Object} textFragment - The text fragment to compress
   * @returns {Array} - The compressed message and the text fragment key
   */
  buildMessage(textFragment) {
    const result = [
      { role: 'system', content: resources.MarkdownCode_services_compress_service_0 },
      { role: 'user', content: textFragment.lines.join('\n') },
    ];
    return [result, textFragment.key];
  }
}

export default CompressService;
