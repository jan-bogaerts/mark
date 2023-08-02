
const TABS = ['home', 'format', 'preferences'];
const TOOLTIP_DESCRIPTIONS = {
  home: 'Main tab of the toolbar',
  format: 'Format your document',
  preferences: 'Change your settings',
};

const SECTIONS = {
  home: ['file', 'edit', 'undo', 'build'],
  format: ['style', 'paragraph', 'font'],
  preferences: [],
};

const ThemeService = require('./services/ThemeService');
const DialogService = require('./services/DialogService');

/**
 * Toolbar component
 * @component
 */
function Toolbar() {
  const [activeTab, setActiveTab] = React.useState(TABS[0]);
  const theme = ThemeService.getCurrentTheme();

  /**
   * Handle tab change
   * @param {string} key - The key of the tab
   */
  const handleTabChange = (key) => {
    try {
      setActiveTab(key);
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  };

  /**
   * Render sections for the active tab
   */
  const renderSections = () => {
    return SECTIONS[activeTab].map((section) => (
      <div className={`toolbar-section toolbar-section-${section}`}>
        {section}
      </div>
    ));
  };

  return (
    <div className={`toolbar toolbar-theme-${theme}`}>
      <antd.Tabs defaultActiveKey={TABS[0]} onChange={handleTabChange}>
        {TABS.map((tab) => (
          <antd.TabPane
            tab={tab}
            key={tab}
            tooltip={TOOLTIP_DESCRIPTIONS[tab]}
          >
            {renderSections()}
          </antd.TabPane>
        ))}
      </antd.Tabs>
    </div>
  );
}

module.exports = Toolbar;
```

```css
.toolbar {
  position: fixed;
  top: 0;
  width: 100%;
}

.toolbar-theme-light {
  background-color: #ffffff;
  color: #000000;
}

.toolbar-theme-dark {
  background-color: #000000;
  color: #ffffff;
}

.toolbar-section {
  padding: 10px;
}
