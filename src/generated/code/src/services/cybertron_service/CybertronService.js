
/**
 * CybertronService class
 */
class CybertronService {
  constructor() {
    if (!CybertronService.instance) {
      this.transformers = [];
      this.entryPoints = [];
      CybertronService.instance = this;
    }

    return CybertronService.instance;
  }

  /**
   * Register a transformer
   * @param {Object} transformer - The transformer to register
   * @param {boolean} isEntryPoint - Whether the transformer is an entry point
   */
  register(transformer, isEntryPoint) {
    this.transformers.push(transformer);
    if (isEntryPoint) {
      this.entryPoints.push(transformer);
    }
  }

  /**
   * Unregister a transformer
   * @param {Object} transformer - The transformer to unregister
   */
  unregister(transformer) {
    this.transformers = this.transformers.filter(t => t !== transformer);
    this.entryPoints = this.entryPoints.filter(t => t !== transformer);
  }

  /**
   * Get entry points
   * @returns {Array} - Array of transformers
   */
  getEntryPoints() {
    return this.entryPoints;
  }

  getTransformer(name) {
    return this.transformers.find(t => t.name === name);
  }
}

const cybertronService = new CybertronService();

export default cybertronService;
