
const electron = require('electron');
const React = require('react');
const { Layout } = require('antd');
const { Header, Content } = Layout;
const ThemeService = require('./services/ThemeService');
const DialogService = require('./services/DialogService');
const Toolbar = require('./components/Toolbar');
const Body = require('./components/Body');

/**
 * MainWindow component
 * This is the main window of the application.
 * It contains a toolbar and a body.
 * It uses the ThemeService to apply the selected theme and refresh its content when the theme is updated.
 * It uses the DialogService to display dialog boxes.
 */
class MainWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: ThemeService.getCurrentTheme(),
    };
  }

  componentDidMount() {
    this.themeChangeSubscription = ThemeService.subscribe(this.handleThemeChange);
  }

  componentWillUnmount() {
    this.themeChangeSubscription.unsubscribe();
  }

  /**
   * Handle theme change
   * Refresh the entire content of the main window when the selected theme is updated.
   */
  handleThemeChange = (newTheme) => {
    this.setState({ theme: newTheme });
  }

  /**
   * Render the main window
   * The main window contains a toolbar and a body.
   * The toolbar is located at the top of the window.
   * The body occupies all of the remaining space in the window.
   */
  render() {
    return (
      <Layout className={`main-window ${this.state.theme}`}>
        <Header className="main-window-toolbar">
          <Toolbar />
        </Header>
        <Content className="main-window-body">
          <Body />
        </Content>
      </Layout>
    );
  }
}

module.exports = MainWindow;
