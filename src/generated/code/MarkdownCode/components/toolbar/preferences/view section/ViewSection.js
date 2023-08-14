
// Importing required services and components
import ThemeService from 'MarkdownCode/services/ThemeService/ThemeService';
import DialogService from 'MarkdownCode/services/DialogService/DialogService';
import ThemeComboBox from 'MarkdownCode/components/toolbar/preferences/view section/ThemeComboBox';
import FontComboBox from 'MarkdownCode/components/toolbar/preferences/view section/FontComboBox';
import FontSizeComboBox from 'FontSizeComboBox';

// Constants for styling names
const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';

/**
 * ViewSection component
 * This component is responsible for configuring the appearance of the application.
 * It allows users to select the theme (light or dark mode), font, and font size for the monaco editor and markdown viewer.
 */
class ViewSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: ThemeService.getCurrentTheme(),
    };
  }

  /**
   * Function to handle theme change
   * @param {string} newTheme - The new theme selected by the user
   */
  handleThemeChange = (newTheme) => {
    try {
      ThemeService.setCurrentTheme(newTheme);
      this.setState({ theme: newTheme });
    } catch (error) {
      DialogService.showErrorDialog('Error while changing theme', error);
    }
  }

  render() {
    const { theme } = this.state;
    const themeClassName = theme === LIGHT_THEME ? 'light-theme' : 'dark-theme';

    return (
      <div className={`view-section ${themeClassName}`}>
        <ThemeComboBox onChange={this.handleThemeChange} />
        <FontComboBox />
        <FontSizeComboBox />
      </div>
    );
  }
}

export default ViewSection;
