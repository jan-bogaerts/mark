
import React, { useEffect, useState } from 'react';
import { HorizontalSplitter } from './horizontal_splitter/HorizontalSplitter';
import { VerticalSplitter } from './vertical_splitter/VerticalSplitter';
import { Outline } from './outline/Outline';
import { Editor } from './editor/Editor';
import { ResultsView } from './results_view/ResultsView';
import { ThemeService } from '../../../services/Theme_service/ThemeService';

const LOCAL_STORAGE_HORIZONTAL_SPLITTER_POSITION = 'horizontalSplitterPosition';
const LOCAL_STORAGE_VERTICAL_SPLITTER_POSITION = 'verticalSplitterPosition';

/**
 * Body component represents the main body of the application.
 */
const Body = () => {
  const [horizontalSplitterPosition, setHorizontalSplitterPosition] = useState(null);
  const [verticalSplitterPosition, setVerticalSplitterPosition] = useState(null);

  useEffect(() => {
    const horizontalSplitterPosition = localStorage.getItem(LOCAL_STORAGE_HORIZONTAL_SPLITTER_POSITION);
    const verticalSplitterPosition = localStorage.getItem(LOCAL_STORAGE_VERTICAL_SPLITTER_POSITION);
    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;

    setHorizontalSplitterPosition(horizontalSplitterPosition && horizontalSplitterPosition < clientHeight ? horizontalSplitterPosition : clientHeight / 4);
    setVerticalSplitterPosition(verticalSplitterPosition && verticalSplitterPosition < clientWidth ? verticalSplitterPosition : clientWidth / 4);
  }, []);

  useEffect(() => {
    return () => {
      localStorage.setItem(LOCAL_STORAGE_HORIZONTAL_SPLITTER_POSITION, horizontalSplitterPosition);
      localStorage.setItem(LOCAL_STORAGE_VERTICAL_SPLITTER_POSITION, verticalSplitterPosition);
    };
  }, [horizontalSplitterPosition, verticalSplitterPosition]);

  const theme = ThemeService.getCurrentTheme();

  return (
    <div className={`body ${theme}`}>
      <HorizontalSplitter
        top={<Outline />}
        bottom={
          <VerticalSplitter
            left={<Editor />}
            right={<ResultsView />}
            position={verticalSplitterPosition}
            onPositionChanged={setVerticalSplitterPosition}
          />
        }
        position={horizontalSplitterPosition}
        onPositionChanged={setHorizontalSplitterPosition}
      />
    </div>
  );
};

export default Body;
