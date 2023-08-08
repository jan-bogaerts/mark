
import React, { useEffect, useState } from 'react';
import { Tooltip, Tabs } from 'antd';
import HomeTab from 'MarkdownCode/components/toolbar/home/HomeTab';
import FormatTab from 'MarkdownCode/components/toolbar/format/FormatTab';
import PreferencesTab from 'MarkdownCode/components/toolbar/preferences/PreferencesTab';
import ThemeService from 'MarkdownCode/services/Theme service/ThemeService';
import DialogService from 'MarkdownCode/services/dialog service/DialogService';

const { TabPane } = Tabs;

/**
 * Toolbar component
 * @component
 */
function Toolbar() {
  const [theme, setTheme] = useState(ThemeService.getCurrentTheme());

  useEffect(() => {
    const unsubscribe = ThemeService.subscribe((newTheme) => {
      setTheme(newTheme);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const errorHandler = (action) => {
    try {
      action();
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

  return (
    <div className={`toolbar ${theme}`}>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <Tooltip title="Home tab">
              <span>Home</span>
            </Tooltip>
          }
          key="1"
        >
          <HomeTab errorHandler={errorHandler} />
        </TabPane>
        <TabPane
          tab={
            <Tooltip title="Format tab">
              <span>Format</span>
            </Tooltip>
          }
          key="2"
        >
          <FormatTab errorHandler={errorHandler} />
        </TabPane>
        <TabPane
          tab={
            <Tooltip title="Preferences tab">
              <span>Preferences</span>
            </Tooltip>
          }
          key="3"
        >
          <PreferencesTab errorHandler={errorHandler} />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Toolbar;
