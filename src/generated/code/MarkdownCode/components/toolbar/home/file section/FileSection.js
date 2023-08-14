
import React, { useState, useEffect } from 'react';
import { Button, Tooltip } from 'antd';
import { FileAddOutlined, FolderOpenOutlined, SaveOutlined, FileOutlined, SyncOutlined } from '@ant-design/icons';
import DialogService from 'MarkdownCode/services/dialog service/DialogService';
import ProjectService from 'MarkdownCode/services/project service/ProjectService';
import UndoService from 'MarkdownCode/services/Undo service/UndoService';
import ThemeService from 'MarkdownCode/services/Theme service/ThemeService';

/**
 * FileSection component
 * Contains actions related to the project and file management.
 */
const FileSection = () => {
  const [autoSave, setAutoSave] = useState(ProjectService.autoSave);

  useEffect(() => {
    ProjectService.onAutoSaveChange(setAutoSave);
    return () => ProjectService.offAutoSaveChange(setAutoSave);
  }, []);

  const newProject = async () => {
    if (UndoService.hasUndoData()) {
      const save = await DialogService.confirm('Save changes before creating a new project?');
      if (save) await ProjectService.save();
    }
    ProjectService.newProject();
  };

  const openProject = async () => {
    try {
      const file = await DialogService.openFileDialog();
      if (file) await ProjectService.load(file);
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

  const saveProject = async () => {
    try {
      let filename = ProjectService.filename;
      if (!filename) {
        filename = await DialogService.saveFileDialog();
        if (!filename) return;
      }
      await ProjectService.save(filename);
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

  const saveProjectAs = async () => {
    try {
      const filename = await DialogService.saveFileDialog();
      if (filename) await ProjectService.save(filename);
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

  const toggleAutoSave = () => {
    ProjectService.autoSave = !ProjectService.autoSave;
  };

  const theme = ThemeService.getTheme();

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
        <Button icon={<FileOutlined />} onClick={saveProjectAs} disabled={!UndoService.hasUndoData()} />
      </Tooltip>
      <Tooltip title="Toggle Auto Save">
        <Button icon={<SyncOutlined />} onClick={toggleAutoSave} type={autoSave ? 'primary' : 'default'} />
      </Tooltip>
    </div>
  );
};

export default FileSection;
