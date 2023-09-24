
import React, { useEffect, useState } from 'react';
import { Button, Tooltip } from 'antd';
import { SaveOutlined, FolderOpenOutlined, FileAddOutlined, SaveFilled, SyncOutlined } from '@ant-design/icons';
import UndoService from '../../../../services/Undo_service/UndoService';
import ProjectService from '../../../../services/project_service/ProjectService';
import StorageService from '../../../../services/project_service/storage_service/StorageService';
import DialogService from '../../../../services/dialog_service/DialogService';
import ThemeService from '../../../../services/Theme_service/ThemeService';

/**
 * FileSection component
 */
function FileSection() {
  const [autoSave, setAutoSave] = useState(ProjectService.getAutoSaveState());

  useEffect(() => {

    UndoService.subscribe(updateAutoSave);
    return () => {
      UndoService.unsubscribe(updateAutoSave);
    };
  }, []);

  const updateAutoSave = () => {
    setAutoSave(ProjectService.getAutoSaveState());
  };

  const newProject = async () => {
    if (UndoService.hasUndoData()) {
      const save = await DialogService.confirm('Save changes before creating a new project?');
      if (save) {
        await saveProject();
      }
    }
    StorageService.new();
  };

  const openProject = async () => {
    const filePath = await DialogService.showOpenDialog();
    if (filePath.filePaths[0]) {
      try {
        await StorageService.load(filePath.filePaths[0]);
      } catch (error) {
        DialogService.error('Error loading project', error.message);
      }
    }
  };

  const saveProject = async () => {
    let fileName = ProjectService.filename;
    if (!fileName) {
      const filePath = await DialogService.showSaveDialog();
      if (filePath.filePath) {
        fileName = filePath.filePath;
      } else {
        return;
      }
    }
    try {
      await StorageService.save(fileName);
    } catch (error) {
      DialogService.error('Error saving project', error.message);
    }
  };

  const saveProjectAs = async () => {
    const filePath = await DialogService.showSaveDialog();
    if (filePath.filePath) {
      try {
        await StorageService.save(filePath.filePath);
      } catch (error) {
        DialogService.error('Error saving project', error.message);
      }
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
        <Button icon={<SaveOutlined />} onClick={saveProject} disabled={!ProjectService.filename || !UndoService.hasUndoData()} />
      </Tooltip>
      <Tooltip title="Save Project As">
        <Button icon={<SaveFilled />} onClick={saveProjectAs} disabled={!UndoService.hasUndoData()} />
      </Tooltip>
      <Tooltip title="Toggle Auto Save">
        <Button icon={<SyncOutlined />} onClick={toggleAutoSave} type={autoSave ? 'primary' : 'default'} />
      </Tooltip>
    </div>
  );
}

export default FileSection;
