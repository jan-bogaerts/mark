
import React, { Component } from 'react';
import { Tree } from 'antd';
import { ProjectService } from '../../../services/project_service/ProjectService';
import { PositionTrackingService } from '../../../services/position-tracking_service/PositionTrackingService';
import { DialogService } from '../../../services/dialog_service/DialogService';
import { ThemeService } from '../../../services/Theme_service/ThemeService';

/**
 * Outline component
 */
class Outline extends Component {
  state = {
    treeData: [],
    selectedKeys: [],
  };

  componentDidMount() {
    this.loadProjectData();
    ProjectService.on('projectLoaded', this.loadProjectData);
    ProjectService.on('dataItemRemoved', this.removeNode);
    ProjectService.on('dataItemAdded', this.loadProjectData);
    ProjectService.on('dataItemsChanged', this.loadProjectData);
    PositionTrackingService.on('positionChanged', this.updateSelectedKeys);
  }

  loadProjectData = () => {
    try {
      const projectData = ProjectService.getProjectData();
      const treeData = this.convertToTreeData(projectData);
      this.setState({ treeData });
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
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

  convertToTreeData = (data) => {
    let parent = null;
    const rootNode = { title: 'Root', key: 'root', children: [] };
    data.forEach(item => {
      const node = { title: item.title, key: item.key, data: item };
      if (item.levelCount === 1) {
        rootNode.children.push(node);
        parent = node;
      } else if (!parent) {
        return;
      } else if (item.levelCount > parent.data.levelCount) {
        parent.children = parent.children || [];
        parent.children.push(node);
        parent = node;
      } else {
        while (parent && parent.data.levelCount >= item.levelCount) {
          parent = parent.parent;
        }
        parent.children = parent.children || [];
        parent.children.push(node);
        parent = node;
      }
    });
    return [rootNode];
  };

  updateSelectedKeys = (key) => {
    this.setState({ selectedKeys: [key] });
  };

  onSelect = (selectedKeys) => {
    PositionTrackingService.setActiveFragment(selectedKeys[0]);
  };

  render() {
    const theme = ThemeService.getCurrentTheme();
    return (
      <div className={`outline ${theme}`}>
        <Tree
          showLine
          treeData={this.state.treeData}
          selectedKeys={this.state.selectedKeys}
          onSelect={this.onSelect}
        />
      </div>
    );
  }
}

export default Outline;
