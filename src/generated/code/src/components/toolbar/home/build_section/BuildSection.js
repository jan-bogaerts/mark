
import React, { useState, useEffect } from 'react';
import { Button, Divider } from 'antd';
import { BuildOutlined, CodeOutlined, SyncOutlined, BugOutlined, StepForwardOutlined } from '@ant-design/icons';
import buildService from '../../../services/build_service/BuildService';
import projectService from '../../../services/project_service/ProjectService';
import positionTrackingService from '../../../services/position-tracking_service/PositionTrackingService';
import dialogService from '../../../services/dialog_service/DialogService';
import themeService from '../../../services/Theme_service/ThemeService';

/**
 * BuildSection component
 * Contains actions that the build-service can perform.
 */
const BuildSection = () => {
  const [debug, setDebug] = useState(buildService.debug);

  useEffect(() => {
    const theme = themeService.getCurrentTheme();
    document.body.className = theme;
  }, []);

  const handleAllClick = () => {
    if (projectService.isAnyFragmentOutOfDate()) {
      buildService.buildAll();
    } else {
      dialogService.showError('All fragments are up to date.');
    }
  };

  const handleActiveFragmentClick = () => {
    if (positionTrackingService.activeFragment.isOutOfDate) {
      buildService.buildFragment(positionTrackingService.activeFragment);
    } else {
      dialogService.showError('Active fragment is up to date.');
    }
  };

  const handleActiveFragmentWithTransformerClick = () => {
    if (positionTrackingService.activeFragment && positionTrackingService.activeTransformer && 
        (!positionTrackingService.activeFragment.isOutOfDate || 
        !positionTrackingService.activeTransformer.cache.isOutOfDate(positionTrackingService.activeFragment.key))) {
      buildService.runTransformer(positionTrackingService.activeFragment, positionTrackingService.activeTransformer);
    } else {
      dialogService.showError('Active fragment or transformer is up to date.');
    }
  };

  const handleDebugClick = () => {
    buildService.toggleDebug();
    setDebug(!debug);
  };

  const handleRunNextClick = () => {
    if (debug) {
      buildService.runNext();
    } else {
      dialogService.showError('Debug mode is not enabled.');
    }
  };

  return (
    <div className="build-section">
      <Button icon={<BuildOutlined />} onClick={handleAllClick} disabled={!projectService.isAnyFragmentOutOfDate()} />
      <Button icon={<CodeOutlined />} onClick={handleActiveFragmentClick} disabled={!positionTrackingService.activeFragment.isOutOfDate} />
      <Button icon={<SyncOutlined />} onClick={handleActiveFragmentWithTransformerClick} disabled={!positionTrackingService.activeFragment || !positionTrackingService.activeTransformer || positionTrackingService.activeFragment.isOutOfDate || positionTrackingService.activeTransformer.cache.isOutOfDate(positionTrackingService.activeFragment.key)} />
      <Divider />
      <Button icon={<BugOutlined />} onClick={handleDebugClick} type={debug ? "primary" : "default"} />
      <Button icon={<StepForwardOutlined />} onClick={handleRunNextClick} disabled={!debug} />
    </div>
  );
};

export default BuildSection;
