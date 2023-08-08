
import React, { Component } from 'react';
import { Button, Tooltip } from 'antd';
import { BulbOutlined, NumberOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import SelectionService from 'MarkdownCode/services/SelectionService/SelectionService';
import UndoService from 'MarkdownCode/services/UndoService/UndoService';
import ThemeService from 'MarkdownCode/services/ThemeService/ThemeService';
import DialogService from 'MarkdownCode/services/DialogService/DialogService';

const bulletListIcon = <BulbOutlined />;
const numberListIcon = <NumberOutlined />;
const indentIcon = <RightOutlined />;
const unindentIcon = <LeftOutlined />;

/**
 * ParagraphSection component
 * Contains actions related to the markup used in the text for applying markdown formatting.
 */
class ParagraphSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bulletListActive: false,
      numberListActive: false,
    };
    this.selectionService = new SelectionService();
    this.undoService = new UndoService();
    this.themeService = new ThemeService();
    this.dialogService = new DialogService();
  }

  componentDidMount() {
    this.themeService.subscribe(this.handleThemeChange);
  }

  componentWillUnmount() {
    this.themeService.unsubscribe(this.handleThemeChange);
  }

  handleThemeChange = (theme) => {
    this.setState({ theme });
  }

  handleBulletListToggle = () => {
    try {
      this.undoService.saveState();
      this.selectionService.toggleBulletList();
      this.setState({ bulletListActive: !this.state.bulletListActive });
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
  }

  handleNumberListToggle = () => {
    try {
      this.undoService.saveState();
      this.selectionService.toggleNumberList();
      this.setState({ numberListActive: !this.state.numberListActive });
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
  }

  handleIndent = () => {
    try {
      this.undoService.saveState();
      this.selectionService.indent();
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
  }

  handleUnindent = () => {
    try {
      this.undoService.saveState();
      this.selectionService.unindent();
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
  }

  render() {
    const { bulletListActive, numberListActive, theme } = this.state;
    return (
      <div className={`paragraph-section ${theme}`}>
        <Tooltip title="Bullet List">
          <Button
            icon={bulletListIcon}
            onClick={this.handleBulletListToggle}
            className={`toggle-button ${bulletListActive ? 'active' : ''}`}
          />
        </Tooltip>
        <Tooltip title="Numbered List">
          <Button
            icon={numberListIcon}
            onClick={this.handleNumberListToggle}
            className={`toggle-button ${numberListActive ? 'active' : ''}`}
          />
        </Tooltip>
        <Tooltip title="Indent">
          <Button icon={indentIcon} onClick={this.handleIndent} className="action-button" />
        </Tooltip>
        <Tooltip title="Unindent">
          <Button icon={unindentIcon} onClick={this.handleUnindent} className="action-button" />
        </Tooltip>
      </div>
    );
  }
}

export default ParagraphSection;
