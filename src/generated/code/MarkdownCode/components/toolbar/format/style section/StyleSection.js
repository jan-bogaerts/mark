
import React, { useState, useEffect } from 'react';
import { Button, Tooltip } from 'antd';
import { ParagraphStyle } from 'MarkdownCode/components/toolbar/format/style section/ParagraphStyle';
import { SelectionService } from 'MarkdownCode/services/Selection service/SelectionService';
import { ThemeService } from 'MarkdownCode/services/Theme service/ThemeService';
import { DialogService } from 'MarkdownCode/services/dialog service/DialogService';

const styles = [
  'heading 1',
  'heading 2',
  'heading 3',
  'heading 4',
  'heading 5',
  'heading 6',
  'paragraph',
  'quote',
  'code',
];

/**
 * StyleSection component
 * Contains actions related to the markup used in the text for applying markdown formatting.
 */
const StyleSection = () => {
  const [selectedStyle, setSelectedStyle] = useState('paragraph');
  const themeService = new ThemeService();
  const dialogService = new DialogService();
  const selectionService = new SelectionService();

  useEffect(() => {
    selectionService.on('selectionChanged', updateStyle);
    themeService.on('themeChanged', updateTheme);
    return () => {
      selectionService.off('selectionChanged', updateStyle);
      themeService.off('themeChanged', updateTheme);
    };
  }, []);

  const updateStyle = () => {
    try {
      const style = selectionService.getStyle();
      setSelectedStyle(style);
    } catch (error) {
      dialogService.showError('Error updating style', error);
    }
  };

  const updateTheme = () => {
    try {
      const theme = themeService.getTheme();
      // Apply the theme to the component
    } catch (error) {
      dialogService.showError('Error updating theme', error);
    }
  };

  const handleStyleChange = (style) => {
    try {
      selectionService.setStyle(style);
      setSelectedStyle(style);
    } catch (error) {
      dialogService.showError('Error changing style', error);
    }
  };

  return (
    <div className="style-section">
      {styles.map((style) => (
        <Tooltip title={style} key={style}>
          <Button
            type={selectedStyle === style ? 'primary' : 'default'}
            icon={<ParagraphStyle style={style} />}
            onClick={() => handleStyleChange(style)}
          />
        </Tooltip>
      ))}
    </div>
  );
};

export default StyleSection;
