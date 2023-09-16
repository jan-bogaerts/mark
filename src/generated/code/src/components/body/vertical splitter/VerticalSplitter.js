
import React, { Component } from 'react';
import { Resizable } from 're-resizable';
import DialogService from '../../../services/dialog_service/DialogService';
import ThemeService from '../../../services/Theme_service/ThemeService';

const splitterWidth = 8;

/**
 * VerticalSplitter component
 * This component is responsible for managing the layout of 2 child components.
 * Users can increase the width of the panel to the left of the splitter while simultaneously decreasing the size of the panel right of it, or vice versa.
 */
class VerticalSplitter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: this.props.position || 0,
      theme: ThemeService.getCurrentTheme(),
    };
  }

  /**
   * Handle the resizing of the left panel
   * @param {Object} e - The event object
   * @param {String} direction - The direction of the resizing
   * @param {Object} ref - The reference to the resizable object
   * @param {Object} delta - The delta object containing the difference in size
   */
  handleResize = (e, direction, ref, delta) => {
    const newPosition = this.state.position + delta.width;
    this.setState({ position: newPosition });
    if (this.props.onPositionChanged) {
      this.props.onPositionChanged(newPosition);
    }
  };

  /**
   * Handle the error
   * @param {String} error - The error message
   */
  handleError = (error) => {
    DialogService.showErrorDialog(error);
  };

  render() {
    const { left, right } = this.props;
    const { position, theme } = this.state;

    return (
      <div className={`vertical-splitter ${theme}`}>
        <Resizable
          className="left-panel"
          size={{ width: position, height: '100%' }}
          onResize={this.handleResize}
          onResizeStop={this.handleError}
          enable={{ right: true }}
        >
          {left}
        </Resizable>
        <div className="splitter" style={{ width: splitterWidth }} />
        <div className="right-panel" style={{ width: `calc(100% - ${position}px - ${splitterWidth}px)` }}>
          {right}
        </div>
      </div>
    );
  }
}

export default VerticalSplitter;
