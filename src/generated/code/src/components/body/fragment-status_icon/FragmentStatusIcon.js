import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { LuHeading1, LuHeading2, LuHeading3, LuHeading4, LuHeading5, LuHeading6 } from 'react-icons/lu';
import ProjectService from '../../../services/project_service/ProjectService';

/**
 * FragmentStatusIcon component
 * @param {Object} props - Component properties
 * @param {Object} props.fragment - Text fragment object
 */
const FragmentStatusIcon = ({ fragment }) => {
  const [icon, setIcon] = useState(null);
  const [color, setColor] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  const selectIconToUse = (depth) => {
    switch(depth) {
      case 1:
        setIcon(<LuHeading1 />);
        break;
      case 2:
        setIcon(<LuHeading2 />);
        break;
      case 3:
        setIcon(<LuHeading3 />);
        break;
      case 4:
        setIcon(<LuHeading4 />);
        break;
      case 5:
        setIcon(<LuHeading5 />);
        break;
      case 6:
      default:
        setIcon(<LuHeading6 />);
        break;
    }
  };

  // Set icon based on fragment depth-level
  useEffect(() => {
    const depth = fragment?.depth;
    selectIconToUse(depth);
  }, [fragment]);

  // Set color and tooltip based on fragment status
  useEffect(() => {
    if (!fragment?.isOutOfDate) {
      setColor('green');
      setTooltip('Fragment is up to date');
    } else if (fragment?.outOfDateTransformers?.length > 0) {
      setColor('orange');
      setTooltip(`Fragment is out of date for: ${fragment.outOfDateTransformers.map(t => t.name).join(', ')}`);
    } else {
      setColor('red');
      setTooltip('Fragment is out of date for all transformers');
    }
  }, [fragment]);

  // Register event handlers
  useEffect(() => {
    const handleFragmentOutOfDate = (e) => {
      if (e.detail === fragment?.key) {
        setColor('red');
        setTooltip('Fragment is out of date for all transformers');
      }
    }; 

    const handleKeyChanged = (e) => {
      if (e.detail?.key === fragment?.key) {
        selectIconToUse(e.detail.depth);
      }
    };

    ProjectService.eventTarget.addEventListener('fragment-out-of-date', handleFragmentOutOfDate);
    ProjectService.eventTarget.addEventListener('key-changed', handleKeyChanged);

    // Unregister event handlers
    return () => {
      ProjectService.eventTarget.removeEventListener('fragment-out-of-date', handleFragmentOutOfDate);
      ProjectService.eventTarget.removeEventListener('key-changed', handleKeyChanged);
    };
  }, [fragment]);

  return (
    <Tooltip title={tooltip}>
      {icon && React.cloneElement(icon, { style: { color } })}
    </Tooltip>
  );
};

export default FragmentStatusIcon;