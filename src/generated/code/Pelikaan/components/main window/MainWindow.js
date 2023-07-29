import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { ThemeProvider } from 'styled-components';

const { Header, Content } = Layout;

const MainWindow = () => {
  const [theme, setTheme] = useState('light');
  const [stylingOption, setStylingOption] = useState('light');

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  const handleStylingOptionChange = (selectedStylingOption) => {
    setStylingOption(selectedStylingOption);
  };

  return (
    <ThemeProvider theme={{ mode: theme }}>
      <Layout>
        <Header>
          <Menu theme={theme} mode="horizontal">
            {/* Menu items */}
          </Menu>
        </Header>
        <Content>
          {/* Body content */}
        </Content>
      </Layout>
    </ThemeProvider>
  );
};

export default MainWindow;