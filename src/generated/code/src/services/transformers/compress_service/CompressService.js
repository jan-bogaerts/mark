
import resources from '../../../resources.json';
import TransformerBaseService from '../../transformer-base_service/TransformerBaseService';

/**
 * CompressService class
 * Inherits from TransformerBaseService
 * Takes a text fragment and makes it shorter
 */
class CompressService extends TransformerBaseService {
  constructor() {
    super('compress', ['constants'], false);
    this.constantsService = this.dependencies[0];
  }

  /**
   * Builds a message from a text fragment
   * @param {Object} textFragment - The text fragment to compress
   * @return {Array} - The compressed message and text fragment key
   */
  async buildMessage(textFragment) {
    const result = [
      {
        role: 'system',
        content: resources.MarkdownCode_services_transformers_compress_service_0,
      },
      {
        role: 'user',
        content: await this.constantsService.getResult(textFragment),
      },
    ];

    return [result, [textFragment.key]];
  }

}

export default CompressService;
