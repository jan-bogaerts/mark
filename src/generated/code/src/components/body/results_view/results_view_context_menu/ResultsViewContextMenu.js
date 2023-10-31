import React, { useState, useEffect } from 'react';
import { Dropdown, Menu, Button, Divider } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import gptService from '../../../../services/gpt_service/GPTService';
import ThemeService from '../../../../services/Theme_service/ThemeService';
import DialogService from '../../../../services/dialog_service/DialogService';
import ProjectService from '../../../../services/project_service/ProjectService';

/**
 * ResultsViewContextMenu component
 * @param {Object} props - properties for the component
 * @param {string} props.transformer - transformer name
 * @param {string} props.key - key name
 */
const ResultsViewContextMenu = ({ transformer, key }) => {
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState(null);
  const [currentFragmentModel, setCurrentFragmentModel] = useState(null);
  const theme = ThemeService.getCurrentTheme();

  useEffect(() => {
    fetchModels();
    ProjectService.eventTarget.addEventListener('content-changed', fetchModels);
    return () => {
      ProjectService.eventTarget.removeEventListener('content-changed', fetchModels);
    };
  }, []);

  const fetchModels = async () => {
    try {
      const models = await gptService.getModels();
      setModels(models);
      const model = gptService.getModelForTransformer(transformer);
      setCurrentModel(model);
      const fragmentModel = gptService.getModelForFragment(transformer, key);
      setCurrentFragmentModel(fragmentModel);
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

  const handleModelChange = async (model, forFragment = false) => {
    try {
      if (forFragment) {
        await gptService.setModelForFragment(model, transformer, key);
        setCurrentFragmentModel(model);
      } else {
        await gptService.setModelForTransformer(model, transformer);
        setCurrentModel(model);
      }
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
            className={model === currentModel ? `selected-${theme}` : ''}
          >
            {model}
          </Menu.Item>
        ))}
      </Menu.SubMenu>
      <Menu.SubMenu title="Model for fragment">
        {models.map((model) => (
          <Menu.Item
            key={model}
            onClick={() => handleModelChange(model, true)}
            className={model === currentFragmentModel ? `selected-${theme}` : ''}
          >
            {model}
          </Menu.Item>
        ))}
      </Menu.SubMenu>
      <Menu.Divider />
      <Menu.Item onClick={() => transformer.refresh()}>
        Refresh
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button
        icon={<MoreOutlined />}
        style={{ position: 'absolute', top: 0, right: 16 }}
        className={`more-button-${theme}`}
      />
    </Dropdown>
  );
};

export default ResultsViewContextMenu;