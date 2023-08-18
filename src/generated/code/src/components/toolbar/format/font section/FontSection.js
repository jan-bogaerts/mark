
import React, { Component } from 'react';
import { Button } from 'antd';
import { BoldOutlined, ItalicOutlined, UnderlineOutlined, StrikethroughOutlined } from '@ant-design/icons';
import SelectionService from '../../../../services/SelectionService/SelectionService';
import DialogService from '../../../../services/DialogService/DialogService';
import ThemeService from '../../../../services/ThemeService/ThemeService';

/**
 * FontSection component
 * Contains actions related to the markup used in the text for applying markdown formatting.
 */
class FontSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStyle: {},
    };
  }

  componentDidMount() {
    SelectionService.subscribe(this.updateButtonState);
  }

  updateButtonState = () => {
    try {
      const currentStyle = SelectionService.getCurrentStyle();
      this.setState({ currentStyle });
    } catch (error) {
      DialogService.showErrorDialog('Error while updating button state', error);
    }
  };

  toggleStyle = (styleKey) => {
    try {
      const newStyle = { ...this.state.currentStyle };
      newStyle[styleKey] = !newStyle[styleKey];
      SelectionService.setStyle(newStyle);
      this.setState({ currentStyle: newStyle });
    } catch (error) {
      DialogService.showErrorDialog('Error while toggling style', error);
    }
  };

  render() {
    const theme = ThemeService.getCurrentTheme();
    const { currentStyle } = this.state;

    return (
      <div className={`font-section ${theme}`}>
        <Button
          className={`toggle-btn ${currentStyle.bold ? 'active' : ''}`}
          icon={<BoldOutlined />}
          onClick={() => this.toggleStyle('bold')}
        />
        <Button
          className={`toggle-btn ${currentStyle.italic ? 'active' : ''}`}
          icon={<ItalicOutlined />}
          onClick={() => this.toggleStyle('italic')}
        />
        <Button
          className={`toggle-btn ${currentStyle.underline ? 'active' : ''}`}
          icon={<UnderlineOutlined />}
          onClick={() => this.toggleStyle('underline')}
        />
        <Button
          className={`toggle-btn ${currentStyle.strikethrough ? 'active' : ''}`}
          icon={<StrikethroughOutlined />}
          onClick={() => this.toggleStyle('strikethrough')}
        />
      </div>
    );
  }
}

export default FontSection;
