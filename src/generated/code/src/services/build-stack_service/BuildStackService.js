import ProjectService from '../project_service/ProjectService';

/**
 * BuildStackService class
 * This class is used during the build process to make certain that there are no circular references in the process.
 * This occurs when a transformer depends on the result of another transformer that (eventually) again relies on the result of the first transformer, which can't be rendered yet.
 */
class BuildStackService {
  constructor() {
    // A dictionary that keeps track of the textframe - transformer pairs that are currently running.
    // Key calculation for the dict = transformer.name + textframe.key
    this.running = {};
    this.state = 'normal'; // other states: 'validating'
  }

  /**
   * tryRegister function
   * This function tries to register a transformer-textframe pair in the running dictionary.
   * @param {Object} transformer - The transformer object.
   * @param {Object} fragment - The fragment object.
   * @returns {boolean} - Returns true if the pair was successfully registered, false otherwise.
   */
  tryRegister(transformer, fragment) {
    const toSearch = `${fragment?.key}-${transformer?.name}`;
    if (this.running.hasOwnProperty(toSearch)) {
      return false;
    }
    this.running[toSearch] = true;
    if (fragment) {
      ProjectService.markIsBuilding(fragment, transformer); // do here cause all transformers need to pass the stack
    }
    return true;
  }

  /**
   * unRegister function
   * This function unregisters a transformer-textframe pair from the running dictionary.
   * @param {Object} transformer - The transformer object.
   * @param {Object} fragment - The fragment object.
   */
  unRegister(transformer, fragment) {
    const toSearch = `${fragment?.key}-${transformer?.name}`;
    delete this.running[toSearch];
    if (fragment) {
      ProjectService.markUpToDate(fragment, transformer); // do here cause all transformers need to pass the stack
    }
  }

  isRunning(transformer, fragment) {
    const toSearch = `${fragment?.key}-${transformer?.name}`;
    return toSearch in this.running;
  }
}

export default new BuildStackService();