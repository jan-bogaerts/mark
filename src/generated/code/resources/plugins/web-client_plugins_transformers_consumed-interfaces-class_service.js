
const resources = require('./resources.json');
const services = {}; // must always be present
const deps = {}; // must always be present

function getDescription() {
  return {
    name: 'consumed interfaces class',
    dependencies: ['classes', 'class imports', 'usage extractor', 'class description'],
    isJson: true,
    description: 'The consumed-interfaces-class is responsible for filtering the interface definitions of all imports done by a class to only those items that are used in the description.'
  };
}

function calculateMaxTokens(inputTokenCount) {
  return inputTokenCount.total;
}

function formatInterface(interfaceDef) {
  let result = '';
  for (let key in interfaceDef) {
    result += `- ${key}: ${interfaceDef[key]}\n`;
  }
  return result;
}

async function buildMessage(fragment, item, service, serviceLoc, interfaceDef, fullDescription) {
  let result = [
    {
      role: 'system',
      content: resources.res_web_client_plugins_transformers_consumed_interfaces_class_service_1.replace('{{name}}', service).replace('{{interface}}', interfaceDef),
    },
    {
      role: 'user',
      content: resources.res_web_client_plugins_transformers_consumed_interfaces_class_service_2.replace('{{full}}', fullDescription),
    },
  ];

  return [result, [ item, service ]];
}

async function iterator(fragment, callback, result) {
  let classes = await deps.classes.getResult(fragment);
  for (let item of classes) {
    let importsList = await deps['class imports'].getResult(fragment);
    if (importsList) {
      importsList = importsList[item];
    }
    if (importsList) {
      let classDesc = (await deps['class description'].getResult(fragment))?.[item];
      for (let import_def of importsList) {
        let service = import_def['service'];
        let serviceLoc = import_def['service_loc'];
        let serviceFragment = services.projectService.getFragment(serviceLoc);
        if (!serviceFragment) {
          throw new Error(`fragment with key ${serviceLoc} not found in the project`);
        }
        let interfaceDef = (await deps['usage extractor'].getResult(serviceFragment))?.[service];
        if (interfaceDef) {
          let fullDescription = classDesc;
          interfaceDef = formatInterface(interfaceDef);
          await callback(fragment, service, serviceLoc, interfaceDef, fullDescription);
        }
      }
    }
  }
}

module.exports = { getDescription, buildMessage, calculateMaxTokens, iterator, services, deps };
