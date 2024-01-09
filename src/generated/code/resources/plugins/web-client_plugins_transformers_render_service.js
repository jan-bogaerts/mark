
const resources = require('./resources.json');
const services = {}; // must always be present
const deps = {}; // must always be present
const shared = require('./shared.js');

function getDescription() {
  return {
    name: 'renderer',
    dependencies: ['class renderer', 'component renderer'],
    isJson: true,
    isEntryPoint: true,
    description: 'The render service is the main transformer responsible for generating code from fragments.'
  };
}

async function iterator(fragment, callback, resultSetter) {
  const comps = await deps['component renderer'].getResult(fragment);
  resultSetter(comps, ['components']);
  const cls = await deps['class renderer'].getResult(fragment);
  resultSetter(cls, ['classes']);
}

async function buildMessage(fragment, item, classes, renderToPath) {
  return '';
}

module.exports = { getDescription, iterator, buildMessage, services, deps };
