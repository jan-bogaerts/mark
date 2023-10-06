import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';
import ResultsViewContextMenu from '../results_view_context_menu/ResultsViewContextMenu';
import ThemeService from '../../../../services/Theme_service/ThemeService';
import SelectionService from '../../../../services/Selection_service/SelectionService';
import PositionTrackingService from '../../../../services/position-tracking_service/PositionTrackingService';
import DialogService from '../../../../services/dialog_service/DialogService';
import StorageService from '../../../../services/project_service/storage_service/StorageService';

class ResultsViewTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorKey: null,
      editorValue: '',
      editorOptions: {
        theme: ThemeService.getCurrentTheme(),
        fontFamily: ThemeService.getCurrentFont(),
        fontSize: ThemeService.getCurrentFontSize(),
        automaticLayout: true,
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
      },
      isOutdated: false,
      isDeleted: false,
      isOverwritten: false,
    };
  }

  componentDidMount() {
    this.updateEditorValue();
    PositionTrackingService.eventTarget.addEventListener('change', this.updateEditorValue);
    if (this.props.transformer) {
      this.props.transformer.cache.eventTarget.addEventListener('result-changed', this.updateEditorValue);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.transformer && this.props.transformer !== prevProps.transformer) {
      prevProps.transformer.cache.eventTarget.removeEventListener('result-changed', this.updateEditorValue);
      if (this.props.transformer) {
        this.props.transformer.cache.eventTarget.addEventListener('result-changed', this.updateEditorValue);
      }
    }
  }

  componentWillUnmount() {
    PositionTrackingService.eventTarget.removeEventListener('change', this.updateEditorValue);
    if (this.props.transformer) {
      this.props.transformer.cache.eventTarget.removeEventListener('result-changed', this.updateEditorValue);
    }
  }

  updateEditorValue = () => {
    const editorKey = PositionTrackingService.activeFragment?.key;
    if (editorKey) {
      let editorValue = this.props.transformer.cache.getFragmentResults(editorKey);
      if (this.props.transformer.isJson) {
        editorValue = JSON.stringify(editorValue, null, 2);
      }
      const isOutdated = this.props.transformer.cache.isOutOfDate(editorKey);
      // to fix
      const isDeleted = false;// this.props.transformer.cache.isDeleted(editorKey); 
      const isOverwritten = false; //this.props.transformer.cache.isOverwritten(editorKey);
      this.setState({ editorKey, editorValue, isOutdated, isDeleted, isOverwritten });
    }
  }

  handleEditorChange = (newValue) => {
    let parsedValue = newValue;
    if (this.props.transformer.isJson) {
      try {
        parsedValue = JSON.parse(newValue);
      } catch (error) {
        DialogService.showErrorDialog('Invalid JSON format');
        return;
      }
    }
    this.props.transformer.cache.overwriteResult(this.state.editorKey, parsedValue);
    StorageService.markDirty();
    this.setState({ isOverwritten: true });
  }

  handleEditorMount = (editor) => {
    this.editor = editor;
    editor.onDidFocusEditorWidget(this.handleEditorFocus);
    editor.onDidBlurEditorWidget(this.handleEditorBlur);
    editor.onDidChangeCursorSelection(this.handleCursorChange);
  }

  handleEditorFocus = () => {
    SelectionService.setEditor(this.editor);
    PositionTrackingService.activeTransformer = this.props.transformer;
  }

  handleEditorBlur = () => {
    if (SelectionService.getEditor() === this.editor) {
      SelectionService.setEditor(null);
    }
  }

  handleCursorChange = () => {
    if (SelectionService.getEditor() === this.editor) {
      SelectionService.notifySubscribers();
    }
  }

  render() {
    const { isOutdated, isDeleted, isOverwritten } = this.state;
    let editorClassName = 'results-view-tab';
    if (isOutdated || isDeleted) {
      editorClassName += ' grayed-out';
    }
    if (isOverwritten) {
      editorClassName += ' red-text';
    }

    return (
      <div className={editorClassName}>
        <MonacoEditor
          width="100%"
          height="100%"
          language={this.props.transformer.language}
          theme={this.state.editorOptions.theme}
          value={this.state.editorValue}
          options={this.state.editorOptions}
          onChange={this.handleEditorChange}
          editorDidMount={this.handleEditorMount}
        />
        <ResultsViewContextMenu transformer={this.props.transformer} key={this.state.editorKey} />
      </div>
    );
  }
}

export default ResultsViewTab;