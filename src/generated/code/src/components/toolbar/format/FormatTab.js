
import React from 'react';
import { Row } from 'antd';
import ThemeService from '../../../services/ThemeService/ThemeService';
import StyleSection from './StyleSection/StyleSection';
import ParagraphSection from './ParagraphSection/ParagraphSection';
import FontSection from './FontSection/FontSection';

/**
 * FormatTab component
 * This component is a wrapper that displays its children in a row.
 * It contains the following child components: StyleSection, ParagraphSection, FontSection.
 */
const FormatTab = () => {
  // Retrieve the current theme from the ThemeService
  const theme = ThemeService.getCurrentTheme();

  return (
    <Row className={`format-tab ${theme}`}>
      <StyleSection />
      <ParagraphSection />
      <FontSection />
    </Row>
  );
};

export default FormatTab;
