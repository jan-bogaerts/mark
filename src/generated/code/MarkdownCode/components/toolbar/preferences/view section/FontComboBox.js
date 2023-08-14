
// Importing required components and services
import React from 'react';
import { Select } from 'antd';
import { ThemeService } from 'MarkdownCode/services/Theme service/ThemeService';
import { DialogService } from 'MarkdownCode/services/dialog service/DialogService';
import { FontSizeComboBox } from 'FontSizeComboBox';

// Constants
const { Option } = Select;
const fonts = ["Arial", "Verdana", "Helvetica", "Tahoma", "Trebuchet MS", "Times New Roman", "Georgia", "Garamond", "Courier New", "Brush Script MT"];

/**
 * FontComboBox component
 * This component provides a dropdown list of font options for the user to select from.
 */
class FontComboBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFont: ThemeService.getCurrentTheme().font
    };
  }

  /**
   * Handles the event when a font is selected from the dropdown.
   * @param {string} value - The selected font.
   */
  handleFontChange = (value) => {
    try {
      ThemeService.setCurrentTheme({ ...ThemeService.getCurrentTheme(), font: value });
      this.setState({ selectedFont: value });
    } catch (error) {
      DialogService.showErrorDialog(`An error occurred while changing the font: ${error.message}`);
    }
  }

  render() {
    return (
      <div className={`font-combo-box ${ThemeService.getCurrentTheme().name}`}>
        <Select defaultValue={this.state.selectedFont} style={{ width: 120 }} onChange={this.handleFontChange}>
          {fonts.map(font => <Option key={font} value={font}>{font}</Option>)}
        </Select>
        <FontSizeComboBox />
      </div>
    );
  }
}

export default FontComboBox;
