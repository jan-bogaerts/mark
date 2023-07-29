
import React from 'react';
import { Button } from 'antd';

const EditSection = () => {
  const handleCut = () => {
    // handle cut action
  };

  const handleCopy = () => {
    // handle copy action
  };

  const handlePaste = () => {
    // handle paste action
  };

  const handleDelete = () => {
    // handle delete action
  };

  const handleSelectAll = () => {
    // handle select all action
  };

  const handleClearSelection = () => {
    // handle clear selection action
  };

  return (
    <div>
      <Button onClick={handleCut}>Cut</Button>
      <Button onClick={handleCopy}>Copy</Button>
      <Button onClick={handlePaste}>Paste</Button>
      <Button onClick={handleDelete}>Delete</Button>
      <Button onClick={handleSelectAll}>Select All</Button>
      <Button onClick={handleClearSelection}>Clear Selection</Button>
    </div>
  );
};

export default EditSection;
