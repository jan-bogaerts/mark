
const resources = require('./resources.json');
const services = {}; // must always be present
const deps = {}; // must always be present

function getDescription() {
  return {
    name: 'component exact description',
    dependencies: ['components', 'primary component'],
    isJson: false,
    description: 'The component-exact-description-service is responsible for generating descriptions of components based on the text-fragments that contain references to those components. A single description can only contain info about the requested component, any information about other components is removed.'
  };
}

async function buildContent(fragment, components, primary, item) {
  var info = fragment.lines.join('\n');
  if (!info) {
    return null;
  }
  var other_components = components.filter(c => c !== item);
  var remember_prompt = '';
  var to_be = '';
  if (other_components.length === 1) {
    to_be = ' is';
    other_components = other_components[0];
  } else if (other_components.length > 1) {
    to_be = ' are';
    var last_join = item === primary ? ' and ' : ' or ';
    other_components = other_components.slice(0, -1).join(', ') + last_join + other_components.slice(-1);
  } else {
    other_components = '';
  }
  if (other_components) {
    if (item === primary) {
      remember_prompt = 'Remember: mention where ' + other_components + to_be + ' used but not their features';
      other_components = ', only mention where ' + other_components + to_be + ' used but not their features';
    } else {
      other_components = ', do not mention anything about ' + other_components;
    }
  }
  return [info, other_components, remember_prompt];
}

async function buildMessage(fragment, components, primary, item) {
  var [content, otherCompText, rememberPrompt] = await buildContent(fragment, components, primary, item);
  if (!content) return null;
  var result = [
    {
      role: 'system',
      content: resources.res_web_client_plugins_transformers_component_exact_description_service_1.replaceAll('{{name}}', item).replaceAll('{{otherCompText}}', otherCompText),
    },
    {
      role: 'user',
      content: resources.res_web_client_plugins_transformers_component_exact_description_service_2.replaceAll('{{content}}', content),
    },
  ];
  if (rememberPrompt) {
    result.push({
      role: 'assistant',
      content: rememberPrompt,
    });
  }
  return [result, [item]];
}

function calculateMaxTokens(inputTokenCount) {
  return inputTokenCount.total;
}

async function iterator(fragment, callback) {
  var components = await deps.components.getResult(fragment);
  var primary = await deps['primary component'].getResult(fragment);
  for (var item of components) {
    await callback(fragment, components, primary, item);
  }
}

module.exports = { getDescription, buildMessage, calculateMaxTokens, iterator, services, deps };
