
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
   * Render the component.
   */
  render() {
    return (
      <Tabs defaultActiveKey="1" className={this.state.currentTheme}>
        <TabPane
          tab={
            <Tooltip title="Home tab">
              <span>Home</span>
            </Tooltip>
          }
          key="1"
        >
          <HomeTab />
        </TabPane>
        <TabPane
          tab={
            <Tooltip title="Format tab">
              <span>Format</span>
            </Tooltip>
          }
          key="2"
        >
          <FormatTab />
        </TabPane>
        <TabPane
          tab={
            <Tooltip title="Preferences tab">
              <span>Preferences</span>
            </Tooltip>
          }
          key="3"
        >
          <PreferencesTab />
        </TabPane>
      </Tabs>
    );
  }
}

export default Toolbar;
