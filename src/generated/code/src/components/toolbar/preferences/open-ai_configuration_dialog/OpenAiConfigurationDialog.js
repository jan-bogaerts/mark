
import React, { useState, useEffect } from 'react';
import { Modal, Input, Button } from 'antd';
import GptService from '../../../../services/gpt_service/GPTService';
import DialogService from '../../../../services/dialog_service/DialogService';
import ThemeService from '../../../../services/Theme_service/ThemeService';

/**
 * OpenAiConfigurationDialog component
 * @param {Object} props - Component properties
 * @param {boolean} props.visible - Visibility of the dialog
 * @param {Function} props.onClose - Function to call when the dialog is closed
 */
const OpenAiConfigurationDialog = ({ visible, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const theme = ThemeService.getCurrentTheme();

  useEffect(() => {
    if (visible) {
      setApiKey(GptService.apiKey);
    }
  }, [visible]);

  const handleOk = () => {
    try {
      GptService.setApiKey(apiKey);
      onClose();
    } catch (error) {    
      DialogService.showErrorDialog(error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      title="OpenAI Configuration"
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="ok" type="primary" onClick={handleOk}>
          OK
        </Button>,
      ]}
      className={`openai-configuration-dialog ${theme}`}
    >
      <p>Enter your OpenAI API key:</p>
      <Input
        value={apiKey}
        onChange={e => setApiKey(e.target.value)}
        className={`openai-configuration-input ${theme}`}
      />
    </Modal>
  );
};

export default OpenAiConfigurationDialog;
