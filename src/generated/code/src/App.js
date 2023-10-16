
import './App.css';
import MainWindow from './components/main window/MainWindow';
import StorageService from './services/project_service/storage_service/StorageService';

import allSpark from './services/all-spark_service/AllSparkService';  // import so that everything is registered

if (window.electron.fileToOpen) {
  StorageService.open(window.electron.fileToOpen);
} else {
  StorageService.new(); // initate to new project
}

function App() {
  return (
    <MainWindow />
  );
}

export default App;
