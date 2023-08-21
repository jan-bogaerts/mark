
import React, { useState, useEffect } from 'react';
import { Modal, Input, Button } from 'antd';
import GptService from '../../../services/gpt-service/GptService';
import DialogService from '../../../services/dialog-service/DialogService';
import ThemeService from '../../../services/theme-service/ThemeService';

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
      GptService.getApiKey().then(setApiKey).catch(DialogService.showErrorDialog);
    }
  }, [visible]);

  const handleOk = () => {
    GptService.setApiKey(apiKey).then(onClose).catch(DialogService.showErrorDialog);
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
