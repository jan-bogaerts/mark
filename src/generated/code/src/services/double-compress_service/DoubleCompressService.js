
// Importing required modules and services
import resources from '../../resources.json';
import TransformerBaseService from '../transformer-base_service/TransformerBaseService';

/**
 * DoubleCompressService class
 * Inherits from TransformerBaseService
 * Takes the result of CompressService and makes it even shorter
 */
class DoubleCompressService extends TransformerBaseService {
  /**
   * DoubleCompressService constructor
   * Initializes the 'compress' service and registers it to the 'cybertronService'
   */
  constructor() {
    super('double compress', ['compress'], false);
    this.compressService = this.dependencies[0];
  }

  /**
   * buildMessage method
   * Takes a text fragment as an argument and returns a compressed message and the text fragment key
   * @param {Object} textFragment - The text fragment to be compressed
   * @return {Array} - The compressed message and the text fragment key
   */
  async buildMessage(textFragment) {
    const result = [
      {
        role: 'system',
        content: resources.MarkdownCode_services_double_compress_service_0,
      },
      {
        role: 'user',
        content: await this.compressService.getResult(textFragment),
      },
    ];
    return [result, [textFragment.key]];
  }
}

// Exporting DoubleCompressService as default
export default DoubleCompressService;
