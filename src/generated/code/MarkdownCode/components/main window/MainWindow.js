
// Importing required services and components
import ThemeService from 'MarkdownCode/services/ThemeService/ThemeService';
import DialogService from 'MarkdownCode/services/DialogService/DialogService';
import Toolbar from 'MarkdownCode/components/Toolbar/Toolbar';
import Body from 'MarkdownCode/components/Body/Body';

// MainWindow component
class MainWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: ThemeService.getCurrentTheme(),
    };
  }

  // Function to handle theme change
  handleThemeChange = () => {
    this.setState({ theme: ThemeService.getCurrentTheme() });
  }

  // Function to handle errors
  handleError = (error) => {
    DialogService.showErrorDialog(error);
  }

  componentDidMount() {
    // Subscribe to theme change
    ThemeService.subscribe(this.handleThemeChange);

    // Handle errors
    window.addEventListener('error', this.handleError);
  }

  componentWillUnmount() {
    // Unsubscribe from theme change
    ThemeService.unsubscribe(this.handleThemeChange);

    // Remove error handler
    window.removeEventListener('error', this.handleError);
  }

  render() {
    const { theme } = this.state;

    return (
      <div className={`main-window ${theme}`}>
        <Toolbar />
        <Body />
      </div>
    );
  }
}

export default MainWindow;
