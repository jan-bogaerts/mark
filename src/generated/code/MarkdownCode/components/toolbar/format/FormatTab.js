
import React from 'react';
import { Row } from 'antd';
import { ThemeService } from 'MarkdownCode/services/Theme service/ThemeService';
import { DialogService } from 'MarkdownCode/services/dialog service/DialogService';
import Style from 'StyleSection';
import Paragraph from 'MarkdownCode/components/toolbar/format/paragraph section/ParagraphSection';
import Font from 'FontSection';

/**
 * FormatTab component
 * This component is a wrapper that displays its children in a row.
 * It contains Style, Paragraph, and Font components as its children.
 */
class FormatTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: ThemeService.getCurrentTheme(),
    };
  }

  componentDidMount() {
    this.updateTheme();
  }

  /**
   * Retrieves the current theme from the ThemeService and updates the state.
   */
  updateTheme() {
    try {
      const theme = ThemeService.getCurrentTheme();
      this.setState({ theme });
    } catch (error) {
      DialogService.showErrorDialog('Error retrieving theme', error.message);
    }
  }

  render() {
    const { theme } = this.state;
    return (
      <Row className={`format-tab ${theme}`}>
        <Style />
        <Paragraph />
        <Font />
      </Row>
    );
  }
}

export default FormatTab;
