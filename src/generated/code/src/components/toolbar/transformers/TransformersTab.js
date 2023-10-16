
import React from 'react';
import { Row } from 'antd';
import ThemeService from '../../../services/Theme_service/ThemeService';
import DialogService from '../../../services/dialog_service/DialogService';
import ConfigurationSection from './transformers-configuration_section/ConfigurationSection';
import BuildSection from './build_section/BuildSection';

/**
 * TransformersTab component
 * This component is a wrapper that displays its children in a row.
 * It contains ConfigurationSection and BuildSection as child components.
 */
class TransformersTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: ThemeService.getCurrentTheme(),
    };
  }

  /**
   * Error handler function
   * @param {Function} fn - The function to be executed
   */
  errorHandler = (fn) => {
    try {
      fn();
    } catch (error) {
      DialogService.showErrorDialog(error.message);
    }
  };

  render() {
    const { theme } = this.state;
    return (
      <Row className={`transformers-tab ${theme}`}>
        <ConfigurationSection errorHandler={this.errorHandler} />
        <BuildSection errorHandler={this.errorHandler} />
      </Row>
    );
  }
}

export default TransformersTab;
