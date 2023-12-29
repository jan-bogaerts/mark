
const resources = require('./resources.json');
const services = {}; // must always be present
const deps = {}; // must always be present
const shared = require('./shared.js');

function getDescription() {
  return {
    name: 'is service used',
    dependencies: ['declare or use class', 'class description', 'constants'],
    isJson: false,
    description: 'The is-service-used classification service is responsible for figuring out if a text fragment uses any of the currently known service-classes in the project. Used to determine which files should be imported and which interfaces should be known about.'
  };
}

function calculateMaxTokens(inputTokenCount) {
  return inputTokenCount.total + 4;
}

async function iterator(fragment, callback, result) {
  for (let toCheck of services.projectService.textFragments) {
    if (toCheck.key === fragment.key) continue;
    let classes = await deps['declare or use class'].getResult(toCheck);
    for (let [className, value] of Object.entries(classes)) {
      if (value === 'declare') {
        await callback(fragment, toCheck, className);
      }
    }
  }
}

async function buildMessage(fragment, checkAgainst, className) {
  let description = await deps['class description'].getResult(checkAgainst);
  if (!description) return null;
  description = description[className]; // a fragment can have multiple classes, so get the description of the class we are searching for
  if (!description) return null;
  let content = await deps.constants.getResult(fragment);
  let result = [
    {
      role: 'system',
      content: resources.res_web_client_plugins_transformers_is_service_used_service_1.replace('{{class}}', className).replace('{{class_description}}', description),
    },
    {
      role: 'user',
      content: resources.res_web_client_plugins_transformers_is_service_used_service_2.replace('{{feature_desc}}', content),
    },
  ];
  return [result, [checkAgainst.key, className]];
}

module.exports = { getDescription, buildMessage, calculateMaxTokens, iterator, services, deps };
