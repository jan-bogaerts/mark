import React, { Component } from 'react';
import { Tooltip, Spin } from 'antd';
import { FaPause } from 'react-icons/fa';
import { LuType, LuArrowDownToDot } from 'react-icons/lu';
import { MdAutoFixNormal } from 'react-icons/md';
import ProjectService from '../../../../services/project_service/ProjectService';
import PositionTrackingService from '../../../../services/position-tracking_service/PositionTrackingService';
import ThemeService from '../../../../services/Theme_service/ThemeService';
import BuildStackService from '../../../../services/build-stack_service/BuildStackService';
import BuildService from '../../../../services/build_service/BuildService';

/**
 * TransformerStatusIcon component
 */
class TransformerStatusIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
    };
  }

  componentDidMount() {
    PositionTrackingService.eventTarget.addEventListener('change', this.refreshStatus);
    ProjectService.eventTarget.addEventListener('fragment-out-of-date', this.refreshStatus);
    ProjectService.eventTarget.addEventListener('fragment-building', this.refreshStatus);
    ProjectService.eventTarget.addEventListener('fragment-up-to-date', this.refreshStatus);
    BuildService.eventTarget.addEventListener('is-pausing', this.refreshStatus);
    BuildService.eventTarget.addEventListener('has-resumed', this.refreshStatus);
  }

  componentWillUnmount() {
    PositionTrackingService.eventTarget.removeEventListener('change', this.refreshStatus);
    ProjectService.eventTarget.removeEventListener('fragment-out-of-date', this.refreshStatus);
    ProjectService.eventTarget.removeEventListener('fragment-building', this.refreshStatus);
    ProjectService.eventTarget.removeEventListener('fragment-up-to-date', this.refreshStatus);
    BuildService.eventTarget.removeEventListener('is-pausing', this.refreshStatus);
    BuildService.eventTarget.removeEventListener('has-resumed', this.refreshStatus);
  }

  refreshStatus = () => {
    const activeFragmentKey = PositionTrackingService.activeFragment?.key;
    const isRunning = BuildStackService.isRunning(this.props.transformer, PositionTrackingService.activeFragment);
    const isPaused = BuildService.isPaused;

    if (!activeFragmentKey) {
      this.setState({ status: 'notYetRendered' });
      return;
    }
    if (isRunning && !isPaused) {
      this.setState({ status: 'building' });
    } else if (isRunning && isPaused) {
      this.setState({ status: 'paused' });
    } else if (this.props.transformer.cache.isOverwritten(activeFragmentKey)) {
      this.setState({ status: 'overwritten' });
    } else if (!this.props.transformer.cache.getFragmentResults(activeFragmentKey)) {
      this.setState({ status: 'notYetRendered' });
    } else {
      this.setState({ status: 'rendered' });
    }
  }

  render() {
    const theme = ThemeService.getCurrentTheme();
    let icon, color;
    switch (this.state.status) {
      case 'building':
        icon = <Spin />;
        break;
      case 'paused':
        icon = <FaPause style={{ color: 'grey' }} />;
        break;
      case 'overwritten':
        color = this.props.transformer.cache.isOutOfDate(PositionTrackingService.activeFragment?.key) ? 'red' : undefined;
        icon = <LuType style={{ color }} />;
        break;
      case 'rendered':
        color = this.props.transformer.cache.isOutOfDate(PositionTrackingService.activeFragment?.key) ? 'red' : undefined;
        icon = <MdAutoFixNormal style={{ color }} />;
        break;
      case 'notYetRendered':
        icon = <LuArrowDownToDot style={{ color: 'orange' }} />;
        break;
      default:
        icon = null;
    }

    let tooltip = this.state.status;
    if (color === 'red') {
      tooltip += ' (out of date)';
    }
    return (
      <Tooltip title={tooltip}>
        <div className={`transformer-status-icon ${theme}`}>
          {icon}
        </div>
      </Tooltip>
    );
  }
}

export default TransformerStatusIcon;