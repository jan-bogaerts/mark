
const resources = require('./resources.json');
const services = {}; // must always be present
const deps = {}; // must always be present

function getDescription() {
  return {
    name: 'classes',
    dependencies: ['constants'],
    isJson: true,
    description: 'The class-lister service is responsible for extracting all the names of the classes that are declared in a text fragment.'
  };
}

function calculateMaxTokens(inputTokenCount) {
  return inputTokenCount.total / 2;
}

async function buildMessage(textFragment) {
  if (services.projectService.textFragments.indexOf(textFragment) < 2) return null;
  var linesStr = textFragment.lines.join('\n');
  if (!linesStr.trim()) return null;

  var result = [
    {
      role: 'system',
      content: resources.res_web_client_plugins_transformers_class_lister_service_1.replace('{{dev_stack_title}}', services.projectService.textFragments[1]?.title).replace('{{dev_stack_content}}', services.projectService.textFragments[1]?.lines.join('\n')),
    },
    {
      role: 'user',
      content: resources.res_web_client_plugins_transformers_class_lister_service_2.replace('{{title}}', textFragment.title).replace('{{content}}', await deps.constants.getResult(textFragment)),
    },
  ];

  if (services.projectService.textFragments.length >= 1) {
    return [result, [services.projectService.textFragments[1].key]];
  } else {
    return [result, []];
  }
}

module.exports = { getDescription, buildMessage, calculateMaxTokens, services, deps };
