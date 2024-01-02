
const resources = require('./resources.json');
const services = {}; // must always be present
const deps = {}; // must always be present

function getDescription() {
  return {
    name: 'declare or use class',
    dependencies: ['classes', 'class description', 'primary class'],
    isJson: false,
    description: 'The declare-or-use-class classification service is responsible for figuring out if a class gets declared or used in a text-fragment. Used to determine if a file needs to be generated for the class or the info needs to be used to find out from where to import the class.'
  };
}

async function getKeysWithClasses(toExclude) {
  var result = [];
  for (var fragment of services.projectService.textFragments) {
    var classes = await deps.classes.getResult(fragment);
    if (classes && fragment.key != toExclude) {
      result.push(services.keyService.calculateLocation(fragment.key));
    }
  }
  return result;
}

async function iterator(fragment, callback, resultSetter) {
  var titles = await getKeysWithClasses(fragment.key);
  var classes = await deps.classes.getResult(fragment);
  if (classes?.length > 0) {
    var primary = await deps['primary class'].getResult(fragment);
    for (var item of classes) {
      if (item === primary) {
        resultSetter('declare', [fragment.key, item]);
      } else {
        await callback(fragment, titles, item);
      }
    }
  }
}

function cleanResponse(response) {
  if (response.toLowerCase() == 'no') {
    return 'declare';
  }
  return response;
}

async function buildMessage(fragment, titles, item) {
  var description = await deps['class description'].getResult(fragment);
  if (!description) return null;
  description = description[item]; // a fragment can have multiple classes, so get the description of the class we are searching for
  if (!description) return null;

  var result = [
    {
      role: 'system',
      content: resources.res_web_client_plugins_transformers_declare_or_use_class_classification_service_1.replace('{{class}}', item).replace('{{description}}', description),
    },
    {
      role: 'user',
      content: resources.res_web_client_plugins_transformers_declare_or_use_class_classification_service_2.replace('{{titles}}', titles.join('\n')),
    },
  ];

  return [result, [ item ]];
}

function calculateMaxTokens(inputTokenCount) {
  return 200;
}

module.exports = { getDescription, getKeysWithClasses, iterator, cleanResponse, buildMessage, calculateMaxTokens, services, deps };
