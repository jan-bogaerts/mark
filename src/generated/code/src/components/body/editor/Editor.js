
import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';
import SelectionService from '../../../services/Selection_service/SelectionService';
import PositionTrackingService from '../../../services/position-tracking_service/PositionTrackingService';
import DialogService from '../../../services/dialog_service/DialogService';
import ChangeProcessorService from '../../../services/project_service/change-processor_service/ChangeProcessorService';
import ProjectService from '../../../services/project_service/ProjectService';
import ThemeService from '../../../services/Theme_service/ThemeService';

/**
 * Editor component
 */
class Editor extends Component {
  constructor(props) {
    super(props);
    this.editorRef = React.createRef();
  }

  componentDidMount() {
    ProjectService.eventTarget.addEventListener('content-changed', this.handleContentChanged);
    PositionTrackingService.eventTarget.addEventListener('moveTo', this.handleMoveTo);
  }

  componentWillUnmount() {
    ProjectService.eventTarget.removeEventListener('content-changed', this.handleContentChanged);
    PositionTrackingService.eventTarget.removeEventListener('moveTo', this.handleMoveTo);
  }

  handleContentChanged = () => {
    const editor = this.editorRef.current;
    if (editor) {
      editor.setValue(ProjectService.content);
    }
  }

  handleMoveTo = (e) => {
    const editor = this.editorRef.current;
    if (editor) {
      editor.revealLineNearTop(e.detail);
    }
  }

  handleEditorDidMount = (editor) => {
    this.editorRef.current = editor;
    editor.onDidChangeModelContent(this.handleDidChangeModelContent);
    editor.onDidFocusEditorWidget(this.handleDidFocusEditorWidget);
    editor.onDidBlurEditorWidget(this.handleDidBlurEditorWidget);
    editor.onDidChangeCursorPosition(this.handleDidChangeCursorPosition);
    editor.onDidChangeCursorSelection(this.handleDidChangeCursorSelection);
  }

  handleDidChangeModelContent = (ev) => {
    try {
      const editor = this.editorRef.current;
      if (editor) {
        ChangeProcessorService.process(ev.changes, editor);
      }
    } catch (e) {
      DialogService.showErrorDialog(e);
    }
  }

  handleDidFocusEditorWidget = () => {
    SelectionService.editor = this.editorRef.current;
  }

  handleDidBlurEditorWidget = () => {
    if (SelectionService.editor === this.editorRef.current) {
      SelectionService.editor = null;
    }
  }

  handleDidChangeCursorPosition = (e) => {
    if (SelectionService.editor === this.editorRef.current) {
      PositionTrackingService.setCurrentLine(e.position.lineNumber - 1);
    }
  }

  handleDidChangeCursorSelection = () => {
    if (SelectionService.editor === this.editorRef.current) {
      SelectionService.notifySubscribers();
    }
  }

  render() {
    const options = {
      theme: ThemeService.getCurrentTheme(),
      fontFamily: ThemeService.getCurrentFont(),
      fontSize: ThemeService.getCurrentFontSize(),
      automaticLayout: true,
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: false,
    };

    return (
      <MonacoEditor
        language="markdown"
        theme={options.theme}
        value={ProjectService.content}
        options={options}
        editorDidMount={this.handleEditorDidMount}
      />
    );
  }
}

export default Editor;
