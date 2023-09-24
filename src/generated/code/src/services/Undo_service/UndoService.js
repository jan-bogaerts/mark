
/**
 * UndoService is a singleton class that keeps track of all the text edits that the user performs on the various monaco-editors.
 * It has an undo and redo list.
 */
class UndoService {
  constructor() {
    if (!UndoService.instance) {
      this.subscribers = [];
      this.undoList = [];
      this.redoList = [];
      UndoService.instance = this;
    }

    return UndoService.instance;
  }

  /**
   * Allows a function to be added to a list of functions to be called whenever the state of the UndoService changes.
   * @param {Function} fn - The function to subscribe.
   */
  subscribe(fn) {
    this.subscribers.push(fn);
  }

  /**
   * Removes a function from the list of subscribers to the UndoService.
   * @param {Function} fn - The function to unsubscribe.
   */
  unsubscribe(fn) {
    this.subscribers = this.subscribers.filter(subscriber => subscriber !== fn);
  }

  /**
   * Checks if there is any undo data available.
   * @returns {boolean} - Returns true if there is undo data, false otherwise.
   */
  hasUndoData() {
    return this.undoList.length > 0;
  }

  /**
   * Checks if there are any actions that can be undone.
   * @returns {boolean} - Returns true if there are actions to undo, false otherwise.
   */
  canUndo() {
    return this.hasUndoData();
  }

  /**
   * Checks if there are any actions that can be redone.
   * @returns {boolean} - Returns true if there are actions to redo, false otherwise.
   */
  canRedo() {
    return this.redoList.length > 0;
  }

  /**
   * Undoes the last action performed by the user.
   * Throws an error if there are no actions to undo.
   */
  undo() {
    if (!this.canUndo()) {
      throw new Error('No actions to undo.');
    }

    const action = this.undoList.pop();
    this.redoList.push(action);
    this.notifySubscribers();
  }

  /**
   * Redoes the last action that was undone.
   * Throws an error if there are no actions to redo.
   */
  redo() {
    if (!this.canRedo()) {
      throw new Error('No actions to redo.');
    }

    const action = this.redoList.pop();
    this.undoList.push(action);
    this.notifySubscribers();
  }

  /**
   * Notifies all subscribers about the state change.
   */
  notifySubscribers() {
    this.subscribers.forEach(subscriber => subscriber());
  }
}

const undoService = new UndoService();

module.exports = undoService;
