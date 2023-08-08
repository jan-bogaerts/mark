
import React, { useEffect, useState } from 'react';
import { Select, Button } from 'antd';
import { KeyButton } from 'MarkdownCode/components/toolbar/preferences/GPT section/KeyButton';
import { DialogService } from 'MarkdownCode/services/dialog service/DialogService';
import { SelectionService } from 'MarkdownCode/services/Selection service/SelectionService';
import { GptService } from 'MarkdownCode/services/gpt service/GptService';
import { CompressService } from 'MarkdownCode/services/compress service/CompressService';
import { ThemeService } from 'MarkdownCode/services/Theme service/ThemeService';

/**
 * ModelComboBox component
 * This component is responsible for selecting the default model for open-ai requests.
 */
const ModelComboBox = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const theme = ThemeService.getCurrentTheme();

  useEffect(() => {
    fetchModels();
  }, []);

  /**
   * Fetch models from the GptService
   */
  const fetchModels = async () => {
    try {
      const models = await GptService.getModels();
      setModels(models);
    } catch (error) {
      DialogService.showErrorDialog('Error fetching models', error);
    }
  };

  /**
   * Handle model selection
   * @param {string} model - The selected model
   */
  const handleModelSelect = (model) => {
    try {
      setSelectedModel(model);
      SelectionService.setSelectedModel(model);
    } catch (error) {
      DialogService.showErrorDialog('Error selecting model', error);
    }
  };

  return (
    <div className={`model-combo-box ${theme}`}>
      <KeyButton />
      <Select
        value={selectedModel}
        onChange={handleModelSelect}
        className="model-select"
      >
        {models.map((model) => (
          <Select.Option key={model} value={model}>
            {model}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default ModelComboBox;
