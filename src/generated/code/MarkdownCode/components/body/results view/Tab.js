
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
 */
const Tab = () => {
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [theme, setTheme] = useState(ThemeService.getTheme());

  useEffect(() => {
    setServices(ProjectService.getServices());
    setActiveTab(services[0]?.name);
    ThemeService.subscribe(setTheme);
    return () => ThemeService.unsubscribe(setTheme);
  }, []);

  const handleTabChange = key => {
    setActiveTab(key);
  };

  const handleModelChange = (service, model) => {
    ProjectService.updateModel(service, model);
  };

  const handleFragmentModelChange = (service, fragment, model) => {
    ProjectService.updateFragmentModel(service, fragment, model);
  };

  const handleRefresh = service => {
    BuildService.refresh(service);
  };

  const handleEdit = (service, text) => {
    ResultCacheService.update(service, text);
  };

  const handleCopy = text => {
    CompressService.copyToClipboard(text);
  };

  return (
    <Tabs onChange={handleTabChange} activeKey={activeTab} className={`tab-${theme}`}>
      {services.map(service => (
        <TabPane tab={service.name} key={service.name}>
          <MonacoEditor
            text={ResultCacheService.get(service.name)}
            onEdit={text => handleEdit(service.name, text)}
            onCopy={handleCopy}
            className={`editor-${theme}`}
          />
          <Button onClick={() => handleRefresh(service.name)} className={`refresh-button-${theme}`}>Refresh</Button>
          <ContextMenu>
            <MenuItem onClick={() => handleModelChange(service.name, model)} className={`menu-item-${theme}`}>
              Model for all
            </MenuItem>
            <MenuItem onClick={() => handleFragmentModelChange(service.name, SelectionService.getActiveFragment(), model)} className={`menu-item-${theme}`}>
              Model for fragment
            </MenuItem>
          </ContextMenu>
        </TabPane>
      ))}
    </Tabs>
  );
};

export default Tab;
