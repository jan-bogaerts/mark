
const resources = require('./resources.json');
const services = {}; // must always be present
const deps = {}; // must always be present
const shared = require('./shared.js');
const os = require('os');
const path = require('path');
const fs = require('fs');

function getDescription() {
  return {
    name: 'class renderer',
    dependencies: [
      "classes",
      "declare or use class",
      "is service singleton",
      "class imports",
      "primary class",
      "consumed interfaces class",
      "usage extractor",
    ],
    isJson: false,
    description: 'the class-renderer service is responsible for generating all the code for the services in the form of classes.'
  };
}

function calculateMaxTokens(inputTokenCount, modelOptions) {
  return modelOptions.maxTokens - inputTokenCount.total - 500;
}

async function iterator(fragment, callback, resultSetter) {
  const renderToPath = shared.getPath(services, fragment);
  const classes = await deps.classes.getResult(fragment);
  const primary = await deps['primary class'].getResult(fragment);
  if (!primary) {
    throw new Error('no primary found for ' + fragment.title);
  }
  await callback(fragment, primary, classes, renderToPath);
  for (let item of classes) {
    if (item !== primary) {
      await callback(fragment, item, classes, renderToPath);
    }
  }
}

function cleanResponse(response, fragment, item, classes, renderToPath) {
  response = response.trim();
  if (response.startsWith("```javascript")) {
    response = response.substring("```javascript".length);
  }
  if (response.endsWith("```")) {
    response = response.substring(0, response.length - "```".length);
  }
  const fullPath = path.join(services.folderService.output, renderToPath);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  const filePath = path.join(fullPath, item + ".js");
  fs.writeFileSync(filePath, response);
  return filePath;
}

async function buildMessage(fragment, item, classes, renderToPath) {
  const result = [
    {
      role: "system",
      content: resources.res_web_client_plugins_transformers_class_renderer_service_1
        .replace("{{name}}", item)
        .replace("{{devStack}}", services.projectService.textFragments[1]?.lines.join("\n")),
    },
    {
      role: "user",
      content: resources.res_web_client_plugins_transformers_class_renderer_service_2
        .replace("{{name}}", item)
        .replace(
          "{{ownDescription}}",
          classes.length > 1
            ? await deps["class exact description"].getResult(fragment)
            : "\n".join(fragment.lines)
        )
        .replace(
          "{{externalDescription}}",
          await shared.getExternalDescription(deps, fragment, item)
        )
        .replace("{{otherInterfaces}}", await shared.getOtherInterfaces(deps, fragment, item))
        .replace(
          "{{importsToAdd}}",
          await shared.getAllImports(deps, "class imports", services, fragment, item, renderToPath)
        ),
    },
    {
      role: 'assistant',
      content: resources.res_web_client_plugins_transformers_class_renderer_service_3,
    },
  ];
  return [result, [item]];
}

module.exports = { getDescription, calculateMaxTokens, iterator, cleanResponse, buildMessage, services, deps };
