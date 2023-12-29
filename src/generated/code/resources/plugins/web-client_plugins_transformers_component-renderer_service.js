const resources = require("./resources.json");
const services = {}; // must always be present
const deps = {}; // must always be present
const shared = require("./shared.js");
const fs = require("fs");
const path = require("path");

function getDescription() {
  return {
    name: "component renderer",
    dependencies: [
      "components",
      "declare or use component",
      "is service singleton",
      "component imports",
      "primary component",
      "consumed interfaces component",
      "usage extractor",
      "component exact description",
      "consumed interfaces class",
      'constants',
    ],
    isJson: false,
    description:
      "the component-renderer service is responsible for generating all the code related to UI components.",
  };
}

function calculateMaxTokens(inputTokenCount, modelOptions) {
  return modelOptions.maxTokens;
}

async function iterator(fragment, callback, result) {
  const renderToPath = shared.getPath(services, fragment);
  const components = await deps.components.getResult(fragment);
  const primary = await deps["primary component"].getResult(fragment);
  if (!primary) {
    throw new Error("no primary found for " + fragment.title);
  }
  const { toRender, used } = await shared.getToRenderAndUsed(deps, fragment, components);
  await callback(fragment, primary, components, renderToPath);
  for (let component of toRender) {
    if (component !== primary) {
      await callback(fragment, component, components, renderToPath);
    }
  }
}

function cleanResponse(response, fragment, component, components, renderToPath) {
  response = response.trim();
  if (response.startsWith("```javascript")) {
    response = response.substring("```javascript".length);
  }
  if (response.endsWith("```")) {
    response = response.substring(0, response.length - "```".length);
  }
  if (!fs.existsSync(renderToPath)) {
    fs.mkdirSync(renderToPath, { recursive: true });
  }
  const filePath = path.join(renderToPath, component + ".js");
  fs.writeFileSync(filePath, response);
  return filePath;
}

async function buildMessage(fragment, component, components, renderToPath) {
  const result = [
    {
      role: "system",
      content: resources.res_web_client_plugins_transformers_component_renderer_service_1
        .replace("{{name}}", component)
        .replace("{{devStack}}", services.projectService.textFragments[1]?.lines.join("\n")),
    },
    {
      role: "user",
      content: resources.res_web_client_plugins_transformers_component_renderer_service_2
        .replace("{{name}}", component)
        .replace(
          "{{ownDescription}}",
          components.length > 1
            ? (await deps["component exact description"].getResult(fragment))?.[component]
            : fragment.lines.join("\n")
        )
        .replace(
          "{{externalDescription}}",
          await shared.getExternalDescription(deps, fragment, component)
        )
        .replace("{{otherInterfaces}}", await shared.getOtherInterfaces(deps, fragment, component))
        .replace(
          "{{importsToAdd}}",
          await shared.getAllImports(deps, "component imports", services, fragment, component, renderToPath)
        ),
    },
  ];

  return [result, [component]];
}

module.exports = {
  getDescription,
  calculateMaxTokens,
  iterator,
  cleanResponse,
  buildMessage,
  services,
  deps,
};
