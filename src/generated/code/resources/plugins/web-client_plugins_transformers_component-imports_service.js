
const resources = require('./resources.json');
const services = {}; // must always be present
const deps = {}; // must always be present
const shared = require('./shared.js');

function getDescription() {
  return {
    name: 'component imports',
    dependencies: ['components', 'declare or use component', 'service usage', 'global component features', 'component description'],
    isJson: false,
    description: 'The component-imports service is responsible for generating the list of modules that should be imported by a component.'
  };
}

function calculateMaxTokens(inputTokenCount) {
  return 200;
}

async function iterator(fragment, callback, resultSetter) {
  const components = await deps.components.getResult(fragment);
  for (let component of components) {
    const isDeclare = await shared.getIsDeclared(deps, 'declare or use component', fragment, component);
    if (isDeclare) {
      const imports = await getServiceImports(fragment);
      resultSetter(imports, [fragment.key, component]);
    } else {
      await resolveComponentImports(fragment, component, callback, resultSetter);
    }
  }
}

async function getServiceImports(fragment) {
  const imported = {}; // so we don't list the same thing twice
  const results = [];

  const services_used = await deps['service usage'].getResult(fragment);
  if (services_used) {
    for (let [service, rec] of Object.entries(services_used)) {
      if (!rec['value']) {
        continue; // some services are included in the list cause the previous step had flagged them (cheap run), but then list_service_usage didn't find any usage of them (expensive run)
      }
      const service_loc = rec['source'];
      let cur_path_parts = service_loc.split(" > ");
      // replace all spaces with underscores
      cur_path_parts = cur_path_parts.map(part => part.replace(/ /g, "_"));
      cur_path_parts[0] = 'src'; // replace the first part with src so that it replaces the name of the project which isn't the root of the source code
      if (!imported[service]) {
        imported[service] = true;
        const service_path = cur_path_parts.join('/') + '/' + service.replace(/ /g, "_");
        results.push({ 'service': service, 'path': service_path, 'service_loc': service_loc });
      }
    }
  }

  for (let fragment of services.projectService.textFragments) {
    const globalFeatures = await deps['global component features'].getResult(fragment);
    if (globalFeatures) {
      let cur_path_parts = fragment.key.split(" > ");
      // replace all spaces with underscores
      cur_path_parts = cur_path_parts.map(part => part.replace(/ /g, "_").replace(/-/g, '_'));
      cur_path_parts[0] = 'src'; // replace the first part with src so that it replaces the name of the project which isn't the root of the source code
      for (let [service, features] of Object.entries(globalFeatures)) {
        if (!imported[service]) {
          imported[service] = true;
          const service_path = cur_path_parts.join('/') + '/' + service.replace(/ /g, "_").replace(/-/g, '_').trim();
          results.push({ 'service': service, 'path': service_path, 'service_loc': fragment.full_title });
        }
      }
    }
  }
  return results;
}

async function resolveComponentImports(fragment, component, callback, resultSetter) {
  const declared_in = await shared.getDeclaredIn(deps, 'declare or use component', fragment, component);
  if (!declared_in) {
    throw new Error(`can't find import location for component ${component} used in ${fragment.key}`);
  } else {
    const declaredInFragment = services.projectService.getFragment(declared_in.replace(/'/g, "").replace(/"/g, "")); // remove quotes cause gpr sometimes adds them
    if (!declaredInFragment) {
      throw new Error(`component declared in ${declared_in}, but fragment cant be found at specified index`);
    }
    const components = await deps.components.getResult(declaredInFragment);
    if (components.includes(component)) {
      const path = shared.buildPath(services, declaredInFragment, component);
      resultSetter(path, [fragment.key, component]);
    } else {
      // if there is only 1 component declared in the fragment, we can presume that's the one we need
      const declared_comps = await shared.getAllDeclared(deps, 'declare or use component', declaredInFragment);
      if (declared_comps.length === 1) {
        const path = shared.buildPath(services, declaredInFragment, declared_comps[0]);
        resultSetter(path, [fragment.key, component]);
      } else {
        await callback(fragment, component, declared_comps, declaredInFragment); // declaredInFragment is needed for cleanresponse
      }
    }
  }
}

function cleanResponse(response, fragment, component, declared_comps, declaredInFragment) {
  return shared.buildPath(services, declaredInFragment, response);
}

async function buildMessage(fragment, component, declared_comps) {
  let description = await deps['component description'].getResult(fragment);
  if (!description) return null;
  description = description[component]; // a fragment can have multiple classes, so get the description of the class we are searching for
  if (!description) return null;

  const result = [
    {
      role: 'system',
      content: resources.res_web_client_plugins_transformers_component_imports_service_1,
    },
    {
      role: 'user',
      content: resources.res_web_client_plugins_transformers_component_imports_service_2.replace('{{description}}', description).replace('{{items}}', declared_comps.join('\n- ')).replace('{{component}}', component),
    },
  ];

  return [result, [component]];
}

module.exports = { getDescription, buildMessage, calculateMaxTokens, iterator, getServiceImports, resolveComponentImports, cleanResponse, services, deps };
