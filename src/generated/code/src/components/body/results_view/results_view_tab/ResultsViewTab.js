
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
      },
    };
  }

  componentDidMount() {
    this.updateEditorValue();
    PositionTrackingService.eventTarget.addEventListener('change', this.updateEditorValue);
  }

  componentWillUnmount() {
    PositionTrackingService.eventTarget.removeEventListener('change', this.updateEditorValue);
  }

  updateEditorValue = () => {
    const editorKey = PositionTrackingService.activeFragment?.key;
    if (editorKey) {
      let editorValue = this.props.transformer.cache.getFragmentResults(editorKey);
      editorValue = JSON.stringify(editorValue, null, 2);
      this.setState({ editorKey, editorValue });
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
  }

  handleEditorFocus = (e) => {
    SelectionService.setEditor(e.target);
    PositionTrackingService.activeTransformer = this.props.transformer;
  }

  handleEditorBlur = (e) => {
    if (SelectionService.getEditor() === e.target) {
      SelectionService.setEditor(null);
    }
  }

  handleCursorChange = () => {
    if (SelectionService.getEditor() === this.editor) {
      SelectionService.notifySubscribers();
    }
  }

  render() {
    return (
      <div className="results-view-tab">
        <MonacoEditor
          width="100%"
          height="100%"
          language={this.props.transformer.language}
          theme={this.state.editorOptions.theme}
          value={this.state.editorValue}
          options={this.state.editorOptions}
          onChange={this.handleEditorChange}
          editorDidMount={this.handleEditorMount}
          onFocusChange={this.handleEditorFocus}
          onBlur={this.handleEditorBlur}
          onSelectionChange={this.handleCursorChange}
        />
        <ResultsViewContextMenu transformer={this.props.transformer} key={this.state.editorKey} />
      </div>
    );
  }
}

export default ResultsViewTab;
