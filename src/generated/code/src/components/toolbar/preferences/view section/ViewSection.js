
import React from 'react';
import { Select, Button } from 'antd';
import { ThemeService } from '../../../services/ThemeService/ThemeService';
import { DialogService } from '../../../services/DialogService/DialogService';

const { Option } = Select;

const FONT_SIZES = Array.from({length: 45}, (_, i) => i + 6);
const FONTS = ['Consolas', 'Helvetica', 'Arial', 'Arial Black', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Impact', 'Gill Sans', 'Times New Roman', 'Georgia', 'Palatino', 'Baskerville', 'Andalé Mono', 'Courier', 'Lucida', 'Monaco', 'Bradley Hand', 'Brush Script MT', 'Luminari', 'Comic Sans MS'];
const THEMES = ['light', 'dark'];

/**
 * ViewSection component
 * Contains actions related to the configuration of the appearance of the application
 */
class ViewSection extends React.Component {
  state = {
    theme: ThemeService.getCurrentTheme(),
    font: ThemeService.getCurrentFont(),
    fontSize: ThemeService.getCurrentFontSize(),
  };

  handleThemeChange = (value) => {
    try {
      ThemeService.setCurrentTheme(value);
      this.setState({ theme: value });
    } catch (error) {
      DialogService.showErrorDialog('Error setting theme', error);
    }
  };

  handleFontChange = (value) => {
    try {
      ThemeService.setCurrentFont(value);
      this.setState({ font: value });
    } catch (error) {
      DialogService.showErrorDialog('Error setting font', error);
    }
  };

  handleFontSizeChange = (value) => {
    try {
      ThemeService.setCurrentFontSize(value);
      this.setState({ fontSize: value });
    } catch (error) {
      DialogService.showErrorDialog('Error setting font size', error);
    }
  };

  render() {
    return (
      <div className="view-section">
        <Select value={this.state.theme} onChange={this.handleThemeChange} className="theme-select">
          {THEMES.map((theme) => (
            <Option key={theme} value={theme}>
              {theme}
            </Option>
          ))}
        </Select>
        <Select value={this.state.font} onChange={this.handleFontChange} className="font-select">
          {FONTS.map((font) => (
            <Option key={font} value={font}>
              {font}
            </Option>
          ))}
        </Select>
        <Select value={this.state.fontSize} onChange={this.handleFontSizeChange} className="font-size-select">
          {FONT_SIZES.map((size) => (
            <Option key={size} value={size}>
              {size}
            </Option>
          ))}
        </Select>
      </div>
    );
  }
}

export default ViewSection;
