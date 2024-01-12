# web-client plugins

## shared

- getIsDeclared(deps, transformerName, fragment, item): get the result of the declare-or-use transformer and see if the specified item is declared or not. 
  Do case insensitive search.
  ```python
    name = item.lower()
    result = await deps[transformerName].getResult(fragment)
    temp_items = {k.lower(): v for k, v in result.items()}
    if name in temp_items:
      return temp_items[name] == 'declare'
    else:
      return False
  ```
- getAllDeclared(deps, transformerName, fragment):
  ```python
    data = await deps[transformerName].getResult(fragment)
    return [name for name in data if data[name] == 'declare']
  ```
- buildPath(services, declaredIn, filename):
  ```python
    declaredIn = services.keyService.calculateLocation(declaredIn.key) 
    declared_in_parts = declaredIn.split(" > ")
    declared_in_parts[0] = 'src' # replace the first part with src so that it replaces the name of the project which isn't the root of the source code
    path = os.path.join(*declared_in_parts, filename.replaceAll(" ", "_").replaceAll('-', '_') )
    return path
  ```
- getDeclaredIn(deps, transformerName, fragment, item): Returns the key of the text fragment where the item is declared. 
  Do case insensitive search.
  ```python
    item = item.lower()
    result = await deps[transformerName].getResult(fragment)
    temp_items = {k.lower(): v for k, v in result.items()}
    if item in temp_items:
      return temp_items[item]
    return None
  ```
- getToRenderAndUsed(deps, fragment, components): splits up the list of components into a list of components that are declared in the fragment and a list of components that are only used by the declared components in this fragment
  ```python
    to_render = []
    used = []
    classifications = await deps['declare or use component'].getResult(fragment)
    classifications = {k.lower(): v for k, v in classifications.items()}
    for component in components:
      name = component.lower()
      if classifications[name] === 'declare':
          to_render.append(component)
      else:
          used.append(component)
    return to_render, used
  ```
- getPath(services, fragment): calculate the path to the files we will generate cause we need it to get the import paths of the locally declared components
  ```python
    fullTitle = services.keyService.calculateLocation(fragment)
    titleToPath = fullTitle.replaceAll(":", "").replaceAll('?', '').replaceAll('!', '')
    pathItems = titleToPath.split(" > ")
    pathItems = [part.replaceAll(" ", "_") for part in pathItems]
    pathItems[0] = 'src' # the first item is the project name, we need to replace it with src so that the code gets rendered nicely
    return os.path.join( *pathItems)
  ```
- readFile(filePath): read the contents of the specified file and return as a string.
- getExternalDescription(deps, fragment, item): get how other code has used the class
  ```python
      results = {}
      found = False
      all = (await deps['usage extractor'].getResult(fragment))?.[item]
      if all:
        for key, value in all.items():
          for service, usage in value:
            for feature, desc in usage:
              if not feature in results:
              results[feature] = desc
              found = True
      if found:
        toJoin = []
        for key, value in results.items():
          toJoin.append(f'{key}: {value}')
        return f'\nMake certain that {item} has:\n- ' + '\n- '.join(toJoin) + '\n'
      return ''
  ```
- getOtherInterfaces(deps, fragment, item): get the interface definitions of other classes that are used by this class. Only include parts of the interface that are actually used in the code that needs to be rendered.
  ```python
      interfaceTxt = ''
      all = (await deps['consumed interfaces class'].getResult(fragment))?.[item]
      if all:
        for key, value in all.items():
          found = False
          results = {}
          for service, usage in value:
            interfaceTxt += f'\n{service} has the following interface:\n' + JSON.stringify(usage) + '\n'
      return interfaceTxt
  ``` 
- getImportServiceLine(importDef, renderToPath): (note: this function needs to be exported and usable within this module like in getAllImports)
    ```python
        service = importDef['service']
        servicePath = os.path.join(importDef['path'], service)
        servicePath = os.path.relpath(renderToPath, servicePath).replaceAll('\\', '/')
        fragment = await services.projectService.getResult(importDef['key'])
        isGlobal = (await deps['is service singleton'].getResult(fragment))?.[service]
        if isGlobal == 'yes' or isGlobal == True:
            serviceTxt = "global object"
            service = service.lower()
        else:
            serviceTxt = "service"
        return f"The {serviceTxt} {service} can be imported from {servicePath} (exported as default)\n"
    ```      
- getAllImports(deps, depName, services, fragment, item, renderToPath): build the text that defines which modules should be imported
   ```python
      importsTxt = None
      constants = deps.constants.cache.getFragmentResults(fragment.key)
      if constants and len(constants) > 0:
        resourcesPath = os.path.join(services.folderService.output, 'src', 'resources.json')
        relPath = os.path.relpath(renderToPath, resourcesPath)
        relPath = relPath.replaceAll('\\', '/')
        importsTxt += f"The const 'resources' can be imported from {relPath}\n"
      imports = await deps[depName].getResult(fragment)?.[item]
      for key, importInfo in imports:
        if key == item:
          for importDef in imports:
            importsTxt += await getImportServiceLine(deps, importDef, renderToPath)  
        if typeof importInfo == 'string':
          servicePath = path.relative(renderToPath, importInfo).replaceAll('\\', '/')
          importsTxt += key + " can be imported from " + servicePath + "\n"
        else:
          servicePath = f"./{key}"
          importsTxt += key + " can be imported from " + servicePath + "\n"        
      if importsTxt:
        importsTxt = '\nimports (only include the imports that are used in the code):\n' + importsTxt
      return importsTxt
    ```   
## transformers

### compress service
- The compress service takes a text fragment and makes it shorter.
- Useful to check if the system understands the fragment and can be used as input for other processes.
- name: 'compress'
- dependencies: ['constants']
- isJson: false
- calculateMaxTokens(inputTokenCount): return inputTokenCount.total
- build-message(text-fragment):
  - result (json array):
    - role: system, content:
      
     > Act as an ai software analyst. You are reviewing the feature description of an application. It is your job to shorten the following text as much as possible and rephrase it in your own words, without loosing any meaning.
     > compress the following text:

    - role: user, content: 
      ```python 
        content: await deps.constants.getResult(fragment)
      ```
  - return result, [ ]
  
  
### double-compress service
- The double-compress-service takes the result of compress-service and makes it even shorter.
- Useful to check if the system understands the fragment and can be used as input for other processes.
- name: 'double compress'
- dependencies: ['compress']
- isJson: false
- calculateMaxTokens(inputTokenCount): return inputTokenCount.total
- build-message(text-fragment):
  - result (json array):
    - role: system, content:
      
     > condense the following text as much as possible, without loosing any meaning:

    - role: user, content: await deps.compress.getResult(fragment)
  - return result, [ ]


