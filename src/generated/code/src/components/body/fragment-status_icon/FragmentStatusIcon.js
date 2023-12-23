import React, { useReducer, useEffect } from 'react';
import { Tooltip, Spin } from 'antd';
import { LuHeading1, LuHeading2, LuHeading3, LuHeading4, LuHeading5, LuHeading6 } from 'react-icons/lu';
import ProjectService from '../../../services/project_service/ProjectService';
import BuildService from '../../../services/build_service/BuildService';
import ThemeService from '../../../services/Theme_service/ThemeService';

const FragmentStatusIcon = ({ fragment }) => {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  useEffect(() => {
    const updateState = () => {
      forceUpdate();
    };

    const handleOutOfDate = (e) => {
      if (e.detail === fragment?.key) {
        updateState();
      }
    };

    const handleTitleChanged = (e) => {
      if (e.detail?.key === fragment?.key) {
        updateState();
      }
    };

    const handleBuilding = (e) => {
      if (e.detail?.fragment?.key === fragment?.key) {
        updateState();
      }
    };

    const handleUpToDate = (e) => {
      if (e.detail === fragment?.key) {
        updateState();
      }
    };

    const handleIsBuilding = (e) => {
      if (!e.detail.isBuilding) {
        updateState();
      }
    };

    ProjectService.eventTarget.addEventListener('fragment-out-of-date', handleOutOfDate);
    ProjectService.eventTarget.addEventListener('title-changed', handleTitleChanged);
    ProjectService.eventTarget.addEventListener('fragment-building', handleBuilding);
    ProjectService.eventTarget.addEventListener('fragment-up-to-date', handleUpToDate);
    BuildService.eventTarget.addEventListener('is-building', handleIsBuilding);

    return () => {
      ProjectService.eventTarget.removeEventListener('fragment-out-of-date', handleOutOfDate);
      ProjectService.eventTarget.removeEventListener('title-changed', handleTitleChanged);
      ProjectService.eventTarget.removeEventListener('fragment-building', handleBuilding);
      ProjectService.eventTarget.removeEventListener('fragment-up-to-date', handleUpToDate);
      BuildService.eventTarget.removeEventListener('is-building', handleIsBuilding);
    };
  }, [fragment]);

  const getIconColorAndTooltip = () => {
    let color, tooltip;
    if (!fragment?.isOutOfDate) {
      color = 'green';
      tooltip = 'Up to date';
    } else if (fragment?.isOutOfDate && fragment?.outOfDateTransformers?.length > 0) {
      color = 'orange';
      tooltip = 'Out of date for: ' + fragment.outOfDateTransformers.map(t => t.name).join(', ');
    } else {
      color = 'red';
      tooltip = 'Out of date for all transformers';
    }
    return { color, tooltip };
  };

  const { color, tooltip } = getIconColorAndTooltip();
  const theme = ThemeService.getCurrentTheme();
  const isBuilding = fragment?.isBuilding && BuildService.isBuilding;

  let Icon;
  switch (fragment?.depth) {
    case 1: Icon = LuHeading1; break;
    case 2: Icon = LuHeading2; break;
    case 3: Icon = LuHeading3; break;
    case 4: Icon = LuHeading4; break;
    case 5: Icon = LuHeading5; break;
    default: Icon = LuHeading6;
  }

  return (
    <Tooltip title={tooltip}>
      {isBuilding ? <Spin /> : <Icon style={{ color }} className={theme} />}
    </Tooltip>
  );
};

export default FragmentStatusIcon;