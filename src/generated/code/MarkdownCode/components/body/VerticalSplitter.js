
import React from 'react';
import { Layout } from 'antd';
import Outline from 'MarkdownCode/components/body/outline/Outline';
import ResultsView from 'MarkdownCode/components/body/results view/ResultsView';
import Editor from 'MarkdownCode/components/body/editor/Editor';
import Body from 'MarkdownCode/components/body/Body';
import HorizontalSplitter from 'MarkdownCode/components/body/HorizontalSplitter';
import ThemeService from 'MarkdownCode/services/Theme service/ThemeService';
import DialogService from 'MarkdownCode/services/dialog service/DialogService';

const { Sider, Content } = Layout;

/**
 * VerticalSplitter component
 * This component is used to create a vertical splitter between the Outline and the rest of the body.
 */
class VerticalSplitter extends React.Component {
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
      <Layout style={{ height: '100%', overflow: 'hidden' }}>
        <Sider theme={theme} className="vertical-splitter">
          <Outline />
        </Sider>
        <Layout>
          <Content className="vertical-splitter-content">
            <HorizontalSplitter>
              <Editor />
              <ResultsView />
            </HorizontalSplitter>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default VerticalSplitter;
