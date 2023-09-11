
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { UndoOutlined, RedoOutlined } from '@ant-design/icons';
import ProjectService from '../../../../services/project-service/ProjectService';
import UndoService from '../../../../services/undo-service/UndoService';
import DialogService from '../../../../services/dialog-service/DialogService';
import ThemeService from '../../../../services/theme-service/ThemeService';

/**
 * UndoSection component
 * Contains undo and redo actions that can be performed by the UndoService
 */
const UndoSection = () => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    const updateUndoRedoState = () => {
      setCanUndo(UndoService.canUndo());
      setCanRedo(UndoService.canRedo());
    };

    UndoService.subscribe(updateUndoRedoState);
    return () => {
      UndoService.unsubscribe(updateUndoRedoState);
    };
  }, []);

  const handleUndo = () => {
    try {
      UndoService.undo();
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

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
