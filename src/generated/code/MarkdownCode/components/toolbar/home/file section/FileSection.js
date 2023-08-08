
import React, { useEffect, useState } from 'react';
import { Button, Tooltip } from 'antd';
import { FileAddOutlined, FolderOpenOutlined, SaveOutlined, CopyOutlined, SyncOutlined } from '@ant-design/icons';
import { remote } from 'electron';
import DialogService from 'MarkdownCode/services/dialog service/DialogService';
import ProjectService from 'MarkdownCode/services/project service/ProjectService';
import UndoService from 'MarkdownCode/services/Undo service/UndoService';
import ThemeService from 'MarkdownCode/services/Theme service/ThemeService';

const FileSection = () => {
  const [autoSave, setAutoSave] = useState(false);
  const [theme, setTheme] = useState(ThemeService.getCurrentTheme());

  useEffect(() => {
    ThemeService.subscribe(setTheme);
    return () => ThemeService.unsubscribe(setTheme);
  }, []);

  const newProject = async () => {
    if (UndoService.hasUndoData()) {
      const save = await DialogService.confirm('Save changes before creating a new project?');
      if (save) await saveProject();
    }
    ProjectService.clearProject();
  };

  const openProject = async () => {
    try {
      const { filePaths } = await remote.dialog.showOpenDialog({ properties: ['openFile'] });
      if (filePaths.length) {
        await ProjectService.loadProject(filePaths[0]);
      }
    } catch (error) {
      DialogService.showError('Error opening project', error);
    }
  };

  const saveProject = async () => {
    try {
      let filename = ProjectService.getFilename();
      if (!filename) {
        const { filePath } = await remote.dialog.showSaveDialog({});
        if (!filePath) return;
        filename = filePath;
      }
      await ProjectService.saveProject(filename);
    } catch (error) {
      DialogService.showError('Error saving project', error);
    }
  };

  const saveProjectAs = async () => {
    try {
      const { filePath } = await remote.dialog.showSaveDialog({});
      if (filePath) {
        await ProjectService.saveProject(filePath);
      }
    } catch (error) {
      DialogService.showError('Error saving project as', error);
    }
  };

  const toggleAutoSave = () => {
    const newAutoSave = !autoSave;
    setAutoSave(newAutoSave);
    ProjectService.setAutoSave(newAutoSave);
  };

  return (
    <div className={`file-section ${theme}`}>
      <Tooltip title="New Project">
        <Button icon={<FileAddOutlined />} onClick={newProject} />
      </Tooltip>
      <Tooltip title="Open Project">
        <Button icon={<FolderOpenOutlined />} onClick={openProject} />
      </Tooltip>
      <Tooltip title="Save Project">
        <Button icon={<SaveOutlined />} onClick={saveProject} disabled={!ProjectService.hasFilename() || !UndoService.hasUndoData()} />
      </Tooltip>
      <Tooltip title="Save Project As">
        <Button icon={<CopyOutlined />} onClick={saveProjectAs} disabled={!UndoService.hasUndoData()} />
      </Tooltip>
      <Tooltip title="Toggle Auto Save">
        <Button icon={<SyncOutlined />} onClick={toggleAutoSave} type={autoSave ? 'primary' : 'default'} />
      </Tooltip>
    </div>
  );
};

export default FileSection;
