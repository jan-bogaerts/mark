
const resources = require('./resources.json');
const services = {}; // must always be present
const deps = {}; // must always be present
const shared = require('./shared.js');

function getDescription() {
  return {
    name: 'class imports',
    dependencies: ['classes', 'declare or use class', 'service usage', 'class description'],
    isJson: false,
    description: 'The class-imports service is responsible for generating the list of modules that should be imported by a class.'
  };
}

async function getServiceImports(fragment) {
  let imported = {};
  let results = [];

  let services_used = await deps['service usage'].getResult(fragment);
  if (services_used) {
    for (let service in services_used) {
      let rec = services_used[service];
      if (!rec['value']) continue;
      let service_loc = rec['source'];
      let cur_path_parts = service_loc.split(" > ");
      cur_path_parts = cur_path_parts.map(part => part.replaceAll(" ", "_"));
      cur_path_parts[0] = 'src';
      if (!imported[service]) {
        imported[service] = true;
        let service_path = cur_path_parts.join('/') + '/' + service.replaceAll(" ", "_");
        results.push({ 'service': service, 'path': service_path, 'service_loc': service_loc });
      }
    }
  }
  return results;
}

async function resolveClassImports(fragment, item, callback, resultSetter) {
  let declared_in = await shared.getDeclaredIn(deps, 'declare or use class', fragment, item);
  if (!declared_in) {
    throw new Error(`can't find import location for component ${item} used in ${fragment.key}`);
  } else {
    let declaredInFragment = services.projectService.getFragment(declared_in.replaceAll("'", "").replaceAll('"', ''));
    if (!declaredInFragment) {
      throw new Error(`component declared in ${declared_in}, but fragment cant be found at specified index`);
    }
    let classes = await deps.classes.getResult(declaredInFragment);
    if (classes.includes(item)) {
      let path = shared.buildPath(services, declaredInFragment, item);
      resultSetter([fragment.key, item], path);
    } else {
      let declaredClasses = await shared.getAllDeclared(deps, 'declare or use class', declaredInFragment);
      if (declaredClasses.length === 1) {
        let path = shared.buildPath(services, declaredInFragment, declaredClasses[0]);
        resultSetter([fragment.key, item], path);
      } else {
        await callback(fragment, item, declaredClasses, declaredInFragment);
      }
    }
  }
}

async function iterator(fragment, callback, resultSetter) {
  let classes = await deps.classes.getResult(fragment);
  for (let item of classes) {
    let isDeclare = await shared.getIsDeclared(deps, 'declare or use class', fragment, item);
    if (isDeclare) {
      let imports = await getServiceImports(fragment);
      resultSetter([fragment.key, item], imports);
    } else {
      await resolveClassImports(fragment, item, callback, resultSetter);
    }
  }
}

function cleanResponse(response, fragment, item, declaredClasses, declaredInFragment) {
  return shared.buildPath(services, declaredInFragment, response);
}

async function buildMessage(fragment, item, declaredClasses) {
  let description = await deps['class description'].getResult(fragment);
  if (!description) return null;
  description = description[item];
  if (!description) return null;

  let result = [
    {
      role: 'system',
      content: resources.res_web_client_plugins_transformers_class_imports_service_1,
    },
    {
      role: 'user',
      content: resources.res_web_client_plugins_transformers_class_imports_service_2.replace('{{description}}', description).replace('{{items}}', declaredClasses.join('\n- ')).replace('{{name}}', item),
    },
  ];

  return [result, [item]];
}

function calculateMaxTokens(inputTokenCount) {
  return inputTokenCount.total + 200;
}

module.exports = { getDescription, buildMessage, calculateMaxTokens, iterator, cleanResponse, services, deps };
