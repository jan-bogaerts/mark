import React, { Component } from 'react';
import { Tree } from 'antd';
import projectService from '../../../../services/project_service/ProjectService';
import positionTrackingService from '../../../../services/position-tracking_service/PositionTrackingService';
import dialogService from '../../../../services/dialog_service/DialogService';
import themeService from '../../../../services/Theme_service/ThemeService';

/**
 * Outline component
 */
class Outline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      selectedKeys: [],
    };
  }

  componentDidMount() {
    projectService.subscribe('content-changed', this.handleContentChanged);
    projectService.subscribe('fragment-deleted', this.handleFragmentDeleted);
    projectService.subscribe('fragment-inserted', this.handleFragmentInserted);
    projectService.subscribe('key-changed', this.handleKeyChanged);
    positionTrackingService.subscribe(this.handlePositionChanged);
  }

  handleContentChanged = () => {
    const projectData = projectService.getProjectData();
    const treeData = this.convertToTreeData(projectData);
    this.setState({ treeData });
  };

  handleFragmentDeleted = (key) => {
    this.removeNode(key);
  };

  handleFragmentInserted = () => {
    this.handleContentChanged();
  };

  handleKeyChanged = () => {
    this.handleContentChanged();
  };

  handlePositionChanged = (key) => {
    this.setState({ selectedKeys: [key] });
  };

  convertToTreeData = (data) => {
    let parent = null;
    const treeData = [];
    data.forEach(item => {
      const node = { title: item.title, key: item.key, data: item, children: [] };
      if (item.levelCount === 1) {
        treeData.push(node);
        parent = node;
      } else if (!parent) {
        return;
      } else if (item.levelCount > parent.data.levelCount) {
        parent.children.push(node);
        parent = node;
      } else {
        while (parent && parent.data.levelCount >= item.levelCount) {
          parent = parent.parent;
        }
        if (parent) {
          parent.children.push(node);
          parent = node;
        }
      }
    });
    return treeData;
  };

  removeNode = (key) => {
    const treeData = this.removeNodeByKey(this.state.treeData, key);
    this.setState({ treeData });
  };

  removeNodeByKey = (nodes, key) => {
    return nodes.reduce((result, node) => {
      if (node.key === key) return result;
      return [...result, { ...node, children: this.removeNodeByKey(node.children || [], key) }];
    }, []);
  };

  onSelect = (selectedKeys) => {
    positionTrackingService.setActiveFragment(selectedKeys[0]);
  };

  render() {
    const theme = themeService.getCurrentTheme();
    return (
      <div className={`outline ${theme}`}>
        <Tree
          treeData={this.state.treeData}
          selectedKeys={this.state.selectedKeys}
          onSelect={this.onSelect}
          showLine
        />
      </div>
    );
  }
}

export default Outline;