
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

function calculateMaxTokens(inputTokenCount) {
  return 120;
}

async function iterator(fragment, callback, resultSetter) {
  const classes = await deps.classes.getResult(fragment);
  if (classes.length > 1) {
    await callback(fragment, classes);
  } else if (classes.length === 1) {
    resultSetter(classes[0]);
  }
}

async function buildMessage(fragment, classes) {
  var result = [
    {
      role: 'system',
      content: resources.res_web_client_plugins_transformers_primary_class_service_1,
    },
    {
      role: 'user',
      content: resources.res_web_client_plugins_transformers_primary_class_service_2.replace('{{title}}', fragment.title).replace('{{content}}', await deps.constants.getResult(fragment)).replace('{{classes}}', JSON.stringify(classes)),
    },
    {
      role: 'assistant',
      content: resources.res_web_client_plugins_transformers_primary_class_service_3,
    },
  ];

  return [result, []];
}

module.exports = { getDescription, calculateMaxTokens, iterator, buildMessage, services, deps };
