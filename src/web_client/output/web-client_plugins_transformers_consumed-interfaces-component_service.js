
const resources = require('./resources.json');
const services = {}; // must always be present
const deps = {}; // must always be present

function getDescription() {
  return {
    name: 'consumed interfaces component',
    dependencies: ['components', 'component imports', 'usage extractor', 'component exact description', 'global component features'],
    isJson: true
  };
}

function calculateMaxTokens(inputTokenCount) {
  return inputTokenCount.total;
}

function formatInterface(interfaceDef) {
  var result = '';
  for (var key in interfaceDef) {
    result += '- ' + key + ': ' + interfaceDef[key] + '\n';
  }
  return result;
}

async function iterator(fragment, callback, result) {
  var components = await deps.components.getResult(fragment);
  for (var i = 0; i < components.length; i++) {
    var component = components[i];
    var importsList = await deps['component imports'].getResult(fragment);
    if (importsList) {
      importsList = importsList[component];
    }
    if (importsList) {
      var componentDesc = (await deps['component exact description'].getResult(fragment))?.[component];
      for (var j = 0; j < importsList.length; j++) {
        var import_def = importsList[j];
        var service = import_def['service'];
        var serviceLoc = import_def['service_loc'];
        var serviceFragment = services.projectService.getFragment(serviceLoc);
        if (!serviceFragment) {
          throw new Error('fragment with key ' + serviceLoc + ' not found in the project');
        }
        var interfaceDef = (await deps['usage extractor'].getResult(serviceFragment))?.[service];
        if (interfaceDef) {
          var fullDescription = componentDesc;
          var globalInterfaceDef = await deps['global component features'].getResults(serviceFragment);
          if (globalInterfaceDef) {
            fullDescription += '\n';
            for (var key in globalInterfaceDef) {
              fullDescription += '\n' + globalInterfaceDef[key];
            }
          }
          interfaceDef = formatInterface(interfaceDef);
          await callback(fragment, component, service, serviceLoc, interfaceDef, fullDescription);
        }
      }
    }
  }
}

async function buildMessage(fragment, item, service, serviceLoc, interfaceDef, fullDescription) {
  var result = [
    {
      role: 'system',
      content: resources.res_web_client_plugins_transformers_consumed_interfaces_component_service_1.replace('{{name}}', service).replace('{{interface}}', interfaceDef),
    },
    {
      role: 'user',
      content: resources.res_web_client_plugins_transformers_consumed_interfaces_component_service_2.replace('{{full}}', fullDescription),
    },
  ];

  return [result, [ item, service ]];
}

module.exports = { getDescription, calculateMaxTokens, iterator, buildMessage, services, deps };
