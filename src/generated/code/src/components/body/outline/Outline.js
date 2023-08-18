
import React, { useEffect, useState } from 'react';
import { Tree } from 'antd';
import { useTheme } from '@emotion/react';
import { ipcRenderer } from 'electron';
import SelectionService from '../../../services/SelectionService/SelectionService';
import LineParser from '../../../services/line parser/LineParser';
import PositionTrackingService from '../../../services/position-tracking service/PositionTrackingService';
import DialogService from '../../../services/dialog service/DialogService';
import ThemeService from '../../../services/Theme service/ThemeService';

/**
 * Outline component
 * @component
 */
function Outline() {
  const [outlineData, setOutlineData] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const theme = ThemeService.getCurrentTheme();

  useEffect(() => {
    ipcRenderer.on('document-changed', (event, newDocument) => {
      try {
        const parsedOutline = LineParser.parse(newDocument);
        setOutlineData(parsedOutline);
      } catch (error) {
        DialogService.showErrorDialog('Error parsing document', error.message);
      }
    });

    PositionTrackingService.subscribe((newPosition) => {
      setSelectedKeys([newPosition]);
    });

    return () => {
      PositionTrackingService.unsubscribe();
      ipcRenderer.removeAllListeners('document-changed');
    };
  }, []);

  const onSelect = (selectedKeys) => {
    SelectionService.selectTextFragment(selectedKeys[0]);
  };

  return (
    <div className={`outline ${theme}`}>
      <Tree
        treeData={outlineData}
        selectedKeys={selectedKeys}
        onSelect={onSelect}
      />
    </div>
  );
}

export default Outline;
