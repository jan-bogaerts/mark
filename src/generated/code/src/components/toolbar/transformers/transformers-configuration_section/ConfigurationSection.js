
import React, { useState, useEffect } from 'react';
import { Button, Tooltip, Select } from 'antd';
import  { MdRebaseEdit } from 'react-icons/md';
import cybertronService from '../../../../services/cybertron_service/CybertronService';
import themeService from '../../../../services/Theme_service/ThemeService';
import folderService from '../../../../services/folder_service/FolderService';
import dialogService from '../../../../services/dialog_service/DialogService';
import AllSparkService from '../../../../services/all-spark_service/AllSparkService';

/**
 * ConfigurationSection component
 * @param {Object} props - Component properties
 */
const ConfigurationSection = () => {
  const [entryPoints, setEntryPoints] = useState([]);
  const [activeEntryPoint, setActiveEntryPoint] = useState(null);

  useEffect(() => {
    setEntryPoints(cybertronService.entryPoints);
    setActiveEntryPoint(cybertronService.activeEntryPoint?.name);
  }, []);

  const handleEditTransformers = async () => {
    try {
      if (!window.electron.isPluginMode) {
        const result = await window.electron.openPluginEditor(folderService.plugins);
        if (result) {
          await AllSparkService.refreshPlugins();
        }
      }
    }
    catch (error) {
      dialogService.showErrorDialog(error.message);
    }
  };

  const handleEntryPointChange = (value, opt) => {
    try {
      cybertronService.activeEntryPoint = opt.data;
      setActiveEntryPoint(value);
    } catch (error) {
      dialogService.showErrorDialog(error.message);
    }
  };

  const theme = themeService.getCurrentTheme();
  return (
    <div className={`configuration-section ${theme}`}>
      <Tooltip title="Edit Transformers">
        <Button 
          onClick={handleEditTransformers} 
          disabled={window.electron.isPluginMode}
          className="edit-transformers-button"
        >
          <MdRebaseEdit />
        </Button>
      </Tooltip>
      {/* <Tooltip title="Active Entry Point">
        <Select 
          value={activeEntryPoint} 
          onChange={handleEntryPointChange} 
          className="active-entry-point-dropdown"
        >
          {entryPoints.map((entryPoint) => (
            <Select.Option key={entryPoint.name} value={entryPoint.name} data={entryPoint}>
              {entryPoint.name}
            </Select.Option>
          ))}
        </Select>
      </Tooltip> */}
    </div>
  );
};

export default ConfigurationSection;
