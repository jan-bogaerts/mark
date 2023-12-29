import React, { useEffect, useState } from 'react';
import { Button, Tooltip } from 'antd';
import { clipboard, ipcRenderer } from 'electron';
import SelectionService from '../../../../services/Selection_service/SelectionService';
import DialogService from '../../../../services/dialog_service/DialogService';
import ThemeService from '../../../../services/Theme_service/ThemeService';
import { ScissorOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { BiPaste } from 'react-icons/bi';
import { MdSelectAll, MdOutlineDeselect } from 'react-icons/md';

/**
 * EditSection component
 */
function EditSection() {
  const [clipboardHasText, setClipboardHasText] = useState(false);
  const [selectionExists, setSelectionExists] = useState(false);

  useEffect(() => {
    const handleSelectionChanged = () => {
      setSelectionExists(SelectionService.hasSelection());
    };

    setClipboardHasText(clipboard.has('text/plain'));
    handleSelectionChanged();

    ipcRenderer.on('focused', () => {
      const available = clipboard.availableFormats();
      setClipboardHasText(available.includes('text/plain'));
    });

    SelectionService.subscribe(handleSelectionChanged);

    return () => {
      ipcRenderer.removeAllListeners('focused');
      SelectionService.unsubscribe(handleSelectionChanged);
    };
  }, []);

  const handleCut = () => {
    if (selectionExists) {
      SelectionService.cut();
    } else {
      DialogService.showError('No selection to cut');
    }
  };

  const handleCopy = () => {
    if (selectionExists) {
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
    if (selectionExists) {
      SelectionService.delete();
    } else {
      DialogService.showError('No selection to delete');
    }
  };

  const handleSelectAll = () => {
    SelectionService.selectAll();
  };

  const handleClearSelection = () => {
    if (selectionExists) {
      SelectionService.clearSelection();
    } else {
      DialogService.showError('No selection to clear');
    }
  };

  return (
    <div className={`edit-section ${ThemeService.getCurrentTheme()}`}>
      <Tooltip title="Cut" placement='bottom'>
        <Button icon={<ScissorOutlined />} onClick={handleCut} disabled={!selectionExists} />
      </Tooltip>
      <Tooltip title="Copy" placement='bottom'>
        <Button icon={<CopyOutlined />} onClick={handleCopy} disabled={!selectionExists} />
      </Tooltip>
      <Tooltip title="Paste" placement='bottom'>
        <Button icon={<BiPaste />} onClick={handlePaste} disabled={!clipboardHasText || !SelectionService.getEditor()} />
      </Tooltip>
      <Tooltip title="Delete" placement='bottom'>
        <Button icon={<DeleteOutlined />} onClick={handleDelete} disabled={!selectionExists} />
      </Tooltip>
      <Tooltip title="Select All" placement='bottom'>
        <Button icon={<MdSelectAll />} onClick={handleSelectAll} />
      </Tooltip>
      <Tooltip title="Clear Selection" placement='bottom'>
        <Button icon={<MdOutlineDeselect />} onClick={handleClearSelection} disabled={!selectionExists} />
      </Tooltip>
    </div>
  );
}

export default EditSection;