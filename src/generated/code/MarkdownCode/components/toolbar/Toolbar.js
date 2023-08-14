
import React from 'react';
import { Tabs, Tooltip } from 'antd';
import { ThemeService } from 'MarkdownCode/services/ThemeService/ThemeService';
import { DialogService } from 'MarkdownCode/services/DialogService/DialogService';
import { HomeTab } from 'MarkdownCode/components/toolbar/home/HomeTab';
import { FormatTab } from 'MarkdownCode/components/toolbar/format/FormatTab';
import { PreferencesTab } from 'MarkdownCode/components/toolbar/preferences/PreferencesTab';

const { TabPane } = Tabs;

/**
 * Toolbar component
 * This component is responsible for rendering the toolbar with tabs.
 */
class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'home',
    };
  }

  /**
   * Handle tab change
   * @param {string} key - The key of the tab
   */
  handleTabChange = (key) => {
    this.setState({ activeTab: key });
  }

  /**
   * Render tab pane
   * @param {string} key - The key of the tab
   * @param {string} tab - The name of the tab
   * @param {React.Component} component - The component to be rendered in the tab
   */
  renderTabPane = (key, tab, component) => {
    return (
      <TabPane 
        tab={
          <Tooltip title={tab}>
            <span>{tab}</span>
          </Tooltip>
        } 
        key={key}
      >
        {component}
      </TabPane>
    );
  }

  render() {
    const theme = ThemeService.getCurrentTheme();
    return (
      <Tabs 
        defaultActiveKey={this.state.activeTab} 
        onChange={this.handleTabChange} 
        className={theme}
      >
        {this.renderTabPane('home', 'Home', <HomeTab />)}
        {this.renderTabPane('format', 'Format', <FormatTab />)}
        {this.renderTabPane('preferences', 'Preferences', <PreferencesTab />)}
      </Tabs>
    );
  }
}

export default Toolbar;
