
const resources = require('./resources.json');
const services = {}; // must always be present
const deps = {}; // must always be present
const shared = require('./shared.js');

function getDescription() {
  return {
    name: 'component props',
    dependencies: ['declare or use component', 'component exact description'],
    isJson: true,
    description: 'The list-component-props service builds a list of properties that a component is described to have.'
  };
}

async function iterator(fragment, callback) {
  const components = await deps['declare or use component'].getResult(fragment);
  for (let compName in components) {
    if (components[compName] === 'declare') {
      await callback(fragment, compName);
    }
  }
}

async function buildMessage(fragment, compName) {
  const description = await deps['component exact description'].getResult(fragment);
  const result = [
    {
      role: 'system',
      content: resources.res_web_client_plugins_transformers_list_component_props_service_1.replace('{{name}}', compName),
    },
    {
      role: 'user',
      content: resources.res_web_client_plugins_transformers_list_component_props_service_2.replace('{{feature_desc}}', description),
    },
  ];

  return [result, [compName]];
}

function calculateMaxTokens(inputTokenCount) {
  return 240;
}

module.exports = { getDescription, iterator, buildMessage, calculateMaxTokens, services, deps };
