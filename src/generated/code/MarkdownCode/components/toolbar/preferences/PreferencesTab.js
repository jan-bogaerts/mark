
import React from 'react';
import { Row } from 'antd';
import { ThemeService } from 'MarkdownCode/services/Theme service/ThemeService';
import { DialogService } from 'MarkdownCode/services/dialog service/DialogService';
import GPT from 'GptSection';
import View from 'ViewSection';

/**
 * PreferencesTab component
 * This component is a wrapper that displays its children in a row.
 */
class PreferencesTab extends React.Component {
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
   * Update the theme of the component
   */
  updateTheme() {
    const theme = ThemeService.getCurrentTheme();
    this.setState({ theme });
  }

  /**
   * Handle errors by displaying a dialog box with detailed information about the error
   * @param {Error} error - The error to handle
   */
  handleError(error) {
    DialogService.showErrorDialog(error);
  }

  render() {
    const { theme } = this.state;

    return (
      <Row className={`preferences-tab ${theme}`}>
        <GPT onError={this.handleError} />
        <View onError={this.handleError} />
      </Row>
    );
  }
}

export default PreferencesTab;
