
import React, { useState } from 'react';
import { Select } from 'antd';

const { Option } = Select;

const Dropdown = () => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const getOptions = () => {
    return options;
  };

  const selectOption = (option) => {
    setSelectedOption(option);
  };

  const handleSelectChange = (value) => {
    setSelectedOption(value);
  };

  const renderOptions = () => {
    return options.map((option) => (
      <Option key={option} value={option}>
        {option}
      </Option>
    ));
  };

  return (
    <Select
      value={selectedOption}
      onChange={handleSelectChange}
      style={{ width: 200 }}
    >
      {renderOptions()}
    </Select>
  );
};

export default Dropdown;
