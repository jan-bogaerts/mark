
import React, { Component } from 'react';
import { Row } from 'antd';
import FileComponent from 'MarkdownCode/components/toolbar/home/file section/FileComponent';
import EditComponent from 'MarkdownCode/components/toolbar/home/edit section/EditComponent';
import UndoComponent from 'MarkdownCode/components/toolbar/home/undo section/UndoComponent';
import BuildComponent from 'MarkdownCode/components/toolbar/home/build section/BuildComponent';
import ThemeService from 'MarkdownCode/services/Theme service/ThemeService';
import DialogService from 'MarkdownCode/services/dialog service/DialogService';

/**
 * HomeTab component
 * This component is a wrapper that displays its children in a row.
 */
class HomeTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: ThemeService.getCurrentTheme(),
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
   */
  handleThemeChange = (newTheme) => {
    this.setState({ theme: newTheme });
  }

  /**
   * Render the HomeTab component
   */
  render() {
    const { theme } = this.state;
    return (
      <Row className={`home-tab ${theme}`} >
        <FileComponent />
        <EditComponent />
        <UndoComponent />
        <BuildComponent />
      </Row>
    );
  }
}

export default HomeTab;
