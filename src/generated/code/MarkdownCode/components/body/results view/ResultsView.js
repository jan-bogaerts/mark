
import React, { useState, useEffect } from 'react';
import { Tabs, Button, Menu, Dropdown } from 'antd';
import MonacoEditor from 'react-monaco-editor';
import { ThemeService, DialogService, ProjectService, SelectionService, UndoService, LineParser, PositionTrackingService, ResultCacheService, BuildService, CompressService } from 'MarkdownCode/services';
import { Tab, ContextMenu, MenuItem } from 'MarkdownCode/components/body/results view';

const { TabPane } = Tabs;

const ResultsView = () => {
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [isOutdated, setIsOutdated] = useState(false);
  const [isOverwritten, setIsOverwritten] = useState(false);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');

  useEffect(() => {
    // Fetch services and models from gpt-service
    // This is a placeholder, replace with actual implementation
    setServices(['service1', 'service2']);
    setModels(['model1', 'model2']);
  }, []);

  const handleTabChange = (key) => {
    setActiveTab(key);
    // Fetch result from result-cache of the service
    // This is a placeholder, replace with actual implementation
    setEditorContent('result');
  };

  const handleEditorChange = (value) => {
    setEditorContent(value);
    // Store changes back in the result-cache of the service, marked as 'overwritten'
    // This is a placeholder, replace with actual implementation
  };

  const handleModelChange = (model) => {
    setSelectedModel(model);
    // Ask the gpt-service to update the model-name for the name of the service related to the results-view
    // This is a placeholder, replace with actual implementation
  };

  const handleRefresh = () => {
    // Update the result
    // This is a placeholder, replace with actual implementation
  };

  const menu = (
    <Menu>
      {models.map((model) => (
        <Menu.Item key={model} onClick={() => handleModelChange(model)}>
          {model === selectedModel ? <CheckOutlined /> : null}
          {model}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className="results-view">
      <Tabs onChange={handleTabChange} activeKey={activeTab}>
        {services.map((service) => (
          <TabPane tab={service} key={service}>
            <MonacoEditor
              value={editorContent}
              onChange={handleEditorChange}
              options={{
                readOnly: isOutdated,
                theme: isOverwritten ? 'vs-dark' : 'vs-light',
              }}
            />
            <div className="tab-actions">
              <Dropdown overlay={menu} trigger={['click']}>
                <Button>Model</Button>
              </Dropdown>
              <Button onClick={handleRefresh}>Refresh</Button>
            </div>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default ResultsView;
