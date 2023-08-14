
import React, { useEffect, useRef } from 'react';
import { Editor } from 'MarkdownCode/components/body/editor/Editor';
import { ProjectService } from 'MarkdownCode/services/project service/ProjectService';
import { SelectionService } from 'MarkdownCode/services/Selection service/SelectionService';
import { PositionTrackingService } from 'MarkdownCode/services/position-tracking service/PositionTrackingService';
import { ThemeService } from 'MarkdownCode/services/Theme service/ThemeService';
import { DialogService } from 'MarkdownCode/services/dialog service/DialogService';
import { MonacoEditor as Monaco } from 'react-monaco-editor';
import { useTheme } from 'antd';

/**
 * MonacoEditor component
 * This component is used as the main view of the app. It displays markdown text and utilizes the monaco editor npm package for its functionality.
 * It interacts with a position-tracking service to update the selected line based on the user's cursor movement.
 */
const MonacoEditor = () => {
  const editorRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    const themeService = new ThemeService();
    const selectedTheme = themeService.getSelectedTheme();
    editorRef.current.editor.updateOptions({ theme: selectedTheme });
  }, [theme]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.onDidChangeCursorPosition(e => {
      const positionTrackingService = new PositionTrackingService();
      positionTrackingService.updateSelectedLine(e.position.lineNumber);
    });
  };

  const handleEditorChange = (value, event) => {
    try {
      const projectService = new ProjectService();
      projectService.updateMarkdownText(value);
    } catch (error) {
      const dialogService = new DialogService();
      dialogService.showErrorDialog(error);
    }
  };

  return (
    <Monaco
      width="100%"
      height="100%"
      language="markdown"
      theme={theme}
      value={SelectionService.getMarkdownText()}
      editorDidMount={handleEditorDidMount}
      onChange={handleEditorChange}
      options={{ selectOnLineNumbers: true }}
    />
  );
};

export default MonacoEditor;
