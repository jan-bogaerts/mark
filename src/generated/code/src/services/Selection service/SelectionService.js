
const { clipboard } = require('electron');
const { ipcRenderer } = require('electron');
const { remote } = require('electron');
const { BrowserWindow } = remote;
const React = require('react');
const { Button } = require('antd');

/**
 * SelectionService is a singleton class that keeps track of the currently selected text.
 */
class SelectionService {
  constructor() {
    this.subscribers = [];
  }

  /**
   * Checks if any data is currently selected.
   */
  hasSelectedData() {
    return window.getSelection().toString().length > 0;
  }

  /**
   * Checks if there is any data available in the clipboard.
   */
  isClipboardDataAvailable() {
    return clipboard.readText().length > 0;
  }

  /**
   * Performs the cut operation on the selected data.
   */
  cut() {
    document.execCommand('cut');
  }

  /**
   * Performs the copy operation on the selected data.
   */
  copy() {
    document.execCommand('copy');
  }

  /**
   * Performs the paste operation using the data from the clipboard.
   */
  paste() {
    document.execCommand('paste');
  }

  /**
   * Deletes the currently selected data.
   */
  delete() {
    document.execCommand('delete');
  }

  /**
   * Selects all available data.
   */
  selectAll() {
    document.execCommand('selectAll');
  }

  /**
   * Clears the current selection.
   */
  clearSelection() {
    window.getSelection().removeAllRanges();
  }

  /**
   * Allows a function to be added to the list of functions to be called whenever the selection changes.
   */
  subscribe(fn) {
    this.subscribers.push(fn);
  }

  /**
   * Removes a previously subscribed function from the list of functions to be called when the selection changes.
   */
  unsubscribe(fn) {
    this.subscribers = this.subscribers.filter(subscriber => subscriber !== fn);
  }

  /**
   * Returns the current style of the selected text.
   */
  getCurrentStyle() {
    return window.getComputedStyle(window.getSelection().anchorNode.parentNode);
  }

  /**
   * Applies a given style to the currently selected text.
   */
  setStyle(style) {
    document.execCommand('styleWithCSS', false, style);
  }

  /**
   * Applies the indent action to the current line or selection of text.
   */
  indentSelection() {
    document.execCommand('indent');
  }

  /**
   * Decreases the indent of the current line or selection.
   */
  decreaseIndent() {
    document.execCommand('outdent');
  }

  /**
   * Selects a specific fragment of text. It takes a key as an argument which corresponds to the fragment of text to be selected.
   */
  selectTextFragment(key) {
    const textNode = document.querySelector(`[data-key="${key}"]`);
    if (textNode) {
      const range = document.createRange();
      range.selectNodeContents(textNode);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
}

module.exports = new SelectionService();
