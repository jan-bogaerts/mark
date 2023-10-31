/**
 * DialogService class
 * Provides a common interface for other components and services to show dialog boxes.
 */
class DialogService {
  /**
   * Displays an error dialog with the provided error message.
   * @param {string} param1 - The title of the dialog box.
   * @param {string} param2 - The content of the dialog box.
   */
  showErrorDialog(param1, param2) {
    const config = { title: (param2 ? param1 : 'Error'), content: (param2 || param1) };
    window.electron.openDialog('showErrorBox', config);
  }

  /**
   * Displays a save dialog with specified filters.
   * @returns {Promise<string>} - The path of the file to save.
   */
  showSaveDialog() {
    const config = { filters: [{ name: 'markdown', extensions: ['md']}, { name: 'any', extensions: ['*']}] };
    return window.electron.openDialog('showSaveDialog', config);
  }

  /**
   * Displays an open dialog with specified filters.
   * @returns {Promise<string>} - The path of the file to open.
   */
  async showOpenDialog() {
    const config = { filters: [{ name: 'markdown', extensions: ['md']}, { name: 'any', extensions: ['*']}] };
    const res = await window.electron.openDialog('showOpenDialog', config);
    return res;
  }

  /**
   * Displays a confirmation dialog with a specified message.
   * @param {string} message - The message to display in the confirmation dialog.
   * @returns {Promise<boolean>} - The user's choice.
   */
  async confirm(message) {
    const config = { type: 'question', buttons: ['Yes', 'No', 'Cancel'], message };
    const res = await window.electron.openDialog('showMessageBox', config);
    if (res.response === 2) return null;
    return res.response === 0;
  }

  /**
   * Displays an error dialog with a specified title and message.
   * @param {string} title - The title of the error dialog.
   * @param {string} message - The message to display in the error dialog.
   */
  error(title, message) {
    const config = { type: 'error', buttons: ['OK'], title, message };
    window.electron.openDialog('showMessageBox', config);
  }
}

// Export as a singleton
export default new DialogService();
