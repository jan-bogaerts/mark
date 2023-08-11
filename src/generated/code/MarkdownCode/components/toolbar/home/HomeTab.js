
import React, { Component } from 'react';
import { Row } from 'antd';
import { ThemeService } from 'MarkdownCode/services/Theme service/ThemeService';
import { DialogService } from 'MarkdownCode/services/dialog service/DialogService';
import { UndoService } from 'MarkdownCode/services/Undo service/UndoService';
import { BuildService } from 'MarkdownCode/services/build service/BuildService';
import FileSection from 'MarkdownCode/components/toolbar/home/file section/FileSection';
import EditSection from 'MarkdownCode/components/toolbar/home/edit section/EditSection';
import UndoSection from 'MarkdownCode/components/toolbar/home/undo section/UndoSection';
import BuildSection from 'MarkdownCode/components/toolbar/home/build section/BuildSection';

/**
 * HomeTab component
 * This component is a wrapper that displays its children in a row.
 * It contains the following child components: FileSection, EditSection, UndoSection, BuildSection.
 */
class HomeTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: ThemeService.getCurrentTheme(),
    };
  }

  componentDidMount() {
    // Subscribe to theme changes
    ThemeService.subscribe(this.handleThemeChange);
  }

  componentWillUnmount() {
    // Unsubscribe from theme changes
    ThemeService.unsubscribe(this.handleThemeChange);
  }

  /**
   * Handle theme change
   * This function is called when the theme is changed.
   * It updates the state with the new theme.
   */
  handleThemeChange = (newTheme) => {
    this.setState({ theme: newTheme });
  }

  render() {
    const { theme } = this.state;

    return (
      <Row className={`home-tab ${theme}`} style={{ width: '100%' }}>
        <FileSection theme={theme} />
        <EditSection theme={theme} />
        <UndoSection theme={theme} />
        <BuildSection theme={theme} />
      </Row>
    );
  }
}

export default HomeTab;
