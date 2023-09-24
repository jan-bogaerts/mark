
// Importing required services
import cybertronService from '../cybertron_service/CybertronService';
import CompressService from '../compress_service/CompressService';
import ConstantExtractorService from '../constant-extractor_service/ConstantExtractorService';

/**
 * AllSparkService class
 * Responsible for creating all the transformers and registering them into the cybertron service.
 */
class AllSparkService {
  constructor() {
    this.load();
  }

  /**
   * Create the transformers and register them with the cybertron-service.
   */
  load() {
    this.registerServices();
  }

  /**
   * Register services with the cybertron service.
   */
  registerServices() {
    const compressService = new CompressService();
    const constantExtractorService = new ConstantExtractorService();

    // Registering services
    cybertronService.register(compressService, true); // Registering as entry point
    cybertronService.register(constantExtractorService, false);
  }
}

const allSparkService = new AllSparkService();

export default allSparkService;
