
import React, { Component } from 'react';
import { Select } from 'antd';
import MonacoEditor from 'react-monaco-editor';
import { ThemeService } from 'MarkdownCode/services/Theme service/ThemeService';
import { DialogService } from 'MarkdownCode/services/dialog service/DialogService';
import { PositionTrackingService } from 'MarkdownCode/services/position-tracking service/PositionTrackingService';
import { ProjectService } from 'MarkdownCode/services/project service/ProjectService';
import { SelectionService } from 'MarkdownCode/services/Selection service/SelectionService';

const { Option } = Select;

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: ThemeService.getCurrentTheme(),
      fontSize: 14,
      fontFamily: 'Courier New',
      code: '',
      isOutdated: false,
      isOverwritten: false,
    };
  }

  componentDidMount() {
    this.updateCodeFromProjectService();
    this.updatePositionFromSelectionService();
  }

  updateCodeFromProjectService() {
    try {
      const code = ProjectService.getCurrentProjectMarkdown();
      this.setState({ code });
    } catch (error) {
      DialogService.showErrorDialog('Error loading project markdown', error);
    }
  }

  updatePositionFromSelectionService() {
    try {
      const position = SelectionService.getCurrentPosition();
      this.editor.setPosition(position);
    } catch (error) {
      DialogService.showErrorDialog('Error setting editor position', error);
    }
  }

  onCursorPositionChange(e) {
    PositionTrackingService.updateCurrentLine(e.position.lineNumber);
  }

  onThemeChange(value) {
    this.setState({ theme: value });
    ThemeService.setCurrentTheme(value);
  }

  onFontSizeChange(value) {
    this.setState({ fontSize: value });
  }

  onFontFamilyChange(value) {
    this.setState({ fontFamily: value });
  }

  render() {
    const { theme, fontSize, fontFamily, code } = this.state;
    const options = {
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: false,
      cursorStyle: 'line',
      automaticLayout: false,
      fontFamily,
      fontSize,
    };

    return (
      <div className="editor-container">
        <div className="editor-settings">
          <Select defaultValue={theme} style={{ width: 120 }} onChange={this.onThemeChange.bind(this)}>
            <Option value="vs-dark">Dark</Option>
            <Option value="vs-light">Light</Option>
          </Select>
          <Select defaultValue={fontSize} style={{ width: 120 }} onChange={this.onFontSizeChange.bind(this)}>
            <Option value={14}>14</Option>
            <Option value={16}>16</Option>
            <Option value={18}>18</Option>
          </Select>
          <Select defaultValue={fontFamily} style={{ width: 120 }} onChange={this.onFontFamilyChange.bind(this)}>
            <Option value="Courier New">Courier New</Option>
            <Option value="Arial">Arial</Option>
            <Option value="Times New Roman">Times New Roman</Option>
          </Select>
        </div>
        <MonacoEditor
          width="800"
          height="600"
          language="markdown"
          theme={theme}
          value={code}
          options={options}
          onChange={this.onChange}
          editorDidMount={this.editorDidMount}
          className="monaco-editor"
        />
      </div>
    );
  }
}

export default Editor;
