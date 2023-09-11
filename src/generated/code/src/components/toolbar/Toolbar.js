
import React from 'react';
import { Tabs } from 'antd';
import { ThemeService } from '../../../../services/Theme_service/ThemeService';
import HomeTab from './home/HomeTab';
import FormatTab from './format/FormatTab';
import PreferencesTab from './preferences/PreferencesTab';

const tabs = [
  { key: 'home', label: 'Home', children: <HomeTab /> },
  { key: 'format', label: 'Format', children: <FormatTab /> },
  { key: 'preferences', label: 'Preferences', children: <PreferencesTab /> },
]

/**
 * Toolbar component
 * @component
 */
class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: ThemeService.getCurrentTheme(),
    };
  }

  /**
   * Render the component
   * @returns {JSX.Element}
   */
  render() {
    const { theme } = this.state;
    return (
      <Tabs className={`toolbar-${theme}`} defaultActiveKey="home" items={tabs}>
  
      </Tabs>
    );
  }
}

export default Toolbar;
