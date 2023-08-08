
import React from 'react';
import { Layout } from 'antd';
import { ThemeService } from 'MarkdownCode/services/Theme service/ThemeService';
import { DialogService } from 'MarkdownCode/services/dialog service/DialogService';
import { Outline } from 'MarkdownCode/components/body/outline/Outline';
import { ResultsView } from 'MarkdownCode/components/body/results view/ResultsView';
import { Editor } from 'MarkdownCode/components/body/editor/Editor';
import { VerticalSplitter } from 'MarkdownCode/components/body/VerticalSplitter';

const themeService = new ThemeService();
const dialogService = new DialogService();

/**
 * HorizontalSplitter component
 * This component is responsible for splitting the body of the application into three areas: Outline, ResultsView, and Editor.
 * It uses a vertical splitter to separate the Outline from the rest, and a horizontal splitter to separate the ResultsView from the Editor.
 */
class HorizontalSplitter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: themeService.getCurrentTheme(),
    };
  }

  componentDidMount() {
    themeService.subscribe(this.handleThemeChange);
  }

  componentWillUnmount() {
    themeService.unsubscribe(this.handleThemeChange);
  }

  handleThemeChange = (newTheme) => {
    this.setState({ theme: newTheme });
  }

  render() {
    const { theme } = this.state;
    return (
      <Layout className={`horizontal-splitter ${theme}`}>
        <VerticalSplitter>
          <Outline />
          <Layout>
            <Editor />
            <ResultsView />
          </Layout>
        </VerticalSplitter>
      </Layout>
    );
  }
}

export default HorizontalSplitter;
