
import React from 'react';
import { Select, Button } from 'antd';
import { ThemeService } from 'MarkdownCode/services/ThemeService/ThemeService';
import { DialogService } from 'MarkdownCode/services/DialogService/DialogService';

const { Option } = Select;

const THEMES = ["light", "dark"];
const FONTS = ["Arial", "Verdana", "Courier New", "Times New Roman"];
const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px"];

/**
 * ViewSection component
 * Contains actions related to the configuration of the appearance of the application
 */
class ViewSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: ThemeService.getTheme(),
      font: ThemeService.getFont(),
      fontSize: ThemeService.getFontSize(),
    };
  }

  handleThemeChange = (value) => {
    try {
      ThemeService.setTheme(value);
      this.setState({ theme: value });
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  }

  handleFontChange = (value) => {
    try {
      ThemeService.setFont(value);
      this.setState({ font: value });
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  }

  handleFontSizeChange = (value) => {
    try {
      ThemeService.setFontSize(value);
      this.setState({ fontSize: value });
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  }

  render() {
    return (
      <div className="view-section">
        <Select
          className="theme-selector"
          value={this.state.theme}
          onChange={this.handleThemeChange}
        >
          {THEMES.map(theme => <Option key={theme}>{theme}</Option>)}
        </Select>
        <Select
          className="font-selector"
          value={this.state.font}
          onChange={this.handleFontChange}
        >
          {FONTS.map(font => <Option key={font}>{font}</Option>)}
        </Select>
        <Select
          className="font-size-selector"
          value={this.state.fontSize}
          onChange={this.handleFontSizeChange}
        >
          {FONT_SIZES.map(size => <Option key={size}>{size}</Option>)}
        </Select>
      </div>
    );
  }
}

export default ViewSection;
