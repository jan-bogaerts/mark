
import React, { useState, useEffect } from 'react';
import { Button, Tooltip } from 'antd';
import { CutOutlined, CopyOutlined, PasteOutlined, DeleteOutlined, SelectOutlined, ClearOutlined } from '@ant-design/icons';
import SelectionService from 'MarkdownCode/services/Selection service/SelectionService';
import ThemeService from 'MarkdownCode/services/Theme service/ThemeService';
import DialogService from 'MarkdownCode/services/dialog service/DialogService';

/**
 * EditSection component
 * Contains actions related to the clipboard and the currently selected data.
 */
const EditSection = () => {
  const [selection, setSelection] = useState(false);
  const [clipboardData, setClipboardData] = useState(false);

  useEffect(() => {
    const updateSelection = () => setSelection(SelectionService.hasSelection());
    const updateClipboard = () => setClipboardData(SelectionService.hasClipboardData());

    SelectionService.on('selectionChanged', updateSelection);
    SelectionService.on('clipboardChanged', updateClipboard);

    return () => {
      SelectionService.off('selectionChanged', updateSelection);
      SelectionService.off('clipboardChanged', updateClipboard);
    };
  }, []);

  const handleAction = (action) => {
    try {
      SelectionService[action]();
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

  const theme = ThemeService.getCurrentTheme();

  return (
    <div className={`edit-section ${theme}`}>
      <Tooltip title="Cut">
        <Button icon={<CutOutlined />} onClick={() => handleAction('cut')} disabled={!selection} />
      </Tooltip>
      <Tooltip title="Copy">
        <Button icon={<CopyOutlined />} onClick={() => handleAction('copy')} disabled={!selection} />
      </Tooltip>
      <Tooltip title="Paste">
        <Button icon={<PasteOutlined />} onClick={() => handleAction('paste')} disabled={!clipboardData} />
      </Tooltip>
      <Tooltip title="Delete">
        <Button icon={<DeleteOutlined />} onClick={() => handleAction('delete')} disabled={!selection} />
      </Tooltip>
      <Tooltip title="Select All">
        <Button icon={<SelectOutlined />} onClick={() => handleAction('selectAll')} />
      </Tooltip>
      <Tooltip title="Clear Selection">
        <Button icon={<ClearOutlined />} onClick={() => handleAction('clearSelection')} disabled={!selection} />
      </Tooltip>
    </div>
  );
};

export default EditSection;
