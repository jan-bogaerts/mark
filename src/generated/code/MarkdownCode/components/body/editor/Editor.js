
import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import MonacoEditor from 'MarkdownCode/components/body/editor/MonacoEditor';
import ProjectService from 'MarkdownCode/services/project service/ProjectService';
import SelectionService from 'MarkdownCode/services/Selection service/SelectionService';
import PositionTrackingService from 'MarkdownCode/services/position-tracking service/PositionTrackingService';
import ThemeService from 'MarkdownCode/services/Theme service/ThemeService';
import DialogService from 'MarkdownCode/services/dialog service/DialogService';

const { Content } = Layout;

/**
 * Editor component
 * Displays the markdown text of the currently loaded project
 * Uses Monaco Editor for text display and editing
 */
const Editor = () => {
  const [theme, setTheme] = useState(ThemeService.getCurrentTheme());
  const [project, setProject] = useState(ProjectService.getCurrentProject());
  const [selectedLine, setSelectedLine] = useState(SelectionService.getSelectedLine());

  useEffect(() => {
    ThemeService.subscribe(setTheme);
    ProjectService.subscribe(setProject);
    SelectionService.subscribe(setSelectedLine);
    return () => {
      ThemeService.unsubscribe(setTheme);
      ProjectService.unsubscribe(setProject);
      SelectionService.unsubscribe(setSelectedLine);
    };
  }, []);

  const handleEditorChange = (newValue, e) => {
    try {
      ProjectService.updateProject({ ...project, text: newValue });
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

  const handleEditorSelectionChange = (selection) => {
    try {
      PositionTrackingService.updateSelectedLine(selection.endLineNumber);
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

  return (
    <Content className={`editor ${theme}`}>
      <MonacoEditor
        value={project.text}
        onChange={handleEditorChange}
        onSelectionChange={handleEditorSelectionChange}
        theme={theme}
      />
    </Content>
  );
};

export default Editor;
