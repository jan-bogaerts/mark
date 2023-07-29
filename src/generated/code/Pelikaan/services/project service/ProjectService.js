
class ProjectService {
  constructor() {
    this.dataList = [];
    this.autoSaveTimer = null;
    this.autoSaveEnabled = false;
    this.fileName = null;
    this.codeStyle = null;
    this.eventListeners = {
      dataChanged: [],
    };
  }

  // Event handling
  addEventListener(event, callback) {
    this.eventListeners[event].push(callback);
  }

  removeEventListener(event, callback) {
    this.eventListeners[event] = this.eventListeners[event].filter(
      (listener) => listener !== callback
    );
  }

  raiseEvent(event) {
    this.eventListeners[event].forEach((listener) => listener());
  }

  // Project management
  createNewProject() {
    this.dataList = [];
    this.resetCache();
    this.raiseEvent('dataChanged');
  }

  openProject(filePath) {
    // Read file contents
    const fileContents = readFile(filePath);

    // Split file into lines
    const lines = fileContents.split('\n');

    // Parse each line and store in data list
    this.dataList = lines.map((line) => parseLine(line));

    // Recreate cache for each registered gpt-service
    this.resetCache();

    this.raiseEvent('dataChanged');
  }

  saveProject(filePath) {
    // Open file for writing
    const file = openFile(filePath, 'w');

    // Convert data list to string and write to file
    const fileContents = this.dataList.map((item) => stringifyItem(item)).join('\n');
    file.write(fileContents);

    // Reset project changed indicator
    this.fileName = filePath;

    // Save filename for auto-save function
    this.fileName = filePath;
  }

  updateProjectData(lineNumber, newData) {
    // Update item in data list
    this.dataList[lineNumber] = newData;

    // Update links to and from other items in data list
    this.updateLinks();

    // Trigger auto-save timer if enabled
    if (this.autoSaveEnabled) {
      this.resetAutoSaveTimer();
    }

    this.raiseEvent('dataChanged');
  }

  // Data list functions
  getTreeStructure() {
    // Generate tree structure from data list
    const treeStructure = generateTreeStructure(this.dataList);

    return treeStructure;
  }

  convertTitleToText(title) {
    // Find item in data list with matching title
    const item = this.dataList.find((item) => item.title === title);

    if (item) {
      return item.lines.join('\n');
    }

    return '';
  }

  // Auto-save functions
  enableAutoSave() {
    this.autoSaveEnabled = true;
    this.resetAutoSaveTimer();
  }

  disableAutoSave() {
    this.autoSaveEnabled = false;
    this.clearAutoSaveTimer();
  }

  resetAutoSaveTimer() {
    this.clearAutoSaveTimer();

    // Set auto-save timer
    this.autoSaveTimer = setTimeout(() => {
      if (this.fileName) {
        this.saveProject(this.fileName);
      } else {
        const tempFileName = generateTempFileName();
        this.saveProject(tempFileName);
      }
    }, 3000);
  }

  clearAutoSaveTimer() {
    clearTimeout(this.autoSaveTimer);
    this.autoSaveTimer = null;
  }

  // Helper functions
  resetCache() {
    // Recreate cache for each registered gpt-service
    registeredGptServices.forEach((service) => {
      service.recreateCache(this.fileName);
    });
  }

  updateLinks() {
    // Update links to and from other items in data list
    this.data