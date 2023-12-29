const resources = require("./resources.json");
const services = {}; // must always be present
const deps = {}; // must always be present

function getDescription() {
  return {
    name: "primary component",
    dependencies: ["components"],
    isJson: false,
    description:
      "The primary-component service is responsible for identifying the component that is most of all described and stands out as the most important component in the text-fragment.",
  };
}

function calculateMaxTokens(inputTokenCount) {
  return 120;
}

async function buildMessage(fragment) {
  var result = [
    {
      role: "system",
      content: resources.res_web_client_plugins_transformers_primary_component_service_1,
    },
    {
      role: "user",
      content: resources.res_web_client_plugins_transformers_primary_component_service_2
        .replace("{{title}}", fragment.title)
        .replace("{{content}}", fragment.lines.join("\n"))
        .replace("{{components}}", JSON.stringify(await deps.components.getResult(fragment))),
    },
    {
      role: "assistant",
      content: resources.res_web_client_plugins_transformers_primary_component_service_3,
    },
  ];

  return [result, []];
}

module.exports = { getDescription, buildMessage, calculateMaxTokens, services, deps };
