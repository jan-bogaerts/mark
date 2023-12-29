import React, { Component } from 'react';
import { Button, Tooltip } from 'antd';
import { FileOutlined, FolderOpenOutlined, SaveOutlined, SaveFilled, SyncOutlined } from '@ant-design/icons';
import dialogService from '../../../../services/dialog_service/DialogService';
import storageService from '../../../../services/project_service/storage_service/StorageService';
import projectService from '../../../../services/project_service/ProjectService';
import themeService from '../../../../services/Theme_service/ThemeService';

class FileSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      autoSave: projectService.getAutoSaveState(),
      isDirty: projectService.isDirty,
      filename: projectService.filename
    };
  }

  componentDidMount() {
    projectService.eventTarget.addEventListener('is-dirty-changed', this.updateState);
    window.electron.onCanClose(this.tryCanClose);
  }

  componentWillUnmount() {
    projectService.eventTarget.removeEventListener('is-dirty-changed', this.updateState);
    window.electron.removeOnCanClose(this.tryCanClose);
  }

  updateState = () => {
    this.setState({
      autoSave: projectService.getAutoSaveState(),
      isDirty: projectService.isDirty,
      filename: projectService.filename
    });
  }

  tryCanClose = async () => {
    const res = await this.trySave();
    window.electron.canCloseProcessed(res);
  }

  trySave = async () => {
    if (this.state.isDirty) {
      const confirm = await dialogService.confirm('Do you want to save the changes first?');
      if (confirm === null) {
        return false;
      } else if (confirm) {
        await this.saveProject();
      }
    }
    return true;
  }

  newProject = async () => {
    if (await this.trySave()) {
      if (!window.electron.isPluginMode) {
        await storageService.new();
      }
    }
  }

  openProject = async () => {
    if (window.electron.isPluginMode) return;
    if (await this.trySave()) {
      try {
        const dialogResult = await dialogService.showOpenDialog();
        if (dialogResult && !dialogResult.canceled && dialogResult.filePaths) {
          await storageService.open(dialogResult.filePaths[0]);
        }
      } catch (error) {
        dialogService.showErrorDialog(error);
      }
    }
  }

  saveProject = async () => {
    try {
      let filename = this.state.filename;
      if (!filename) {
        const dialogResult = await dialogService.showSaveDialog();
        if (dialogResult.canceled || !dialogResult.filePath) return;
        filename = dialogResult.filePath;
      }
      await storageService.save(filename);
      this.updateState(); // Update state after saving
    } catch (error) {
      dialogService.showErrorDialog(error);
    }
  }

  saveProjectAs = async () => {
    try {
      const dialogResult = await dialogService.showSaveDialog();
      if (dialogResult && !dialogResult.canceled && dialogResult.filePath) {
        await storageService.save(dialogResult.filePath);
        this.updateState(); // Update state after saving
      }
    } catch (error) {
      dialogService.showErrorDialog(error);
    }
  }

  toggleAutoSave = () => {
    const newValue = !this.state.autoSave;
    projectService.setAutoSaveState(newValue);
    this.updateState(); // Update state after toggling auto-save
  }

  render() {
    const theme = themeService.getCurrentTheme();
    return (
      <div className={`file-section ${theme}`}>
        <Tooltip title="New Project" placement='bottom'>
          <Button icon={<FileOutlined />} onClick={this.newProject} disabled={window.electron.isPluginMode} />
        </Tooltip>
        <Tooltip title="Open Project" placement='bottom'>
          <Button icon={<FolderOpenOutlined />} onClick={this.openProject} disabled={window.electron.isPluginMode} />
        </Tooltip>
        <Tooltip title="Save Project" placement='bottom'>
          <Button icon={<SaveOutlined />} onClick={this.saveProject} disabled={!this.state.isDirty || !this.state.filename} />
        </Tooltip>
        <Tooltip title="Save Project As" placement='bottom'>
          <Button icon={<SaveFilled />} onClick={this.saveProjectAs} />
        </Tooltip>
        <Tooltip title="Toggle Auto Save" placement='bottom'> 
          <Button icon={<SyncOutlined />} onClick={this.toggleAutoSave} type={this.state.autoSave ? 'primary' : 'default'} />
        </Tooltip>
      </div>
    );
  }
}

export default FileSection;