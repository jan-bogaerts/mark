
const resources = require('./resources.json');
const services = {}; // must always be present
const deps = {}; // must always be present
const shared = require('./shared.js');

function getDescription() {
  return {
    name: 'component description',
    dependencies: ['double compress', 'components'],
    isJson: false,
    description: 'The component-description-service is responsible for generating descriptions of components based on the text-fragments that contain references to those components. A single description can still contain info about other components that are mentioned in the fragment.'
  };
}

function calculateMaxTokens(inputTokenCount) {
  return inputTokenCount;
}

async function iterator(fragment, callback) {
  const components = await deps.components.getResult(fragment);
  for (let item of components) {
    await callback(fragment, item);
  }
}

async function buildMessage(fragment, item) {
  const content = await deps['double compress'].getResult(fragment);
  if (!content) return null;

  const result = [
    {
      role: 'system',
      content: resources.res_web_client_plugins_transformers_component_description_service_1,
    },
    {
      role: 'user',
      content: resources.res_web_client_plugins_transformers_component_description_service_2.replace('{{name}}', item).replace('{{content}}', content),
    },
  ];

  return [result, [ item ]];
}

module.exports = { getDescription, calculateMaxTokens, iterator, buildMessage, services, deps };
