
import React, { Component } from 'react';
import { ConfigProvider } from 'antd';
import ThemeService from '../../ThemeService/ThemeService';
import Toolbar from '../toolbar/Toolbar';
import OsDraggable from './OsDraggable';
import Body from '../body/Body';
import './MainWindow.css';

/**
 * MainWindow component
 * This is the main window of the application.
 */
class MainWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: ThemeService.getTheme(),
    };
  }

  componentDidMount() {
    ThemeService.subscribe(this.handleThemeChange);
  }

  componentWillUnmount() {
    ThemeService.unsubscribe(this.handleThemeChange);
  }

  /**
   * Handle theme change
   * @param {string} theme - The new theme
   */
  handleThemeChange = (theme) => {
    this.setState({ theme });
  };

  render() {
    const { theme } = this.state;
    const darkAlgorithm = {}; // Define your dark theme algorithm here
    const defaultAlgorithm = {}; // Define your default theme algorithm here

    return (
      <ConfigProvider theme={{ algorithm: theme === 'dark' ? darkAlgorithm : defaultAlgorithm }}>
        <div className="main-window">
          <header className="main-window-header">
            <OsDraggable />
            <Toolbar />
          </header>
          <Body />
        </div>
      </ConfigProvider>
    );
  }
}

export default MainWindow;
```

```css
/* MainWindow.css */
.main-window {
  width: 100%;
  height: 100%;
}

.main-window-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
