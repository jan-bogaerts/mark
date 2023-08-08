
import React from 'react';
import { Row } from 'antd';
import Style from 'MarkdownCode/components/toolbar/format/style section/Style';
import Paragraph from 'MarkdownCode/components/toolbar/format/paragraph section/Paragraph';
import Font from 'MarkdownCode/components/toolbar/format/font section/Font';
import ThemeService from 'MarkdownCode/services/Theme service/ThemeService';
import DialogService from 'MarkdownCode/services/dialog service/DialogService';

/**
 * FormatTab component
 * This component is a wrapper that displays its children in a row.
 * It contains the Style, Paragraph, and Font components.
 */
class FormatTab extends React.Component {
  constructor(props) {
    super(props);
    this.themeService = new ThemeService();
    this.dialogService = new DialogService();
  }

  componentDidMount() {
    this.themeService.subscribe(this.updateTheme);
  }

  componentWillUnmount() {
    this.themeService.unsubscribe(this.updateTheme);
  }

  /**
   * Update the theme of the component
   */
  updateTheme = () => {
    try {
      const theme = this.themeService.getCurrentTheme();
      this.setState({ theme });
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
  }

  render() {
    return (
      <Row className={`format-tab ${this.state.theme}`}>
        <Style />
        <Paragraph />
        <Font />
      </Row>
    );
  }
}

export default FormatTab;
