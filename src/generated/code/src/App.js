
import './App.css';
import MainWindow from './components/main window/MainWindow';
import StorageService from './services/project_service/storage_service/StorageService';

import allSpark from './services/all-spark_service/AllSparkService';  // import so that everything is registered
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    if (window.electron.fileToOpen) {
      StorageService.open(window.electron.fileToOpen);
    } else {
      // StorageService.new(); // initiate to new project
    }
  }, []);
  return (
    <MainWindow />
  );
}

export default App;
