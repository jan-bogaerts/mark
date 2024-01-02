
var os = require('os');
var fs = require('fs');
var path = require('path');

function getImportServiceLine(deps, importDef, renderToPath) {
  var service = importDef['service'];
  var servicePath = importDef['path'];
  servicePath = path.relative(servicePath, renderToPath);
  return deps['is service singleton'].getResult(importDef['key']).then(function(isGlobal) {
    isGlobal = isGlobal[service];
    var serviceTxt = isGlobal ? "global object" : "service";
    service = service.toLowerCase();
    return "The " + serviceTxt + " " + service + " can be imported from " + servicePath + " (exported as default)\n";
  });
}


module.exports = {
  getIsDeclared: function(deps, transformerName, fragment, item) {
    var name = item.toLowerCase();
    return deps[transformerName].getResult(fragment).then(function(result) {
      var temp_items = {};
      for (var k in result) {
        temp_items[k.toLowerCase()] = result[k];
      }
      return temp_items[name] === 'declare';
    });
  },

  getAllDeclared: function(deps, transformerName, fragment) {
    return deps[transformerName].getResult(fragment).then(function(data) {
      return Object.keys(data).filter(function(name) {
        return data[name] === 'declare';
      });
    });
  },

  buildPath: function(services, declaredIn, filename) {
    declaredIn = services.keyService.calculateLocation(declaredIn.key);
    var declared_in_parts = declaredIn.split(" > ");
    declared_in_parts[0] = 'src';
    var path = path.join.apply(path, declared_in_parts.concat([filename.replace(/ /g, "_").replace(/-/g, '_')]));
    return path;
  },

  getDeclaredIn: function(deps, transformerName, fragment, item) {
    var item = item.toLowerCase();
    return deps[transformerName].getResult(fragment).then(function(result) {
      var temp_items = {};
      for (var k in result) {
        temp_items[k.toLowerCase()] = result[k];
      }
      return temp_items[item] || null;
    });
  },

  getToRenderAndUsed: function(deps, fragment, components) {
    return deps['declare or use component'].getResult(fragment).then(function(classifications) {
      var to_render = [];
      var used = [];
      var temp_classifications = {};
      for (var k in classifications) {
        temp_classifications[k.toLowerCase()] = classifications[k];
      }
      components.forEach(function(component) {
        var name = component.toLowerCase();
        if (temp_classifications[name] === 'declare') {
          to_render.push(component);
        } else {
          used.push(component);
        }
      });
      return [to_render, used];
    });
  },

  getPath: function(services, fragment) {
    var fullTitle = services.keyService.calculateLocation(fragment);
    var titleToPath = fullTitle.replace(/:/g, "").replace(/\?/g, '').replace(/!/g, '');
    var pathItems = titleToPath.split(" > ").map(function(part) {
      return part.replace(/ /g, "_");
    });
    pathItems[0] = 'src';
    return path.join.apply(path, [services.folderService.output].concat(pathItems));
  },

  readFile: function(filePath) {
    return new Promise(function(resolve, reject) {
      fs.readFile(filePath, 'utf8', function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  },

  getExternalDescription: function(deps, fragment, item) {
    return deps['usage extractor'].getResult(fragment).then(function(all) {
      var results = {};
      var found = false;
      all = all[item];
      if (all) {
        for (var key in all) {
          var value = all[key];
          for (var i = 0; i < value.length; i++) {
            var service = value[i][0];
            var usage = value[i][1];
            for (var feature in usage) {
              var desc = usage[feature];
              if (!(feature in results)) {
                results[feature] = desc;
                found = true;
              }
            }
          }
        }
      }
      if (found) {
        var toJoin = [];
        for (var key in results) {
          toJoin.push(key + ': ' + results[key]);
        }
        return '\nMake certain that ' + item + ' has:\n- ' + toJoin.join('\n- ') + '\n';
      } else {
        return '';
      }
    });
  },

  getOtherInterfaces: function(deps, fragment, item) {
    return deps['consumed interfaces class'].getResult(fragment).then(function(all) {
      var interfaceTxt = '';
      all = all[item];
      if (all) {
        for (var key in all) {
          var value = all[key];
          for (var i = 0; i < value.length; i++) {
            var service = value[i][0];
            var usage = value[i][1];
            interfaceTxt += '\n' + service + ' has the following interface:\n' + JSON.stringify(usage) + '\n';
          }
        }
      }
      return interfaceTxt;
    });
  },

  getImportServiceLine: getImportServiceLine,

  getAllImports: function(deps, depName, services, fragment, item, renderToPath) {
    var importsTxt = '';
    var constants = deps.constants.cache.getFragmentResults(fragment.key);
    if (constants) {
      var resourcesPath = path.join(services.folderService.output, 'src', 'resources.json');
      var relPath = path.relative(resourcesPath, renderToPath).replace(/\\/g, '/');
      importsTxt += "The const 'resources' can be imported from " + relPath + "\n";
    }
    return deps[depName].getResult(fragment).then(function(imports) {
      imports = imports[item];
      if (imports) {
        return Promise.all(imports.map(function(importDef) {
          return getImportServiceLine(deps, importDef, renderToPath);
        })).then(function(lines) {
          importsTxt += lines.join('');
          if (importsTxt) {
            importsTxt = '\n\nimports (only include the imports that are used in the code):\n' + importsTxt;
          }
          return importsTxt;
        });
      } else {
        return importsTxt;
      }
    });
  }
};
