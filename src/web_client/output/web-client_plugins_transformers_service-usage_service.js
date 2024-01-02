
const resources = require('./resources.json');
const services = {}; // must always be present
const deps = {}; // must always be present
const shared = require('./shared.js');

function getDescription() {
  return {
    name: 'service usage',
    dependencies: ['declare or use class', 'is service used', 'constants'],
    isJson: true,
    description: 'The service-usage service is responsible for extracting all the features described in a fragment that relate to a particular service. Used to determine the full set of feature requirements of a class.'
  };
}

function calculateMaxTokens(inputTokenCount) {
  return inputTokenCount.total;
}

async function iterator(fragment, callback, result) {
  for (let toCheck of services.projectService.textFragments) {
    if (toCheck.key === fragment.key) continue;
    let classes = await deps['declare or use class'].getResult(toCheck);
    for (let [className, value] of Object.entries(classes)) {
      if (value === 'declare') {
        let isUsed = await getIfClassIsUsed(fragment, toCheck, className);
        if (isUsed) {
          await callback(fragment, className);
        }
      }
    }
  }
}

async function getIfClassIsUsed(fragment, toCheck, className) {
  let isUsedData = await deps['is service used'].getResult(fragment);
  if (isUsedData && toCheck.key in isUsedData) {
    let section = isUsedData[toCheck.key];
    if (section && className in section) {
      return section[className].toLowerCase() === 'yes';
    }
  }
  return false;
}

function cleanResponse(response, fragment, toCheck) {
  return {
    'value': response,
    'source': toCheck.key,
  };
}

async function buildMessage(fragment, className) {
  let content = await deps.constants.getResult(fragment);
  let result = [
    {
      role: 'system',
      content: resources.res_web_client_plugins_transformers_service_usage_service_1.replace('{{class}}', className),
    },
    {
      role: 'user',
      content: resources.res_web_client_plugins_transformers_service_usage_service_2.replace('{{feature_desc}}', content),
    },
    {
      role: 'assistant',
      content: resources.res_web_client_plugins_transformers_service_usage_service_3.replace('{{class}}', className),
    },
  ];
  return [result, [ className ]];
}

module.exports = { getDescription, calculateMaxTokens, iterator, getIfClassIsUsed, cleanResponse, buildMessage, services, deps };
