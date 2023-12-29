
const resources = require('./resources.json');
const services = {}; // must always be present
const deps = {}; // must always be present
const shared = require('./shared.js');

function getDescription() {
  return {
    name: 'primary class',
    dependencies: ['classes', 'constants'],
    isJson: false,
    description: 'The primary-class service is responsible for identifying the class that is most of all described and stands out as the most important item in the text-fragment.'
  };
}

async function buildMessage(fragment) {
  var result = [
    {
      role: 'system',
      content: resources.res_web_client_plugins_transformers_primary_class_service_1,
    },
    {
      role: 'user',
      content: resources.res_web_client_plugins_transformers_primary_class_service_2.replace('{{title}}', fragment.title).replace('{{content}}', await deps.constants.getResult(fragment)).replace('{{classes}}', await deps.classes.getResult(fragment)),
    },
    {
      role: 'assistant',
      content: resources.res_web_client_plugins_transformers_primary_class_service_3,
    }
  ];

  return [result, [ ]];
}

function calculateMaxTokens(inputTokenCount) {
  return 120;
}

module.exports = { getDescription, buildMessage, calculateMaxTokens, services, deps };
