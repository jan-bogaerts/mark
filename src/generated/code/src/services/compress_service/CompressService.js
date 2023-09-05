
import resources from '../../resources.json';
import cybertronService from '../cybertron_service/CybertronService';
import TransformerBaseService from '../transformer-base_service/TransformerBaseService';

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
   * @return {Array} - The compressed message and the text fragment key
   */
  buildMessage(textFragment) {
    const result = resources.MarkdownCode_services_compress_service_0;
    result.push({
      role: 'user',
      content: textFragment.lines.join('\n')
    });
    return [result, textFragment.key];
  }
}

// Create a global instance of the service
const compressService = new CompressService();

export default compressService;
