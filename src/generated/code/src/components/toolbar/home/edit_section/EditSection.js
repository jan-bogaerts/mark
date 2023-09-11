
import React, { Component } from 'react';
import { Button, Tooltip } from 'antd';
import { ScissorOutlined, CopyOutlined, PasteOutlined, DeleteOutlined, SelectOutlined, ClearOutlined } from '@ant-design/icons';
import SelectionService from '../../../services/SelectionService/SelectionService';
import DialogService from '../../../services/DialogService/DialogService';
import ThemeService from '../../../services/ThemeService/ThemeService';

/**
 * EditSection component
 * Contains actions related to the clipboard and the currently selected data.
 */
class EditSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: ThemeService.getCurrentTheme(),
    };
  }

  /**
   * Check if any data is selected
   */
  isDataSelected = () => {
    return SelectionService.hasSelectedData();
  }

  /**
   * Check if clipboard contains text data
   */
  isClipboardDataAvailable = () => {
    return SelectionService.isClipboardDataAvailable();
  }

  /**
   * Handle cut action
   */
  handleCut = () => {
    if (this.isDataSelected()) {
      SelectionService.cut();
    } else {
      DialogService.showErrorDialog('No data selected to cut.');
    }
  }

  /**
   * Handle copy action
   */
  handleCopy = () => {
    if (this.isDataSelected()) {
      SelectionService.copy();
    } else {
      DialogService.showErrorDialog('No data selected to copy.');
    }
  }

  /**
   * Handle paste action
   */
  handlePaste = () => {
    if (this.isClipboardDataAvailable()) {
      SelectionService.paste();
    } else {
      DialogService.showErrorDialog('No data available to paste.');
    }
  }

  /**
   * Handle delete action
   */
  handleDelete = () => {
    if (this.isDataSelected()) {
      SelectionService.delete();
    } else {
      DialogService.showErrorDialog('No data selected to delete.');
    }
  }

  /**
   * Handle select all action
   */
  handleSelectAll = () => {
    SelectionService.selectAll();
  }

  /**
   * Handle clear selection action
   */
  handleClearSelection = () => {
    if (this.isDataSelected()) {
      SelectionService.clearSelection();
    } else {
      DialogService.showErrorDialog('No data selected to clear.');
    }
  }

  render() {
    const { theme } = this.state;
    return (
      <div className={`edit-section ${theme}`}>
        <Tooltip title="Cut">
          <Button icon={<ScissorOutlined />} onClick={this.handleCut} disabled={!this.isDataSelected()} />
        </Tooltip>
        <Tooltip title="Copy">
          <Button icon={<CopyOutlined />} onClick={this.handleCopy} disabled={!this.isDataSelected()} />
        </Tooltip>
        <Tooltip title="Paste">
          <Button icon={<PasteOutlined />} onClick={this.handlePaste} disabled={!this.isClipboardDataAvailable()} />
        </Tooltip>
        <Tooltip title="Delete">
          <Button icon={<DeleteOutlined />} onClick={this.handleDelete} disabled={!this.isDataSelected()} />
        </Tooltip>
        <Tooltip title="Select All">
          <Button icon={<SelectOutlined />} onClick={this.handleSelectAll} />
        </Tooltip>
        <Tooltip title="Clear Selection">
          <Button icon={<ClearOutlined />} onClick={this.handleClearSelection} disabled={!this.isDataSelected()} />
        </Tooltip>
      </div>
    );
  }
}

export default EditSection;