### triple-compress service
- The triple-compress-service takes the result of double-compress-service and shortens it to 1 line.
- Used as a description for each fragment when searching for linked components and services.
- name: 'triple compress'
- dependencies: ['double compress']
- isJson: false
- calculateMaxTokens(inputTokenCount): return inputTokenCount.total
- build-message(text-fragment):
  - result (json array):
    - role: system, content:
      
     > condense the following text to 1 short sentence:

    - role: user, content: await deps['double compress'].getResult(text-fragment)
  - return result, [ ]

### component-lister service
- the component-lister service is responsible for extracting all the component names it can find in a text-fragment.
- part of finding out which components need to be rendered
- name: 'components'
- dependencies: []
- isJson: true
- calculateMaxTokens(inputTokenCount): return inputTokenCount.total / 2
- build-message(textFragment):
  - if refs.projectService.textFragments.indexOf(textFragment) < 2: return null
  - linesStr = textFragment.lines.join('\n'); if (!linesStr.trim()) return null
  - result (json array):
    - role: system, content:
      
      > Act as an ai software analyst.
      > It is your task to list all the components that you can find in the text, keeping in mind that the following development stack is used:
      > {{dev_stack_title}}
      > {{dev_stack_content}}
      >
      > Do not include UI components that are provided by the UI framework. So don't include: buttons, dropdowns, inputs, sliders, toggle buttons, but only list the components that need to be custom built.
      > Don't include any non visual services.
      > Don't include any explanation, just write the list of component names as a json array and nothing else.
      > If no components can be found, return an empty json array.
      >
      > good response:
      > ["SomethingX", "SomethingY"]
      > 
      > bad response:
      > ["something-x", "something y"]

      replace:
      - {{dev_stack_title}}: `services.projectService.textFragments[1]?.title`
      - {{dev_stack_content}}: `services.projectService.textFragments[1]?.lines.join('\n')`

    - role: user, content:

      > {{title}}
      > {{content}}
      
      replace:
      - {{title}}: `textFragment.title`
      - {{content}}: `textFragment.lines.join('\n')`

    - role: assistant, content:

      > Remember: only components and use CamelCasing for the component names.

  - return:
    ```python
    if len(services.projectService.textFragments) >= 1:
      return result, [services.projectService.textFragments[1].key ]
    else:
      result, []
    ```

### class-lister service
- the class-lister service is responsible for extracting all the names of the classes that are declared in a text fragment.
- determines which classes need to be rendered
- name: 'classes'
- dependencies: ['constants']
- isJson: true
- calculateMaxTokens(inputTokenCount): return inputTokenCount.total / 2
- build-message(textFragment):
  - if services.projectService.textFragments.indexOf(textFragment) < 2: return null
  - linesStr = textFragment.lines.join('\n'); if (!linesStr.trim()) return null
  - result (json array):
    - role: system, content:
      
      > Act as an ai software analyst.
      > It is your task to find all the classes that are declared in the user text.
      > The following development stack is used:
      > {{dev_stack_title}}
      > {{dev_stack_content}}
      >
      > Do not include UI components, but only list the classes that need to be custom built.
      > return an empty array if you can't detect any classes.
      > don't include any introduction. Don't include any explanation, just write the list of classes as a json array.
      
      replace:
      - {{dev_stack_title}}: `services.projectService.textFragments[1]?.title`
      - {{dev_stack_content}}: `services.projectService.textFragments[1]?.lines.join('\n')`

    - role: user, content:

      > list all the classes declared in:
      > {{title}}
      > {{content}}
      
      replace:
      - {{title}}: `textFragment.title`
      - {{content}}: `await deps.constants.getResult(textFragment)`
       
  - return:
    ```python
    if len(services.projectService.textFragments) >= 1:
      return result, [ services.projectService.textFragments[1].key ]
    else:
      result, [  ]
    ```


