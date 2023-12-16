
const { Selection } = require('monaco-editor');
const { default: PositionTrackingService } = require('../position-tracking_service/PositionTrackingService');

/**
 * count the nr of times that '**' appears in the line. if even: not in bold, if odd: in bold
 * @param {string} lineContent the line to check
 */
function getInBold(lineContent) {
  let count = 0;
  // note: we have to search for exact matches on '**', because '*' can also be used to make a line italic
  for (let i = 0; i < lineContent.length - 1; i++) {
    if (lineContent[i] === '*' && lineContent[i + 1] === '*') count++;
  }
  return count % 2 === 1;
}

function getInItalic(lineContent) {
  let count = 0;
  // note: we have to search for exact matches on '*', because '**' can also be used to make a line bold  
  for (let i = 0; i < lineContent.length - 1; i++) {
    if (lineContent[i] === '*' && lineContent[i + 1] !== '*' && lineContent[i - 1] !== '*') count++;
  }
  return count % 2 === 1;
}

/**
 * search for the nr of occurences of '<u>'
 */ 
function getInUnderline(lineContent) {
  let count = 0;
  for (let i = 0; i < lineContent.length - 2; i++) {
    if (lineContent[i] === '<' && lineContent[i + 1] === 'u' && lineContent[i + 2] === '>') count++;
  }
  return count % 2 === 1;
}

function getInStrikeThrough(lineContent) {
  let count = 0;
  for (let i = 0; i < lineContent.length - 2; i++) {
    if (lineContent[i] === '<' && lineContent[i + 1] === 's' && lineContent[i + 2] === '>') count++;
  }
  return count % 2 === 1;
}

/**
 * SelectionService class
 * This class is responsible for managing the selection in the editor.
 */
class SelectionService {
  constructor() {
    this.editor = null;
    this.subscribers = [];
    this._currentStyle = 'paragraph';
    this._currentBlockStyle = {};
    //whenever the pos changes, update the current style
    PositionTrackingService.eventTarget.addEventListener('pos-changed', this.updateStyles.bind(this));
  }

