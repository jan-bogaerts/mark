
import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import GPTSection from 'MarkdownCode/components/toolbar/preferences/GPT section/GPTSection';
import KeyButton from 'MarkdownCode/components/toolbar/preferences/GPT section/KeyButton';
import DialogService from 'MarkdownCode/services/dialog service/DialogService';
import SelectionService from 'MarkdownCode/services/Selection service/SelectionService';
import GptService from 'MarkdownCode/services/gpt service/GptService';
import CompressService from 'MarkdownCode/services/compress service/CompressService';
import ThemeService from 'MarkdownCode/services/Theme service/ThemeService';

/**
 * ModelComboBox component
 * This component allows users to select the default model from a list provided by the GPT service.
 */
const ModelComboBox = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const themeService = new ThemeService();
  const dialogService = new DialogService();
  const gptService = new GptService();

  useEffect(() => {
    fetchModels();
  }, []);

  /**
   * Fetch models from GPT service
   */
  const fetchModels = async () => {
    try {
      const models = await gptService.getModels();
      setModels(models);
    } catch (error) {
      dialogService.showErrorDialog('Error fetching models', error.message);
    }
  };

  /**
   * Handle model selection
   * @param {string} model - Selected model
   */
  const handleModelSelect = (model) => {
    setSelectedModel(model);
  };

  return (
    <GPTSection>
      <Select
        className={`model-combo-box ${themeService.getCurrentTheme()}`}
        value={selectedModel}
        onChange={handleModelSelect}
      >
        {models.map((model) => (
          <Select.Option key={model} value={model}>
            {model}
          </Select.Option>
        ))}
      </Select>
      <KeyButton onClick={() => dialogService.showInfoDialog('Selected Model', selectedModel)} />
    </GPTSection>
  );
};

export default ModelComboBox;
