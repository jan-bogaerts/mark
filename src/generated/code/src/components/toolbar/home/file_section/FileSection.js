
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
      const save = await dialogService.showSaveDialog();
      if (save) {
        storageService.save();
      }
    }
    storageService.new();
  }

  openProject = async () => {
    try {
      const filename = await dialogService.showOpenDialog();
      if (filename) {
        storageService.open(filename);
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
      storageService.save(filename);
    } catch (error) {
      dialogService.showErrorDialog(error);
    }
  }

  saveProjectAs = async () => {
    try {
      const filename = await dialogService.showSaveDialog();
      if (filename) {
        storageService.save(filename);
      }
    } catch (error) {
      dialogService.showErrorDialog(error);
    }
  }

  toggleAutoSave = () => {
    projectService.autoSave = !this.state.autoSave;
    this.setState({ autoSave: projectService.autoSave });
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
