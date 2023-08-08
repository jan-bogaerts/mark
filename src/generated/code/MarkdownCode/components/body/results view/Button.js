
import React, { useState, useEffect } from 'react';
import { Button, Tabs, Menu } from 'antd';
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
 * Button Component
 */
const ButtonComponent = () => {
  const [theme, setTheme] = useState(ThemeService.getCurrentTheme());
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [results, setResults] = useState([]);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);

  useEffect(() => {
    ThemeService.subscribe(setTheme);
    setServices(ProjectService.getServices());
    setActiveTab(services[0]);
    setResults(ResultCacheService.getResults());
    return () => {
      ThemeService.unsubscribe(setTheme);
    };
  }, []);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenuVisible(true);
  };

  const handleRefresh = () => {
    BuildService.refreshResults(activeTab);
  };

  const handleModelChange = (model) => {
    ProjectService.updateModel(activeTab, model);
  };

  const handleCopy = () => {
    const result = ResultCacheService.getResult(activeTab);
    navigator.clipboard.writeText(result);
  };

  return (
    <div className={`button-component ${theme}`}>
      <Tabs onChange={handleTabChange} activeKey={activeTab}>
        {services.map((service) => (
          <TabPane tab={service} key={service}>
            <MonacoEditor content={results[service]} />
            <Button onClick={handleContextMenu}>More</Button>
            <ContextMenu visible={contextMenuVisible}>
              <MenuItem onClick={handleModelChange}>Model for all</MenuItem>
              <MenuItem onClick={handleModelChange}>Model for fragment</MenuItem>
            </ContextMenu>
            <Button onClick={handleRefresh}>Refresh</Button>
          </TabPane>
        ))}
      </Tabs>
      <Button onClick={handleCopy}>Copy</Button>
    </div>
  );
};

export default ButtonComponent;
