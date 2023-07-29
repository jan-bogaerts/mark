```javascript
import React, { useState } from 'react';
import { Layout, Switch } from 'antd';

const { Header, Content } = Layout;

const MainWindow = () => {
  const [theme, setTheme] = useState('light');

  const handleThemeChange = (checked) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <Layout>
      <Header>
        <Switch
          checked={theme === 'dark'}
          onChange={handleThemeChange}
          checkedChildren="Dark"
          unCheckedChildren="Light"
        />
      </Header>
      <Content>
        {/* Add your content here */}
      </Content>
    </Layout>
  );
};

export default MainWindow;
```