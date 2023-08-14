
import React, { useRef, useState, useEffect } from 'react';
import { DialogService } from 'MarkdownCode/services/dialog service/DialogService';
import { ThemeService } from 'MarkdownCode/services/Theme service/ThemeService';

/**
 * HorizontalSplitter component
 * @param {Object} props - properties passed to the component
 */
const HorizontalSplitter = ({ top, bottom, position, onPositionChanged }) => {
  const [currentPosition, setCurrentPosition] = useState(position);
  const splitterRef = useRef(null);
  const theme = ThemeService.getCurrentTheme();

  useEffect(() => {
    setCurrentPosition(position);
  }, [position]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const newPosition = e.clientY - splitterRef.current.getBoundingClientRect().top;
    setCurrentPosition(newPosition);
    if (onPositionChanged) {
      onPositionChanged(newPosition);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className={`horizontal-splitter ${theme}`}>
      <div className="top-component">
        {top}
      </div>
      <div
        className="splitter-bar"
        ref={splitterRef}
        onMouseDown={handleMouseDown}
        style={{ height: '8px' }}
      />
      <div className="bottom-component" style={{ height: `${currentPosition}px` }}>
        {bottom}
      </div>
    </div>
  );
};

export default HorizontalSplitter;
