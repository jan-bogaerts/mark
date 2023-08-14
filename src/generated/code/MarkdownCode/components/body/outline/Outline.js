
import React, { useEffect, useState } from 'react';
import { Tree } from 'antd';
import { useTheme } from 'styled-components';
import { PositionTrackingService } from 'MarkdownCode/services/position-tracking service/PositionTrackingService';
import { LineParser } from 'MarkdownCode/services/line parser/LineParser';
import { SelectionService } from 'MarkdownCode/services/Selection service/SelectionService';
import { ThemeService } from 'MarkdownCode/services/Theme service/ThemeService';
import { DialogService } from 'MarkdownCode/services/dialog service/DialogService';

/**
 * Outline component
 * @component
 */
function Outline() {
  const [outline, setOutline] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const subscription = PositionTrackingService.subscribe((position) => {
      setSelectedKey(position.key);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const markdown = SelectionService.getActiveProject();
    if (markdown) {
      try {
        const parsedOutline = LineParser.parse(markdown);
        setOutline(parsedOutline);
      } catch (error) {
        DialogService.showErrorDialog('Error parsing markdown', error);
      }
    }
  }, []);

  const onSelect = (selectedKeys) => {
    const key = selectedKeys[0];
    SelectionService.scrollTo(key);
  };

  return (
    <Tree
      className={`outline-tree ${theme}`}
      treeData={outline}
      selectedKeys={[selectedKey]}
      onSelect={onSelect}
    />
  );
}

export default Outline;
