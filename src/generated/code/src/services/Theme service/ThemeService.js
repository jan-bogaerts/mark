
const electron = require('electron');
const { ipcMain } = electron;
const storage = electron.storage || electron.remote.storage;

/**
 * ThemeService class
 * This class is responsible for managing the currently selected theme.
 */
class ThemeService {
  constructor() {
    this.theme = storage.get('theme') || 'light';
    this.subscribers = [];
  }

  /**
   * Returns the current theme of the application.
   * @returns {string} The current theme.
   */
  getCurrentTheme() {
    return this.theme;
  }

  /**
   * Subscribes a callback function to be called whenever the theme changes.
   * @param {function} callback - The callback function.
   */
  subscribe(callback) {
    this.subscribers.push(callback);
  }

  /**
   * Unsubscribes a callback function from the list of functions to be called when the theme changes.
   * @param {function} callback - The callback function.
   */
  unsubscribe(callback) {
    this.subscribers = this.subscribers.filter(subscriber => subscriber !== callback);
  }

  /**
   * Changes the current theme and notifies all subscribers.
   * @param {string} theme - The new theme.
   */
  changeTheme(theme) {
    this.theme = theme;
    storage.set('theme', theme);
    this.subscribers.forEach(callback => callback(theme));
    ipcMain.send('theme-changed', theme);
  }
}

module.exports = new ThemeService();
