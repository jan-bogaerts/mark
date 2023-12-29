import React, { Component } from 'react';
import { Button, Tooltip } from 'antd';
import { BoldOutlined, ItalicOutlined, UnderlineOutlined, StrikethroughOutlined } from '@ant-design/icons';
import SelectionService from '../../../../services/Selection_service/SelectionService';
import PositionTrackingService from '../../../../services/position-tracking_service/PositionTrackingService';
import DialogService from '../../../../services/dialog_service/DialogService';
import ThemeService from '../../../../services/Theme_service/ThemeService';

class FontSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStyle: {},
    };
  }

  componentDidMount() {
    SelectionService.subscribe(this.updateButtonState);
    PositionTrackingService.eventTarget.addEventListener('pos-changed', this.updateButtonState);
  }

  componentWillUnmount() {
    SelectionService.unsubscribe(this.updateButtonState);
    PositionTrackingService.eventTarget.removeEventListener('pos-changed', this.updateButtonState);
  }

  updateButtonState = () => {
    try {
      const currentStyle = SelectionService.getBlockStyles();
      this.setState({ currentStyle });
    } catch (error) {
      DialogService.showErrorDialog('Error while updating button state', error);
    }
  };

  toggleStyle = (styleKey) => {
    try {
      const newStyle = { ...this.state.currentStyle };
      newStyle[styleKey] = !newStyle[styleKey];
      SelectionService.setBlockStyle(newStyle);
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
        <Tooltip title="Toggle bold formatting" placement='bottom'>
          <Button
            className={`toggle-btn ${currentStyle.bold ? `selected-${theme}` : ''}`}
            icon={<BoldOutlined />}
            onClick={() => this.toggleStyle('bold')}
          />
        </Tooltip>
        <Tooltip title="Toggle italic formatting" placement='bottom'>
          <Button
            className={`toggle-btn ${currentStyle.italic ? `selected-${theme}` : ''}`}
            icon={<ItalicOutlined />}
            onClick={() => this.toggleStyle('italic')}
          />
        </Tooltip>
        <Tooltip title="Toggle underline formatting" placement='bottom'>
          <Button
            className={`toggle-btn ${currentStyle.underline ? `selected-${theme}` : ''}`}
            icon={<UnderlineOutlined />}
            onClick={() => this.toggleStyle('underline')}
          />
        </Tooltip>
        <Tooltip title="Toggle strikethrough formatting" placement='bottom'>
          <Button
            className={`toggle-btn ${currentStyle.strikethrough ? `selected-${theme}` : ''}`}
            icon={<StrikethroughOutlined />}
            onClick={() => this.toggleStyle('strikethrough')}
          />
        </Tooltip>
      </div>
    );
  }
}

export default FontSection;