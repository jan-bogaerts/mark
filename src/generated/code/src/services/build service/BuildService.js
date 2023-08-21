
const { ipcRenderer } = require('electron');
const { CompressService } = require('./CompressService');
const { ProjectDataService } = require('./ProjectDataService');

/**
 * BuildService is a singleton class that turns the markdown project data list into source code.
 * It uses a set of gpt-services to iteratively generate conversions on the different text frames.
 */
class BuildService {
  constructor() {
    if (!BuildService.instance) {
      this.compressService = new CompressService();
      this.projectDataService = new ProjectDataService();
      BuildService.instance = this;
    }

    return BuildService.instance;
  }

  /**
   * Triggers the build process for all services.
   */
  buildAll() {
    const projectDataList = this.projectDataService.getProjectDataList();
    projectDataList.forEach((textFragment) => {
      this.compressService.renderResult(textFragment);
    });
  }

  /**
   * Triggers the build process for the currently active fragment.
   */
  buildActiveFragment() {
    const activeFragment = this.projectDataService.getActiveFragment();
    this.compressService.renderResult(activeFragment);
  }

  /**
   * Triggers the build process for the currently active fragment in the currently active service.
   */
  buildActiveFragmentInActiveService() {
    const activeFragment = this.projectDataService.getActiveFragment();
    const activeService = this.projectDataService.getActiveService();
    activeService.renderResult(activeFragment);
  }
}

const buildService = new BuildService();
Object.freeze(buildService);

module.exports = buildService;
```
This code defines a singleton class `BuildService` that uses `CompressService` and `ProjectDataService` to convert markdown project data into source code. The `buildAll` method triggers the build process for all services, `buildActiveFragment` triggers the build process for the currently active fragment, and `buildActiveFragmentInActiveService` triggers the build process for the currently active fragment in the currently active service.