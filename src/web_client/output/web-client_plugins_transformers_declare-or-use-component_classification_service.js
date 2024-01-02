
const resources = require('./resources.json');
const services = {}; // must always be present
const deps = {}; // must always be present

function getDescription() {
  return {
    name: 'declare or use component',
    dependencies: ['triple compress', 'components', 'primary component', 'component description'],
    isJson: false,
    description: 'The declare-or-use-component classification service is responsible for figuring out if a component gets declared or used in a text-fragment.'
  };
}

async function calculateMaxTokens(inputTokenCount) {
  return 250;
}

async function iterator(fragment, callback, resultSetter) {
  const titles = await getOtherTitles(fragment.key);
  const description = await deps['component description'].getResult(fragment);
  const components = await deps.components.getResult(fragment);
  if (components.length > 0) {
    const primary = await deps['primary component'].getResult(fragment);
    for (let item of components) {
      if (item === primary) {
        resultSetter([fragment.key, item], 'declare');
      } else {
        await callback(fragment, titles, item, description[item]);
      }
    }
  }
}

async function getOtherTitles(toExclude) {
  const result = [];
  for (let fragment of services.projectService.textFragments) {
    if (fragment.key === toExclude) continue;
    const components = await deps.components.getResult(fragment);
    if (components && components.length > 0) {
      const description = await deps['triple compress'].getResult(fragment);
      const value = `${fragment.key}:\n${services.keyService.calculateLocation(fragment)}\n${JSON.stringify(description,0, 2)}\n`;
      result.push(value);
    }
  }
  return result;
}

function cleanResponse(response) {
  if (response.toLowerCase() === 'no') {
    return 'declare';
  } else {
    if (response.startsWith("'")) {
      response = response.substring(1);
    }
    if (response.endsWith("'")) {
      response = response.slice(0, -1);
    }
    if (response.endsWith(':')) {
      response = response.slice(0, -1);
    }
    return response;
  }
}

async function buildMessage(fragment, titles, item, description) {
  if (!description) return null;
  const result = [
    {
      role: 'system',
      content: resources.res_web_client_plugins_transformers_declare_or_use_component_classification_service_1.replace('{{name}}', item).replace('{{description}}', description),
    },
    {
      role: 'user',
      content: resources.res_web_client_plugins_transformers_declare_or_use_component_classification_service_2.replace('{{name}}', item).replace('{{titles}}', titles.join('\n')),
    },
  ];
  return [result, [ item ]];
}

module.exports = { getDescription, calculateMaxTokens, iterator, getOtherTitles, cleanResponse, buildMessage, services, deps };
