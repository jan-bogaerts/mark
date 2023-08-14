
import React from 'react';
import { Select } from 'antd';
import ThemeService from 'MarkdownCode/services/Theme service/ThemeService';
import DialogService from 'MarkdownCode/services/dialog service/DialogService';
import ViewSection from 'MarkdownCode/components/toolbar/preferences/view section/ViewSection';
import FontComboBox from 'MarkdownCode/components/toolbar/preferences/view section/FontComboBox';
import FontSizeComboBox from 'FontSizeComboBox';

const { Option } = Select;

/**
 * ThemeComboBox component
 * This component is responsible for displaying a combo box for theme selection.
 * It uses the ThemeService to retrieve the currently selected theme and apply it.
 * It also uses the DialogService to display dialog boxes for errors.
 */
class ThemeComboBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTheme: ThemeService.getCurrentTheme(),
    };
  }

  /**
   * Handle theme change
   * This function is called when a new theme is selected from the combo box.
   * It updates the selected theme in the ThemeService and refreshes the main window.
   * If an error occurs, it uses the DialogService to display an error dialog box.
   */
  handleThemeChange = (value) => {
    try {
      ThemeService.setCurrentTheme(value);
      this.setState({ selectedTheme: value });
      window.location.reload();
    } catch (error) {
      DialogService.showErrorDialog('An error occurred while changing the theme.', error);
    }
  }

  render() {
    const { selectedTheme } = this.state;
    return (
      <ViewSection title="Theme">
        <Select value={selectedTheme} onChange={this.handleThemeChange} className={`theme-combo-box ${selectedTheme}`}>
          <Option value="light">Light</Option>
          <Option value="dark">Dark</Option>
        </Select>
        <FontComboBox />
        <FontSizeComboBox />
      </ViewSection>
    );
  }
}

export default ThemeComboBox;
