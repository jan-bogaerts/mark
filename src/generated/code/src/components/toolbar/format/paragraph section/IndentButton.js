
import React from 'react';
import { Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import SelectionService from '../../../../services/SelectionService/SelectionService';
import DialogService from '../../../../services/DialogService/DialogService';
import ThemeService from '../../../../services/ThemeService/ThemeService';

/**
 * IndentButton component
 * This component is used to apply the indent action to the current line or selection of text.
 */
class IndentButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: ThemeService.getCurrentTheme(),
    };
  }

  /**
   * Handle the click event on the button
   * Apply the indent action to the current line or selection of text
   */
  handleClick = () => {
    try {
      SelectionService.indentSelection();
    } catch (error) {
      DialogService.showErrorDialog(error.message);
    }
  };

  render() {
    const { theme } = this.state;
    return (
      <Button
        className={`indent-button ${theme}`}
        icon={<RightOutlined />}
        onClick={this.handleClick}
      />
    );
  }
}

export default IndentButton;
