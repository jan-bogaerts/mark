
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
 * Contains actions related to the configuration of the GPT service.
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
      dialogService.showErrorDialog(error);
    }
  };

  /**
   * Handle model selection
   * @param {string} model - Selected model
   */
  const handleModelSelect = (model) => {
    setSelectedModel(model);
    gptService.setDefaultModel(model);
  };

  return (
    <div className={`model-combo-box ${themeService.getTheme()}`}>
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
