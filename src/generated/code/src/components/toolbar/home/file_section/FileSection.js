
import React, { useEffect, useState } from 'react';
import { Button, Tooltip } from 'antd';
import { UndoOutlined, RedoOutlined, SaveOutlined, FileAddOutlined, FileOutlined, FileSyncOutlined } from '@ant-design/icons';
import { remote } from 'electron';
import UndoService from '../../../../services/Undo_service/UndoService';
import ProjectService from '../../../../services/project_service/ProjectService';
import DialogService from '../../../../services/dialog_service/DialogService';
import ThemeService from '../../../../services/Theme_service/ThemeService';

/**
 * FileSection component
 * Contains actions related to the project and file management
 */
function FileSection() {
  const [canUndo, setCanUndo] = useState(UndoService.canUndo());
  const [autoSave, setAutoSave] = useState(ProjectService.getAutoSaveState());

  useEffect(() => {
    const undoSubscription = UndoService.subscribe(() => {
      setCanUndo(UndoService.canUndo());
    });

    return () => {
      UndoService.unsubscribe(undoSubscription);
    };
  }, []);

  const newProject = async () => {
    if (canUndo && !await DialogService.showSaveDialog()) {
      return;
    }
    ProjectService.newProject();
  };

  const openProject = async () => {
    try {
      const { filePaths } = await remote.dialog.showOpenDialog({ properties: ['openFile'] });
      if (filePaths.length > 0) {
        await ProjectService.loadProject(filePaths[0]);
      }
    } catch (error) {
      DialogService.showErrorDialog(error.message);
    }
  };

  const saveProject = async () => {
    try {
      let filename = ProjectService.getFilename();
      if (!filename) {
        const { filePath } = await remote.dialog.showSaveDialog({});
        if (!filePath) {
          return;
        }
        filename = filePath;
      }
      await ProjectService.saveProject(filename);
    } catch (error) {
      DialogService.showErrorDialog(error.message);
    }
  };

  const saveProjectAs = async () => {
    try {
      const { filePath } = await remote.dialog.showSaveDialog({});
      if (filePath) {
        await ProjectService.saveProject(filePath);
      }
    } catch (error) {
      DialogService.showErrorDialog(error.message);
    }
  };

  const toggleAutoSave = () => {
    const newAutoSave = !autoSave;
    ProjectService.setAutoSaveState(newAutoSave);
    setAutoSave(newAutoSave);
  };

  const theme = ThemeService.getCurrentTheme();

  return (
    <div className={`file-section ${theme}`}>
      <Tooltip title="New Project">
        <Button icon={<FileAddOutlined />} onClick={newProject} />
      </Tooltip>
      <Tooltip title="Open Project">
        <Button icon={<FileOutlined />} onClick={openProject} />
      </Tooltip>
      <Tooltip title="Save Project">
        <Button icon={<SaveOutlined />} onClick={saveProject} disabled={!canUndo || !ProjectService.getFilename()} />
      </Tooltip>
      <Tooltip title="Save Project As">
        <Button icon={<SaveOutlined />} onClick={saveProjectAs} disabled={!canUndo} />
      </Tooltip>
      <Tooltip title="Toggle Auto Save">
        <Button icon={<FileSyncOutlined />} onClick={toggleAutoSave} type={autoSave ? 'primary' : 'default'} />
      </Tooltip>
    </div>
  );
}

export default FileSection;
