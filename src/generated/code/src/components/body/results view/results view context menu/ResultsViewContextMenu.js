
import React from 'react';
import { Dropdown, Menu, Button, Divider } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import gptservice from '../../../../services/gpt_service/GptService';
import dialogservice from '../../../../services/dialog_service/DialogService';

/**
 * ResultsViewContextMenu component
 * @param {Object} props - The properties for the component
 * @returns {JSX.Element} - The JSX Element
 */
const ResultsViewContextMenu = (props) => {
  const { transformer, key } = props;

  /**
   * Fetches the models from the GptService
   * @returns {Array} - The list of models
   */
  const fetchModels = () => {
    try {
      return gptservice.getModels();
    } catch (error) {
      dialogservice.showErrorDialog('Error fetching models', error);
      return [];
    }
  };

  /**
   * Handles the selection of a model
   * @param {string} modelName - The name of the model
   * @param {boolean} forFragment - Whether the model is for a fragment
   */
  const handleModelSelect = (modelName, forFragment = false) => {
    try {
      if (forFragment) {
        gptservice.setDefaultModel(transformer, key, modelName);
      } else {
        gptservice.setDefaultModel(transformer, modelName);
      }
    } catch (error) {
      dialogservice.showErrorDialog('Error setting default model', error);
    }
  };

  /**
   * Handles the refresh action
   */
  const handleRefresh = () => {
    try {
      transformer.recalculate();
    } catch (error) {
      dialogservice.showErrorDialog('Error refreshing results', error);
    }
  };

  const models = fetchModels();
  const defaultModel = gptservice.getDefaultModel(transformer, key);

  const menu = (
    <Menu>
      <Menu.SubMenu title="Model for all">
        {models.map((model) => (
          <Menu.Item
            key={model}
            onClick={() => handleModelSelect(model)}
            className={model === defaultModel ? 'selected' : ''}
          >
            {model}
          </Menu.Item>
        ))}
      </Menu.SubMenu>
      <Menu.SubMenu title="Model for fragment">
        {models.map((model) => (
          <Menu.Item
            key={model}
            onClick={() => handleModelSelect(model, true)}
            className={model === defaultModel ? 'selected' : ''}
          >
            {model}
          </Menu.Item>
        ))}
      </Menu.SubMenu>
      <Divider />
      <Menu.Item onClick={handleRefresh}>Refresh</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']} placement="topRight">
      <Button icon={<MoreOutlined />} style={{ margin: '16px' }} />
    </Dropdown>
  );
};

export default ResultsViewContextMenu;
