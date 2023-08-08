
import React, { Component } from 'react';
import { Layout } from 'antd';
import Outline from 'MarkdownCode/components/body/outline/Outline';
import ResultsView from 'MarkdownCode/components/body/results view/ResultsView';
import Editor from 'MarkdownCode/components/body/editor/Editor';
import HorizontalSplitter from 'MarkdownCode/components/body/HorizontalSplitter';
import VerticalSplitter from 'MarkdownCode/components/body/VerticalSplitter';
import ThemeService from 'MarkdownCode/services/Theme service/ThemeService';
import DialogService from 'MarkdownCode/services/dialog service/DialogService';

const { Content } = Layout;

/**
 * Body component represents the main body of the application.
 * It consists of an Outline, ResultsView and Editor components.
 * These areas can be resized using a horizontal or vertical splitter.
 */
class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: ThemeService.getCurrentTheme(),
    };
    this.themeServiceSubscription = null;
  }

  componentDidMount() {
    this.themeServiceSubscription = ThemeService.subscribe((newTheme) => {
      this.setState({ theme: newTheme });
    });
  }

  componentWillUnmount() {
    if (this.themeServiceSubscription) {
      this.themeServiceSubscription.unsubscribe();
    }
  }

  render() {
    const { theme } = this.state;

    return (
      <Content className={`body ${theme}`}>
        <Outline className="outline" />
        <VerticalSplitter className="vertical-splitter" />
        <div className="editor-results-container">
          <Editor className="editor" />
          <HorizontalSplitter className="horizontal-splitter" />
          <ResultsView className="results-view" />
        </div>
      </Content>
    );
  }
}

export default Body;
