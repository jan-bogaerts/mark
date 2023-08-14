
import React, { useRef, useEffect } from 'react';
import { DialogService } from 'MarkdownCode/services/dialog service/DialogService';
import { ThemeService } from 'MarkdownCode/services/Theme service/ThemeService';

/**
 * VerticalSplitter component
 * @param {Object} props - Component properties
 * @param {React.Component} props.left - Component to be placed on the left
 * @param {React.Component} props.right - Component to be placed on the right
 * @param {number} props.position - Width assigned to the left component
 * @param {function} props.onPositionChanged - Callback function to update position value
 */
const VerticalSplitter = ({ left, right, position, onPositionChanged }) => {
  const splitterRef = useRef(null);
  const theme = ThemeService.getCurrentTheme();

  /**
   * Handle mouse down event on the splitter
   * @param {Object} e - Event object
   */
  const handleMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  /**
   * Handle mouse move event on the document
   * @param {Object} e - Event object
   */
  const handleMouseMove = (e) => {
    try {
      const newWidth = e.clientX - splitterRef.current.getBoundingClientRect().left;
      onPositionChanged(newWidth);
    } catch (error) {
      DialogService.showErrorDialog(`An error occurred while resizing: ${error.message}`);
    }
  };

  /**
   * Handle mouse up event on the document
   */
  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className={`vertical-splitter ${theme}`} style={{ gridTemplateColumns: `${position}px 8px auto` }}>
      <div className="left-panel">{left}</div>
      <div
        className="splitter"
        ref={splitterRef}
        onMouseDown={handleMouseDown}
        style={{ cursor: 'col-resize' }}
      />
      <div className="right-panel">{right}</div>
    </div>
  );
};

export default VerticalSplitter;
