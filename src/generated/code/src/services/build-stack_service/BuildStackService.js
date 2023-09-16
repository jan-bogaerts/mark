
/**
 * BuildStackService class
 * This class is used during the build process to make certain that there are no circular references in the process.
 */
class BuildStackService {
  constructor() {
    // A dictionary that keeps track of the textframe - transformer pairs that are currently running.
    this.running = {};
  }

  /**
   * tryRegister function
   * This function tries to register a transformer-textframe pair in the running dictionary.
   * @param {string} name - The name of the transformer.
   * @param {string} key - The key of the textframe.
   * @returns {boolean} - Returns true if the pair was successfully registered, false otherwise.
   */
  tryRegister(name, key) {
    const toSearch = `${key}-${name}`;
    if (this.running.hasOwnProperty(toSearch)) {
      return false;
    }
    this.running[toSearch] = true;
    return true;
  }

  /**
   * unRegister function
   * This function unregisters a transformer-textframe pair from the running dictionary.
   * @param {string} name - The name of the transformer.
   * @param {string} key - The key of the textframe.
   */
  unRegister(name, key) {
    const toSearch = `${key}-${name}`;
    delete this.running[toSearch];
  }
}

module.exports = BuildStackService;
