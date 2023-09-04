
const { ipcRenderer } = require('electron');
const { ProjectService } = require('../project_service/ProjectService');
const { CybertronService } = require('../cybertron_service/CybertronService');

/**
 * BuildService class
 * This class is responsible for turning the markdown project data list into source code.
 */
class BuildService {
  constructor() {
    this.projectService = new ProjectService();
    this.cybertronService = new CybertronService();
  }

  /**
   * Method to trigger the building process for all code in the project.
   */
  async buildAll() {
    const dataList = this.projectService.getDataList();

    for (const fragment of dataList) {
      for (const transformer of this.cybertronService.getEntryPoints()) {
        await transformer.render(fragment);
      }
    }
  }

  /**
   * Method to trigger the building process for all code files related to the currently active fragment.
   * @param {Object} activeFragment - The currently active fragment.
   */
  async buildForActiveTopic(activeFragment) {
    for (const transformer of this.cybertronService.getEntryPoints()) {
      await transformer.render(activeFragment);
    }
  }

  /**
   * Method to trigger the building process for the selected fragment in the service related to the currently selected.
   * @param {Object} activeFragment - The currently active fragment.
   */
  async buildForActivePrompt(activeFragment) {
    const selectedFragment = this.projectService.getSelectedFragment(activeFragment);

    for (const transformer of this.cybertronService.getEntryPoints()) {
      await transformer.render(selectedFragment);
    }
  }
}

module.exports = { BuildService };
