
import resources from '../../../resources.json';
import TransformerBaseService from '../../transformer-base_service/TransformerBaseService';
import DoubleCompressService from '../../double-compress_service/DoubleCompressService';

/**
 * TripleCompressService class
 * Inherits from TransformerBaseService
 * Takes the result of DoubleCompressService and shortens it to 1 line
 */
class TripleCompressService extends TransformerBaseService {
  /**
   * TripleCompressService constructor
   * @param {string} name - Service name
   * @param {Array} dependencies - Service dependencies
   * @param {boolean} isJson - Flag to check if the service is JSON
   */
  constructor(name = 'triple compress', dependencies = ['double compress'], isJson = false) {
    super(name, dependencies, isJson);
    this.doubleCompressService = this.dependencies[0];
  }

  /**
   * Build message from text fragment
   * @param {Object} textFragment - Text fragment to compress
   * @returns {Array} - Compressed message and text fragment key
   */
  async buildMessage(textFragment) {
    const result = [
      {
        role: 'system',
        content: resources.MarkdownCode_services_transformers_triple_compress_service_0,
      },
      {
        role: 'user',
        content: await this.doubleCompressService.getResult(textFragment),
      },
    ];
    return [result, textFragment.key];
  }
}

export default TripleCompressService;
