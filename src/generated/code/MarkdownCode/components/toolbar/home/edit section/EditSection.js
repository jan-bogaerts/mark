
import React, { Component } from 'react';
import { Button, Tooltip } from 'antd';
import { CutOutlined, CopyOutlined, PasteOutlined, DeleteOutlined, SelectOutlined, ClearOutlined } from '@ant-design/icons';
import SelectionService from 'MarkdownCode/services/Selection service/SelectionService';
import ThemeService from 'MarkdownCode/services/Theme service/ThemeService';
import DialogService from 'MarkdownCode/services/dialog service/DialogService';

const selectionService = new SelectionService();
const themeService = new ThemeService();
const dialogService = new DialogService();

class EditSection extends Component {
  state = {
    isDataSelected: false,
    isClipboardNotEmpty: false,
  };

  componentDidMount() {
    this.checkSelectionStatus();
    this.checkClipboardStatus();
  }

  checkSelectionStatus = () => {
    const isDataSelected = selectionService.hasSelectedData();
    this.setState({ isDataSelected });
  };

  checkClipboardStatus = () => {
    const isClipboardNotEmpty = selectionService.isClipboardNotEmpty();
    this.setState({ isClipboardNotEmpty });
  };

  handleCut = () => {
    try {
      selectionService.cut();
      this.checkSelectionStatus();
      this.checkClipboardStatus();
    } catch (error) {
      dialogService.showErrorDialog(error);
    }
  };

  handleCopy = () => {
    try {
      selectionService.copy();
      this.checkClipboardStatus();
    } catch (error) {
      dialogService.showErrorDialog(error);
    }
  };

  handlePaste = () => {
    try {
      selectionService.paste();
      this.checkSelectionStatus();
    } catch (error) {
      dialogService.showErrorDialog(error);
    }
  };

  handleDelete = () => {
    try {
      selectionService.delete();
      this.checkSelectionStatus();
    } catch (error) {
      dialogService.showErrorDialog(error);
    }
  };

  handleSelectAll = () => {
    selectionService.selectAll();
    this.checkSelectionStatus();
  };

  handleClearSelection = () => {
    selectionService.clearSelection();
    this.checkSelectionStatus();
  };

  render() {
    const { isDataSelected, isClipboardNotEmpty } = this.state;
    const theme = themeService.getCurrentTheme();

    return (
      <div className={`edit-section ${theme}`}>
        <Tooltip title="Cut">
          <Button icon={<CutOutlined />} onClick={this.handleCut} disabled={!isDataSelected} />
        </Tooltip>
        <Tooltip title="Copy">
          <Button icon={<CopyOutlined />} onClick={this.handleCopy} disabled={!isDataSelected} />
        </Tooltip>
        <Tooltip title="Paste">
          <Button icon={<PasteOutlined />} onClick={this.handlePaste} disabled={!isClipboardNotEmpty} />
        </Tooltip>
        <Tooltip title="Delete">
          <Button icon={<DeleteOutlined />} onClick={this.handleDelete} disabled={!isDataSelected} />
        </Tooltip>
        <Tooltip title="Select All">
          <Button icon={<SelectOutlined />} onClick={this.handleSelectAll} />
        </Tooltip>
        <Tooltip title="Clear Selection">
          <Button icon={<ClearOutlined />} onClick={this.handleClearSelection} disabled={!isDataSelected} />
        </Tooltip>
      </div>
    );
  }
}

export default EditSection;
