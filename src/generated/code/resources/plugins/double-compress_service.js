
const resources = require('./resources.json');
const services = {}; // must always be present
const deps = {}; // must always be present

function getDescription() {
  return {
    name: 'double compress', 
    dependencies: ['compress'], 
    isJson: false, 
    description: 'The double-compress-service takes the result of compress-service and makes it even shorter. Useful to check if the system understands the fragment and can be used as input for other processes.'
  };
}

async function buildMessage(textFragment) {
  var result = [
    {
      role: 'system',
      content: resources.double_compress_service_1,
    },
    {
      role: 'user',
      content: await deps.compress.getResult(textFragment),
    },
  ];

  return [result, [textFragment.key]];
}

module.exports = { getDescription, buildMessage, services, deps };
