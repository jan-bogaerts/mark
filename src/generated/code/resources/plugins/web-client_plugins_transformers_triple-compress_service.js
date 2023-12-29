
const resources = require('./resources.json');
const services = {}; // must always be present
const deps = {}; // must always be present

function getDescription() {
  return {
    name: 'triple compress',
    dependencies: ['double compress'],
    isJson: false,
    description: 'The triple-compress-service takes the result of double-compress-service and shortens it to 1 line.'
  };
}

async function buildMessage(textFragment) {
  var result = [
    {
      role: 'system',
      content: resources.res_web_client_plugins_transformers_triple_compress_service_1,
    },
    {
      role: 'user',
      content: await deps['double compress'].getResult(textFragment),
    },
  ];

  return [result, [ ]];
}

function calculateMaxTokens(inputTokenCount) {
  return inputTokenCount.total;
}

module.exports = { getDescription, buildMessage, calculateMaxTokens, services, deps };
