
import React, { useState } from 'react';
import { Button, Input } from 'antd';
import GPTSection from 'MarkdownCode/components/toolbar/preferences/GPT section/GPTSection';
import DialogService from 'MarkdownCode/services/dialog service/DialogService';
import SelectionService from 'MarkdownCode/services/Selection service/SelectionService';
import GptService from 'MarkdownCode/services/gpt service/GptService';
import CompressService from 'MarkdownCode/services/compress service/CompressService';
import ThemeService from 'MarkdownCode/services/Theme service/ThemeService';
import ModelComboBox from 'MarkdownCode/components/toolbar/preferences/GPT section/ModelComboBox';

/**
 * KeyButton component
 * This component allows users to enter an API key and select a default model from a list provided by the GPT service.
 */
const KeyButton = () => {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  const theme = ThemeService.getCurrentTheme();

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const handleModelChange = (value) => {
    setSelectedModel(value);
  };

  const handleSave = () => {
    try {
      GptService.setApiKey(apiKey);
      SelectionService.setDefaultModel(selectedModel);
    } catch (error) {
      DialogService.showErrorDialog('Error saving API key and model', error.message);
    }
  };

  return (
    <GPTSection>
      <Input
        className={`key-input ${theme}`}
        value={apiKey}
        onChange={handleApiKeyChange}
        placeholder="Enter API key"
      />
      <ModelComboBox
        className={`model-combo-box ${theme}`}
        value={selectedModel}
        onChange={handleModelChange}
      />
      <Button
        className={`save-button ${theme}`}
        onClick={handleSave}
      >
        Save
      </Button>
    </GPTSection>
  );
};

export default KeyButton;
