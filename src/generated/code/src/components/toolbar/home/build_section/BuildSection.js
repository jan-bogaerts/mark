
import React, { useState, useEffect } from 'react';
import { Button, Divider } from 'antd';
import { BuildOutlined, CodeOutlined, PlayCircleOutlined, BugOutlined, RightOutlined } from '@ant-design/icons';
import buildService from '../../../services/build_service/BuildService';
import positionTrackingService from '../../../services/position-tracking_service/PositionTrackingService';
import projectService from '../../../services/project_service/ProjectService';
import dialogService from '../../../services/dialog_service/DialogService';
import themeService from '../../../services/Theme_service/ThemeService';

/**
 * BuildSection component
 */
function BuildSection() {
  const [disabledButtons, setDisabledButtons] = useState({
    all: true,
    code: true,
    active: true,
    debug: false,
    next: true,
  });

  useEffect(() => {
    initializeButtonStates();
    registerEventHandlers();
    return unregisterEventHandlers;
  }, []);

  const initializeButtonStates = () => {
    setDisabledButtons({
      all: !projectService.isAnyFragmentOutOfDate(),
      code: !positionTrackingService.activeFragment?.isOutOfDate,
      active: !(positionTrackingService.activeFragment && positionTrackingService.activeTransformer && !positionTrackingService.activeFragment.isOutOfDate || !positionTrackingService.activeTransformer.cache.isOutOfDate(positionTrackingService.activeFragment.key)),
      debug: false,
      next: !buildService.debug,
    });
  };

  const registerEventHandlers = () => {
    projectService.eventTarget.addEventListener('fragment-out-of-date', initializeButtonStates);
    positionTrackingService.eventTarget.addEventListener('change', initializeButtonStates);
  };

  const unregisterEventHandlers = () => {
    projectService.eventTarget.removeEventListener('fragment-out-of-date', initializeButtonStates);
    positionTrackingService.eventTarget.removeEventListener('change', initializeButtonStates);
  };

  const handleButtonClick = (action) => {
    switch (action) {
      case 'all':
        buildService.buildAll();
        break;
      case 'code':
        buildService.buildFragment(positionTrackingService.activeFragment);
        break;
      case 'active':
        buildService.runTransformer(positionTrackingService.activeFragment, positionTrackingService.activeTransformer);
        break;
      case 'debug':
        buildService.debug = !buildService.debug;
        break;
      case 'next':
        buildService.runNext();
        break;
      default:
        dialogService.showError('Invalid action');
    }
  };

  const theme = themeService.getCurrentTheme();

  return (
    <div className={`build-section ${theme}`}>
      <Button icon={<BuildOutlined />} disabled={disabledButtons.all} onClick={() => handleButtonClick('all')} />
      <Button icon={<CodeOutlined />} disabled={disabledButtons.code} onClick={() => handleButtonClick('code')} />
      <Button icon={<PlayCircleOutlined />} disabled={disabledButtons.active} onClick={() => handleButtonClick('active')} />
      <Divider />
      <Button icon={<BugOutlined />} disabled={disabledButtons.debug} onClick={() => handleButtonClick('debug')} />
      <Button icon={<RightOutlined />} disabled={disabledButtons.next} onClick={() => handleButtonClick('next')} />
    </div>
  );
}

export default BuildSection;
