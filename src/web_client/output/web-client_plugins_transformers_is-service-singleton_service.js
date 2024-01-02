
const resources = require('./resources.json');
const services = {}; // must always be present
const deps = {}; // must always be present
const shared = require('./shared.js');

function getDescription() {
  return {
    name: 'is service singleton',
    dependencies: ['declare or use class', 'constants'],
    isJson: false,
    description: 'The is-service-singleton service is responsible for figuring out if a class that is declared in a text fragment is described as being a singleton or not.'
  };
}

function calculateMaxTokens(inputTokenCount) {
  return inputTokenCount.total + 5;
}

async function iterator(fragment, callback, result) {
  const classes = await deps['declare or use class'].getResult(fragment);
  for (let className in classes) {
    if (classes[className] === 'declare') {
      await callback(fragment, className);
    }
  }
}

async function buildMessage(fragment, className) {
  const content = await deps.constants.getResult(fragment);
  const result = [
    {
      role: 'system',
      content: resources.res_web_client_plugins_transformers_is_service_singleton_service_1.replace('{{class}}', className),
    },
    {
      role: 'user',
      content: resources.res_web_client_plugins_transformers_is_service_singleton_service_2.replace('{{feature_desc}}', content),
    },
  ];

  return [result, [ className ]];
}

module.exports = { getDescription, calculateMaxTokens, iterator, buildMessage, services, deps };
