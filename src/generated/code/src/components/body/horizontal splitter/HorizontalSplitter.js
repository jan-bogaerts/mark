
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from 'antd';
import ThemeService from '../../../services/Theme_service/ThemeService';

const { Sider, Content } = Layout;

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
    if (!splitterRef.current) return;
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
    <Layout className={`horizontal-splitter ${theme}`}>
      <Content style={{ height: `${currentPosition}px` }}>
        {top}
      </Content>
      <Sider
        ref={splitterRef}
        className="splitter"
        style={{ height: '8px', cursor: 'row-resize' }}
        onMouseDown={handleMouseDown}
      />
      <Content>
        {bottom}
      </Content>
    </Layout>
  );
};

export default HorizontalSplitter;
