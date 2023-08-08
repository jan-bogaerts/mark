
import React, { useEffect, useState } from 'react';
import { Button, Input } from 'antd';
import { KeyOutlined, SelectOutlined } from '@ant-design/icons';
import ModelComboBox from 'MarkdownCode/components/toolbar/preferences/GPT section/ModelComboBox';
import DialogService from 'MarkdownCode/services/dialog service/DialogService';
import SelectionService from 'MarkdownCode/services/Selection service/SelectionService';
import GptService from 'MarkdownCode/services/gpt service/GptService';
import ThemeService from 'MarkdownCode/services/Theme service/ThemeService';

/**
 * KeyButton component
 * Contains actions related to the configuration of the GPT service.
 */
const KeyButton = () => {
  const [apiKey, setApiKey] = useState('');
  const [theme, setTheme] = useState(ThemeService.getCurrentTheme());

  useEffect(() => {
    ThemeService.subscribe(setTheme);
    return () => ThemeService.unsubscribe(setTheme);
  }, []);

  const handleKeyClick = async () => {
    try {
      const key = await DialogService.showDialog({
        type: 'input',
        title: 'Enter API Key',
        message: 'Please enter your OpenAI API Key',
        inputAttrs: { type: 'password' }
      });
      if (key) {
        setApiKey(key);
        GptService.setApiKey(key);
      }
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

  return (
    <div className={`key-button ${theme}`}>
      <Button icon={<KeyOutlined />} onClick={handleKeyClick} />
      <ModelComboBox />
    </div>
  );
};

export default KeyButton;
