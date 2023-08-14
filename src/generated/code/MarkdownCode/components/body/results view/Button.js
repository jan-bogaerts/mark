
import React from 'react';
import { Button, Menu } from 'antd';
import { MonacoEditor, Tab, ResultsView, ContextMenu, MenuItem } from 'MarkdownCode/components/body/results view';
import { DialogService, ThemeService, ProjectService, SelectionService, UndoService, LineParser, PositionTrackingService, ResultCacheService, BuildService, CompressService } from 'MarkdownCode/services';

const THEME = ThemeService.getTheme();
const DIALOG = new DialogService();

/**
 * Button component
 */
class ButtonComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: '',
      results: [],
      models: [],
      selectedModel: '',
      overwritten: false,
    };
  }

  componentDidMount() {
    this.updateResults();
    this.updateModels();
  }

  updateResults() {
    // Fetch results and update state
  }

  updateModels() {
    // Fetch models and update state
  }

  handleTabChange(activeTab) {
    this.setState({ activeTab });
  }

  handleModelChange(selectedModel) {
    this.setState({ selectedModel });
  }

  handleOverwrite() {
    this.setState({ overwritten: true });
  }

  handleRefresh() {
    this.updateResults();
  }

  handleCopy() {
    // Copy current text to clipboard
  }

  render() {
    const { activeTab, results, models, selectedModel, overwritten } = this.state;

    return (
      <ResultsView>
        <Tab onChange={this.handleTabChange.bind(this)} activeKey={activeTab}>
          {results.map(result => (
            <Tab.Pane key={result.id} tab={result.name}>
              <MonacoEditor
                value={result.content}
                readOnly={overwritten}
                theme={THEME}
              />
            </Tab.Pane>
          ))}
        </Tab>
        <Button onClick={this.handleRefresh.bind(this)}>Refresh</Button>
        <Button onClick={this.handleCopy.bind(this)}>Copy</Button>
        <Button>
          More
          <ContextMenu>
            <MenuItem onClick={this.handleOverwrite.bind(this)}>Overwrite</MenuItem>
            <Menu.SubMenu title="Select Model">
              {models.map(model => (
                <MenuItem
                  key={model.id}
                  onClick={this.handleModelChange.bind(this, model.id)}
                >
                  {model.name}
                </MenuItem>
              ))}
            </Menu.SubMenu>
          </ContextMenu>
        </Button>
      </ResultsView>
    );
  }
}

export default ButtonComponent;
