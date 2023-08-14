
import React, { useState, useEffect } from 'react';
import { Menu, Dropdown, Button as AntButton } from 'antd';
import MonacoEditor from 'MarkdownCode/components/body/results view/MonacoEditor';
import Tab from 'MarkdownCode/components/body/results view/Tab';
import ResultsView from 'MarkdownCode/components/body/results view/ResultsView';
import MenuItem from 'MarkdownCode/components/body/results view/MenuItem';
import Button from 'MarkdownCode/components/body/results view/Button';
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

/**
 * ContextMenu component
 * @param {Object} props - Component properties
 */
const ContextMenu = (props) => {
  const [activeTab, setActiveTab] = useState(null);
  const [results, setResults] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [theme, setTheme] = useState(ThemeService.getCurrentTheme());

  useEffect(() => {
    PositionTrackingService.subscribe(setSelectedText);
    ThemeService.subscribe(setTheme);
    return () => {
      PositionTrackingService.unsubscribe(setSelectedText);
      ThemeService.unsubscribe(setTheme);
    };
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const result = ResultCacheService.getResult(tab);
    setResults(result);
  };

  const handleRefresh = () => {
    const result = BuildService.build(selectedText);
    ResultCacheService.updateResult(activeTab, result);
    setResults(result);
  };

  const handleModelChange = (model, forAll = false) => {
    if (forAll) {
      ProjectService.setModelForAll(model);
    } else {
      ProjectService.setModelForFragment(activeTab, model);
    }
    handleRefresh();
  };

  const handleMoreClick = ({ key }) => {
    switch (key) {
      case 'modelForAll':
        DialogService.showDialog({
          title: 'Select Model',
          onOk: handleModelChange,
          onCancel: () => {},
        });
        break;
      case 'modelForFragment':
        DialogService.showDialog({
          title: 'Select Model for Fragment',
          onOk: (model) => handleModelChange(model, false),
          onCancel: () => {},
        });
        break;
      default:
        break;
    }
  };

  const moreMenu = (
    <Menu onClick={handleMoreClick}>
      <MenuItem key="modelForAll">Model for all</MenuItem>
      <MenuItem key="modelForFragment">Model for fragment</MenuItem>
    </Menu>
  );

  return (
    <div className={`context-menu ${theme}`}>
      <Tab onChange={handleTabChange} />
      <ResultsView results={results} />
      <MonacoEditor value={selectedText} />
      <AntButton onClick={handleRefresh}>Refresh</AntButton>
      <Dropdown overlay={moreMenu}>
        <AntButton>More</AntButton>
      </Dropdown>
    </div>
  );
};

export default ContextMenu;
