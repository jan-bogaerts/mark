
import React, { Component } from 'react';
import { Button } from 'antd';
import { BoldOutlined, ItalicOutlined, UnderlineOutlined, StrikethroughOutlined } from '@ant-design/icons';
import SelectionService from 'MarkdownCode/services/Selection service/SelectionService';
import ThemeService from 'MarkdownCode/services/Theme service/ThemeService';
import DialogService from 'MarkdownCode/services/dialog service/DialogService';

const selectionService = new SelectionService();
const themeService = new ThemeService();
const dialogService = new DialogService();

class FontSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bold: false,
      italic: false,
      underline: false,
      strikeThrough: false,
    };
  }

  componentDidMount() {
    themeService.subscribe(this.handleThemeChange);
    selectionService.subscribe(this.handleSelectionChange);
  }

  componentWillUnmount() {
    themeService.unsubscribe(this.handleThemeChange);
    selectionService.unsubscribe(this.handleSelectionChange);
  }

  handleThemeChange = (theme) => {
    this.setState({ theme });
  }

  handleSelectionChange = (selection) => {
    this.setState({
      bold: selection.bold,
      italic: selection.italic,
      underline: selection.underline,
      strikeThrough: selection.strikeThrough,
    });
  }

  toggleBold = () => {
    this.toggleFormat('bold');
  }

  toggleItalic = () => {
    this.toggleFormat('italic');
  }

  toggleUnderline = () => {
    this.toggleFormat('underline');
  }

  toggleStrikeThrough = () => {
    this.toggleFormat('strikeThrough');
  }

  toggleFormat = (format) => {
    try {
      selectionService.toggleFormat(format);
      this.setState(prevState => ({ [format]: !prevState[format] }));
    } catch (error) {
      dialogService.showErrorDialog(error);
    }
  }

  render() {
    const { bold, italic, underline, strikeThrough } = this.state;
    return (
      <div className="font-section">
        <Button icon={<BoldOutlined />} onClick={this.toggleBold} className={bold ? 'active' : ''} />
        <Button icon={<ItalicOutlined />} onClick={this.toggleItalic} className={italic ? 'active' : ''} />
        <Button icon={<UnderlineOutlined />} onClick={this.toggleUnderline} className={underline ? 'active' : ''} />
        <Button icon={<StrikethroughOutlined />} onClick={this.toggleStrikeThrough} className={strikeThrough ? 'active' : ''} />
      </div>
    );
  }
}

export default FontSection;
