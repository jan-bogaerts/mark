
import React, { useEffect, useState } from 'react';
import { Tree } from 'antd';
import { useTheme } from 'MarkdownCode/services/Theme service/ThemeService';
import { useDialog } from 'MarkdownCode/services/dialog service/DialogService';
import { useSelection } from 'MarkdownCode/services/Selection service/SelectionService';
import { usePositionTracking } from 'MarkdownCode/services/position-tracking service/PositionTrackingService';
import { parseLine } from 'MarkdownCode/services/line parser/LineParser';

/**
 * Outline component
 * Displays a tree structure of the markdown document headings
 */
const Outline = () => {
  const [treeData, setTreeData] = useState([]);
  const { theme } = useTheme();
  const { showError } = useDialog();
  const { getSelection } = useSelection();
  const { subscribeToPositionChanges } = usePositionTracking();

  useEffect(() => {
    try {
      const selection = getSelection();
      const parsedData = parseLine(selection);
      setTreeData(parsedData);
    } catch (error) {
      showError('Error parsing selection', error.message);
    }

    const unsubscribe = subscribeToPositionChanges((newPosition) => {
      try {
        const parsedData = parseLine(newPosition);
        setTreeData(parsedData);
      } catch (error) {
        showError('Error parsing new position', error.message);
      }
    });

    return () => unsubscribe();
  }, [getSelection, showError, subscribeToPositionChanges]);

  const onSelect = (selectedKeys, info) => {
    // Scroll the selected text into view
  };

  return (
    <div className={`outline ${theme}`}>
      <Tree
        treeData={treeData}
        onSelect={onSelect}
      />
    </div>
  );
};

export default Outline;
```

```css
.outline {
  position: absolute;
  left: 0;
  width: 300px;
  overflow: auto;
}

.outline.light {
  background-color: #fff;
  color: #000;
}

.outline.dark {
  background-color: #000;
  color: #fff;
}
