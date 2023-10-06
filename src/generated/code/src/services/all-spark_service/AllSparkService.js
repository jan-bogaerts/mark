
import CybertronService from '../cybertron_service/CybertronService';
import CompressService from '../transformers/compress_service/CompressService';
import ConstantExtractorService from '../constant-extractor_service/ConstantExtractorService';
import DoubleCompressService from '../double-compress_service/DoubleCompressService';
import TripleCompressService from '../transformers/triple-compress_service/TripleCompressService';
import ComponentListerService from '../transformers/component-lister_service/component-lister_service';

/**
 * AllSparkService class
 * This class is responsible for creating all the transformers and registering them into the cybertron service.
 */
class AllSparkService {
  constructor() {
    this.load();
  }

  /**
   * Load function
   * This function creates the transformers and register them with the cybertron-service.
   */
  load() {
    this.registerTransformer(new ConstantExtractorService(), false);
    this.registerTransformer(new CompressService(), false);
    this.registerTransformer(new DoubleCompressService(), false);
    this.registerTransformer(new TripleCompressService(), false);
    this.registerTransformer(new ComponentListerService(), true);
  }

  /**
   * RegisterTransformer function
   * This function registers a transformer with the cybertron-service.
   * @param {Object} transformer - The transformer to register.
   * @param {boolean} isEntryPoint - Whether the transformer is an entry point.
   */
  registerTransformer(transformer, isEntryPoint) {
    CybertronService.register(transformer, isEntryPoint);
  }
}

export default new AllSparkService();
