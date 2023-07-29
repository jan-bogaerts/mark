
import React, { useState } from 'react';
import { Button, Input } from 'antd';

const App = () => {
  const [text, setText] = useState('');

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const handleButtonClick = () => {
    alert(`You entered: ${text}`);
  };

  return (
    <div>
      <h1>Pelikaan</h1>
      <Input placeholder="Enter text" value={text} onChange={handleInputChange} />
      <Button type="primary" onClick={handleButtonClick}>Submit</Button>
    </div>
  );
};

export default App;
```
