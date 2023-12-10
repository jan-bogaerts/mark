
const { Selection } = require('monaco-editor');
const { default: PositionTrackingService } = require('../position-tracking_service/PositionTrackingService');

/**
 * SelectionService class
 * This class is responsible for managing the selection in the editor.
 */
class SelectionService {
  constructor() {
    this.editor = null;
    this.subscribers = [];
  }

  setEditor = (editor) => {
    this.editor = editor;
  }

  getEditor = () => {
    return this.editor;
  }

  hasSelection = () => {
    return this.editor && !this.editor.getSelection().isEmpty();
  }


  cut() {
    if (this.editor) {
      this.editor.focus();
      this.editor.trigger('source', 'editor.action.clipboardCutAction');
    }
  }

  copy() {
    if (this.editor) {
      this.editor.focus();
      this.editor.trigger('source', 'editor.action.clipboardCopyAction');
    }
  }

  paste() {
    if (this.editor) {
      this.editor.focus();
      this.editor.trigger('source', 'editor.action.clipboardPasteAction');
    }
  }

  delete() {
    if (this.editor) {
      this.editor.focus();
      var selection = this.editor.getSelection();
      var id = { major: 1, minor: 1 };             
      var text = "";
      var op = {identifier: id, range: selection, text: text, forceMoveMarkers: true};
      this.editor.executeEdits("my-source", [op]);
    }
  }

  selectAll = () => {
    if (this.editor) {
      const model = this.editor.getModel();
      if (!model) return;
      const range = model.getFullModelRange();
      this.editor.setSelection(range);
    }
  }

  clearSelection() {
    if (this.editor) {
      this.editor.setSelection(new Selection(0, 0, 0, 0));
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
      const model = this.editor.getModel();
      if (model) {
        const line = PositionTrackingService.currentLine;
        if (line < 0) return 'paragraph';
        const lineContent = model.getLineContent(line + 1).trim();
        if (lineContent.startsWith('# ')) return 'heading1';
        if (lineContent.startsWith('## ')) return 'heading2';
        if (lineContent.startsWith('### ')) return 'heading3';
        if (lineContent.startsWith('#### ')) return 'heading4';
        if (lineContent.startsWith('##### ')) return 'heading5';
        if (lineContent.startsWith('###### ')) return 'heading6';
        if (lineContent.startsWith('> ')) return 'quote';
        if (lineContent.startsWith('- ')) return 'bulletList';
        if (lineContent.startsWith('1. ')) return 'numberedList';
        if (lineContent.startsWith('```')) return 'code';
        return 'paragraph';
      }
      return model.getModeId();
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
