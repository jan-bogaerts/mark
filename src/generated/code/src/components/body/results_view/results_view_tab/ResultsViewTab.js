
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import MonacoEditor from 'react-monaco-editor';
import { ResultCacheService } from '../../../../services/result-cache_service/ResultCacheService';
import { ThemeService } from '../../../../services/Theme_service/ThemeService';
import { SelectionService } from '../../../../services/Selection_service/SelectionService';
import { PositionTrackingService } from '../../../../services/position-tracking_service/PositionTrackingService';
import { DialogService } from '../../../../services/dialog_service/DialogService';
import ResultsViewContextMenu from '../results view/results view context menu/ResultsViewContextMenu';


class ResultsViewTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorKey: null,
      editorText: '',
      editorTheme: ThemeService.getCurrentTheme(),
      editorFont: ThemeService.getCurrentFont(),
      editorFontSize: ThemeService.getCurrentFontSize(),
    };
  }

  componentDidMount() {
    this.updateEditorText();
    this.updateEditorTheme();
    this.updateEditorFont();
    this.updateEditorFontSize();
    PositionTrackingService.subscribe(this.updateEditorKey);
  }

  componentWillUnmount() {
    PositionTrackingService.unsubscribe(this.updateEditorKey);
  }

  updateEditorKey = (newKey) => {
    this.setState({ editorKey: newKey }, this.updateEditorText);
  }

  updateEditorText = () => {
    const newText = ResultCacheService.getResult(this.state.editorKey);
    this.setState({ editorText: newText });
  }

  updateEditorTheme = () => {
    const newTheme = ThemeService.getCurrentTheme();
    this.setState({ editorTheme: newTheme });
  }

  updateEditorFont = () => {
    const newFont = ThemeService.getCurrentFont();
    this.setState({ editorFont: newFont });
  }

  updateEditorFontSize = () => {
    const newFontSize = ThemeService.getCurrentFontSize();
    this.setState({ editorFontSize: newFontSize });
  }

  handleEditorChange = (newValue) => {
    ResultCacheService.overwriteResult(this.state.editorKey, newValue);
  }

  handleEditorFocus = () => {
    SelectionService.setEditor(this.editor);
  }

  handleEditorBlur = () => {
    if (SelectionService.getEditor() === this.editor) {
      SelectionService.setEditor(null);
    }
  }

  handleEditorSelectionChange = () => {
    if (SelectionService.getEditor() === this.editor) {
      SelectionService.notifySelectionChanged();
    }
  }

  render() {
    const options = {
      selectOnLineNumbers: true,
      fontFamily: this.state.editorFont,
      fontSize: this.state.editorFontSize,
    };

    return (
      <div className="results-view-tab">
        <MonacoEditor
          width="100%"
          height="100%"
          language="markdown"
          theme={this.state.editorTheme}
          value={this.state.editorText}
          options={options}
          onChange={this.handleEditorChange}
          editorDidMount={editor => { this.editor = editor; }}
          onFocusChange={this.handleEditorFocus}
          onBlurChange={this.handleEditorBlur}
          onSelectionChange={this.handleEditorSelectionChange}
        />
        <ResultsViewContextMenu
          transformer={this.props.transformer}
          key={this.state.editorKey}
        />
      </div>
    );
  }
}

export default ResultsViewTab;
