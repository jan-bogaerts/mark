import React, { Component } from 'react';
import { Tooltip, Button, Divider } from 'antd';
import { BuildOutlined, CodeOutlined, PlayCircleOutlined, BugOutlined, StepForwardOutlined, FileTextOutlined } from '@ant-design/icons';
import { VscDebugLineByLine } from "react-icons/vsc";
import { TbPlayerStop } from "react-icons/tb";
import buildService from '../../../../services/build_service/BuildService';
import projectService from '../../../../services/project_service/ProjectService';
import positionTrackingService from '../../../../services/position-tracking_service/PositionTrackingService';
import CybertronService from '../../../../services/cybertron_service/CybertronService';
import logService from '../../../../services/log_service/LogService';
import dialogService from '../../../../services/dialog_service/DialogService';
import themeService from '../../../../services/Theme_service/ThemeService';

class BuildSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDisabled: true,
      transformerDisabled: true,
      showLog: logService.showLogWindow,
      showDebugger: buildService.showDebugger,
      debug: buildService.debug,
      nextDisabled: true,
      stopDisabled: true,
    };
  }

  componentDidMount() {
    this.updateButtonStates();
    projectService.eventTarget.addEventListener('fragment-out-of-date', this.updateButtonStates);
    positionTrackingService.eventTarget.addEventListener('change', this.updateButtonStates);
    buildService.eventTarget.addEventListener('is-building', this.updateButtonStates);
    buildService.eventTarget.addEventListener('is-pausing', this.updateButtonStates);
    buildService.eventTarget.addEventListener('has-resumed', this.updateButtonStates);
    buildService.eventTarget.addEventListener('show-debugger', this.updateButtonStates);
    logService.eventTarget.addEventListener('log-window-visibility', this.updateLogButtonState);
  }

  componentWillUnmount() {
    projectService.eventTarget.removeEventListener('fragment-out-of-date', this.updateButtonStates);
    positionTrackingService.eventTarget.removeEventListener('change', this.updateButtonStates);
    buildService.eventTarget.removeEventListener('is-building', this.updateButtonStates);
    buildService.eventTarget.removeEventListener('is-pausing', this.updateButtonStates);
    buildService.eventTarget.removeEventListener('has-resumed', this.updateButtonStates);
    buildService.eventTarget.removeEventListener('show-debugger', this.updateButtonStates);
    logService.eventTarget.removeEventListener('log-window-visibility', this.updateLogButtonState);
  }

  updateButtonStates = () => {
    const activeFragment = positionTrackingService.activeFragment;
    const activeTransformer = positionTrackingService.activeTransformer;
    const isBuilding = buildService.isBuilding;
    const debug = buildService.debug;
    const isPaused = buildService.isPaused;

    this.setState({
      allDisabled: !projectService.isAnyFragmentOutOfDate() || isBuilding || !activeTransformer,
      transformerDisabled: !activeFragment || !activeTransformer || activeTransformer.isFullRender || isBuilding,
      showLog: logService.showLogWindow,
      showDebugger: buildService.showDebugger,
      debug: debug,
      nextDisabled: !debug || !isBuilding || !isPaused,
      stopDisabled: !debug || !isBuilding || !isPaused,
    });
  }

  updateLogButtonState = () => {
    this.setState({
      showLog: logService.showLogWindow
    });
  }

  handleAllClick = () => {
    try {
      buildService.buildAll(positionTrackingService.activeTransformer);
    } catch (error) {
      dialogService.showErrorDialog(error.message);
    }
  }


  handleTransformerClick = () => {
    try {
      buildService.runTransformer(positionTrackingService.activeFragment, positionTrackingService.activeTransformer);
    } catch (error) {
      dialogService.showErrorDialog(error.message);
    }
  }

  handleShowLogClick = () => {
    logService.showLogWindow = !this.state.showLog;
    this.updateLogButtonState();
  }

  handleShowDebuggerClick = () => {
    buildService.showDebugger = !this.state.showDebugger;
    this.updateButtonStates();
  }

  handleDebugClick = () => {
    buildService.debug = !this.state.debug;
    this.updateButtonStates();
  }

  handleNextClick = () => {
    try {
      buildService.runNext();
    } catch (error) {
      dialogService.showErrorDialog(error.message);
    }
  }

  handleStopClick = () => {
    try {
      buildService.stopRun();
    } catch (error) {
      dialogService.showErrorDialog(error.message);
    }
  }

  render() {
    const theme = themeService.getCurrentTheme();
    return (
      <div className={`build-section ${theme}`}>
        <Tooltip title="Start rendering the currently active transformer for the entire project" placement='bottom'>
          <Button icon={<BuildOutlined />} onClick={this.handleAllClick} disabled={this.state.allDisabled} />
        </Tooltip>
        <Tooltip title="Start rendering the result for the currently active fragment and transformer" placement='bottom'>
          <Button icon={<PlayCircleOutlined />} onClick={this.handleTransformerClick} disabled={this.state.transformerDisabled} />
        </Tooltip>
        <Divider type="vertical" style={{ height: '24px' }} />
        <Tooltip title="Show log window" placement='bottom'>
          <Button icon={<FileTextOutlined />} onClick={this.handleShowLogClick} type={this.state.showLog ? 'primary' : 'default'} />
        </Tooltip>
        <Tooltip title="Toggle debugger window" placement='bottom'>
          <Button icon={<BugOutlined />} onClick={this.handleShowDebuggerClick} type={this.state.showDebugger ? 'primary' : 'default'} />
        </Tooltip>
        <Divider type="vertical" style={{ height: '24px' }} />
        <Tooltip title="Toggle debug mode" placement='bottom'>
          <Button icon={<VscDebugLineByLine />} onClick={this.handleDebugClick} type={this.state.debug ? 'primary' : 'default'} />
        </Tooltip>
        <Tooltip title="Continue rendering the next stop" placement='bottom'>
          <Button icon={<StepForwardOutlined />} onClick={this.handleNextClick} disabled={this.state.nextDisabled} />
        </Tooltip>
        <Tooltip title="Stop rendering" placement='bottom'>
          <Button icon={<TbPlayerStop />} onClick={this.handleStopClick} disabled={this.state.stopDisabled} />
        </Tooltip>
      </div>
    );
  }
}

export default BuildSection;