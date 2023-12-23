import { v4 as uuidv4 } from 'uuid';
import keyService from '../key_service/KeyService';
import ProjectService from '../project_service/ProjectService';
import BuildService from '../build_service/BuildService';

class LogService {
  constructor() {
    this.eventTarget = new EventTarget();
    this._showLogWindow = false;

    // Register the callback for log window visibility changes
    window.electron.onLogWindowVisibility(this.setLogWindowVisibility.bind(this));
  }

  // Getter and setter for showLogWindow
  get showLogWindow() {
    return this._showLogWindow;
  }

  set showLogWindow(value) {
    if (this._showLogWindow === value) return;
    this._showLogWindow = value;
    window.electron.showLogWindow(value);
    this.eventTarget.dispatchEvent(new CustomEvent('log-window-visibility', { detail: value }));
  }

  beginMsg(transformerName, fragmentKey, inputData) {
    if (BuildService.debug) {
      this.showLogWindow = true;
    }
    const logObj = {
      uuid: uuidv4(),
      transformerName,
      fragmentKey,
      location: keyService.calculateLocation(ProjectService.getFragment(fragmentKey)),
      inputData,
    };
    window.electron.logMsg(JSON.stringify(logObj, null, 2));
    return logObj;
  }

  logMsgResponse(logObj, response) {
    if (BuildService.debug) {
      this.showLogWindow = true;
    }
    const responseObj = {
      uuid: logObj.uuid,
      response,
    };

    window.electron.logMsg(JSON.stringify(responseObj));
  }

  setLogWindowVisibility(ev, value) {
    // Update internal state and trigger event, but don't call showLogWindow as the window is reporting its new state
    this._showLogWindow = value;
    this.eventTarget.dispatchEvent(new CustomEvent('log-window-visibility', { detail: value }));
  }

  // Ensure to clean up when the service is no longer needed
  dispose() {
    window.electron.removeOnLogWindowVisibility(this.setLogWindowVisibility.bind(this));
  }
}

// Exporting the singleton instance of the LogService class
const logServiceInstance = new LogService();
export default logServiceInstance;