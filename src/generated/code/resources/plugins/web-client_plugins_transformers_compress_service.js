
const resources = require('./resources.json');
const services = {}; // must always be present
const deps = {}; // must always be present

function getDescription() {
  return {
    name: 'compress',
    dependencies: ['constants'],
    isJson: false,
    description: 'The compress service takes a text fragment and makes it shorter. Useful to check if the system understands the fragment and can be used as input for other processes.'
  };
}

async function buildMessage(fragment) {
  var result = [
    {
      role: 'system',
      content: resources.res_web_client_plugins_transformers_compress_service_1,
    },
    {
      role: 'user',
      content: await deps.constants.getResult(fragment),
    },
  ];

  return [result, [ ]];
}

function calculateMaxTokens(inputTokenCount) {
  return inputTokenCount.total;
}

module.exports = { getDescription, buildMessage, calculateMaxTokens, services, deps };
