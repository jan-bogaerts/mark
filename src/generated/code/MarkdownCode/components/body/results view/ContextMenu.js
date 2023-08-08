
import React, { useState, useEffect } from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { MonacoEditor, Tab, ResultsView, MenuItem } from 'MarkdownCode/components/body/results view';
import { DialogService, ThemeService, ProjectService, SelectionService, UndoService, LineParser, PositionTrackingService, ResultCacheService, BuildService, CompressService } from 'MarkdownCode/services';

const ContextMenu = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedFragment, setSelectedFragment] = useState(null);
  const [resultCache, setResultCache] = useState(null);
  const [theme, setTheme] = useState(ThemeService.getCurrentTheme());

  useEffect(() => {
    setServices(ProjectService.getServices());
    setSelectedService(ProjectService.getDefaultService());
    setSelectedModel(ProjectService.getDefaultModel());
    setSelectedFragment(SelectionService.getCurrentFragment());
    setResultCache(ResultCacheService.getResultCache());
    ThemeService.subscribe(setTheme);
  }, []);

  const handleModelChange = (model) => {
    setSelectedModel(model);
    ProjectService.updateModelForService(selectedService, model);
  };

  const handleFragmentModelChange = (model) => {
    setSelectedModel(model);
    ProjectService.updateModelForServiceAndFragment(selectedService, selectedFragment, model);
  };

  const handleRefresh = () => {
    BuildService.refreshResultForService(selectedService);
  };

  const handleMoreClick = ({ key }) => {
    switch (key) {
      case 'modelForAll':
        handleModelChange();
        break;
      case 'modelForFragment':
        handleFragmentModelChange();
        break;
      default:
        break;
    }
  };

  const menu = (
    <Menu onClick={handleMoreClick}>
      <Menu.SubMenu key="modelForAll" title="Model for all">
        {services.map(service => (
          <MenuItem key={service}>{service}</MenuItem>
        ))}
      </Menu.SubMenu>
      <Menu.SubMenu key="modelForFragment" title="Model for fragment">
        {services.map(service => (
          <MenuItem key={service}>{service}</MenuItem>
        ))}
      </Menu.SubMenu>
    </Menu>
  );

  return (
    <ResultsView>
      <Tab title={selectedService}>
        <MonacoEditor
          value={resultCache[selectedService]}
          theme={theme}
          onChange={value => ResultCacheService.updateResultCache(selectedService, value)}
        />
        <Button onClick={handleRefresh}>Refresh</Button>
        <Dropdown overlay={menu}>
          <Button>More</Button>
        </Dropdown>
      </Tab>
    </ResultsView>
  );
};

export default ContextMenu;
