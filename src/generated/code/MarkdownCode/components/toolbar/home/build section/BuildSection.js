
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

  // Update theme when it changes
  useEffect(() => {
    const unsubscribe = ThemeService.subscribe(setTheme);
    return () => unsubscribe();
  }, []);

  // Check if buttons should be enabled
  useEffect(() => {
    const checkButtonStatus = async () => {
      try {
        const isAnyOutOfDate = await GptService.isAnyResultOutOfDate();
        setIsAllEnabled(isAnyOutOfDate);
        const isActiveFragmentOutOfDate = await GptService.isResultOutOfDate(ProjectService.getActiveFragment());
        setIsCodeForActiveTopicEnabled(isActiveFragmentOutOfDate);
        const isActiveFragmentInActiveServiceOutOfDate = await GptService.isResultOutOfDate(ProjectService.getActiveFragment(), ProjectService.getActiveService());
        setIsActiveTopicInActivePromptEnabled(isActiveFragmentInActiveServiceOutOfDate);
      } catch (error) {
        DialogService.showErrorDialog('Error checking button status', error);
      }
    };
    checkButtonStatus();
  }, []);

  // Button click handlers
  const handleAllClick = () => {
    try {
      BuildService.buildAll();
    } catch (error) {
      DialogService.showErrorDialog('Error building all', error);
    }
  };

  const handleCodeForActiveTopicClick = () => {
    try {
      BuildService.buildForActiveFragment();
    } catch (error) {
      DialogService.showErrorDialog('Error building for active fragment', error);
    }
  };

  const handleActiveTopicInActivePromptClick = () => {
    try {
      BuildService.buildForActiveFragmentInActiveService();
    } catch (error) {
      DialogService.showErrorDialog('Error building for active fragment in active service', error);
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
