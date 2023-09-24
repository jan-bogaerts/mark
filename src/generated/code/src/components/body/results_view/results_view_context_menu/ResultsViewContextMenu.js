
import React, { useState, useEffect } from 'react';
import { Dropdown, Menu, Button } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import GptService from '../../../../services/gpt_service/GPTService';
import DialogService from '../../../../services/dialog_service/DialogService';
import ThemeService from '../../../../services/Theme_service/ThemeService';

/**
 * ResultsViewContextMenu component
 * @param {Object} props - properties for the component
 * @returns {JSX.Element} ResultsViewContextMenu component
 */
const ResultsViewContextMenu = ({ transformer, key }) => {
  const [models, setModels] = useState([]);
  const [defaultModel, setDefaultModel] = useState('');
  const [theme, setTheme] = useState('');

  useEffect(() => {
    fetchModels();
    fetchDefaultModel();
    fetchTheme();
  }, []);

  const fetchModels = async () => {
    try {
      const models = await GptService.getModels();
      setModels(models);
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

  const fetchDefaultModel = async () => {
    try {
      const defaultModel = await GptService.getDefaultModel();
      setDefaultModel(defaultModel);
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

  const fetchTheme = () => {
    const theme = ThemeService.getCurrentTheme();
    setTheme(theme);
  };

  const handleModelChange = async (model) => {
    try {
      await GptService.setDefaultModel(model);
      fetchDefaultModel();
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

  const menu = (
    <Menu>
      <Menu.SubMenu title="Model for all">
        {models.map((model) => (
          <Menu.Item
            key={model}
            onClick={() => handleModelChange(model)}
            className={model === defaultModel ? 'selected' : ''}
          >
            {model}
          </Menu.Item>
        ))}
      </Menu.SubMenu>
      <Menu.Divider />
      <Menu.Item key="refresh">Refresh</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button
        className={`more-button ${theme}`}
        style={{ float: 'right', right: '16px', top: '0px', position: 'absolute' }}
        icon={<MoreOutlined />}
      />
    </Dropdown>
  );
};

export default ResultsViewContextMenu;
