
import React, { useState } from 'react';
import { Button, Space } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import ThemeService from '../../../../services/ThemeService/ThemeService';
import OpenAIConfigurationDialog from '../open-ai-configuration-dialog/OpenAiConfigurationDialog';
import ModelComboBox from './ModelComboBox';

/**
 * GPTSection component.
 * This component handles GPT service configuration actions.
 */
const GPTSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = ThemeService.getCurrentTheme();

  /**
   * Handle key button click.
   * This function opens the 'open-ai configuration dialog'.
   */
  const handleKeyButtonClick = () => {
    setIsOpen(true);
  };

  /**
   * Handle dialog close.
   * This function tracks the open state of the 'open-ai configuration dialog'.
   */
  const handleDialogClose = () => {
    setIsOpen(false);
  };

  return (
    <Space className={`gpt-section ${theme}`}>
      <Button
        className="key-button"
        icon={<KeyOutlined />}
        onClick={handleKeyButtonClick}
      />
      <ModelComboBox className="model-combo-box" />
      <OpenAIConfigurationDialog
        visible={isOpen}
        onClose={handleDialogClose}
      />
    </Space>
  );
};

export default GPTSection;
