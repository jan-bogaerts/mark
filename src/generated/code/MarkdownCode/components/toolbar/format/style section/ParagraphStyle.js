
import React from 'react';
import { Button } from 'antd';
import { StyleSection } from 'MarkdownCode/components/toolbar/format/style section/StyleSection';
import { SelectionService } from 'MarkdownCode/services/Selection service/SelectionService';
import { ThemeService } from 'MarkdownCode/services/Theme service/ThemeService';
import { DialogService } from 'MarkdownCode/services/dialog service/DialogService';

const STYLES = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'quote', 'code'];

/**
 * ParagraphStyle component
 * UI element that allows users to apply different styles to paragraphs of text.
 */
class ParagraphStyle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStyle: 'p',
    };
  }

  /**
   * Apply the selected style as markdown to the selected text.
   * @param {string} style - The style to apply.
   */
  applyStyle(style) {
    try {
      const selectedText = SelectionService.getSelectedText();
      const styledText = StyleSection.applyStyle(style, selectedText);
      SelectionService.replaceSelectionWith(styledText);
      this.setState({ selectedStyle: style });
    } catch (error) {
      DialogService.showErrorDialog(`Failed to apply style: ${error.message}`);
    }
  }

  /**
   * Render the component.
   */
  render() {
    const theme = ThemeService.getCurrentTheme();
    return (
      <div className={`paragraph-style ${theme}`}>
        {STYLES.map((style) => (
          <Button
            key={style}
            className={`style-button ${style === this.state.selectedStyle ? 'selected' : ''}`}
            onClick={() => this.applyStyle(style)}
          >
            {style}
          </Button>
        ))}
      </div>
    );
  }
}

export default ParagraphStyle;
