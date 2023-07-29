
import React from 'react';
import { Slider as AntSlider } from 'antd';

const Slider = ({ min, max, value, onChange }) => {
  return (
    <AntSlider min={min} max={max} value={value} onChange={onChange} />
  );
};

export default Slider;
```

```css
.ant-slider {
  width: 200px;
}

.ant-slider-handle {
  border-color: #1890ff;
}

.ant-slider-track {
  background-color: #1890ff;
}
