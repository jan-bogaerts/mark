
import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { HorizontalSplitter } from 'horizontal-splitter/HorizontalSplitter';
import { VerticalSplitter } from 'vertical-splitter/VerticalSplitter';
import { Outline } from 'outline/Outline';
import { Editor } from 'editor/Editor';
import { ResultsView } from 'results-view/ResultsView';
import { DialogService } from '../../services/dialog-service/DialogService';
import { ThemeService } from '../../services/theme-service/ThemeService';

const Body = () => {
  const [horizontalSplitterPosition, setHorizontalSplitterPosition] = useState(null);
  const [verticalSplitterPosition, setVerticalSplitterPosition] = useState(null);
  const themeService = ThemeService.getCurrentTheme();

  useEffect(() => {
    const horizontalSplitterPosition = localStorage.getItem('horizontalSplitterPosition');
    const verticalSplitterPosition = localStorage.getItem('verticalSplitterPosition');

    if (horizontalSplitterPosition && verticalSplitterPosition) {
      setHorizontalSplitterPosition(horizontalSplitterPosition);
      setVerticalSplitterPosition(verticalSplitterPosition);
    } else {
      setHorizontalSplitterPosition(window.innerHeight / 3);
      setVerticalSplitterPosition(window.innerWidth / 3);
    }
  }, []);

  useEffect(() => {
    return () => {
      localStorage.setItem('horizontalSplitterPosition', horizontalSplitterPosition);
      localStorage.setItem('verticalSplitterPosition', verticalSplitterPosition);
    };
  }, [horizontalSplitterPosition, verticalSplitterPosition]);

  const handleHorizontalSplitterPositionChange = (newPosition) => {
    setHorizontalSplitterPosition(newPosition);
  };

  const handleVerticalSplitterPositionChange = (newPosition) => {
    setVerticalSplitterPosition(newPosition);
  };

  return (
    <Layout className={`body ${themeService}`}>
      <HorizontalSplitter
        position={horizontalSplitterPosition}
        onPositionChanged={handleHorizontalSplitterPositionChange}
      >
        <Outline />
        <VerticalSplitter
          position={verticalSplitterPosition}
          onPositionChanged={handleVerticalSplitterPositionChange}
        >
          <Editor />
          <ResultsView />
        </VerticalSplitter>
      </HorizontalSplitter>
    </Layout>
  );
};

export default Body;
