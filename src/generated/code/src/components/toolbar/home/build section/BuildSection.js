
import React, { Component } from 'react';
import { Button, Tooltip } from 'antd';
import { BuildOutlined, CodeOutlined, HighlightOutlined } from '@ant-design/icons';
import GptService from '../../../../services/gpt_service/GptService';
import BuildService from '../../../../services/build_service/BuildService';
import DialogService from '../../../../services/dialog_service/DialogService';
import ThemeService from '../../../../services/Theme_service/ThemeService';

/**
 * BuildSection component
 * Contains actions that the build-service can perform.
 */
class BuildSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: ThemeService.getCurrentTheme(),
    };
  }

  /**
   * Start rendering all the code for the entire project.
   */
  handleAllClick = () => {
    try {
      BuildService.buildAll();
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

  /**
   * Start rendering all the code files for the currently active fragment.
   */
  handleActiveTopicClick = () => {
    try {
      const activeFragment = GptService.getActiveFragment();
      BuildService.buildForActiveTopic(activeFragment);
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

  /**
   * Start rendering the selected fragment in the service related to the currently selected.
   */
  handleActivePromptClick = () => {
    try {
      const activeFragment = GptService.getActiveFragment();
      BuildService.buildForActivePrompt(activeFragment);
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

  render() {
    const { theme } = this.state;
    return (
      <div className={`build-section ${theme}`}>
        <Tooltip title="Build all">
          <Button
            className="build-all-button"
            icon={<BuildOutlined />}
            onClick={this.handleAllClick}
            disabled={!GptService.isAnyFragmentOutOfDate()}
          />
        </Tooltip>
        <Tooltip title="Build active topic">
          <Button
            className="build-active-topic-button"
            icon={<CodeOutlined />}
            onClick={this.handleActiveTopicClick}
            disabled={!GptService.isFragmentOutOfDate(GptService.getActiveFragment())}
          />
        </Tooltip>
        <Tooltip title="Build active prompt">
          <Button
            className="build-active-prompt-button"
            icon={<HighlightOutlined />}
            onClick={this.handleActivePromptClick}
            disabled={!GptService.isFragmentOutOfDate(GptService.getActiveFragment())}
          />
        </Tooltip>
      </div>
    );
  }
}

export default BuildSection;
