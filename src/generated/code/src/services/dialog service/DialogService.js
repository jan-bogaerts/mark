
const { dialog } = require('electron').remote;
const React = require('react');
const { Modal } = require('antd');

/**
 * DialogService is a singleton class that provides a common interface for other components and services to show dialog boxes.
 * It can show a dialog box for errors, warnings and info.
 */
class DialogService {
  constructor() {
    if (!DialogService.instance) {
      DialogService.instance = this;
    }

    return DialogService.instance;
  }

  /**
   * Displays a confirmation dialog with a custom title and message.
   * Returns a promise that resolves to a boolean indicating whether the user confirmed or cancelled the dialog.
   * @param {string} title - The title of the confirmation dialog.
   * @param {string} message - The message of the confirmation dialog.
   * @returns {Promise<boolean>} - A promise that resolves to a boolean.
   */
  showConfirmationDialog(title, message) {
    return new Promise((resolve) => {
      Modal.confirm({
        title: title,
        content: message,
        onOk() {
          resolve(true);
        },
        onCancel() {
          resolve(false);
        },
      });
    });
  }

  /**
   * Displays an error dialog with the provided error message.
   * @param {string} errorMessage - The error message to display.
   */
  showErrorDialog(errorMessage) {
    dialog.showErrorBox('Error', errorMessage);
  }
}

const instance = new DialogService();
Object.freeze(instance);

module.exports = instance;
