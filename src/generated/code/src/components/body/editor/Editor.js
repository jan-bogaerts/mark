
import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';
import ThemeService from '../../../services/Theme_service/ThemeService';
import SelectionService from '../../../services/Selection_service/SelectionService';
import PositionTrackingService from '../../../services/position-tracking_service/PositionTrackingService';
import DialogService from '../../../services/dialog_service/DialogService';
import ChangeProcessorService from '../../../services/project_service/change-processor_service/ChangeProcessorService';
import ProjectService from '../../../services/project_service/ProjectService';

class Editor extends Component {
  constructor(props) {
    super(props);
    this.editorRef = React.createRef();
    this.settingValue = false;
  }

  componentDidMount() {
    this.handleThemeChanged = this.handleThemeChanged.bind(this);
    ThemeService.subscribe(this.handleThemeChanged);
    ProjectService.eventTarget.addEventListener('content-changed', this.handleContentChanged);
    PositionTrackingService.eventTarget.addEventListener('moveTo', this.handleMoveTo);
  }


  componentWillUnmount() {
    ThemeService.unsubscribe(this.handleThemeChanged);
    ProjectService.eventTarget.removeEventListener('content-changed', this.handleContentChanged);
    PositionTrackingService.eventTarget.removeEventListener('moveTo', this.handleMoveTo);
  }

  handleThemeChanged() {
    if (!this.editorRef.current) return;
    const theme = ThemeService.getCurrentTheme();
    const font = ThemeService.getCurrentFont();
    const fontSize = ThemeService.getCurrentFontSize();
    this.editorRef.current.updateOptions({
      theme: theme === 'light' ? 'vs-light' : 'vs-dark',
      fontFamily: font,
      fontSize: fontSize,
      automaticLayout: true,
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: false,
    });
  }

  handleContentChanged = () => {
    const editor = this.editorRef.current;
    if (editor) {
      this.settingValue = true;
      editor.setValue(ProjectService.content);
    }
  }

  handleMoveTo = (e) => {
    const editor = this.editorRef.current;
    if (!editor) return;
    editor.revealLineNearTop(e.detail);
  }

  editorDidMount = (editor) => {
    this.editorRef.current = editor;
    this.settingValue = true; // when loading content, don't process changes
    editor.onDidChangeModelContent(this.handleDidChangeModelContent);
    editor.onDidFocusEditorWidget(this.handleDidFocusEditorWidget);
    editor.onDidBlurEditorWidget(this.handleDidBlurEditorWidget);
    editor.onDidChangeCursorPosition(this.handleDidChangeCursorPosition);
    editor.onDidChangeCursorSelection(this.handleDidChangeCursorSelection);
  }

  handleDidChangeModelContent = (ev) => {
    try {
      if (!this.editorRef.current) return;
      if (this.settingValue) { 
        this.settingValue = false;
        return;
      }
      ChangeProcessorService.process(ev.changes, this.editorRef.current);
    } catch (e) {
      DialogService.showErrorDialog(e);
    }
  }

  handleDidFocusEditorWidget = () =>  {
    SelectionService.editor = this.editorRef.current;
  }

  handleDidBlurEditorWidget = () =>  {
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
    return (
      <MonacoEditor
        language="markdown"
        theme={ThemeService.getCurrentTheme() === 'light' ? 'vs-light' : 'vs-dark'}
        value={ProjectService.content}
        options={{
          fontFamily: ThemeService.getCurrentFont(),
          fontSize: ThemeService.getCurrentFontSize(),
          automaticLayout: true,
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
        }}
        editorDidMount={this.editorDidMount.bind(this)}
        className="editor"
      />
    );
  }
}

export default Editor;
