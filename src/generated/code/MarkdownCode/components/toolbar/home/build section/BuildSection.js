
import React, { useEffect, useState } from 'react';
import { Button, Tooltip } from 'antd';
import { BuildOutlined, CodeOutlined, FileOutlined } from '@ant-design/icons';
import ProjectService from 'MarkdownCode/services/project service/ProjectService';
import GptService from 'MarkdownCode/services/gpt service/GptService';
import BuildService from 'MarkdownCode/services/build service/BuildService';
import ThemeService from 'MarkdownCode/services/Theme service/ThemeService';
import DialogService from 'MarkdownCode/services/dialog service/DialogService';

/**
 * BuildSection component
 * Contains actions that the build-service can perform.
 */
const BuildSection = () => {
  const [theme, setTheme] = useState(ThemeService.getCurrentTheme());
  const [isAllEnabled, setIsAllEnabled] = useState(false);
  const [isCodeForActiveTopicEnabled, setIsCodeForActiveTopicEnabled] = useState(false);
  const [isActiveTopicInActivePromptEnabled, setIsActiveTopicInActivePromptEnabled] = useState(false);

  useEffect(() => {
    checkAllButtonStatus();
    checkCodeForActiveTopicButtonStatus();
    checkActiveTopicInActivePromptButtonStatus();
  }, []);

  const checkAllButtonStatus = () => {
    const isOutOfDate = GptService.getList().some(service => service.resultCache.isOutOfDate());
    setIsAllEnabled(isOutOfDate);
  };

  const checkCodeForActiveTopicButtonStatus = () => {
    const activeFragment = ProjectService.getActiveFragment();
    const isOutOfDate = GptService.getList().some(service => service.resultCache.isOutOfDateFor(activeFragment));
    setIsCodeForActiveTopicEnabled(isOutOfDate);
  };

  const checkActiveTopicInActivePromptButtonStatus = () => {
    const activeFragment = ProjectService.getActiveFragment();
    const activeService = GptService.getActiveService();
    const isOutOfDate = activeService.resultCache.isOutOfDateFor(activeFragment);
    setIsActiveTopicInActivePromptEnabled(isOutOfDate);
  };

  const handleAllClick = () => {
    try {
      BuildService.buildAll();
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

  const handleCodeForActiveTopicClick = () => {
    try {
      const activeFragment = ProjectService.getActiveFragment();
      BuildService.buildFor(activeFragment);
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

  const handleActiveTopicInActivePromptClick = () => {
    try {
      const activeFragment = ProjectService.getActiveFragment();
      const activeService = GptService.getActiveService();
      BuildService.buildFor(activeFragment, activeService);
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

  return (
    <div className={`build-section ${theme}`}>
      <Tooltip title="Build all">
        <Button icon={<BuildOutlined />} onClick={handleAllClick} disabled={!isAllEnabled} />
      </Tooltip>
      <Tooltip title="Build code for active topic">
        <Button icon={<CodeOutlined />} onClick={handleCodeForActiveTopicClick} disabled={!isCodeForActiveTopicEnabled} />
      </Tooltip>
      <Tooltip title="Build active topic in active prompt">
        <Button icon={<FileOutlined />} onClick={handleActiveTopicInActivePromptClick} disabled={!isActiveTopicInActivePromptEnabled} />
      </Tooltip>
    </div>
  );
};

export default BuildSection;