  setEditor = (editor) => {
    this.editor = editor;
    if (this.editor) {
      const model = editor.getModel();
      this.updateCurrentStyle(model);
      this.updateCurrentBlockStyle(model);
    }
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

  getBlockStyles() {
    return this._currentBlockStyle
  }

  updateStyles() {
    if (!this.editor) return;
    const model = this.editor.getModel();
    if (!model) return;
    this.updateCurrentStyle(model);
    this.updateCurrentBlockStyle(model);
  }

  updateCurrentStyle(model) {
    if (model) {
      const line = PositionTrackingService.currentLine;
      if (line >= 0) {
        const lineContent = model.getLineContent(line + 1).trim();
        this._currentStyle = this.getStyle(lineContent);
      }
    } else {
      this._currentStyle = 'paragraph';
    }
  }

  updateCurrentBlockStyle(model) {
    if (model) {
      const position = this.editor.getPosition();
      if (position && position.lineNumber > 0) {
        const lineContent = model.getLineContent(position.lineNumber).substring(0, position.column - 1);
        this._currentBlockStyle = {
          bold: getInBold(lineContent),
          italic: getInItalic(lineContent),
          underline: getInUnderline(lineContent),
          strikeThrough: getInStrikeThrough(lineContent),
        };
      }
    } else {
      this._currentBlockStyle = {};
    }
  }

  getCurrentStyle() {
    return this._currentStyle;
  }

  getStyle(lineContent) {
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

  getStyleChars(style) {
    switch (style) {
      case 'heading1': return '# ';
      case 'heading2': return '## ';
      case 'heading3': return '### ';
      case 'heading4': return '#### ';
      case 'heading5': return '##### ';
      case 'heading6': return '###### ';
      case 'quote': return '> ';
      case 'bulletList': return '- ';
      case 'numberedList': return '1. ';
      case 'code': return '```';
      default: return '';
    }
  }

  changeLineStyle(lineContent, currentStyle, style) {
    if (currentStyle === style) return lineContent;
    const curStyleChars = this.getStyleChars(currentStyle);
    if (currentStyle !== 'paragraph') {
      lineContent = lineContent.substring(curStyleChars.length);
    }
    const styleChars = this.getStyleChars(style);
    return styleChars + lineContent;
  }

  setCodeStyle(style, selection) {
    if (selection.startLineNumber === selection.endLineNumber) {
      const selectedTxt = this.editor.getModel().getValueInRange(this.editor.getSelection());
      const id = { major: 1, minor: 1 };
      const text = '`' + selectedTxt + '`';
      const op = { identifier: id, range: selection, text: text, forceMoveMarkers: true };
      this.editor.executeEdits("my-source", [op]);
    } else {
      const line = this.editor.getModel().getLineContent(selection.startLineNumber);
      const currentStyle = this.getStyle(line.trim());
      if (currentStyle !== style) {
        const lineContent = '```python\n' + line;
        const id = { major: 1, minor: 1 };
        const text = lineContent;
        const op1 = { identifier: id, range: new Selection(selection.startLineNumber, 1, selection.startLineNumber, line.length + 1), text: text, forceMoveMarkers: true };
        const lastLine = this.editor.getModel().getLineContent(selection.endLineNumber) + '\n```';
        const op2 = { identifier: id, range: new Selection(selection.endLineNumber, 1, selection.endLineNumber, lastLine.length + 1), text: lastLine, forceMoveMarkers: true };
        this.editor.executeEdits("my-source", [op1, op2]);
      }
    }
  }

  setStyle(style) {
    if (this.editor) {
      this.editor.focus();
      const selection = this.editor.getSelection();
      if (style === 'code') {
        this.setCodeStyle(style, selection);
      } else {
        for(let i = selection.startLineNumber; i < selection.endLineNumber + 1; i++) {
          const line = this.editor.getModel().getLineContent(i);
          const currentStyle = this.getStyle(line.trim());
          if (currentStyle !== style) {
            const lineContent = this.changeLineStyle(line, currentStyle, style);
            const id = { major: 1, minor: 1 };
            const text = lineContent;
            const op = { identifier: id, range: new Selection(i, 1, i, line.length + 1), text: text, forceMoveMarkers: true };
            this.editor.executeEdits("my-source", [op]);
          }
        }
      }
    }
  }

  /**
   * update the current selection with the given style.
   * for each block style (bold, italic, underline, strikethrough), see if the new style is different from
   * the existing style. 
   * if it is turned on, wrap the current selection in the new style.
   * if it is turned off, remove the new style from the current selection (all occurences within the selection and
   * if the text before the selection is in the style, set a style terminator at the beginning of the selection)
   * @param {object} style - The style to set
   */
  setBlockStyle(style) {
    if (this.editor) {
      const curStyle = this._currentBlockStyle;
      const toRemove = [];
      const toWrap = [];
      let toPrepend = '';
      if (curStyle.bold !== style.bold) {
        toRemove.push('**');
        if (style.bold) {
          toWrap.push('**');
        } else {
          toPrepend = '**';
        }
      } else if (curStyle.italic !== style.italic) {
        toRemove.push('*');
        if (style.italic) {
          toWrap.push('*');
        } else {
          toPrepend = '*';
        }
      } else if (curStyle.underline !== style.underline) {
        toRemove.push('<u>');
        toRemove.push('</u>');
        if (style.underline) {
          toWrap.push('<u>');
          toWrap.push('</u>');
        } else {
          toPrepend = '</u>';
        }
      } else if (curStyle.strikeThrough !== style.strikeThrough) {
        toRemove.push('<s>');
        toRemove.push('</s>');
        if (style.strikeThrough) {
          toWrap.push('<s>');
          toWrap.push('</s>');
        } else {
          toPrepend = '</s>';
        }
      }
      this.editor.focus();
      const selection = this.editor.getSelection();
      const model = this.editor.getModel();
      const startLine = selection.startLineNumber;
      const endLine = selection.endLineNumber;
      const startCol = selection.startColumn;
      const endCol = selection.endColumn;
      let text = '';
      let range = null;
      let op = null;
      if (startLine === endLine) {
        text = model.getValueInRange(selection);
        if (toRemove.length > 0) {
          toRemove.forEach((term) => {
            if (term === '*') {
              text = text.replace(/\*(?!\*)/g, '');
            } else {
              text = text.replaceAll(term, '');
            }
          });
        }
        if (toPrepend) {
          text = toPrepend + text;
        }
        if (toWrap.length > 0) {
          text = toWrap[0] + text + (toWrap[1] ?? toWrap[0]);
        }
        range = new Selection(startLine, startCol, endLine, endCol);
        op = { identifier: { major: 1, minor: 1 }, range: range, text: text, forceMoveMarkers: true };
        this.editor.executeEdits("my-source", [op]);
      } else {
        // loop over every line in the selection
        for (let i = startLine; i <= endLine; i++) {
          let line = model.getLineContent(i);
          if (i === startLine) {
            // if we are on the first line, only take the text from the startCol
            line = line.substring(startCol - 1);
          } else if (i === endLine) {
            // if we are on the last line, only take the text until the endCol
            line = line.substring(0, endCol - 1);
          }
          if (toRemove.length > 0) {
            toRemove.forEach((term) => {
              if (term === '*') {
                line = line.replace(/\*(?!\*)/g, '');
              } else {
                line = line.replaceAll(term, '');
              }
            });
          }
          if (toPrepend && i === startLine) {
            line = toPrepend + line;
          }
          if (toWrap.length > 0) {
            line = toWrap[0] + line + (toWrap[1] ?? toWrap[0]);
          }
          if (i === startLine) {
            // if we are on the first line, only take the text from the startCol
            text += line;
          } else if (i === endLine) {
            // if we are on the last line, only take the text until the endCol
            text += line;
          } else {
            text += line + '\n';
          }
        }
        range = new Selection(startLine, startCol, endLine, endCol);
        op = { identifier: { major: 1, minor: 1 }, range: range, text: text, forceMoveMarkers: true };
        this.editor.executeEdits("my-source", [op]);
      }
      
    }
  }

  indentSelection() {
    if (this.editor) {
      this.editor.focus();
      this.editor.trigger('keyboard', 'editor.action.indentLines');
    }
  }

  decreaseIndent() {
    if (this.editor) {
      this.editor.focus();
      this.editor.trigger('keyboard', 'editor.action.outdentLines');
    }
  }

  notifySubscribers() {
    this.subscribers.forEach(fn => fn());
  }
}

module.exports = new SelectionService();
