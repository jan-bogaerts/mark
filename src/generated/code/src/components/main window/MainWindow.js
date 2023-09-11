
// Importing required modules and components
import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import ThemeService from '../../services/Theme_service/ThemeService';
import Toolbar from '../toolbar/Toolbar';
import Body from '../body/Body';

// Constants
const { Header, Content } = Layout;

/**
 * MainWindow component
 * This is the main window component of the application.
 * It contains a toolbar and a body component.
 */
const MainWindow = () => {
  const [theme, setTheme] = useState(ThemeService.getCurrentTheme());

  // Use effect hook to update the theme when it changes
  useEffect(() => {
    const updateTheme = () => {
      setTheme(ThemeService.getCurrentTheme());
    };
    ThemeService.subscribe(updateTheme);
    return () => {
      ThemeService.unsubscribe(updateTheme);
    };
  }, []);

  return (
    <Layout className={`main-window ${theme}`}>
      <Header className="toolbar">
        <Toolbar />
      </Header>
      <Content className="body">
        <Body />
      </Content>
    </Layout>
  );
};

export default MainWindow;
