
import React, { Component } from 'react';
import { Button, Tooltip } from 'antd';
import { BuildOutlined, CodeOutlined, FileOutlined } from '@ant-design/icons';
import ProjectService from '../../../services/project-service/ProjectService';
import GptService from '../../../services/gpt-service/GptService';
import BuildService from '../../../services/build-service/BuildService';
import DialogService from '../../../services/dialog-service/DialogService';
import ThemeService from '../../../services/theme-service/ThemeService';

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
   * Check if any service in the GPT-service's list has an out-of-date result fragment or missing result fragments.
   * @returns {boolean}
   */
  isAnyServiceOutOfDate() {
    return GptService.services.some(service => service.resultCache.isOutOfDate());
  }

  /**
   * Check if the selected fragment is out-of-date or missing in any of the result-caches of any of the services in the GPT-service's list.
   * @returns {boolean}
   */
  isSelectedFragmentOutOfDate() {
    const selectedFragment = ProjectService.getActiveFragment();
    return GptService.services.some(service => service.resultCache.isFragmentOutOfDate(selectedFragment));
  }

  /**
   * Check if the selected fragment is out-of-date or missing in the service related to the currently selected.
   * @returns {boolean}
   */
  isSelectedFragmentOutOfDateInActiveService() {
    const selectedFragment = ProjectService.getActiveFragment();
    const activeService = GptService.getActiveService();
    return activeService.resultCache.isFragmentOutOfDate(selectedFragment);
  }

  render() {
    const { theme } = this.state;
    return (
      <div className={`build-section ${theme}`}>
        <Tooltip title="Build all">
          <Button
            icon={<BuildOutlined />}
            disabled={!this.isAnyServiceOutOfDate()}
            onClick={() => BuildService.buildAll()}
          />
        </Tooltip>
        <Tooltip title="Build code for active topic">
          <Button
            icon={<CodeOutlined />}
            disabled={!this.isSelectedFragmentOutOfDate()}
            onClick={() => BuildService.buildActiveFragment()}
          />
        </Tooltip>
        <Tooltip title="Build active topic in active prompt">
          <Button
            icon={<FileOutlined />}
            disabled={!this.isSelectedFragmentOutOfDateInActiveService()}
            onClick={() => BuildService.buildActiveFragmentInActiveService()}
          />
        </Tooltip>
      </div>
    );
  }
}

export default BuildSection;
