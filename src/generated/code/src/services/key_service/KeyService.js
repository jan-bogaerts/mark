import ProjectService from '../project_service/ProjectService';
import crypto from 'crypto';

/**
 * KeyService class
 */
class KeyService {
  constructor() {
    this.loadUuidFromLocs = null;
  }

  /**
   * Assigns a key to a fragment and updates the mappings
   * @param {Object} fragment - The fragment to assign a key to
   * @param {number} index - The index of the fragment in the project
   */
  assignKey(fragment, index) {
    let uuid;
    if (this.loadUuidFromLocs) {
      const location = this.calculateLocation(fragment, index);
      if (location in this.loadUuidFromLocs) {
        uuid = this.loadUuidFromLocs[location];
        delete this.loadUuidFromLocs[location];
      }
    } 
    if (!uuid) {
      uuid = this.generateUUID();
    }

    fragment.key = uuid;
  }

  /**
   * Creates a dictionary of key-location pairs from the project service's fragments list
   * @returns {Object} The dictionary of key-location pairs
   */
  getLocations() {
    const locations = {};
    ProjectService.textFragments.forEach((fragment, index) => {
      const location = this.calculateLocation(fragment, index);
      locations[fragment.key] = location;
    });
    return locations;
  }

  /**
   * Calculates the location of a fragment
   * @param {Object} fragment - The fragment to calculate the location for
   * @param {number} index - The index of the fragment in the project
   * @returns {string} The location of the fragment
   */
  calculateLocation(fragment, index) {
    let currentDepth = fragment.depth;
    let result = fragment.title;

    for (let idx = index; idx >= 0; idx--) {
      const prevFragment = ProjectService.textFragments[idx];

      if (prevFragment && prevFragment.depth < currentDepth) {
        currentDepth = prevFragment.depth;
        result = prevFragment.title + ' > ' + result;

        if (currentDepth === 1) {
          break;
        }
      }
    }

    return result;
  }

  /**
   * Generates a new UUID
   * @returns {string} The new UUID
   */
  generateUUID() {
    return crypto.randomUUID();
  }
}

const keyService = new KeyService();
export default keyService;