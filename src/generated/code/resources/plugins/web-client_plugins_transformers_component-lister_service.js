
const resources = require('./resources.json');
const services = {}; // must always be present
const deps = {}; // must always be present

function getDescription() {
  return {
    name: 'components',
    dependencies: [],
    isJson: true,
    description: 'The component-lister service is responsible for extracting all the component names it can find in a text-fragment.'
  };
}

function calculateMaxTokens(inputTokenCount) {
  return inputTokenCount.total / 2;
}

async function buildMessage(textFragment) {
  if (services.projectService.textFragments.indexOf(textFragment) < 2) return null;
  const linesStr = textFragment.lines.join('\n');
  if (!linesStr.trim()) return null;
  var result = [
    {
      role: 'system',
      content: resources.res_web_client_plugins_transformers_component_lister_service_1.replace('{{dev_stack_title}}', services.projectService.textFragments[1]?.title).replace('{{dev_stack_content}}', services.projectService.textFragments[1]?.lines.join('\n')),
    },
    {
      role: 'user',
      content: resources.res_web_client_plugins_transformers_component_lister_service_2.replace('{{title}}', textFragment.title).replace('{{content}}', textFragment.lines.join('\n')),
    },
    {
      role: 'assistant',
      content: resources.res_web_client_plugins_transformers_component_lister_service_3,
    },
  ];

  if (services.projectService.textFragments.length >= 1) {
    return [result, [services.projectService.textFragments[1].key]];
  } else {
    return [result, []];
  }
}

module.exports = { getDescription, buildMessage, calculateMaxTokens, services, deps };
