
import React, { Component } from 'react';
import { Button, Tooltip } from 'antd';
import { BulbOutlined, NumberOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import SelectionService from 'MarkdownCode/services/SelectionService';
import UndoService from 'MarkdownCode/services/UndoService';
import ThemeService from 'MarkdownCode/services/ThemeService';
import DialogService from 'MarkdownCode/services/DialogService';

const BULLET_LIST = 'bullet-list';
const NUMBERED_LIST = 'numbered-list';
const INDENT = 'indent';
const UNINDENT = 'unindent';

/**
 * ParagraphSection component
 * Contains actions related to the markup used in the text for applying markdown formatting.
 */
class ParagraphSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: null,
      theme: ThemeService.getCurrentTheme(),
    };
  }

  componentDidMount() {
    document.addEventListener('selectionchange', this.handleSelectionChange);
  }

  componentWillUnmount() {
    document.removeEventListener('selectionchange', this.handleSelectionChange);
  }

  handleSelectionChange = () => {
    const selection = SelectionService.getSelection();
    this.setState({ selection });
  };

  handleButtonClick = (action) => {
    try {
      switch (action) {
        case BULLET_LIST:
          SelectionService.toggleBulletList();
          break;
        case NUMBERED_LIST:
          SelectionService.toggleNumberedList();
          break;
        case INDENT:
          SelectionService.increaseIndent();
          break;
        case UNINDENT:
          SelectionService.decreaseIndent();
          break;
        default:
          break;
      }
      UndoService.saveState();
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

  render() {
    const { theme } = this.state;
    return (
      <div className={`paragraph-section ${theme}`}>
        <Tooltip title="Bullet list">
          <Button icon={<BulbOutlined />} onClick={() => this.handleButtonClick(BULLET_LIST)} />
        </Tooltip>
        <Tooltip title="Numbered list">
          <Button icon={<NumberOutlined />} onClick={() => this.handleButtonClick(NUMBERED_LIST)} />
        </Tooltip>
        <Tooltip title="Increase indent">
          <Button icon={<RightOutlined />} onClick={() => this.handleButtonClick(INDENT)} />
        </Tooltip>
        <Tooltip title="Decrease indent">
          <Button icon={<LeftOutlined />} onClick={() => this.handleButtonClick(UNINDENT)} />
        </Tooltip>
      </div>
    );
  }
}

export default ParagraphSection;
