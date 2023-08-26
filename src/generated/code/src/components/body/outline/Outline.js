
import React, { Component } from 'react';
import { Tree } from 'antd';
import { observer } from 'mobx-react';
import projectservice from '../../../../services/project_service/ProjectService';
import positiontrackingservice from '../../../../services/position-tracking_service/PositionTrackingService';
import dialogservice from '../../../../services/dialog_service/DialogService';

const { TreeNode } = Tree;

/**
 * Outline component class
 */
@observer
class Outline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      selectedKeys: []
    };
  }

  componentDidMount() {
    this.loadProjectData();
    projectservice.on('projectLoaded', this.loadProjectData);
    projectservice.on('dataItemRemoved', this.removeNode);
    projectservice.on('dataItemAdded', this.loadProjectData);
    projectservice.on('dataItemsChanged', this.loadProjectData);
    positiontrackingservice.on('positionChanged', this.updateSelectedKeys);
  }

  componentWillUnmount() {
    projectservice.off('projectLoaded', this.loadProjectData);
    projectservice.off('dataItemRemoved', this.removeNode);
    projectservice.off('dataItemAdded', this.loadProjectData);
    projectservice.off('dataItemsChanged', this.loadProjectData);
    positiontrackingservice.off('positionChanged', this.updateSelectedKeys);
  }

  loadProjectData = () => {
    try {
      const projectData = projectservice.getProjectData();
      const treeData = this.convertToTreeData(projectData);
      this.setState({ treeData });
    } catch (error) {
      dialogservice.showErrorDialog('Error loading project data', error);
    }
  }

  convertToTreeData = (data) => {
    // Implementation of the conversion logic goes here
  }

  removeNode = (key) => {
    // Implementation of the node removal logic goes here
  }

  updateSelectedKeys = (key) => {
    this.setState({ selectedKeys: [key] });
  }

  onSelect = (selectedKeys) => {
    positiontrackingservice.activeFragment = selectedKeys[0];
  }

  render() {
    return (
      <div className="outline-component">
        <Tree
          showLine
          selectedKeys={this.state.selectedKeys}
          onSelect={this.onSelect}
        >
          {this.renderTreeNodes(this.state.treeData)}
        </Tree>
      </div>
    );
  }

  renderTreeNodes = (data) => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  }
}

export default Outline;
