
import React, { useState, useEffect } from 'react';
import { Tabs, Button, Menu } from 'antd';
import MonacoEditor from 'MarkdownCode/components/body/results view/MonacoEditor';
import ContextMenu from 'MarkdownCode/components/body/results view/ContextMenu';
import MenuItem from 'MarkdownCode/components/body/results view/MenuItem';
import DialogService from 'MarkdownCode/services/dialog service/DialogService';
import ThemeService from 'MarkdownCode/services/Theme service/ThemeService';
import ProjectService from 'MarkdownCode/services/project service/ProjectService';
import SelectionService from 'MarkdownCode/services/Selection service/SelectionService';
import UndoService from 'MarkdownCode/services/Undo service/UndoService';
import LineParser from 'MarkdownCode/services/line parser/LineParser';
import PositionTrackingService from 'MarkdownCode/services/position-tracking service/PositionTrackingService';
import ResultCacheService from 'MarkdownCode/services/result-cache service/ResultCacheService';
import BuildService from 'MarkdownCode/services/build service/BuildService';
import CompressService from 'MarkdownCode/services/compress service/CompressService';

const { TabPane } = Tabs;

/**
 * Tab component
 * @param {Object} props - Component properties
 */
const Tab = (props) => {
  const [activeKey, setActiveKey] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [isEditorDisabled, setIsEditorDisabled] = useState(false);
  const [isEditorOverwritten, setIsEditorOverwritten] = useState(false);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const theme = ThemeService.getCurrentTheme();

  useEffect(() => {
    const handleSelectionChange = (newSelection) => {
      setActiveKey(newSelection);
      updateEditorContent(newSelection);
    };

    SelectionService.subscribe(handleSelectionChange);

    return () => {
      SelectionService.unsubscribe(handleSelectionChange);
    };
  }, []);

  const updateEditorContent = (key) => {
    const result = ResultCacheService.getResult(key);
    setEditorContent(result.content);
    setIsEditorDisabled(result.isOutdated);
    setIsEditorOverwritten(result.isOverwritten);
  };

  const handleTabChange = (key) => {
    setActiveKey(key);
    updateEditorContent(key);
  };

  const handleRefreshClick = () => {
    const result = BuildService.build(activeKey);
    ResultCacheService.updateResult(activeKey, result);
    updateEditorContent(activeKey);
  };

  const handleMoreClick = () => {
    setContextMenuVisible(true);
  };

  const handleContextMenuClose = () => {
    setContextMenuVisible(false);
  };

  const handleMenuItemClick = (item) => {
    if (item.key === 'copy') {
      navigator.clipboard.writeText(editorContent);
    } else if (item.key === 'selectModel') {
      DialogService.showDialog({
        title: 'Select GPT Model',
        message: 'Please select a GPT model for this service.',
        buttons: ['OK', 'Cancel']
      });
    }
  };

  return (
    <div className={`tab-container ${theme}`}>
      <Tabs activeKey={activeKey} onChange={handleTabChange}>
        {ProjectService.getServices().map((service) => (
          <TabPane tab={service.name} key={service.id}>
            <MonacoEditor
              value={editorContent}
              readOnly={isEditorDisabled}
              className={isEditorOverwritten ? 'overwritten' : ''}
            />
            <Button onClick={handleRefreshClick}>Refresh</Button>
            <Button onClick={handleMoreClick}>More</Button>
            {contextMenuVisible && (
              <ContextMenu onClose={handleContextMenuClose}>
                <MenuItem key="copy" onClick={handleMenuItemClick}>
                  Copy
                </MenuItem>
                <MenuItem key="selectModel" onClick={handleMenuItemClick}>
                  Select GPT Model
                </MenuItem>
              </ContextMenu>
            )}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default Tab;
