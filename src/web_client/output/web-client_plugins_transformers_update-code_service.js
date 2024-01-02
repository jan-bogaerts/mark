
const resources = require('./resources.json');
const services = {}; // must always be present
const deps = {}; // must always be present
const shared = require('./shared.js');
const fs = require('fs');

function getDescription() {
  return {
    name: 'update code', 
    dependencies: ['constants', 'renderer'], 
    isJson: false, 
    description: 'The update-code service can be used to update the code that was rendered for a fragment according to the new specs of that fragment.'
  };
}

function calculateMaxTokens(inputTokenCount, modelOptions) {
  return modelOptions.maxTokens;
}

async function iterator(fragment, callback, result) {
  const files = await deps.renderer.getResult(fragment);
  if (files) {
    if (files.components) {
      for (let file of files.components) {
        const code = fs.readFileSync(file, 'utf8');
        await callback(fragment, code);
      }
    }
    if (files.classes) {
      for (let file of files.classes) {
        const code = fs.readFileSync(file, 'utf8');
        await callback(fragment, code);
      }
    }
  }
}

async function buildMessage(fragment, code) {
  var result = [
    {
      role: 'system',
      content: resources.res_web_client_plugins_transformers_update_code_service_1.replace('{{name}}', services.projectService.textFragments[1]?.lines.join('\n')),
    },
    {
      role: 'user',
      content: resources.res_web_client_plugins_transformers_update_code_service_2.replace('{{code}}', code).replace('{{specs}}', await deps.constants.getResult(fragment)),
    },
  ];

  return [result, []];
}

module.exports = { getDescription, buildMessage, calculateMaxTokens, iterator, services, deps };
