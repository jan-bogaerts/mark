import React, { Component } from 'react';
import { Tree } from 'antd';
import projectService from '../../../services/project_service/ProjectService';
import positionTrackingService from '../../../services/position-tracking_service/PositionTrackingService';
import themeService from '../../../services/Theme_service/ThemeService';
import FragmentStatusIcon from '../fragment-status_icon/FragmentStatusIcon';

/**
 * Outline component
 */
class Outline extends Component {
  constructor(props) {
    super(props);
    this.isMoving = false;
    this.state = {
      treeData: [],
      selectedKeys: [],
      expandedKeys: [],
    };
  }

  componentDidMount() {
    projectService.eventTarget.addEventListener('content-changed', this.handleContentChanged);
    projectService.eventTarget.addEventListener('fragment-deleted', this.handleContentChanged);
    projectService.eventTarget.addEventListener('fragment-inserted', this.handleContentChanged);
    projectService.eventTarget.addEventListener('title-changed', this.handleContentChanged);
    positionTrackingService.eventTarget.addEventListener('change', this.handlePositionChanged);
  }

  handleContentChanged = () => {
    const projectData = projectService.textFragments;
    const treeData = this.convertToTreeData(projectData);
    this.setState({ treeData });
  };

  handleFragmentDeleted = (e) => {
    const key = e.detail;
    this.removeNode(key);
  };

  handlePositionChanged = (e) => {
    const key = e.detail?.key;
    if (!key) return;
    if (this.isMoving) return;
    const parent = projectService.getParent(key);
    if (parent) {
      this.setState({ selectedKeys: [key], expandedKeys: [...this.state.expandedKeys, parent.key] });
    } else {
      this.setState({ selectedKeys: [key] });
    }
  };

  convertToTreeData = (data) => {
    let parent = null;
    const treeData = [];
    data.forEach(item => {
      const node = { 
        title: item.title, 
        key: item.key, 
        data: item, 
        icon: <FragmentStatusIcon fragment={item} />, 
        children: [] 
      };
      if (item.depth === 1) {
        treeData.push(node);
        parent = node;
      } else if (!parent) {
        return;
      } else if (item.depth > parent.data.depth) {
        parent.children.push(node);
        node.parent = parent;
        parent = node;
      } else {
        while (parent && parent.data.depth >= item.depth) {
          parent = parent.parent;
        }
        if (parent) {
          parent.children.push(node);
          node.parent = parent;
          parent = node;
        }
      }
    });
    return treeData;
  };

  removeNode = (key) => {
    const treeData = this.removeNodeByKey(this.state.treeData, key);
    const selected = this.state.selectedKeys.filter(k => k !== key);
    const expanded = this.state.expandedKeys.filter(k => k !== key);
    this.setState({ treeData, selectedKeys: selected, expandedKeys: expanded });
  };

  removeNodeByKey = (nodes, key) => {
    return nodes.reduce((result, node) => {
      if (node.key === key) return result;
      return [...result, { ...node, children: this.removeNodeByKey(node.children || [], key) }];
    }, []);
  };

  onSelect = (selectedKeys) => {
    if (selectedKeys.length === 0) return;
    const fragment = projectService.getFragment(selectedKeys[0]);
    if (fragment) {
      try {
        this.isMoving = true;
        positionTrackingService.setActiveFragment(fragment);
        /* if (this.state.expandedKeys.indexOf(selectedKeys[0]) === -1) {
          this.setState({ expandedKeys: [...this.state.expandedKeys, selectedKeys[0]] });
        } */
        this.setState({ selectedKeys });
      } finally {
        this.isMoving = false;
      }
    }
  };

  onExpand = (expandedKeys, details) => {
    if (!details.expanded) {
      this.setState({ expandedKeys });
      return;
    }
    this.setState({ expandedKeys });
  }

  render() {
    const theme = themeService.getCurrentTheme();
    return (
      <div className={`outline ${theme}`}>
        <Tree
          showIcon
          treeData={this.state.treeData}
          selectedKeys={this.state.selectedKeys}
          autoExpandParent
          expandedKeys={this.state.expandedKeys}
          onExpand={this.onExpand}
          onSelect={this.onSelect}
          showLine
        />
      </div>
    );
  }
}

export default Outline;