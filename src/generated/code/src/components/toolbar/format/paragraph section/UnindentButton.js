
import React from 'react';
import { Button } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import SelectionService from '../../../../services/SelectionService';
import DialogService from '../../../../services/DialogService';
import ThemeService from '../../../../services/ThemeService';

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
      <Button
        className={`unindent-button ${theme}`}
        icon={<UnorderedListOutlined />}
        onClick={this.handleClick}
      />
    );
  }
}

export default UnindentButton;
