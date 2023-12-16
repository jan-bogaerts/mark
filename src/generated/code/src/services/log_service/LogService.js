
import { v4 as uuidv4 } from 'uuid';
import keyService from '../key_service/KeyService';
import ProjectService from '../project_service/ProjectService';

/**
 * LogService class
 * This class is responsible for keeping track of messages that should be shown to the user.
 */
class LogService {
  /**
   * beginMsg function
   * This function creates a gpt msg log item, stores all the data and assigns a UUID to the log object.
   * This log object is then serialized to a string and sent to the log window using the global function `window.electron.logMsg`.
   * @param {string} transformerName - The name of the transformer.
   * @param {string} fragmentKey - The key of the fragment.
   * @param {object} inputData - The input data.
   * @returns {object} The log object.
   */
  beginMsg(transformerName, fragmentKey, inputData) {
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

  /**
   * logMsgResponse function
   * This function creates an object containing the response and the UUID field of the logObj,
   * serializes this object and sends it to the log window using `window.electron.logMsgResponse`.
   * @param {object} logObj - The log object.
   * @param {object} response - The response object.
   */
  logMsgResponse(logObj, response) {
    const responseObj = {
      uuid: logObj.uuid,
      response,
    };

    window.electron.logMsg(JSON.stringify(responseObj));
  }
}

// Exporting the singleton instance of the LogService class
export default new LogService();
