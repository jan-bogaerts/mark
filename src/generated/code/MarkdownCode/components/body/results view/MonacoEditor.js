
import React, { useState, useEffect } from 'react';
import { Button, Tabs, Select, Menu, Dropdown } from 'antd';
import MonacoEditor from 'react-monaco-editor';
import { observer } from 'mobx-react';
import { ThemeService, DialogService, ProjectService, SelectionService, UndoService, PositionTrackingService, ResultCacheService, BuildService, CompressService } from 'MarkdownCode/services';
import { ResultsView, Tab, ContextMenu, MenuItem } from 'MarkdownCode/components/body/results view';

const MonacoEditorComponent = observer(() => {
  const [theme, setTheme] = useState(ThemeService.currentTheme);
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('Courier');
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    ThemeService.subscribe(setTheme);
    ProjectService.subscribe(setServices);
    SelectionService.subscribe(setActiveTab);
    return () => {
      ThemeService.unsubscribe(setTheme);
      ProjectService.unsubscribe(setServices);
      SelectionService.unsubscribe(setActiveTab);
    };
  }, []);

  const handleTabChange = (key) => {
    setActiveTab(key);
    const result = ResultCacheService.getResult(key);
    setEditorContent(result ? result.content : '');
  };

  const handleEditorChange = (newValue) => {
    setEditorContent(newValue);
    ResultCacheService.updateResult(activeTab, newValue, true);
  };

  const handleRefreshClick = () => {
    BuildService.build(activeTab);
  };

  const handleModelChange = (model) => {
    ProjectService.updateModel(activeTab, model);
  };

  const handleThemeChange = (value) => {
    ThemeService.setTheme(value);
  };

  const handleFontChange = (value) => {
    setFontFamily(value);
  };

  const handleFontSizeChange = (value) => {
    setFontSize(value);
  };

  const options = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: false,
  };

  return (
    <ResultsView>
      <Tabs onChange={handleTabChange} activeKey={activeTab}>
        {services.map(service => (
          <Tab key={service.name} tab={service.name}>
            <MonacoEditor
              width="100%"
              height="100%"
              language="markdown"
              theme={theme}
              value={editorContent}
              options={options}
              onChange={handleEditorChange}
            />
            <Button onClick={handleRefreshClick}>Refresh</Button>
            <Dropdown overlay={
              <ContextMenu>
                {ProjectService.models.map(model => (
                  <MenuItem key={model} onClick={() => handleModelChange(model)}>
                    {model}
                  </MenuItem>
                ))}
              </ContextMenu>
            }>
              <Button>More</Button>
            </Dropdown>
          </Tab>
        ))}
      </Tabs>
      <Select defaultValue={theme} style={{ width: 120 }} onChange={handleThemeChange}>
        <Option value="vs-dark">Dark</Option>
        <Option value="vs-light">Light</Option>
      </Select>
      <Select defaultValue={fontFamily} style={{ width: 120 }} onChange={handleFontChange}>
        <Option value="Courier">Courier</Option>
        <Option value="Arial">Arial</Option>
      </Select>
      <Select defaultValue={fontSize} style={{ width: 120 }} onChange={handleFontSizeChange}>
        <Option value={14}>14</Option>
        <Option value={16}>16</Option>
      </Select>
    </ResultsView>
  );
});

export default MonacoEditorComponent;
