
import React from 'react';
import { Button, Tooltip  } from 'antd';
import SelectionService from '../../../../services/Selection_service/SelectionService';
import DialogService from '../../../../services/dialog_service/DialogService';
import ThemeService from '../../../../services/Theme_service/ThemeService';
import { MdOutlineFormatIndentDecrease } from "react-icons/md"


/**
 * UnindentButton component
 * This component is a button that decreases the indent of the current line or selection.
 */
class UnindentButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: ThemeService.getCurrentTheme(),
    };
  }

  /**
   * Handle the click event of the button
   * Decrease the indent of the current line or selection
   */
  handleClick = () => {
    try {
      SelectionService.decreaseIndent();
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

  render() {
    const { theme } = this.state;
    return (
      <Tooltip title="Outdent">
        <Button
          className={`unindent-button ${theme}`}
          icon={<MdOutlineFormatIndentDecrease />}
          onClick={this.handleClick}
        />
      </Tooltip>
      
    );
  }
}

export default UnindentButton;
