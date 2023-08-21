
import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import GptService from '../../../../services/gpt-service/GptService';
import DialogService from '../../../../services/dialog-service/DialogService';
import ThemeService from '../../../../services/theme-service/ThemeService';
import OpenAIConfigurationDialog from '../../../open-ai-configuration-dialog/OpenAiConfigurationDialog';

/**
 * ModelComboBox component allows user to select default model for open-ai requests.
 * @component
 */
const ModelComboBox = () => {
  const [models, setModels] = useState([]);
  const [defaultModel, setDefaultModel] = useState('');

  useEffect(() => {
    fetchModels();
    fetchDefaultModel();
  }, []);

  /**
   * Fetch available models from gpt-service.
   */
  const fetchModels = async () => {
    try {
      const models = await GptService.getModels();
      setModels(models);
    } catch (error) {
      DialogService.showErrorDialog('Failed to fetch models', error);
    }
  };

  /**
   * Fetch default model from gpt-service.
   */
  const fetchDefaultModel = async () => {
    try {
      const model = await GptService.getDefaultModel();
      setDefaultModel(model);
    } catch (error) {
      DialogService.showErrorDialog('Failed to fetch default model', error);
    }
  };

  /**
   * Handle model change event.
   * @param {string} model - Selected model.
   */
  const handleModelChange = async (model) => {
    try {
      await GptService.setDefaultModel(model);
      setDefaultModel(model);
    } catch (error) {
      DialogService.showErrorDialog('Failed to set default model', error);
    }
  };

  const theme = ThemeService.getCurrentTheme();

  return (
    <Select
      className={`model-combo-box ${theme}`}
      value={defaultModel}
      onChange={handleModelChange}
    >
      {models.map((model) => (
        <Select.Option key={model} value={model}>
          {model}
        </Select.Option>
      ))}
    </Select>
  );
};

export default ModelComboBox;
