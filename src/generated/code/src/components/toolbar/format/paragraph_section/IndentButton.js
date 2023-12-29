
import React from 'react';
import { Button, Tooltip } from 'antd';
import SelectionService from '../../../../services/Selection_service/SelectionService';
import DialogService from '../../../../services/dialog_service/DialogService';
import ThemeService from '../../../../services/Theme_service/ThemeService';
import { MdFormatIndentIncrease  } from "react-icons/md";

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
      <Tooltip title="Indent" placement='bottom'>
        <Button
          className={`indent-button ${theme}`}
          icon={<MdFormatIndentIncrease />}
          onClick={this.handleClick}
      />
      </Tooltip>
      
    );
  }
}

export default IndentButton;
