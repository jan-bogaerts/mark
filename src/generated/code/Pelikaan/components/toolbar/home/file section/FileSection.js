
import React, { useState } from 'react';
import { Button, message, Modal } from 'antd';
import { remote } from 'electron';

const { dialog } = remote;

const FileSection = ({ projectService }) => {
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(false);

  const handleNewProject = () => {
    if (projectService.isProjectChanged()) {
      Modal.confirm({
        title: 'Save Changes',
        content: 'Do you want to save the changes before creating a new project?',
        onOk: handleSave,
        onCancel: () => {
          projectService.clearProject();
        },
      });
    } else {
      projectService.clearProject();
    }
  };

  const handleOpenProject = () => {
    dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Project Files', extensions: ['json'] }],
    }).then((result) => {
      if (!result.canceled) {
        const filePath = result.filePaths[0];
        projectService.loadProject(filePath);
      }
    }).catch((error) => {
      message.error(`Failed to open project: ${error.message}`);
    });
  };

  const handleSave = () => {
    const currentFilePath = projectService.getFilePath();
    if (currentFilePath) {
      saveProject(currentFilePath);
    } else {
      handleSaveAs();
    }
  };

  const handleSaveAs = () => {
    dialog.showSaveDialog({
      defaultPath: 'project.json',
      filters: [{ name: 'Project Files', extensions: ['json'] }],
    }).then((result) => {
      if (!result.canceled) {
        const filePath = result.filePath;
        saveProject(filePath);
      }
    }).catch((error) => {
      message.error(`Failed to save project: ${error.message}`);
    });
  };

  const saveProject = (filePath) => {
    projectService.saveProject(filePath)
      .then(() => {
        message.success('Project saved successfully');
      })
      .catch((error) => {
        message.error(`Failed to save project: ${error.message}`);
      });
  };

  const handleAutoSaveToggle = () => {
    setIsAutoSaveEnabled(!isAutoSaveEnabled);
  };

  return (
    <div>
      <Button onClick={handleNewProject}>New Project</Button>
      <Button onClick={handleOpenProject}>Open</Button>
      <Button onClick={handleSave}>Save</Button