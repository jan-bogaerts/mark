
import React, { useState, useEffect } from 'react';
import { Tabs, Button, Menu } from 'antd';
import MonacoEditor from 'react-monaco-editor';
import { DialogService, ProjectService, SelectionService, UndoService, LineParser, PositionTrackingService, ResultCacheService, BuildService, CompressService, ThemeService } from '../../../services';
import Tab from '../Tab';
import ContextMenu from '../ContextMenu';
import MenuItem from '../MenuItem';

/**
 * ResultsView component
 * @component
 */
const ResultsView = () => {
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [editorOptions, setEditorOptions] = useState({});
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuOptions, setContextMenuOptions] = useState([]);
  const [currentTheme, setCurrentTheme] = useState(ThemeService.getCurrentTheme());

  useEffect(() => {
    // Fetch services and set initial active tab
    const servicesList = ProjectService.getServices();
    setServices(servicesList);
    setActiveTab(servicesList[0]?.name || null);

    // Subscribe to position tracking service
    const unsubscribe = PositionTrackingService.subscribe((selectedTextFragment) => {
      // Update active tab content
      const result = ResultCacheService.getResultForFragment(selectedTextFragment);
      setEditorContent(result);
    });

    return () => {
      // Unsubscribe on component unmount
      unsubscribe();
    };
  }, []);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleEditorChange = (newValue) => {
    setEditorContent(newValue);
    ResultCacheService.setOverwrittenResult(activeTab, newValue);
  };

  const handleRefreshClick = () => {
    const result = ResultCacheService.refreshResult(activeTab);
    setEditorContent(result);
  };

  const handleMoreClick = () => {
    setContextMenuVisible(true);
  };

  const handleContextMenuClose = () => {
    setContextMenuVisible(false);
  };

  const handleModelChange = (model) => {
    ProjectService.setModelForService(activeTab, model);
    handleContextMenuClose();
  };

  const handleModelForFragmentChange = (model) => {
    ProjectService.setModelForFragment(activeTab, model);
    handleContextMenuClose();
  };

  return (
    <div className={`results-view ${currentTheme}`}>
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        {services.map((service) => (
          <Tab key={service.name} tab={service.name}>
            <MonacoEditor
              value={editorContent}
              options={editorOptions}
              onChange={handleEditorChange}
            />
            <Button onClick={handleRefreshClick}>Refresh</Button>
            <Button onClick={handleMoreClick}>More</Button>
            {contextMenuVisible && (
              <ContextMenu onClose={handleContextMenuClose}>
                <MenuItem onClick={() => handleModelChange('Model for all')}>
                  Model for all
                </MenuItem>
                <MenuItem onClick={() => handleModelForFragmentChange('Model for fragment')}>
                  Model for fragment
                </MenuItem>
              </ContextMenu>
            )}
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};

export default ResultsView;
