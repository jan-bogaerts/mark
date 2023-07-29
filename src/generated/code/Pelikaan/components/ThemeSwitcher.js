
import React, { useState } from 'react';
import { Switch } from 'antd';

const ThemeSwitcher = ({ onChange }) => {
  const [theme, setTheme] = useState('light');

  const handleThemeChange = (checked) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);
    onChange(newTheme);
  };

  return (
    <div>
      <span>Light</span>
      <Switch checked={theme === 'dark'} onChange={handleThemeChange} />
      <span>Dark</span>
    </div>
  );
};

export default ThemeSwitcher;
