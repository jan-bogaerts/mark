import React, { Component } from 'react';
import './App.css';
import fs from 'fs';
import path from 'path';
import MainWindow from './components/main window/MainWindow';
import StorageService from './services/project_service/storage_service/StorageService';

import allSpark from './services/all-spark_service/AllSparkService';  // import so that everything is registered
import DialogService from './services/dialog_service/DialogService';
import LogWindow from './components/log_window/LogWindow';

let isLoaded = false;

class App extends Component {

  handleOpen = async () => {
    if (isLoaded) return;
    isLoaded = true;
    allSpark.load();
    if (window.electron.fileToOpen) {
      let canOpen = true;
      if (!fs.existsSync(window.electron.fileToOpen)) {
        if (window.electron.isPluginMode) {
          // copy the template file to the new location
          const userDataPath = window.electron.resourcesPath;
          const templatePath = path.join(userDataPath, 'templates', 'plugins.md');
          fs.copyFileSync(templatePath, window.electron.fileToOpen);
        } else {
          DialogService.showErrorDialog(`File ${window.electron.fileToOpen} does not exist`);
          canOpen = false;
        }
      }
      if (canOpen) {
        StorageService.open(window.electron.fileToOpen);
      }
    } else {
      await StorageService.new(); // initiate to new project
    }
  };

  componentDidMount() {
    this.handleOpen();
  }

  render() {
    if (window.electron.isLogMode === true) {
      return (
        <LogWindow />
      );
    }
    return (<MainWindow />);
  }
}

export default App;