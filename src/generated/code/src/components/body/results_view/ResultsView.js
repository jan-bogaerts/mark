
import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import CybertronService from '../../../services/cybertron_service/CybertronService';
import ThemeService from '../../../services/Theme_service/ThemeService';
import DialogService from '../../../services/dialog_service/DialogService';
import ResultsViewTab from '../results_view/results_view_tab/ResultsViewTab';

/**
 * ResultsView component
 * @component
 */
function ResultsView() {
  const [theme, setTheme] = useState(ThemeService.getCurrentTheme());
  const [transformers, setTransformers] = useState([]);
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    try {
      setTransformers(CybertronService.transformers);
    } catch (error) {
      DialogService.showErrorDialog(error);
    }
  }, []);

  useEffect(() => {
    const tabsData = transformers.map((transformer) => ({
      key: transformer.name,
      label: transformer.name,
      children: <ResultsViewTab transformer={transformer} />,
    }));
    setTabs(tabsData);
  }, [transformers]);

  return (
    <Tabs className={`results-view ${theme}`}  items={tabs} size="small" tabPosition='bottom' tabBarStyle={{marginTop: 0}}>
      
    </Tabs>
  );
}

export default ResultsView;
