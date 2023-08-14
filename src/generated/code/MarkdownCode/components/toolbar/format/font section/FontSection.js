
import React, { Component } from 'react';
import { Button } from 'antd';
import { BoldOutlined, ItalicOutlined, UnderlineOutlined, StrikethroughOutlined } from '@ant-design/icons';
import SelectionService from 'MarkdownCode/services/Selection service/SelectionService';
import ThemeService from 'MarkdownCode/services/Theme service/ThemeService';
import DialogService from 'MarkdownCode/services/dialog service/DialogService';

const BOLD = 'bold';
const ITALIC = 'italic';
const UNDERLINE = 'underline';
const STRIKETHROUGH = 'strikethrough';

class FontSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      [BOLD]: false,
      [ITALIC]: false,
      [UNDERLINE]: false,
      [STRIKETHROUGH]: false,
    };
  }

  componentDidMount() {
    SelectionService.on('selection-changed', this.updateButtonStates);
  }

  componentWillUnmount() {
    SelectionService.off('selection-changed', this.updateButtonStates);
  }

  updateButtonStates = () => {
    try {
      const { bold, italic, underline, strikethrough } = SelectionService.getSelectionStyles();
      this.setState({ [BOLD]: bold, [ITALIC]: italic, [UNDERLINE]: underline, [STRIKETHROUGH]: strikethrough });
    } catch (error) {
      DialogService.showErrorDialog('Error updating button states', error);
    }
  }

  toggleStyle = (style) => {
    try {
      SelectionService.toggleStyle(style);
      this.updateButtonStates();
    } catch (error) {
      DialogService.showErrorDialog(`Error toggling ${style}`, error);
    }
  }

  render() {
    const theme = ThemeService.getCurrentTheme();
    return (
      <div className={`font-section ${theme}`}>
        <Button icon={<BoldOutlined />} className={`btn-${BOLD}`} onClick={() => this.toggleStyle(BOLD)} />
        <Button icon={<ItalicOutlined />} className={`btn-${ITALIC}`} onClick={() => this.toggleStyle(ITALIC)} />
        <Button icon={<UnderlineOutlined />} className={`btn-${UNDERLINE}`} onClick={() => this.toggleStyle(UNDERLINE)} />
        <Button icon={<StrikethroughOutlined />} className={`btn-${STRIKETHROUGH}`} onClick={() => this.toggleStyle(STRIKETHROUGH)} />
      </div>
    );
  }
}

export default FontSection;
