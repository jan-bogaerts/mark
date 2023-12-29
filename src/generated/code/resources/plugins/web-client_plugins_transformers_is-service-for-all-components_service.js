
const resources = require('./resources.json');
const services = {}; // must always be present
const deps = {}; // must always be present

function getDescription() {
  return {
    name: 'is service for all components',
    dependencies: ['declare or use class', 'class description'],
    isJson: false,
    description: 'The is-service-for-all-components service is responsible for figuring out if a class described in the fragment should be used by all components or not.'
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
  let description = await deps['class description'].getResult(fragment);
  if (!description) return null;
  description = description[className];
  if (!description) return null;

  const result = [
    {
      role: 'system',
      content: resources.res_web_client_plugins_transformers_is_service_for_all_components_service_1,
    },
    {
      role: 'user',
      content: resources.res_web_client_plugins_transformers_is_service_for_all_components_service_2.replace('{{feature_desc}}', description),
    },
  ];

  return [result, [className]];
}

module.exports = { getDescription, calculateMaxTokens, iterator, buildMessage, services, deps };
