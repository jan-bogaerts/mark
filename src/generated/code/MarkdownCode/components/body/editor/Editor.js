
import React, { useEffect, useState } from 'react';
import { useTheme } from 'styled-components';
import { MonacoEditor } from 'MarkdownCode/components/body/editor/MonacoEditor';
import { ProjectService } from 'MarkdownCode/services/project service/ProjectService';
import { SelectionService } from 'MarkdownCode/services/Selection service/SelectionService';
import { PositionTrackingService } from 'MarkdownCode/services/position-tracking service/PositionTrackingService';
import { ThemeService } from 'MarkdownCode/services/Theme service/ThemeService';
import { DialogService } from 'MarkdownCode/services/dialog service/DialogService';

/**
 * Editor component
 * @component
 */
function Editor() {
  const [theme, setTheme] = useState(ThemeService.getCurrentTheme());
  const [selectedLine, setSelectedLine] = useState(null);
  const [markdownText, setMarkdownText] = useState('');

  useEffect(() => {
    ThemeService.subscribe(setTheme);
    PositionTrackingService.subscribe(setSelectedLine);
    setMarkdownText(ProjectService.getProjectMarkdown());

    return () => {
      ThemeService.unsubscribe(setTheme);
      PositionTrackingService.unsubscribe(setSelectedLine);
    };
  }, []);

  const handleEditorChange = (value) => {
    try {
      ProjectService.updateProjectMarkdown(value);
      setMarkdownText(value);
    } catch (error) {
      DialogService.showErrorDialog('Error updating markdown text', error);
    }
  };

  const handleCursorChange = (lineNumber) => {
    try {
      SelectionService.updateSelectedLine(lineNumber);
      setSelectedLine(lineNumber);
    } catch (error) {
      DialogService.showErrorDialog('Error updating selected line', error);
    }
  };

  return (
    <MonacoEditor
      theme={theme}
      value={markdownText}
      onChange={handleEditorChange}
      onCursorChange={handleCursorChange}
      className={`editor-${theme}`}
    />
  );
}

export default Editor;
