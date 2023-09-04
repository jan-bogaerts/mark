
const electron = require('electron');
const { ipcMain } = electron;
const storage = electron.storage || electron.remote.storage;

/**
 * ThemeService class
 * This class is responsible for managing the currently selected theme, font and font-size.
 */
class ThemeService {
  constructor() {
    this.theme = storage.get('theme') || 'light';
    this.font = storage.get('font') || 'Arial';
    this.fontSize = storage.get('fontSize') || 14;
    this.subscribers = [];
  }

  /**
   * Returns the current theme of the application.
   */
  getCurrentTheme() {
    return this.theme;
  }

  /**
   * Takes a callback function as an argument and calls it whenever the theme changes.
   * @param {Function} callback - The callback to be called when the theme changes.
   */
  subscribe(callback) {
    this.subscribers.push(callback);
  }

  /**
   * Takes a callback function as an argument and removes it from the list of functions to be called when the theme changes.
   * @param {Function} callback - The callback to be removed from the list of subscribers.
   */
  unsubscribe(callback) {
    this.subscribers = this.subscribers.filter(subscriber => subscriber !== callback);
  }

  /**
   * Returns the current font being used in the theme.
   */
  getCurrentFont() {
    return this.font;
  }

  /**
   * Returns the current font size being used in the theme.
   */
  getCurrentFontSize() {
    return this.fontSize;
  }

  /**
   * Sets the current theme. It accepts a string value representing the theme to be set.
   * @param {string} theme - The theme to be set.
   */
  setCurrentTheme(theme) {
    this.theme = theme;
    storage.set('theme', theme);
    this.notifySubscribers();
  }

  /**
   * Sets the current font. It accepts a string value representing the font to be set.
   * @param {string} font - The font to be set.
   */
  setCurrentFont(font) {
    this.font = font;
    storage.set('font', font);
  }

  /**
   * Sets the current font size. It accepts a number value representing the font size to be set.
   * @param {number} fontSize - The font size to be set.
   */
  setCurrentFontSize(fontSize) {
    this.fontSize = fontSize;
    storage.set('fontSize', fontSize);
  }

  /**
   * Notifies all subscribers about the theme change.
   */
  notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.theme));
  }
}

module.exports = new ThemeService();
