
// Importing required services and components
import { SelectionService } from 'MarkdownCode/services/SelectionService';
import { ThemeService } from 'MarkdownCode/services/ThemeService';
import { DialogService } from 'MarkdownCode/services/DialogService';
import { ParagraphStyle } from 'MarkdownCode/components/toolbar/format/style section/ParagraphStyle';

// Constants for markdown styles
const MARKDOWN_STYLES = {
  HEADING1: 'heading1',
  HEADING2: 'heading2',
  HEADING3: 'heading3',
  HEADING4: 'heading4',
  HEADING5: 'heading5',
  HEADING6: 'heading6',
  PARAGRAPH: 'paragraph',
  QUOTE: 'quote',
  CODE: 'code'
};

/**
 * StyleSection component
 * This component allows users to apply markdown formatting to text.
 */
class StyleSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStyle: MARKDOWN_STYLES.PARAGRAPH
    };
  }

  /**
   * Function to handle style selection
   * @param {string} style - The selected style
   */
  handleStyleSelection = (style) => {
    try {
      this.setState({ selectedStyle: style });
      SelectionService.applyMarkdownStyle(style);
    } catch (error) {
      DialogService.showErrorDialog('Error applying markdown style', error);
    }
  }

  /**
   * Function to render the component
   */
  render() {
    const theme = ThemeService.getCurrentTheme();
    return (
      <div className={`style-section ${theme}`}>
        <ParagraphStyle
          styles={MARKDOWN_STYLES}
          selectedStyle={this.state.selectedStyle}
          onStyleSelect={this.handleStyleSelection}
        />
      </div>
    );
  }
}

export default StyleSection;
