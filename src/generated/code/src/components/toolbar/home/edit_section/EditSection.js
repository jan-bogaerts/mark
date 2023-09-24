
import React, { useEffect, useState } from 'react';
import { Button, Tooltip } from 'antd';
import { BiPaste } from 'react-icons/bi';
import { clipboard, ipcRenderer } from 'electron';
import SelectionService from '../../../../services/Selection_service/SelectionService';
import DialogService from '../../../../services/dialog_service/DialogService';
import ThemeService from '../../../../services/Theme_service/ThemeService';
import { ScissorOutlined, CopyOutlined, DeleteOutlined, SelectOutlined, ClearOutlined } from '@ant-design/icons';

/**
 * EditSection component
 */
function EditSection() {
  const [clipboardHasText, setClipboardHasText] = useState(false);
  const [selectionExists, setSelectionExists] = useState(false);

  useEffect(() => {
    setClipboardHasText(clipboard.has('text/plain'));
    setSelectionExists(SelectionService.hasSelection());

    ipcRenderer.on('focused', () => {
      setClipboardHasText(clipboard.has('text/plain'));
    });
  }, []);

  const handleCut = () => {
    if (SelectionService.hasSelection()) {
      SelectionService.cut();
    } else {
      DialogService.showError('No selection to cut');
    }
  };

  const handleCopy = () => {
    if (SelectionService.hasSelection()) {
      SelectionService.copy();
    } else {
      DialogService.showError('No selection to copy');
    }
  };

  const handlePaste = () => {
    if (clipboardHasText) {
      SelectionService.paste(clipboard.readText());
    } else {
      DialogService.showError('No text in clipboard to paste');
    }
  };

  const handleDelete = () => {
    if (SelectionService.hasSelection()) {
      SelectionService.delete();
    } else {
      DialogService.showError('No selection to delete');
    }
  };

  const handleSelectAll = () => {
    SelectionService.selectAll();
  };

  const handleClearSelection = () => {
    if (SelectionService.hasSelection()) {
      SelectionService.clearSelection();
    } else {
      DialogService.showError('No selection to clear');
    }
  };

  return (
    <div className={`edit-section ${ThemeService.getCurrentTheme()}`}>
      <Tooltip title="Cut">
        <Button icon={<ScissorOutlined />} onClick={handleCut} disabled={!selectionExists} />
      </Tooltip>
      <Tooltip title="Copy">
        <Button icon={<CopyOutlined />} onClick={handleCopy} disabled={!selectionExists} />
      </Tooltip>
      <Tooltip title="Paste">
        <Button icon={<BiPaste />} onClick={handlePaste} disabled={!clipboardHasText} />
      </Tooltip>
      <Tooltip title="Delete">
        <Button icon={<DeleteOutlined />} onClick={handleDelete} disabled={!selectionExists} />
      </Tooltip>
      <Tooltip title="Select All">
        <Button icon={<SelectOutlined />} onClick={handleSelectAll} />
      </Tooltip>
      <Tooltip title="Clear Selection">
        <Button icon={<ClearOutlined />} onClick={handleClearSelection} disabled={!selectionExists} />
      </Tooltip>
    </div>
  );
}

export default EditSection;
