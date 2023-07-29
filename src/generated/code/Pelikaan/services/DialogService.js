
class DialogService {
  /**
   * Show an error dialog box with the given message.
   * @param {string} message - The error message to display.
   */
  static showErrorDialog(message) {
    const { dialog } = require('electron');
    dialog.showErrorBox('Error', message);
  }
}

module.exports = DialogService;
