
import React, { useEffect, useState } from 'react';
import { DialogService } from 'MarkdownCode/services/dialog service/DialogService';
import { ThemeService } from 'MarkdownCode/services/Theme service/ThemeService';
import { HorizontalSplitter } from 'MarkdownCode/components/body/horizontal splitter/HorizontalSplitter';
import { Outline } from 'MarkdownCode/components/body/outline/Outline';
import { VerticalSplitter } from 'MarkdownCode/components/body/vertical splitter/VerticalSplitter';
import { Editor } from 'MarkdownCode/components/body/editor/Editor';
import { ResultsView } from 'MarkdownCode/components/body/results view/ResultsView';

const Body = () => {
  const [horizontalSplitterPosition, setHorizontalSplitterPosition] = useState(null);
  const [verticalSplitterPosition, setVerticalSplitterPosition] = useState(null);
  const theme = ThemeService.getCurrentTheme();

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
    <div className={`body ${theme}`}>
      <HorizontalSplitter
        left={<Outline />}
        right={
          <VerticalSplitter
            top={<Editor />}
            bottom={<ResultsView />}
            onPositionChanged={handleVerticalSplitterPositionChange}
            position={verticalSplitterPosition}
          />
        }
        onPositionChanged={handleHorizontalSplitterPositionChange}
        position={horizontalSplitterPosition}
      />
    </div>
  );
};

export default Body;
