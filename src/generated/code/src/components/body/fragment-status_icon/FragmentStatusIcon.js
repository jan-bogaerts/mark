import React, { useState, useEffect } from 'react';
import { Tooltip, Spin } from 'antd';
import { LuHeading1, LuHeading2, LuHeading3, LuHeading4, LuHeading5, LuHeading6 } from 'react-icons/lu';
import ProjectService from '../../../services/project_service/ProjectService';
import ThemeService from '../../../services/Theme_service/ThemeService';

const FragmentStatusIcon = (props) => {
  const [state, setState] = useState({
    depth: props.fragment?.depth,
    showSpinner: false,
    color: null,
    tooltip: null
  });

  useEffect(() => {
    const handleOutOfDate = (e) => {
      if (e.detail === props.fragment?.key) {
        updateColorAndTooltip();
      }
    }

    const handleTitleChanged = (e) => {
      if (e.detail?.key === props.fragment?.key) {
        updateIcon();
      }
    }

    const handleBuilding = (e) => {
      if (e.detail?.fragment?.key === props.fragment?.key) {
        setState(prevState => ({ ...prevState, showSpinner: true }));
      }
    }

    const handleUpToDate = (e) => {
      if (e.detail === props.fragment?.key) {
        updateIcon();
        updateColorAndTooltip();
      }
    }

    const updateIcon = () => {
      const depth = props.fragment?.depth;
      setState(prevState => ({ ...prevState, depth, showSpinner: false }));
    }

    const updateColorAndTooltip = () => {
      const fragment = props.fragment;
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
      setState(prevState => ({ ...prevState, color, tooltip }));
    }

    ProjectService.eventTarget.addEventListener('fragment-out-of-date', handleOutOfDate);
    ProjectService.eventTarget.addEventListener('title-changed', handleTitleChanged);
    ProjectService.eventTarget.addEventListener('fragment-building', handleBuilding);
    ProjectService.eventTarget.addEventListener('fragment-up-to-date', handleUpToDate);

    updateColorAndTooltip();

    return () => {
      ProjectService.eventTarget.removeEventListener('fragment-out-of-date', handleOutOfDate);
      ProjectService.eventTarget.removeEventListener('title-changed', handleTitleChanged);
      ProjectService.eventTarget.removeEventListener('fragment-building', handleBuilding);
      ProjectService.eventTarget.removeEventListener('fragment-up-to-date', handleUpToDate);
    }
  }, [props.fragment]);

  const {depth, showSpinner, color, tooltip } = state;
  let Icon;
  switch (depth) {
    case 1: Icon = LuHeading1; break;
    case 2: Icon = LuHeading2; break;
    case 3: Icon = LuHeading3; break;
    case 4: Icon = LuHeading4; break;
    case 5: Icon = LuHeading5; break;
    default: Icon = LuHeading6;
  }
  const theme = ThemeService.getCurrentTheme();
  return (
    <Tooltip title={tooltip}>
      {showSpinner ? <Spin /> : <Icon style={{ color: color }} className={theme} />}
    </Tooltip>
  );
}

export default FragmentStatusIcon;