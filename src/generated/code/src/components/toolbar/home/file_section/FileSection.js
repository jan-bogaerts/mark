
import React, { Component } from 'react';
import { Button, Tooltip } from 'antd';
import { PlusOutlined, FolderOpenOutlined, SaveOutlined, SaveFilled, SyncOutlined } from '@ant-design/icons';
import dialogService from '../../../../services/dialog_service/DialogService';
import storageService from '../../../../services/project_service/storage_service/StorageService';
import projectService from '../../../../services/project_service/ProjectService';
import themeService from '../../../../services/Theme_service/ThemeService';

class FileSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      autoSave: projectService.autoSave,
      isDirty: projectService.isDirty,
      filename: projectService.filename
    };
  }

  componentDidMount() {
    projectService.eventTarget.addEventListener('is-dirty-changed', this.updateState);
  }

  componentWillUnmount() {
    projectService.eventTarget.removeEventListener('is-dirty-changed', this.updateState);
  }

  updateState = () => {
    this.setState({
      autoSave: projectService.autoSave,
      isDirty: projectService.isDirty,
      filename: projectService.filename
    });
  }

  newProject = async () => {
    if (this.state.isDirty) {
      await this.saveProject();
    }
    storageService.new();
  }

  openProject = async () => {
    try {
      const dialogResult = await dialogService.showOpenDialog();
      if (dialogResult && !dialogResult.canceled && dialogResult.filePaths) {
        storageService.open(dialogResult.filePaths[0]);
      }
    } catch (error) {
      dialogService.showErrorDialog(error);
    }
  }

  saveProject = async () => {
    try {
      let filename = this.state.filename;
      if (!filename) {
        filename = await dialogService.showSaveDialog();
        if (!filename) return;
      }
      await storageService.save(filename);
    } catch (error) {
      dialogService.showErrorDialog(error);
    }
  }

  saveProjectAs = async () => {
    try {
      const dialogResult = await dialogService.showSaveDialog();
      if (dialogResult && !dialogResult.canceled && dialogResult.filePath) {
        storageService.save(dialogResult.filePath);
      }
    } catch (error) {
      dialogService.showErrorDialog(error);
    }
  }

  toggleAutoSave = () => {
    const newValue = !this.state.autoSave;
    projectService.setAutoSaveState(newValue);
    this.setState({ autoSave: newValue });
  }

  render() {
    const theme = themeService.getCurrentTheme();
    return (
      <div className={`file-section ${theme}`}>
        <Tooltip title="New Project">
          <Button icon={<PlusOutlined />} onClick={this.newProject} />
        </Tooltip>
        <Tooltip title="Open Project">
          <Button icon={<FolderOpenOutlined />} onClick={this.openProject} />
        </Tooltip>
        <Tooltip title="Save Project">
          <Button icon={<SaveOutlined />} onClick={this.saveProject} disabled={!this.state.isDirty || !this.state.filename} />
        </Tooltip>
        <Tooltip title="Save Project As">
          <Button icon={<SaveFilled />} onClick={this.saveProjectAs} disabled={!this.state.isDirty} />
        </Tooltip>
        <Tooltip title="Toggle Auto Save">
          <Button icon={<SyncOutlined />} onClick={this.toggleAutoSave} type={this.state.autoSave ? 'primary' : 'default'} />
        </Tooltip>
      </div>
    );
  }
}

export default FileSection;
