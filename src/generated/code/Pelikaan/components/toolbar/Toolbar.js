
import React from 'react';
import { Menu, Dropdown, Button, Tooltip } from 'antd';

const Toolbar = ({ theme, stylingOptions, addNewItem, deleteSelectedItem, saveChanges, viewOptions }) => {
  const handleAddNewItem = () => {
    addNewItem();
  };

  const handleDeleteSelectedItem = () => {
    deleteSelectedItem();
  };

  const handleSaveChanges = () => {
    saveChanges();
  };

  const handleViewOptionSelect = (option) => {
    // Handle view option selection
  };

  const renderViewOptions = () => {
    return viewOptions.map((option) => (
      <Menu.Item key={option}>{option}</Menu.Item>
    ));
  };

  const renderThemeButton = () => {
    const themeButtonStyle = theme === 'dark' ? stylingOptions.dark : stylingOptions.light;

    return (
      <Button style={themeButtonStyle}>
        {theme === 'dark' ? 'Dark Theme' : 'Light Theme'}
      </Button>
    );
  };

  const menu = (
    <Menu onClick={handleViewOptionSelect}>
      {renderViewOptions()}
    </Menu>
  );

  return (
    <div>
      <div>
        <Button onClick={handleAddNewItem} type="primary" icon="plus" />
        <Button onClick={handleDeleteSelectedItem} type="danger" icon="delete" />
        <Button onClick={handleSaveChanges} type="primary" icon="save" />
        <Dropdown overlay={menu}>
          <Button>
            View Options
          </Button>
        </Dropdown>
        {renderThemeButton()}
      </div>
      <Tooltip title="Add a new item">
        <Button onClick={handleAddNewItem} icon="plus" />
      </Tooltip>
      <Tooltip title="Delete selected item">
        <Button onClick={handleDeleteSelectedItem} icon="delete" />
      </Tooltip>
      <Tooltip title="Save changes">
        <Button onClick={handleSaveChanges} icon="save" />
      </Tooltip>
      <Dropdown overlay={menu}>
        <Button>
          View Options
        </Button>
      </Dropdown>
      {renderThemeButton()}
    </div>
  );
};

export default Toolbar;
