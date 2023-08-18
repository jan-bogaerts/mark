
import React, { useEffect, useState } from 'react';
import { Button, Tooltip } from 'antd';
import { FileAddOutlined, FolderOpenOutlined, SaveOutlined, Save3Outlined, SyncOutlined } from '@ant-design/icons';
import { dialog } from 'electron';
import DialogService from '../../../../services/dialog-service/DialogService';
import ProjectService from '../../../../services/project-service/ProjectService';
import UndoService from '../../../../services/undo-service/UndoService';
import ThemeService from '../../../../services/theme-service/ThemeService';

/**
 * FileSection component
 * Contains actions related to the project and file management
 */
const FileSection = () => {
  const [autoSave, setAutoSave] = useState(ProjectService.getAutoSaveState());

  useEffect(() => {
    const undoSubscription = UndoService.subscribe(() => {
      // Force component to re-render when undo data changes
      setAutoSave(ProjectService.getAutoSaveState());
    });

    return () => {
      undoSubscription.unsubscribe();
    };
  }, []);

  const newProject = async () => {
    if (UndoService.hasUndoData()) {
      const saveChanges = await DialogService.showConfirmationDialog('Save changes', 'You have unsaved changes. Do you want to save them?');
      if (saveChanges) {
        await saveProject();
      }
    }
    ProjectService.newProject();
  };

  const openProject = async () => {
    try {
      const filePaths = await dialog.showOpenDialog({ properties: ['openFile'] });
      if (filePaths.filePaths.length > 0) {
        await ProjectService.loadProject(filePaths.filePaths[0]);
      }
    } catch (error) {
      DialogService.showErrorDialog('Error opening project', error.message);
    }
  };

  const saveProject = async () => {
    try {
      let filename = ProjectService.getFilename();
      if (!filename) {
        const savePath = await dialog.showSaveDialog({});
        if (savePath.filePath) {
          filename = savePath.filePath;
        } else {
          return;
        }
      }
      await ProjectService.saveProject(filename);
    } catch (error) {
      DialogService.showErrorDialog('Error saving project', error.message);
    }
  };

  const saveProjectAs = async () => {
    try {
      const savePath = await dialog.showSaveDialog({});
      if (savePath.filePath) {
        await ProjectService.saveProject(savePath.filePath);
      }
    } catch (error) {
      DialogService.showErrorDialog('Error saving project', error.message);
    }
  };

  const toggleAutoSave = () => {
    ProjectService.setAutoSaveState(!autoSave);
    setAutoSave(!autoSave);
  };

  const theme = ThemeService.getCurrentTheme();

  return (
    <div className={`file-section ${theme}`}>
      <Tooltip title="New Project">
        <Button icon={<FileAddOutlined />} onClick={newProject} />
      </Tooltip>
      <Tooltip title="Open Project">
        <Button icon={<FolderOpenOutlined />} onClick={openProject} />
      </Tooltip>
      <Tooltip title="Save Project">
        <Button icon={<SaveOutlined />} onClick={saveProject} disabled={!UndoService.hasUndoData() || !ProjectService.getFilename()} />
      </Tooltip>
      <Tooltip title="Save Project As">
        <Button icon={<Save3Outlined />} onClick={saveProjectAs} disabled={!UndoService.hasUndoData()} />
      </Tooltip>
      <Tooltip title="Toggle Auto Save">
        <Button icon={<SyncOutlined />} onClick={toggleAutoSave} type={autoSave ? 'primary' : 'default'} />
      </Tooltip>
    </div>
  );
};

export default FileSection;
