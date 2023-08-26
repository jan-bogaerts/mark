
import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import MonacoEditor from 'react-monaco-editor';
import ProjectService from '../../../services/project-service/ProjectService';
import ThemeService from '../../../services/theme-service/ThemeService';
import SelectionService from '../../../services/selection-service/SelectionService';
import PositionTrackingService from '../../../services/position-tracking-service/PositionTrackingService';
import DialogService from '../../../services/dialog-service/DialogService';

const Editor = () => {
  const [editor, setEditor] = useState(null);
  const [code, setCode] = useState('');
  const [theme, setTheme] = useState(ThemeService.getCurrentTheme());
  const [font, setFont] = useState(ThemeService.getCurrentFont());
  const [fontSize, setFontSize] = useState(ThemeService.getCurrentFontSize());

  useEffect(() => {
    ProjectService.subscribe((newCode) => {
      setCode(newCode);
    });

    ThemeService.subscribe((newTheme, newFont, newFontSize) => {
      setTheme(newTheme);
      setFont(newFont);
      setFontSize(newFontSize);
    });

    return () => {
      ProjectService.unsubscribe();
      ThemeService.unsubscribe();
    };
  }, []);

  const handleEditorDidMount = (editor) => {
    setEditor(editor);
    SelectionService.setEditor(editor);
  };

  const handleEditorChange = (newValue) => {
    setCode(newValue);
    ProjectService.setCode(newValue);
  };

  const handleEditorFocus = () => {
    SelectionService.setEditor(editor);
  };

  const handleEditorBlur = () => {
    if (SelectionService.getEditor() === editor) {
      SelectionService.setEditor(null);
    }
  };

  const handleCursorPositionChange = (e) => {
    if (SelectionService.getEditor() === editor) {
      PositionTrackingService.updatePosition(e.position);
    }
  };

  const handleCursorSelectionChange = () => {
    if (SelectionService.getEditor() === editor) {
      SelectionService.notifySubscribers();
    }
  };

  return (
    <Layout className="editor-layout">
      <MonacoEditor
        width="100%"
        height="100%"
        language="markdown"
        theme={theme}
        value={code}
        options={{
          selectOnLineNumbers: true,
          fontFamily: font,
          fontSize: fontSize,
        }}
        onChange={handleEditorChange}
        editorDidMount={handleEditorDidMount}
        onFocusChange={handleEditorFocus}
        onBlur={handleEditorBlur}
        onCursorPositionChange={handleCursorPositionChange}
        onCursorSelectionChange={handleCursorSelectionChange}
      />
    </Layout>
  );
};

export default Editor;
