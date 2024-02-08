
const resources = require('./resources.json');
const services = {}; // must always be present
const deps = {}; // must always be present
const shared = require('./shared.js');
const fs = require('fs');

function getDescription() {
  return {
    name: 'usage extractor', 
    dependencies: ['component renderer', 'components', 'component imports', 'declare or use component', 'class renderer', 'classes', 'class imports', 'primary component'], 
    isJson: true,
    description: 'The usage-extractor service is responsible for listing all parts of the interface of a service that are actually used in the code.'
  };
}

function calculateMaxTokens(inputTokenCount) {
  return inputTokenCount.total + (inputTokenCount.total / 5);
}

async function iterator(fragment, callback, result) {
  let allCode = null;
  let allImports = null;
  const components = await deps.components.getResult(fragment);
  const primary = await deps['primary component'].getResult(fragment);
  const [toRender, ] = await shared.getToRenderAndUsed(deps, fragment, components);
  const fragmentCode = deps['component renderer'].cache.getFragmentResults(fragment.key);
  const primaryCodeFile = fragmentCode?.[primary];
  for (let component of toRender) {
    if (component !== primary && primaryCodeFile) {
      const code = fs.readFileSync(primaryCodeFile, 'utf8');
      await callback(fragment, component, primary, fragment, code, true);
    }
    for (let checkAgainst of services.projectService.textFragments) {
      allCode = deps['component renderer'].cache.getFragmentResults(checkAgainst.key);
      allImports = deps['component imports'].cache.getFragmentResults(checkAgainst.key);
      if (allCode && allImports) {
        for (let key in allCode) {
          const imports = allImports[key];
          if (fragment.key in imports) {
            const code = fs.readFileSync(allCode[key], 'utf8');
            await callback(fragment, component, key, checkAgainst, code, true);
          }
        }
      }
    }
  }
  const classes = await deps.classes.getResult(fragment);
  for (let item of classes) {
    for (let checkAgainst of services.projectService.textFragments) {
      allCode = deps['class renderer'].cache.getFragmentResults(checkAgainst.key);
      allImports = deps['class imports'].cache.getFragmentResults(checkAgainst.key);
      if (allCode && allImports) {
        for (let key in allCode) {
          const imports = allImports[key];
          if (fragment.key in imports) {
            const code = fs.readFileSync(allCode[key], 'utf8');
            await callback(fragment, item, key, checkAgainst, code, false);
          }
        }
      }
    }
  }
}

async function buildMessage(fragment, item, service, serviceFragment, code, isComponent) {
  const result = [
    {
      role: 'system',
      content: resources.res_web_client_plugins_transformers_usage_extractor_service_1.replace('{{name}}', service).replace('{{type}}', isComponent ? 'component' : 'class'),
    },
    {
      role: 'user',
      content: resources.res_web_client_plugins_transformers_usage_extractor_service_2.replace('{{name}}', service).replace('{{code}}', code),
    },
    {
      role: 'assistant',
      content: resources.res_web_client_plugins_transformers_usage_extractor_service_3.replace('{{name}}', service),
    },
  ];

  return [result, [item, serviceFragment.key, service]];
}

module.exports = { getDescription, calculateMaxTokens, iterator, buildMessage, services, deps };
