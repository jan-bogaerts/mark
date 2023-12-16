
import React from 'react';
import { Split } from '@geoffcox/react-splitter';
import ThemeService from '../../services/Theme_service/ThemeService';
import Outline from './outline/Outline';
import Editor from './editor/Editor';
import ResultsView from './results_view/ResultsView';

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      verticalSplitSize: localStorage.getItem('verticalSplitSize') || '30%',
      horizontalSplitSize: localStorage.getItem('horizontalSplitSize') || '30%',
    };
  }

  handleVerticalSplitChange = (newSize) => {
    this.setState({ verticalSplitSize: newSize });
  }

  handleHorizontalSplitChange = (newSize) => {
    this.setState({ horizontalSplitSize: newSize });
  }

  componentWillUnmount() {
    localStorage.setItem('verticalSplitSize', this.state.verticalSplitSize);
    localStorage.setItem('horizontalSplitSize', this.state.horizontalSplitSize);
  }

  render() {
    const theme = ThemeService.getCurrentTheme();
    let colors;
    if (theme === 'light') {
      colors = {
        color: '#e8e8e8',
        hover: 'gray',
        drag: '#f5f5f5',
      };
    } else {
      colors = {
        color: '#323233',
        hover: 'gray',
        drag: '#979797',
      };
    }
    return (
      <Split
          initialPrimarySize={this.state.verticalSplitSize}
          defaultSplitterColors={colors}
          minPrimarySize='50px'
          minSecondarySize='15%'
          onSplitChanged={this.handleVerticalSplitChange}
        >
          <Outline />
          <Split
            initialPrimarySize={this.state.horizontalSplitSize}
            defaultSplitterColors={colors}
            minPrimarySize='50px'
            minSecondarySize='15%'
            horizontal
            onSplitChanged={this.handleHorizontalSplitChange}
          >
            <Editor />
            <ResultsView transformer={this.props.transformer} key={this.props.key} />
          </Split>
        </Split>
    );
  }
}

export default Body;
