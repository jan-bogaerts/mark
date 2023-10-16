
/**
 * ProjectConfigurationService class
 * This class is responsible for managing the project configurations.
 */
class ProjectConfigurationService {
  /**
   * constructor
   * Initializes the eventTarget and config fields.
   */
  constructor() {
    this.eventTarget = new EventTarget();
    this.config = {};
  }

  /**
   * registerEventHandler
   * Registers an event handler to the eventTarget.
   * @param {string} eventType - The type of the event to listen for.
   * @param {function} handler - The function to execute when the event occurs.
   */
  registerEventHandler(eventType, handler) {
    this.eventTarget.addEventListener(eventType, handler);
  }

  /**
   * unregisterEventHandler
   * Removes an event handler from the eventTarget.
   * @param {string} eventType - The type of the event to stop listening for.
   * @param {function} handler - The function to remove from the event listeners.
   */
  unregisterEventHandler(eventType, handler) {
    this.eventTarget.removeEventListener(eventType, handler);
  }

  /**
   * loadConfig
   * Loads a configuration object into the config field.
   * @param {object} config - The configuration object to load.
   */
  loadConfig(config) {
    this.config = config;
    this.eventTarget.dispatchEvent(new Event('configLoaded'));
  }

  /**
   * getConfig
   * Returns the current configuration object.
   * @returns {object} The current configuration object.
   */
  getConfig() {
    return this.config;
  }

  /**
   * updateConfig
   * Updates the current configuration object with a new one.
   * @param {object} newConfig - The new configuration object.
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.eventTarget.dispatchEvent(new Event('configUpdated'));
  }
}

const projectConfigurationService = new ProjectConfigurationService();
export default projectConfigurationService;
