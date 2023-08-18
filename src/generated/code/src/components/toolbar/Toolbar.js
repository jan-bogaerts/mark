
import React from 'react';
import { Tabs, Tooltip } from 'antd';
import { DialogService } from '../../services/dialog service/DialogService';
import { ThemeService } from '../../services/Theme service/ThemeService';
import HomeTab from './home/HomeTab';
import FormatTab from './format/FormatTab';
import PreferencesTab from './preferences/PreferencesTab';

const { TabPane } = Tabs;

/**
 * Toolbar component
 * This component represents the toolbar of the application.
 */
class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTheme: ThemeService.getCurrentTheme(),
    };
  }

  /**
   * Function to render a tab with a tooltip
   * @param {string} key - The key of the tab
   * @param {string} tab - The name of the tab
   * @param {string} tooltip - The tooltip of the tab
   * @param {React.Component} component - The component of the tab
   */
  renderTab(key, tab, tooltip, component) {
    return (
      <TabPane
        key={key}
        tab={
          <Tooltip title={tooltip}>
            {tab}
          </Tooltip>
        }
      >
        {component}
      </TabPane>
    );
  }

  render() {
    return (
      <Tabs defaultActiveKey="1" className={this.state.currentTheme}>
        {this.renderTab("1", "Home", "Go to Home", <HomeTab />)}
        {this.renderTab("2", "Format", "Change the format", <FormatTab />)}
        {this.renderTab("3", "Preferences", "Change your preferences", <PreferencesTab />)}
      </Tabs>
    );
  }
}

export default Toolbar;
