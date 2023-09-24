
import React from 'react';
import { Row } from 'antd';
import ThemeService from '../../../services/Theme_service/ThemeService';
import StyleSection from './style_section/StyleSection';
import ParagraphSection from './paragraph_section/ParagraphSection';
import FontSection from './font_section/FontSection';

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
