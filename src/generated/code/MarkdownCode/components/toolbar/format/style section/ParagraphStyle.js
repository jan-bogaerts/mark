
import React, { useState, useEffect } from 'react';
import { Button, Tooltip } from 'antd';
import { StyleSection } from 'MarkdownCode/components/toolbar/format/style section/StyleSection';
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
  'code'
];

/**
 * ParagraphStyle component
 * This component is responsible for applying markdown formatting to the selected text.
 */
const ParagraphStyle = () => {
  const [selectedStyle, setSelectedStyle] = useState('paragraph');
  const theme = ThemeService.getCurrentTheme();

  useEffect(() => {
    const updateStyle = () => {
      try {
        const currentStyle = SelectionService.getCurrentStyle();
        setSelectedStyle(currentStyle);
      } catch (error) {
        DialogService.showErrorDialog('Error while updating style', error);
      }
    };

    SelectionService.subscribe(updateStyle);
    return () => SelectionService.unsubscribe(updateStyle);
  }, []);

  const applyStyle = (style) => {
    try {
      SelectionService.applyStyle(style);
      setSelectedStyle(style);
    } catch (error) {
      DialogService.showErrorDialog('Error while applying style', error);
    }
  };

  return (
    <StyleSection theme={theme}>
      {styles.map((style) => (
        <Tooltip key={style} title={style}>
          <Button
            type={selectedStyle === style ? 'primary' : 'default'}
            icon={style}
            onClick={() => applyStyle(style)}
          />
        </Tooltip>
      ))}
    </StyleSection>
  );
};

export default ParagraphStyle;
