
const { clipboard } = require('electron');
const { editor } = require('monaco-editor');

/**
 * SelectionService class
 * This class is responsible for managing the selection in the editor.
 */
class SelectionService {
  constructor() {
    this.editor = null;
    this.subscribers = [];
  }

  setEditor(editor) {
    this.editor = editor;
  }

  getEditor() {
    return this.editor;
  }

  hasSelection() {
    return this.editor && !this.editor.getSelection().isEmpty();
  }


  cut() {
    if (this.editor) {
      this.editor.trigger('keyboard', 'cut');
    }
  }

  copy() {
    if (this.editor) {
      this.editor.trigger('keyboard', 'copy');
    }
  }

  paste() {
    if (this.editor) {
      this.editor.trigger('keyboard', 'paste');
    }
  }

  delete() {
    if (this.editor) {
      this.editor.trigger('keyboard', 'delete');
    }
  }

  selectAll() {
    if (this.editor) {
      this.editor.trigger('keyboard', 'selectAll');
    }
  }

  clearSelection() {
    if (this.editor) {
      this.editor.setSelection(new editor.Selection(0, 0, 0, 0));
    }
  }

  subscribe(fn) {
    this.subscribers.push(fn);
  }

  unsubscribe(fn) {
    this.subscribers = this.subscribers.filter(subscriber => subscriber !== fn);
  }

  getCurrentStyle() {
    if (this.editor) {
      return this.editor.getModel().getModeId();
    }
  }

  setStyle(style) {
    if (this.editor) {
      this.editor.updateOptions({ theme: style });
    }
  }

  indentSelection() {
    if (this.editor) {
      this.editor.trigger('keyboard', 'tab');
    }
  }

  decreaseIndent() {
    if (this.editor) {
      this.editor.trigger('keyboard', 'outdent');
    }
  }

  notifySubscribers() {
    this.subscribers.forEach(fn => fn());
  }
}

module.exports = new SelectionService();
