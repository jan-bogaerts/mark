
import DialogService from 'MarkdownCode/services/dialog service/DialogService';
import ThemeService from 'MarkdownCode/services/Theme service/ThemeService';
import ProjectService from 'MarkdownCode/services/project service/ProjectService';
import SelectionService from 'MarkdownCode/services/Selection service/SelectionService';
import UndoService from 'MarkdownCode/services/Undo service/UndoService';
import LineParser from 'MarkdownCode/services/line parser/LineParser';
import PositionTrackingService from 'MarkdownCode/services/position-tracking service/PositionTrackingService';
import ResultCacheService from 'MarkdownCode/services/result-cache service/ResultCacheService';
import BuildService from 'MarkdownCode/services/build service/BuildService';
import CompressService from 'MarkdownCode/services/compress service/CompressService';
import Tab from 'MarkdownCode/components/body/results view/Tab';
import MonacoEditor from 'MarkdownCode/components/body/results view/MonacoEditor';
import ContextMenu from 'MarkdownCode/components/body/results view/ContextMenu';
import MenuItem from 'MarkdownCode/components/body/results view/MenuItem';
import Button from 'MarkdownCode/components/body/results view/Button';

/**
 * ResultsView component
 * This component is responsible for displaying the results based on the selected text block.
 */
class ResultsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: null,
      results: [],
      theme: ThemeService.getCurrentTheme(),
    };
  }

  componentDidMount() {
    PositionTrackingService.subscribe(this.updateActiveTab);
    ThemeService.subscribe(this.updateTheme);
  }

  componentWillUnmount() {
    PositionTrackingService.unsubscribe(this.updateActiveTab);
    ThemeService.unsubscribe(this.updateTheme);
  }

  updateActiveTab = (newTab) => {
    this.setState({ activeTab: newTab });
  }

  updateTheme = (newTheme) => {
    this.setState({ theme: newTheme });
  }

  handleRefresh = () => {
    const result = ResultCacheService.refreshResult(this.state.activeTab);
    this.setState({ results: [...this.state.results, result] });
  }

  handleMore = () => {
    DialogService.showContextMenu();
  }

  render() {
    const { activeTab, results, theme } = this.state;
    return (
      <div className={`results-view ${theme}`}>
        <Tab activeTab={activeTab} />
        {results.map((result, index) => (
          <MonacoEditor key={index} result={result} theme={theme} />
        ))}
        <Button onClick={this.handleRefresh} className="refresh-button">Refresh</Button>
        <Button onClick={this.handleMore} className="more-button">More</Button>
      </div>
    );
  }
}

export default ResultsView;
