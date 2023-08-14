
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { UndoOutlined, RedoOutlined } from '@ant-design/icons';
import ThemeService from 'MarkdownCode/services/Theme service/ThemeService';
import UndoService from 'MarkdownCode/services/Undo service/UndoService';
import DialogService from 'MarkdownCode/services/dialog service/DialogService';

/**
 * UndoSection component
 * Contains undo and redo actions
 */
const UndoSection = () => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Monitor undo service for changes
  useEffect(() => {
    const undoSubscription = UndoService.canUndo.subscribe(setCanUndo);
    const redoSubscription = UndoService.canRedo.subscribe(setCanRedo);

    return () => {
      undoSubscription.unsubscribe();
      redoSubscription.unsubscribe();
    };
  }, []);

  // Handle undo action
  const handleUndo = () => {
    try {
      UndoService.undo();
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

  // Handle redo action
  const handleRedo = () => {
    try {
      UndoService.redo();
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

  const theme = ThemeService.getCurrentTheme();

  return (
    <div className={`undo-section ${theme}`}>
      <Button
        className="undo-button"
        icon={<UndoOutlined />}
        disabled={!canUndo}
        onClick={handleUndo}
      />
      <Button
        className="redo-button"
        icon={<RedoOutlined />}
        disabled={!canRedo}
        onClick={handleRedo}
      />
    </div>
  );
};

export default UndoSection;
