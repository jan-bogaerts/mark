
import React, { Component } from 'react';
import { Row } from 'antd';
import DialogService from '../../../services/dialog_service/DialogService';
import ThemeService from '../../../services/Theme_service/ThemeService';
import GPT from './GPT_section/GPTSection';
import View from './view_section/ViewSection';

/**
 * PreferencesTab component
 * This component is a wrapper that displays its children in a row.
 */
class PreferencesTab extends Component {
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
    try {
      const theme = ThemeService.getCurrentTheme();
      this.setState({ theme });
    } catch (error) {
      DialogService.showErrorDialog('An error occurred while updating the theme.', error);
    }
  }

  render() {
    const { theme } = this.state;

    return (
      <Row className={`preferences-tab ${theme}`}>
        <GPT />
        <View />
      </Row>
    );
  }
}

export default PreferencesTab;
