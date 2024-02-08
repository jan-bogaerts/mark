
const resources = require('./resources.json');
const services = {}; // must always be present
const deps = {}; // must always be present
const shared = require('./shared.js');

function getDescription() {
  return {
    name: 'class description',
    dependencies: ['double compress', 'classes'],
    isJson: false,
    description: 'The class-description-service is responsible for generating descriptions of classes based on the text-fragments that contain references to those classes. Used as input for various other transformers that require the description of only 1 class in a fragment instead of everything.'
  };
}

function calculateMaxTokens(inputTokenCount) {
  return inputTokenCount.total;
}

async function iterator(fragment, callback) {
  const classes = await deps.classes.getResult(fragment);
  if (!classes) {
    return;
  }
  for (let item of classes) {
    await callback(fragment, item);
  }
}

async function buildMessage(fragment, item) {
  let content = await deps['double compress'].getResult(fragment);
  if (!content) return null;

  let result = [
    {
      role: 'system',
      content: resources.res_web_client_plugins_transformers_class_description_service_1,
    },
    {
      role: 'user',
      content: resources.res_web_client_plugins_transformers_class_description_service_2.replace('{{name}}', item).replace('{{content}}', content),
    },
  ];

  return [result, [ item ]];
}

module.exports = { getDescription, calculateMaxTokens, iterator, buildMessage, services, deps };
