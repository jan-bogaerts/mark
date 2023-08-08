
import React, { useState, useEffect } from 'react';
import { Menu, Tabs, Button } from 'antd';
import MonacoEditor from 'react-monaco-editor';
import { ThemeService, DialogService, ProjectService, SelectionService, UndoService, LineParser, PositionTrackingService, ResultCacheService, BuildService, CompressService } from 'MarkdownCode/services';
import { ResultsView, Tab, ContextMenu } from 'MarkdownCode/components/body/results view';

const MenuItem = () => {
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');

  useEffect(() => {
    // Fetch services from gpt-service
    // Update services state
  }, []);

  useEffect(() => {
    // Listen to position-tracking service for changes
    // Update editor content
  }, []);

  const handleTabChange = (key) => {
    setActiveTab(key);
    // Fetch result from result-cache of the service
    // Update editor content
  };

  const handleEditorChange = (newValue) => {
    setEditorContent(newValue);
    // Store changes back in the result-cache of the service, marked as 'overwritten'
  };

  const handleContextMenuClick = ({ key }) => {
    setSelectedModel(key);
    // Ask the gpt-service to update the model-name for the name of the service related to the results-view
  };

  const handleRefreshClick = () => {
    // Update the result
  };

  return (
    <ResultsView>
      <Tabs onChange={handleTabChange} activeKey={activeTab}>
        {services.map(service => (
          <Tab key={service.name} tab={service.name}>
            <MonacoEditor
              value={editorContent}
              onChange={handleEditorChange}
              theme={ThemeService.getTheme()}
            />
            <Button onClick={() => setContextMenuVisible(true)}>More</Button>
            <ContextMenu visible={contextMenuVisible} onClick={handleContextMenuClick}>
              <Menu.Item key="modelForAll">Model for all</Menu.Item>
              <Menu.Item key="modelForFragment">Model for fragment</Menu.Item>
            </ContextMenu>
            <Button onClick={handleRefreshClick}>Refresh</Button>
          </Tab>
        ))}
      </Tabs>
    </ResultsView>
  );
};

export default MenuItem;
