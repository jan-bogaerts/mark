
import React, { useState, useEffect } from 'react';
import { Select, Tooltip } from 'antd';
import { ThemeService } from '../../../services/ThemeService/ThemeService';
import { DialogService } from '../../../services/DialogService/DialogService';

const { Option } = Select;

/**
 * ViewSection component
 * Contains actions related to the configuration of the appearance of the application
 */
const ViewSection = () => {
  const [theme, setTheme] = useState('');
  const [font, setFont] = useState('');
  const [fontSize, setFontSize] = useState('');

  useEffect(() => {
    try {
      const currentTheme = ThemeService.getCurrentTheme();
      setTheme(currentTheme.theme);
      setFont(currentTheme.font);
      setFontSize(currentTheme.fontSize);
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  }, []);

  const handleThemeChange = (value) => {
    try {
      ThemeService.setTheme(value);
      setTheme(value);
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

  const handleFontChange = (value) => {
    try {
      ThemeService.setFont(value);
      setFont(value);
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

  const handleFontSizeChange = (value) => {
    try {
      ThemeService.setFontSize(value);
      setFontSize(value);
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

  return (
    <div className="view-section">
      <Tooltip title="Change theme">
        <Select value={theme} onChange={handleThemeChange} className="theme-select">
          <Option value="light">Light</Option>
          <Option value="dark">Dark</Option>
        </Select>
      </Tooltip>
      <Tooltip title="Change font">
        <Select value={font} onChange={handleFontChange} className="font-select">
          {/* Add your font options here */}
        </Select>
      </Tooltip>
      <Tooltip title="Change font size">
        <Select value={fontSize} onChange={handleFontSizeChange} className="font-size-select">
          {/* Add your font size options here */}
        </Select>
      </Tooltip>
    </div>
  );
};

export default ViewSection;