### primary-component service
- The primary-component service is responsible for identifying the component that is most of all described and stands out as the most important component in the text-fragment.
- part of determining which components to render and which to import
- name: 'primary component'
- dependencies: ['components']
- isJson: false
- functions:
  - calculateMaxTokens(inputTokenCount): return 120 (just return a fixed size cause we only want 1 name coming back, shouldn't be too long)
  - iterator(fragment, callback, resultSetter):
      ```python
        components = await deps.components.getResult(fragment)  
        if len(components) > 1:
          await callback(fragment, components)
        elif len(components) == 1:
          resultSetter(components[0])
      ```    
  - buildMessage(fragment, components):
    - result (json array):
    - role: system, content:
      
      > Act as an ai software analyst.
      > It is your task to classify which of the following components is the primary / root component described in the feature list.
      > only return the name of the component that is the primary / root component, no explanation or any more text.
      
    - role: user, content:

      > components:
      > {{components}}
      >
      > feature list:
      > # {{title}}
      > {{content}}
      
      replace:
      - {{title}}: `fragment.title`
      - {{content}}: `fragment.lines.join('\n')`
      - {{components}}: `JSON.stringify(components)`

    - role: assistant, content:

      > Remember: only return the name of the component that is the primary / root component.
      > 
      > good response:
      > x
      >
      > bad response:
      > the primary / root component is x
       
    - return: `result, [ ]`


### primary-class service
- The primary-class service is responsible for identifying the class that is most of all described and stands out as the most important item in the text-fragment.
- part of determining which classes to render and which to import
- name: 'primary class'
- dependencies: ['classes', 'constants']
- isJson: false
- functions:
  - calculateMaxTokens(inputTokenCount): return 120 
    just return a fixed size cause we only want 1 name coming back, shouldn't be too long
  - iterator(fragment, callback, resultSetter):
      ```python
        classes = await deps.classes.getResult(fragment)  
        if len(classes) > 1:
          await callback(fragment, classes)
        elif len(classes) == 1:
          resultSetter(classes[0])
      ```    
  - buildMessage(fragment, classes):
    - result (json array):
    - role: system, content:
      
      > Act as an ai software analyst.
      > It is your task to classify which of the following classes is the primary / root class described in the feature list.
      > Only return the name of the class that is the primary / root, no explanation or any more text.
      
    - role: user, content:
      
      > classes:
      > {{classes}}
      >
      > feature list:
      > # {{title}}
      > {{content}}
      
      replace:
      - {{title}}: `fragment.title`
      - {{content}}: `await deps.constants.getResult(fragment)`
      - {{classes}}: `JSON.stringify(classes)`

    - role: assistant, content:

      > Remember: only return the name of the class that is the primary / root class.
      > 
      > good response:
      > x
      >
      > bad response:
      > the primary / root class is x
       
    - return: `result, [ ]`

### class-description service
- The class-description-service is responsible for generating descriptions of classes based on the text-fragments that contain references to those classes.
- Used as input for various other transformers that require the description of only 1 class in a fragment instead of everything.
- name: 'class description'
- dependencies: ['double compress', 'classes']
- isJson: false
- functions:
  - calculateMaxTokens(inputTokenCount): return inputTokenCount.total
  - iterator(fragment, callback):
    ```python
      classes = await deps.classes.getResult(fragment)  
      for item in classes:
        await callback(fragment, item)
    ```
  - buildMessage(fragment, item):
    - content = await deps['double compress'].getResult(fragment)
    - if not content return null
    - result (json array):
      - role: system, content:
        
        > Act as an ai software analyst.
        > It is your task to make a description of a service class that is described in the feature list.
        > Only return a short description, no introduction or explanation.
        
      - role: user, content:

        > The service name: '{{name}}'
        > the feature list:
        > {{content}}
        
        replace:
        - {{name}}: `item`
        - {{content}}: `content`    
    - return: `result, [ item ]`


### component-description service
- The component-description-service is responsible for generating descriptions of components based on the text-fragments that contain references to those components. A single description can still contain info about other components that are mentioned in the fragment.
- Used as input for various other transformers that require the description of only 1 component in a fragment instead of everything.
- name: 'component description'
- dependencies: ['double compress', 'components']
- isJson: false
- functions:
  - calculateMaxTokens(inputTokenCount): return inputTokenCount.total
  - iterator(fragment, callback):
    ```python
      components = await deps.components.getResult(fragment)
      for item in components:
        await callback(fragment, item)
    ```
  - buildMessage(fragment, item):
    - content = await debs['double compress'].getResult(fragment)
    - if not content return null
    - result (json array):
      - role: system, content:
        
        > Act as an ai software analyst.
        > It is your task to make a description of a UI component that is declared or used in the feature list.
        > Only return a short description, no introduction or explanation.
        
      - role: user, content:

        > The component name: '{{name}}'
        > the feature list:
        > {{content}}
        
        replace:
        - {{name}}: `item`
        - {{content}}: `content`    
    - return: `result, [ item ]`


### component-exact-description service
- The component-exact-description-service is responsible for generating descriptions of components based on the text-fragments that contain references to those components. A single description can only contain info about the requested component, any information about other components is removed.
- Used as input for various other transformers that require the description of exactly only 1 component in a fragment instead of everything.
- name: 'component exact description'
- dependencies: ['compress', 'components', 'primary component']
- isJson: false
- functions:
  - calculateMaxTokens(inputTokenCount): return inputTokenCount.total
  - iterator(fragment, callback):
    ```python
      components = await deps.components.getResult(fragment)
      primary = await deps['primary component'].getResult(fragment)
      for item in components:
        await callback(fragment, components, primary, item)
    ```

  - buildMessage(fragment, components, primary, item):
    - content, otherCompText, rememberPrompt = await buildContent(fragment, components, primary, item)
    - if not content return null
    - result (json array):
      - role: system, content:
        
        > Act as an ai feature classification system.
        > It is your task to build the feature list related to the UI component '{{name}}' using the provided feature list.
        > Only return what is in the feature list about {{name}}{{otherCompText}}. No introduction or explanation.
        
        replaceAll:
        - {{name}}: `item`
        - {{otherCompText}}: `otherCompText`  
  
      - role: user, content:

        > the feature list:
        > {{content}}
        
        replaceAll:
        - {{content}}: `content`
    
    - if rememberPrompt, add to result: 
      - role: assistant, content: rememberPrompt
    - return: `result, [ item ]`
  
  - buildContent(fragment, components, primary, item):
    ```python
      info = await deps.compress.getResult(fragment)
      if not info:
        return None
      other_components = [c for c in components if c != item]
      remember_prompt = ''
      if len(other_components) == 1:
          to_be = ' is'
          other_components = other_components[0]
      elif len(other_components) > 1:
          to_be = ' are'
          if item == primary:
              last_join = ' and '
          else:
              last_join = ' or '
          other_components = ', '.join(other_components[:-1]) + last_join + other_components[-1]
      else:
          other_components = ''
      if other_components:
          if item == primary:
              remember_prompt = 'Remember: mention where ' + other_components + to_be + ' used but not their features'
              other_components = ', only mention where ' + other_components + to_be + ' used but not their features'
          else:
              other_components = ', nothing about ' + other_components
      return info, other_components, remember_prompt
    ```

### declare-or-use-component classification service
- The declare-or-use-component classification service is responsible for figuring out if a component gets declared or used in a text-fragment.
- Used to determine if a file needs to be generated for the component or the info needs to be used to find out from where to import the component.
- name: 'declare or use component'
- dependencies: ['triple compress', 'components', 'primary component', 'component description']
- isJson: false
- functions:
  - calculateMaxTokens(inputTokenCount): return 250
  - iterator(fragment, callback, resultSetter):
    ```python
      description = await deps['component description'].getResult(fragment)
      titles = await getOtherTitles(fragment.key)
      components = await deps.components.getResult(fragment)
      if len(components) > 0:
        primary = await deps['primary component'].getResult(fragment)
        for item in components:
          if item == primary:
            resultSetter('declare', [fragment.key, item])
          else:
            await callback(fragment, titles, item, description[item])
    ```
  - getOtherTitles(toExclude): get every short description and fragment-key in the project that currently has components associated with it. 
  ```python
    result = []
    for fragment in services.projectService.textFragments:
      if fragment.key == toExclude: continue
      components = await deps.components.getResult(fragment)
      if components and len(components) > 0:
        description = await deps['triple compress'].getResult(fragment)
        value = f'${fragment.key}:\n${services.keyService.calculateLocation(fragment)}\n${JSON.stringify(description,0, 2)}\n'
        result.push()
    return result
  ```    
  - cleanResponse(response): if 'no' is returned, convert to 'declare'
    ```python
      if response.lower() == 'no':
        return 'declare'
      else:
        if response.startswith("'"):
          response = response[1:]
        if response.endswith("'"):
          response = response[:-1]
        if response.endswith(':'):
          response = response[:-1]
      return response
    ```
  - buildMessage(fragment, titles, item, description):
    - if not description return null
    - result (json array):
      - role: system, content:
        
        > Act as an ai software analyst.
        > It is your task to classify if the component '{{name}}', described as: 
        > {{description}}
        > , is declared in one of the given topics.
        > Only return 'no' or the topic's key it is declared in, do not include any explanation. Only return 1 key.
        > 
        > good response:
        > no
        >
        > bad response:
        > The component 'X' is not declared in any of the topics.

        replace:
        - {{name}}: `item`
        - {{description}}: `description`  
        
      - role: user, content:

        > titles:
        > {{titles}}
        
        replace:
        - {{name}}: `item`
        - {{titles}}: `'\n'.join(titles)`    
    - return: `result, [ item ]`


### declare-or-use-class classification service
- The declare-or-use-class classification service is responsible for figuring out if a class gets declared or used in a text-fragment.
- Used to determine if a file needs to be generated for the class or the info needs to be used to find out from where to import the class.
- name: 'declare or use class'
- dependencies: ['classes', 'class description', 'primary class']
- isJson: false
- functions:
  - calculateMaxTokens(inputTokenCount): 200
  - iterator(fragment, callback, resultSetter):
    ```python
      titles = await getKeysWithClasses(fragment.key)
      classes = await deps.classes.getResult(fragment)
      if len(classes?) > 0:
        primary = await deps['primary class'].getResult(fragment)
        for item in classes:
          if item == primary:
            resultSetter('declare', [fragment.key, item])
          else:
            await callback(fragment, titles, item)
    ```
  - cleanResponse(response): if 'no' is returned, convert to 'declare'
    ```python
      if response.lower() == 'no':
        return 'declare'
      return response
    ```

  - getKeysWithClasses(toExclude): get every fragment-key in the project that currently has classes associated with it. 
  ```python
    result = []
    for fragment in services.projectService.textFragments:
      classes = await deps.classes.getResult(fragment)
      if classes and fragment.key != toExclude:
        result.push(services.keyService.calculateLocation(fragment.key))
    return result
  ```

  - buildMessage(fragment, titles, item):
    - description = await deps['class description'].getResult(fragment)
      if not description return null
      description = description[item] # a fragment can have multiple classes, so get the description of the class we are searching for
      if not description return null
    - result (json array):
      - role: system, content:
        
        > Act as an ai software analyst.
        > It is your task to classify if the class '{{class}}', described as:
        > {{description}}
        > , is declared in one of the given topics.
        > Only return 'no' or the topic's key it is declared in, do not include any explanation. Only return 1 key.
        > 
        > good response:
        > no
        > 
        > bad response:
        > The class 'X' is not declared in any of the topics.

        replace:
        - {{class}}: `item`
        - {{description}}: `description`  
        
      - role: user, content:

        > Titles: 
        > {{titles}}

        replace:
        - {{titles}}: `'\n'.join(titles)`

    - return: `result, [ item ]`


### is-service-used service
- The is-service-used classification service is responsible for figuring out if a text fragment uses any of the currently known service-classes in the project.
- Used to determine which files should be imported and which interfaces should be known about.
- name: 'is service used'
- dependencies: ['declare or use class', 'class description', 'constants']
- isJson: false
- functions:
  - calculateMaxTokens(inputTokenCount): 4
  - iterator(fragment, callback, result):
    ```python
      for toCheck in services.projectService.textFragments:
        if toCheck.key == fragment.key: continue
        classes = await deps['declare or use class'].getResult(toCheck)
        if not classes: continue
        for className, value in classes.items():
          if value == 'declare':
            await callback(fragment, toCheck, className)
    ```
    
  - buildMessage(fragment, checkAgainst, className):
    - description = await deps['class description'].getResult(checkAgainst)
      if not description return null
      description = description[className] # a fragment can have multiple classes, so get the description of the class we are searching for
      if not description return null
    - content = await deps.constants.getResult(fragment)
    - result (json array):
      - role: system, content:
        
        > Act as an ai software analyst.
        > It is your task to find features in the source text that are related to the specified service.
        > 
        > Does the source-text contain any features related to "{{class}}", described as:
        > {{class_description}}
        > 
        > only return 'yes' or 'no'
        > 
        > good response:
        > yes
        > 
        > bad response:
        > the following text does not contain any references to the given service.

        replace:
        - {{class}}: `className`
        - {{class_description}}: `description`  
        
      - role: user, content:

        > source-text: 
        > {{feature_desc}}

        replace:
        - {{feature_desc}}: `content`

    - return: `result, [ checkAgainst.key, className ]`

### is-service-singleton service
- The is-service-singleton service is responsible for figuring out if a class that is declared in a text fragment is described as being a singleton or not.
- Used to determine how a class should be rendered.
- name: 'is service singleton'
- dependencies: ['declare or use class', 'constants']
- isJson: false
- functions:
  - calculateMaxTokens(inputTokenCount): 5
  - iterator(fragment, callback, result):
    ```python
        classes = await deps['declare or use class'].getResult(fragment)
        for className, value in classes.items():
          if value == 'declare':
            await callback(fragment, className)
    ```
    
  - buildMessage(fragment, className):
    - content = await deps.constants.getResult(fragment)
    - result (json array):
      - role: system, content:
        
        > Act as an ai software analyst.
        > It is your task to to classify if a service is described as a singleton / global instance or not.
        > 
        > Does the source-text require that "{{class}}" is a singleton object?
        > 
        > only return 'yes' or 'no'
        > 
        > good response:
        > yes
        > 
        > bad response:
        > the following text does describes the service as a singleton.

        replace:
        - {{class}}: `className`
        
      - role: user, content:

        > source-text: 
        > {{feature_desc}}

        replace:
        - {{feature_desc}}: `content`

    - return: `result, [ className ]`

### list-component-props service
- The list-component-props service builds a list of properties that a component is described to have.
- Used to determine how a class should be rendered.
- name: 'component props'
- dependencies: ['declare or use component', 'component exact description']
- isJson: true
- functions:
  - calculateMaxTokens(inputTokenCount): 240
  - iterator(fragment, callback):
    ```python
        components = await deps['declare or use component'].getResult(fragment)
        for compName, value in components.items():
          if value == 'declare':
            await callback(fragment, compName)
    ```
  - buildMessage(fragment, compName):
    - description = `await deps['component exact description'].getResult(fragment)`
    - result (json array):
      - role: system, content:
        
        > list all features that the {{name}} component declares consumers of the {{name}} component should provide as property values for the {{name}}.
        > Return the result as a json object of key-value pairs where the value is a short description. Do not include any introduction or explanation. Return an empty object if nothing is found.

        replace:
        - {{name}}: `compName`
        
      - role: user, content:

        > {{feature_desc}}

        replace:
        - {{feature_desc}}: `description`

    - return: `result, [ compName ]`

### is-service-for-all-components service
- The is-service-for-all-components  service is responsible for figuring out if a class described in the fragment should be usd by all components or not.
- Used to determine which files should be imported and which extra info needs to be added to component rendering.
- name: 'is service for all components'
- dependencies: ['declare or use class', 'class description']
- isJson: false
- functions:
  - calculateMaxTokens(inputTokenCount): 5
  - iterator(fragment, callback, result):
    ```python
        classes = await deps['declare or use class'].getResult(fragment)
        for className, value in classes.items():
          if value == 'declare':
            await callback(fragment, className)
    ```
    
  - buildMessage(fragment, className):
    - description = await deps['class description'].getResult(fragment)
      if not description return null
      description = description[className] # a fragment can have multiple classes, so get the description of the class we are searching for
      if not description return null
    - result (json array):
      - role: system, content:
        
        > It is your task to classify the class description.
        > 
        > Does the description contain any features that should be applied to all UI components in the project?
        > 
        > 
        > only return 'yes' or 'no'
        > 
        > good response:
        > yes
        > 
        > bad response:
        > the following text does not contain any references to all components.
        
      - role: user, content:

        > {{feature_desc}}

        replace:
        - {{feature_desc}}: `description`

    - return: `result, [ className ]`


### service-usage service
- The service-usage service is responsible for extracting all the features described in a fragment that relate to a particular service.
- Used to determine the full set of feature requirements of a class.
- name: 'service usage'
- dependencies: ['declare or use class', 'is service used', 'constants']
- isJson: true
- functions:
  - calculateMaxTokens(inputTokenCount): inputTokenCount
  - iterator(fragment, callback, result):
    ```python
        for toCheck in services.projectService.textFragments:
          if toCheck.key == fragment.key: continue
          classes = await deps['declare or use class'].getResult(toCheck)
          for className, value in classes.items():
            if value == 'declare':
              isUsed = await getIfClassIsUsed(fragment, toCheck, className)
              if isUsed:
                await callback(fragment, className)
    ```
  - getIfClassIsUsed(fragment, toCheck, className):
    ```python
      isUsedData = await deps['is service used'].getResult(fragment)
      if isUsedData and toCheck.key in isUsedData:
        section = isUsedData[toCheck.key]
        if section and className in section:
          return section[className].lower() == 'yes'
      return False

    ``` 
  - cleanResponse(response, fragment, toCheck)
    ```python
      return {
                'value': response,
                'source': toCheck.key,
              }
    ```
  - buildMessage(fragment, className):
    - content = await deps.constants.getResult(fragment)
    - result (json array):
      - role: system, content:
        
        > list everything related to '{{class}}' that is declared in the source text. If nothing is found, return an empty value.
        > Do not say: the source text doesn't contain'or provide any information specifically related to...

        replace:
        - {{class}}: `className`
        
      - role: user, content:

        > source-text: 
        > {{feature_desc}}

        replace:
        - {{feature_desc}}: `content`

      - role: assistant, content:

        > Remember: only include features related to '{{class}}' and return an empty string (no quotes) if nothing is found.

        replace:
        - {{class}}: `className`

    - return: `result, [ className ]`

### global-component-features service
- The global-component-features service extracts the list of features that all components should implement according to a service.
- Used to determine how a components should be rendered.
- name: 'global component features'
- dependencies: ['is service for all components', 'constants']
- isJson: false
- functions:
  - calculateMaxTokens(inputTokenCount): inputTokenCount
  - iterator(fragment, callback):
    ```python
        toCheck = await deps['is service for all components'].getResult(fragment)
        for service, value in toCheck.items():
          if value == 'yes':
            await callback(fragment, service)
    ```
  - buildMessage(fragment, service):
    - description = `await deps.constants.getResult(fragment)`
    - result (json array):
      - role: system, content:
        
        > List how all components should use the service described in the source text. If nothing is found, return an empty value (no quotes).
        > Do not say: the source text doesn't contain or provide any information specifically related to...
        > Keep the response as short as possible
        
      - role: user, content:

        > Source text:
        > {{feature_desc}}

        replace:
        - {{feature_desc}}: `description`

    - return: `result, [ service ]`

### component-imports service
- The component-imports service is responsible for generating the list of modules that should be imported by a component.
- Used to prepare the rendering of the code file for a component.
- name: 'component imports'
- dependencies: ['components', 'declare or use component', 'service usage', 'global component features', 'component description']
- isJson: false
- functions: 
  - calculateMaxTokens(inputTokenCount): 200
  - iterator(fragment, callback, resultSetter):
    ```python
      components = await deps.components.getResult(fragment)
      declareOrUseRaw = await deps['declare or use component'].getResult(fragment)
      declareOrUse = {}
      for k in declareOrUseRaw.keys():
        declareOrUse[k.toLowerCase()] = declareOrUseRaw[k]
      for component in components:
        name = component.toLowerCase()
        isDeclare = declareOrUse[name] === 'declare'
        if isDeclare:
            imports = await getServiceImports(fragment)
            resultSetter(imports, [fragment.key, component])
        else:
            await resolveComponentImports(fragment, component, callback, resultSetter)
    ```
  - getServiceImports(fragment):
    ```python
      imported = {} # so we don't list the same thing twice
      results = []
    
      services_used = await deps['service usage'].getResult(fragment)
      if services_used:
          for service, rec in services_used.items():
              if not rec['value']:
                  continue # some services are included in the list cause the previous step had flagged them (cheap run), but then list_service_usage didn't find any usage of them (expensive run)
              service_loc = rec['source']
              cur_path_parts = service_loc.split(" > ")
              # replace all spaces with underscores
              cur_path_parts = [part.replaceAll(" ", "_") for part in cur_path_parts]
              cur_path_parts[0] = 'src' # replace the first part with src so that it replaces the name of the project which isn't the root of the source code
              if not service in imported:
                  imported[service] = True
                  service_path = os.path.join(*cur_path_parts, service.replaceAll(" ", "_"))
                  results.append({'service': service, 'path': service_path, 'service_loc': service_loc })
      for subFrag in services.projectService.textFragments:
          globalFeatures = await deps['global component features'].getResult(subFrag)
          if globalFeatures an len(Object.entries(globalFeatures)) > 0:
            cur_path_parts = subFrag.key.split(" > ")
            # replace all spaces with underscores
            cur_path_parts = [part.replaceAll(" ", "_").replaceAll('-', '_') for part in cur_path_parts]
            cur_path_parts[0] = 'src' # replace the first part with src so that it replaces the name of the project which isn't the root of the source code
            for service, features in globalFeatures.items():
                if not service in imported:
                    imported[service] = True
                    service_path = os.path.join(*cur_path_parts, service.replaceAll(" ", "_").replaceAll('-', '_')).strip()
                    results.append({'service': service, 'path': service_path, 'service_loc': subFrag.key})
      return results  
    ```     
  - resolveComponentImports(fragment, component, callback, resultSetter):
    ```python
      declared_in = await shared.getDeclaredIn(deps, 'declare or use component', fragment, component)
      if not declared_in:
          raise new Error(f"can't find import location for component {component} used in {fragment.key}")
      else:
          declaredInFragment = services.projectService.getFragment(declared_in.replaceAll("'", "").replaceAll('"', '')) # remove quotes cause gpr sometimes adds them
          if not declaredInFragment:
            raise new Error(f'component declared in {declared_in}, but fragment cant be found at specified index')
          components = await deps.components.getResult(declaredInFragment)
          if component in components:
              path = shared.buildPath(services, declaredInFragment, component)
              resultSetter(path, [fragment.key, component])
          else:
              # if there is only 1 component declared in the fragment, we can presume that's the one we need
              declared_comps = await shared.getAllDeclared(deps, 'declare or use component', declaredInFragment)
              if len(declared_comps) == 1:
                  path = shared.buildPath(services, declaredInFragment, declared_comps[0])
                  resultSetter(path, [fragment.key, component])
              else:
                  await callback(fragment, component, declared_comps, declaredInFragment) # declaredInFragment is needed for cleanresponse
    ```
  - cleanResponse(response, fragment, component, declared_comps, declaredInFragment): `return shared.buildPath(services, declaredInFragment, response)` 
  - buildMessage(fragment, component, declared_comps):
    - description = await deps['component description'].getResult(fragment)
      if not description return null
      description = description[component] # a fragment can have multiple classes, so get the description of the class we are searching for
      if not description return null
    - result (json array):
      - role: system, content:
        
        > Only return the name of the most likely match, don't give any introduction or explanation.
        
      - role: user, content:

        > Which of these component names best matches class description '{{component}}', described as {{description}}:
        > {{items}}

        replace:
        - {{description}}: `description`
        - {{items}}: `\n- '.join(declared_comps)`
        - {{component}}: `component`

    - return: `result, [ component ]`
    

### class-imports service
- The class-imports service is responsible for generating the list of modules that should be imported by a class.
- Used to prepare the rendering of the code file for a class.
- name: 'class imports'
- dependencies: ['classes', 'declare or use class', 'service usage', 'class description']
- isJson: false
- functions:
  - calculateMaxTokens(inputTokenCount): 200
  - iterator(fragment, callback, resultSetter):
    ```python
      classes = await deps.classes.getResult(fragment)
      declareOrUseRaw = await deps['declare or use class'].getResult(fragment);
      declareOrUse = {}
      for k in declareOrUseRaw.keys():
        declareOrUse[k.toLowerCase()] = declareOrUseRaw[k]
      for item in classes:
        name = item.toLowerCase()
        isDeclare = declareOrUse[name] === 'declare'
        if isDeclare:
            imports = await getServiceImports(fragment)
            resultSetter(path, [fragment.key, item])
        else:
            await resolveClassImports(fragment, item, callback, resultSetter)
    ```
  - getServiceImports(fragment):
    ```python
      imported = {} # so we don't list the same thing twice
      results = []
    
      services_used = await deps['service usage'].getResult(fragment)
      if services_used:
          for service, rec in services_used.items():
              if not rec['value']:
                  continue # some services are included in the list cause the previous step had flagged them (cheap run), but then list_service_usage didn't find any usage of them (expensive run)
              service_loc = rec['source']
              cur_path_parts = service_loc.split(" > ")
              # replace all spaces with underscores
              cur_path_parts = [part.replaceAll(" ", "_") for part in cur_path_parts]
              cur_path_parts[0] = 'src' # replace the first part with src so that it replaces the name of the project which isn't the root of the source code
              if not service in imported:
                  imported[service] = True
                  service_path = os.path.join(*cur_path_parts, service.replaceAll(" ", "_"))
                  results.append({'service': service, 'path': service_path, 'service_loc': service_loc})
      return results  
    ```     
  - resolveClassImports(fragment, item, callback, resultSetter):
    ```python
      declared_in = await shared.getDeclaredIn(deps, 'declare or use class', fragment, item)
      if not declared_in:
          raise new Error(f"can't find import location for component {item} used in {fragment.key}")
      else:
          declaredInFragment = services.projectService.getFragment(declared_in.replaceAll("'", "").replaceAll('"', '')) # remove quotes cause gpr sometimes adds them
          if not declaredInFragment:
            raise new Error(f'component declared in {declared_in}, but fragment cant be found at specified index')
          classes = await deps.classes.getResult(declaredInFragment)
          if item in classes:
              path = shared.buildPath(services, declaredInFragment, item)
              resultSetter(path, [fragment.key, item])
          else:
              # if there is only 1 item declared in the fragment, we can presume that's the one we need
              declaredClasses = await shared.getAllDeclared(deps, 'declare or use class', declaredInFragment)
              if len(declaredClasses) == 1:
                  path = shared.buildPath(services, declaredInFragment, declaredClasses[0])
                  resultSetter(path, [fragment.key, item])
              else:
                  await callback(fragment, item, declaredClasses, declaredInFragment) # declaredInFragment is needed for cleanresponse
    ```
  - cleanResponse(response, fragment, item, declaredClasses, declaredInFragment): `return shared.buildPath(services, declaredInFragment, response)` 
  - buildMessage(fragment, item, declaredClasses):
    - description = await deps['class description'].getResult(fragment)
      if not description return null
      description = description[item] # a fragment can have multiple classes, so get the description of the class we are searching for
      if not description return null
    - result (json array):
      - role: system, content:
        
        > Only return the name of the most likely match, don't give any introduction or explanation.
        
      - role: user, content:

        > Which of these class names best matches '{{name}}', described as {{description}}:
        > {{items}}

        replace:
        - {{description}}: `description`
        - {{items}}: `\n- '.join(declaredClasses)`
        - {{name}}: `item`

    - return: `result, [ item ]`


### usage-extractor service
- The usage-extractor service is responsible for listing all parts of the interface of a service that are actually used in the code.
- Used to find the exact definitions that are used in the code so that the same name and parameters can be used everywhere.
- name: 'usage extractor'
- dependencies: ['component renderer', 'components', 'component imports', 'declare or use component', 'class renderer', 'classes', 'class imports', 'primary component']
- isJson: true
- functions:
  - calculateMaxTokens(inputTokenCount): inputTokenCount / 5
  - iterator(fragment, callback, result):
    ```python
      allCode = None
      allImports = None
      components = await deps.components.getResult(fragment)
      primary = await deps['primary component'].getResult(fragment)
      [toRender, used] = await shared.getToRenderAndUsed(deps, fragment, components)
      # only search for usage in code for components that get rendered by this fragment, so not in the used items list 
      fragmentCode = deps['component renderer'].cache.getFragmentResults(fragment.key)
      primaryCodeFile = fragmentCode?.[primary]
      for component in toRender:
        if component != primary and primaryCodeFile:
          # the primary component can also use the other components, so if the primary is already rendered, see how other components are used in primary.
          code = readFile(primaryCodeFile)
          await callback(fragment, component, primary, fragment, code, True)
        for checkAgainst in services.projectService.textFragments:
          # get code files that were rendered from the cache, otherwise we get circular ref.
          # we only want to find out how it is used in the already rendered code, not all
          allCode = deps['component renderer'].cache.getFragmentResults(checkAgainst.key)
          allImports = deps['component imports'].cache.getFragmentResults(checkAgainst.key)
          if allCode and allImports:
            for key, value in allCode.items():
              imports = allImports[key]
              # only check the code if the fragment we are checking the usage of, was used in the fragment being checked against.
              if fragment.key in imports:
                code = readFile(value)
                await callback(fragment, component, key, checkAgainst, code, True)
      # classes that are found in a fragment, are always declared (due to the way it was asked from the llm)  
      classes = await deps.classes.getResult(fragment)
      for item in classes:
        for checkAgainst in services.projectService.textFragments:
          # get code files that were rendered from the cache, otherwise we get circular ref.
          # we only want to find out how it is used in the already rendered code, not all
          allCode = deps['class renderer'].cache.getFragmentResults(checkAgainst.key)
          allImports = deps['class imports'].cache.getFragmentResults(checkAgainst.key)
          if allCode and allImports:
            for key, value in allCode.items():
              imports = allImports[key]
              # only check the code if the fragment we are checking the usage of, was used in the fragment being checked against.
              if fragment.key in imports:
                code = readFile(value)
                await callback(fragment, item, key, checkAgainst, code, False)
          # a class can be used by other classes and by other components, so check both
          allCode = deps['component renderer'].cache.getFragmentResults(checkAgainst.key)
          allImports = deps['component imports'].cache.getFragmentResults(checkAgainst.key)
          if allCode and allImports:
            for key, value in allCode.items():
              imports = allImports[key]
              # only check the code if the fragment we are checking the usage of, was used in the fragment being checked against.
              if fragment.key in imports:
                code = readFile(value)
                await callback(fragment, component, key, checkAgainst, code, True)                
    ```
  - buildMessage(fragment, item, service, serviceFragment, code, isComponent):
    - result (json array):
      - role: system, content:

          > It is your task to find functions, properties, fields and constants related to a specific {{type}} in the specified code. 
          > Return the result as a json object of key-value pairs where the value is a short description of the key with enough information so that '{{name}}' can implement the feature. Include parameters declarations. Do not include any introduction or explanation. Return an empty object if nothing is found.

          replace:
          - {{name}}: `service`
          - {{type}}: `if isComponent: 'component' else: 'class'`
        
      - role: user, content:

        > List all interface items of '{{name}}' used in this code
        > ```
        > {{code}}
        > ```

        replace:
        - {{name}}: `service`
        - {{code}}: `code`


      - role: assistant, content:

        >  Remember: only include items of {{name}}

        replace:
          - {{name}}: `service`

    - return: `result, [ item, serviceFragment.key, service ]`    

### consumed-interfaces-component service
- The consumed-interfaces-component is responsible for filtering the interface definitions of all imports done by a component to only those items that are used in the description.
- Used to remove all definitions from the prompt that have no relationship to the current task as to not confuse the llm with lists of unused functions, fields,...
- name: 'consumed interfaces component'
- dependencies: ['components', 'component imports', 'usage extractor', 'component exact description', 'global component features']
- isJson: true
- functions:
  - calculateMaxTokens(inputTokenCount): inputTokenCount
  - iterator(fragment, callback, result): 
    ```python
      components = await deps.components.getResult(fragment)
      for component in components:
        importsList = await deps['component imports'].getResult(fragment)
        if importsList:
          importsList = importsList[component] 
        if importsList:
          componentDesc = (await deps['component exact description'].getResult(fragment))?.[component]
          for import_def in importsList:
            service = import_def['service']
            serviceLoc = import_def['service_loc']
            serviceFragment = services.projectService.getFragment(serviceLoc)
            if not serviceFragment:
              raise new Error(f'fragment with key {serviceLoc} not found in the project')
            interfaceDef = (await deps['usage extractor'].getResult(serviceFragment))?.[service]
            if interfaceDef:
              fullDescription = componentDesc
              globalInterfaceDef = await deps['global component features'].getResults(serviceFragment)
              if globalInterfaceDef:
                fullDescription += '\n'
                  for key, value in globalInterfaceDef.items():
                    fullDescription += f'\n{value}'
              interfaceDef = formatInterface(interfaceDef)
              await callback(fragment, component, service, serviceLoc, interfaceDef, fullDescription)
    ```
  - formatInterface(interfaceDef):
    ```python
      result = ''
      for key, value in interfaceDef.items():
        result += f'- {key}: {value}\n'
      return result
    ```
  - buildMessage(fragment, item, service, serviceLoc, interfaceDef, fullDescription):
    - result (json array):
      - role: system, content:
        
        > This is the known interface for {{name}}:
        > {{interface}}
        >
        > List everything from the known interface described above that is used in the following feature description.
        > Return the result as a json object of key-value pairs where the value is a short description of the key with enough information so that a component can use the feature in code. Do not include by who the key is used in the description. Do not include any introduction or explanation. Return an empty object if nothing is found.

        replace:
        - {{name}}: `service`
        - {{interface}}: `interfaceDef`
        
      - role: user, content:

        > feature description:
        > {{full}}

        replace:
        - {{full}}: `fullDescription`

    - return: `result, [ item, service ]`

### consumed-interfaces-class service
- The consumed-interfaces-class is responsible for filtering the interface definitions of all imports done by a class to only those items that are used in the description.
- Used to remove all definitions from the prompt that have no relationship to the current task as to not confuse the llm.
- name: 'consumed interfaces class'
- dependencies: ['classes', 'class imports', 'usage extractor', 'class description']
- isJson: true
- functions:
  - calculateMaxTokens(inputTokenCount): inputTokenCount
  - iterator(fragment, callback, result): 
    ```python
      classes = await deps.classes.getResult(fragment)
      for item in components:
        importsList = await deps['class imports'].getResult(fragment)
        if importsList:
          importsList = importsList[item] 
        if importsList:
          classDesc = (await deps['class description'].getResult(fragment))?.[item]
          for import_def in importsList:
            service = import_def['service']
            serviceLoc = import_def['service_loc']
            serviceFragment = services.projectService.getFragment(serviceLoc)
            if not serviceFragment:
              raise new Error(f'fragment with key {serviceLoc} not found in the project')
            interfaceDef = (await deps['usage extractor'].getResult(serviceFragment))?.[service]
            if interfaceDef:
              fullDescription = classDesc
              interfaceDef = formatInterface(interfaceDef)
              await callback(fragment, service, serviceLoc, interfaceDef, fullDescription)
    ```
  - formatInterface(interfaceDef):
    ```python
      result = ''
      for key, value in interfaceDef.items():
        result += f'- {key}: {value}\n'
      return result
    ```
  - buildMessage(fragment, item, service, serviceLoc, interfaceDef, fullDescription):
    - result (json array):
      - role: system, content:
        
        > This is the known interface for {{name}}:
        > {{interface}}
        >
        > List everything from the known interface described above that is used in the following feature description.
        > Return the result as a json object of key-value pairs where the value is a short description of the key with enough information so that a component can use the feature in code. Do not include by who the key is used in the description. Do not include any introduction or explanation. Return an empty object if nothing is found.

        replace:
        - {{name}}: `service`
        - {{interface}}: `interfaceDef`
        
      - role: user, content:

        > feature description:
        > {{full}}

        replace:
        - {{full}}: `fullDescription`

    - return: `result, [ item, service ]`

### component-renderer service
- the component-renderer service is responsible for generating all the code related to UI components.
- used to build UI applications
- name: 'component renderer'
- dependencies: ['components', 'declare or use component', 'is service singleton', 'component imports', 'primary component', 'consumed interfaces component', 'usage extractor', 'component exact description', 'consumed interfaces class', 'constants']
- isJson: false
- functions: 
  - calculateMaxTokens(inputTokenCount, modelOptions): modelOptions.maxTokens - 1000
  - iterator(fragment, callback, result): 
    ```python
      renderToPath = shared.getPath(services, fragment)
      components = await deps.components.getResult(fragment)
      primary = await deps['primary component'].getResult(fragment)
      if not primary:
        raise Exception('no primary found for ', fragment.title)
      [toRender, used] = await shared.getToRenderAndUsed(deps, fragment, components)
      await callback(fragment, primary, components, renderToPath)
      for component in toRender:
        if component != primary:
          await callback(fragment, component, components, renderToPath) # renderToPath for the cleanup (which saves)
    ```
  - cleanResponse(response, fragment, component, components, renderToPath): save to file
    ```python
      response = response.strip() # need to remove the newline at the end
      if response.startswith("```javascript"):
          response = response[len("```javascript"):]
      if response.endswith("```"):
          response = response[:-len("```")]
      fullPath = path.join(services.folderService.output, renderToPath)
      if not os.path.exists(fullPath):
          os.makedirs(fullPath)
      filePath = os.path.join(fullPath, component + ".js")
      with open(filePath, "w") as writer:
          writer.write(response)
      return filePath
    ```    
  - buildMessage(fragment, component, components, renderToPath):
    - result (json array):
      - role: system, content:
        
        > Act as a full-stack ai software developer.
        > It is your task to write all the code for the component '{{name}}'
        > 
        > use the following development stack:
        > {{devStack}}
        >
        > Use small functions.
        > When the user text contains references to other components, use the component, do not write the functionality inline.
        > A file always contains the definition for 1 component, service or object, no more.
        > Add documentation to your code.
        > Only write valid code
        > Add css classnames to the html
        > Do not include any intro or explanation at the end, only write code

        replace:
        - {{name}}: `component`
        - {{devStack}}: `services.projectService.textFragments[1]?.lines.join('\n').trim()`  
        
      - role: user, content:

        > The component '{{name}}' is described as follows:
        > {{ownDescription}}
        > {{externalDescription}}{{otherInterfaces}}{{importsToAdd}}
        
        replace:
        - {{name}}: `component`
        - {{ownDescription}}: `if len(components) > 1: (await deps['component exact description'].getResult(fragment))?.[component] else: '\n'.join(fragment.lines)`
        - {{externalDescription}}:  `await shared.getExternalDescription(deps, fragment, component)`
        - {{otherInterfaces}}: `await shared.getOtherInterfaces(deps, fragment, component)`
        - {{importsToAdd}}: `await shared.getAllImports(deps, 'component imports', services, fragment, component, renderToPath)`

    - return: `result, [ component ]`


### class-renderer service
- the class-renderer service is responsible for generating all the code for the services in the form of classes.
- used to build UI applications
- name: 'class renderer'
- dependencies: ['classes', 'declare or use class', 'is service singleton', 'class imports', 'primary class', 'consumed interfaces class', 'usage extractor']
- isJson: false
- functions:
  - calculateMaxTokens(inputTokenCount, modelOptions): modelOptions.maxTokens
  - iterator(fragment, callback, result): 
    ```python
      renderToPath = shared.getPath(services, fragment)
      classes = await deps.classes.getResult(fragment)
      primary = await deps['primary class'].getResult(fragment)
      if not primary:
        raise Exception('no primary found for ', fragment.title)
      await callback(fragment, primary, classes, renderToPath)
      for item in classes:
        if item != primary:
          await callback(fragment, item, classes, renderToPath) # renderToPath for the cleanup (which saves)
    ```
  - cleanResponse(response, fragment, item, classes, renderToPath): save to file
    ```python
      response = response.strip() # need to remove the newline at the end
      if response.startswith("```javascript"):
          response = response[len("```javascript"):]
      if response.endswith("```"):
          response = response[:-len("```")]
      fullPath = os.path.join(services.folderService.output, renderToPath)
      if not os.path.exists(fullPath):
          os.makedirs(fullPath)
      filePath = os.path.join(fullPath, item + ".js")
      with open(filePath, "w") as writer:
          writer.write(response)
      return filePath
    ```    
  - buildMessage(fragment, item, classes, renderToPath):
    - result (json array):
      - role: system, content:
        
        > Act as a full-stack ai software developer.
        > It is your task to write all the code for the class '{{name}}'
        > 
        > use the following development stack:
        > {{devStack}}
       
        replace:
        - {{name}}: `item`
        - {{devStack}}: `services.projectService.textFragments[1]?.lines.join('\n')`  
        
      - role: user, content:

        > The class '{{name}}' is described as follows:
        > {{ownDescription}}
        > {{externalDescription}}{{otherInterfaces}}{{importsToAdd}}
        
        replace:
        - {{name}}: `item`
        - {{ownDescription}}: `if len(classes) > 1: await deps['class exact description'].getResult(fragment) else: '\n'.join(fragment.lines)`
        - {{externalDescription}}:  `await shared.getExternalDescription(deps, fragment, item)`
        - {{otherInterfaces}}: `await shared.getOtherInterfaces(deps, fragment, item)`
        - {{importsToAdd}}: `await shared.getAllImports(deps, 'class imports', services, fragment, item, renderToPath)`

    - return: `result, [ item ]`

### render service
- the render service is the main transformer responsible for generating code from fragments.
- used to render code
- name: 'renderer'
- isEntryPoint: true
- dependencies: ['class renderer', 'component renderer']
- functions:
  - iterator(fragment, callback, resultSetter): 
    ```python
      comps = await deps['component renderer'].getResult(fragment)
      resultSetter(comps, [fragment.key, 'components'])
      classes = await deps['class renderer'].getResult(fragment)
      resultSetter(classes, [fragment.key, 'classes'])
    ```
  - buildMessage(fragment, item, classes, renderToPath): `return ''`

### update-code service
- The update-code service can be used to update the code that was rendered for a fragment according to the new specs of that fragment.
- Useful to check if the system understands the fragment and can be used as input for other processes.
- name: 'update code'
- dependencies: ['constants', 'renderer']
- isJson: false
- calculateMaxTokens(inputTokenCount, modelOptions): modelOptions.maxTokens
- iterator(fragment, callback, resultSetter): 
    ```python
      files = await deps.renderer.getResult(fragment)
      if files:
        if files.components:
          for file in files.components:
            code = readFile(file)
            callback(fragment, code)
        if files.classes:
          for file in file.classes:
            code = readFile(file)
            callback(fragment, code)
    ```
- build-message(fragment, code):
  - result (json array):
    - role: system, content:
      
      > Act as a full-stack ai software developer.
      > It is your task to update the specified code according to the new specifications.
      > 
      > - keep comments
      > - minimize any explanation, if any
      > 
      > use the following development stack:
      > {{devStack}}

      replace:
        - {{name}}: `services.projectService.textFragments[1]?.lines.join('\n')`

    - role: user, content: 

      > {{code}}
      > 
      > update the previous code so that it fits the new specifications:
      > 
      > {{specs}}

        replace:
            - {{code}}: `code`
            - {{specs}}: `await deps.constants.getResult(fragment)`

  - return result, [ ]