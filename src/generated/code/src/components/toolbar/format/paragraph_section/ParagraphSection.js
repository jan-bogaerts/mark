
import React from 'react';
import { Button } from 'antd';
import ThemeService from '../../../../services/Theme_service/ThemeService';
import IndentButton from './IndentButton';
import UnindentButton from './UnindentButton';

/**
 * ParagraphSection component
 * This component is responsible for managing actions related to applying markdown formatting to text.
 * It includes buttons that use icons instead of text.
 * The supported actions in this component are indenting and unindenting.
 */
class ParagraphSection extends React.Component {
  constructor(props) {
    super(props);
    this.themeService = ThemeService;
    this.state = {
      theme: this.themeService.getCurrentTheme(),
    };
  }

  /**
   * Function to get the current theme from the theme service
   */
  getCurrentTheme = () => {
    const theme = this.themeService.getCurrentTheme();
    this.setState({ theme });
  };

  render() {
    const { theme } = this.state;
    return (
      <div className={`paragraph-section ${theme}`}>
        <IndentButton theme={theme} />
        <UnindentButton theme={theme} />
      </div>
    );
  }
}

export default ParagraphSection;
