
import React, { useState } from 'react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const Tab = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [stylingOption, setStylingOption] = useState('light');

  const getTabs = () => {
    return ['home', 'format', 'preferences'];
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const handleStylingOptionChange = (option) => {
    setStylingOption(option);
  };

  return (
    <div className={`tab-container ${stylingOption}`}>
      <Tabs activeKey={activeTab} onChange={switchTab}>
        <TabPane tab="Home" key="home">
          {/* Home tab content */}
        </TabPane>
        <TabPane tab="Format" key="format">
          {/* Format tab content */}
        </TabPane>
        <TabPane tab="Preferences" key="preferences">
          {/* Preferences tab content */}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Tab;
```

CSS Styling:

```css
.tab-container {
  background-color: #f0f0f0;
  padding: 16px;
}

.tab-container.light {
  background-color: #f0f0f0;
}

.tab-container.dark {
  background-color: #333;
  color: #fff;
}
