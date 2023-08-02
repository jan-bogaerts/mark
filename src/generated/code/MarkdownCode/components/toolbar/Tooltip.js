
const TABS = ['home', 'format', 'preferences'];
const THEME_SERVICE = 'ThemeService';
const DIALOG_SERVICE = 'DialogService';

/**
 * Tooltip component
 * @param {string} description - The tooltip description
 */
const Tooltip = ({ description }) => {
  return (
    <Tooltip title={description}>
      <a href="#" className="tooltip">{description}</a>
    </Tooltip>
  );
};

/**
 * Tab component
 * @param {string} tab - The tab name
 */
const Tab = ({ tab }) => {
  return (
    <TabPane tab={tab} key={tab}>
      <Tooltip description={tab} />
    </TabPane>
  );
};

/**
 * Toolbar component
 * @param {array} tabs - The tabs array
 */
const Toolbar = ({ tabs }) => {
  return (
    <Tabs defaultActiveKey="home">
      {tabs.map(tab => <Tab key={tab} tab={tab} />)}
    </Tabs>
  );
};

/**
 * Main window component
 * @param {string} themeService - The theme service
 * @param {string} dialogService - The dialog service
 */
class MainWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: props.themeService.getCurrentTheme(),
    };
  }

  componentDidMount() {
    this.props.themeService.on('themeChanged', this.handleThemeChange);
  }

  componentWillUnmount() {
    this.props.themeService.off('themeChanged', this.handleThemeChange);
  }

  handleThemeChange = (newTheme) => {
    this.setState({ theme: newTheme });
  }

  render() {
    return (
      <div className={`main-window ${this.state.theme}`}>
        <Toolbar tabs={TABS} />
      </div>
    );
  }
}

/**
 * Error handler
 * @param {function} fn - The function to wrap
 * @param {string} dialogService - The dialog service
 */
const withErrorHandler = (fn, dialogService) => {
  return (...args) => {
    try {
      return fn(...args);
    } catch (error) {
      dialogService.showErrorDialog(error);
    }
  };
};
