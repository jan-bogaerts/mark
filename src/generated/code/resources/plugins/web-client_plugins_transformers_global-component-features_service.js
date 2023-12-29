
const resources = require('./resources.json');
const services = {}; // must always be present
const deps = {}; // must always be present
const shared = require('./shared.js');

function getDescription() {
  return {
    name: 'global component features',
    dependencies: ['is service for all components', 'constants'],
    isJson: false,
    description: 'The global-component-features service extracts the list of features that all components should implement according to a service.'
  };
}

function calculateMaxTokens(inputTokenCount) {
  return inputTokenCount.total;
}

async function iterator(fragment, callback) {
  const toCheck = await deps['is service for all components'].getResult(fragment);
  for (let service in toCheck) {
    if (toCheck[service] === 'yes') {
      await callback(fragment, service);
    }
  }
}

async function buildMessage(fragment, service) {
  const description = await deps.constants.getResult(fragment);
  const result = [
    {
      role: 'system',
      content: resources.res_web_client_plugins_transformers_global_component_features_service_1,
    },
    {
      role: 'user',
      content: resources.res_web_client_plugins_transformers_global_component_features_service_2.replace('{{feature_desc}}', description),
    },
  ];

  return [result, [ service ]];
}

module.exports = { getDescription, calculateMaxTokens, iterator, buildMessage, services, deps };
