
import React, { useState } from 'react';
import { Button, Tooltip } from 'antd';
import { KeyOutlined, DatabaseOutlined } from '@ant-design/icons';
import GptService from '../../../../services/gpt-service/GptService';
import ThemeService from '../../../../services/theme-service/ThemeService';
import OpenAiConfigurationDialog from '../open-ai-configuration-dialog/OpenAiConfigurationDialog';
import ModelComboBox from '../ModelComboBox';

/**
 * GPTSection component.
 * This component handles GPT service configuration actions.
 */
const GPTSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = ThemeService.getCurrentTheme();

  /**
   * Handle click event for the key button.
   * This function opens the 'open-ai configuration dialog'.
   */
  const handleKeyClick = () => {
    setIsOpen(true);
  };

  /**
   * Handle close event for the 'open-ai configuration dialog'.
   * This function closes the 'open-ai configuration dialog'.
   */
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className={`gpt-section ${theme}`}>
      <Tooltip title="Open AI Configuration">
        <Button
          className="gpt-section-button"
          icon={<KeyOutlined />}
          onClick={handleKeyClick}
        />
      </Tooltip>
      <ModelComboBox className="gpt-section-combobox" />
      <OpenAiConfigurationDialog
        visible={isOpen}
        onClose={handleClose}
      />
    </div>
  );
};

export default GPTSection;
