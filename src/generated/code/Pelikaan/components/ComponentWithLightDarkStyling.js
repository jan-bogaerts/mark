
import React, { useState } from 'react';
import { Button, Switch } from 'antd';

const ComponentWithLightDarkStyling = () => {
  const [theme, setTheme] = useState('light');

  const handleThemeChange = (checked) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <div className={`component ${theme}`}>
      <h1>Component with Light/Dark Styling</h1>
      <Switch
        checked={theme === 'dark'}
        onChange={handleThemeChange}
        checkedChildren="Dark"
        unCheckedChildren="Light"
      />
      <Button type="primary">Button</Button>
    </div>
  );
};

export default ComponentWithLightDarkStyling;
```

CSS Styling:
```css
.component {
  padding: 20px;
  background-color: #f0f0f0;
}

.component.light {
  color: #000;
}

.component.dark {
  color: #fff;
  background-color: #333;
}
