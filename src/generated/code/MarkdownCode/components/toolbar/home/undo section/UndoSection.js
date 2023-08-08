
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { UndoOutlined, RedoOutlined } from '@ant-design/icons';
import ThemeService from 'MarkdownCode/services/Theme service/ThemeService';
import UndoService from 'MarkdownCode/services/Undo service/UndoService';
import DialogService from 'MarkdownCode/services/dialog service/DialogService';

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

  return (
    <div className={`undo-section ${ThemeService.getCurrentTheme()}`}>
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
