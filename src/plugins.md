# markdown code plugins

## compress service
- The compress service takes a text fragment and makes it shorter.
- Useful to check if the system understands the fragment and can be used as input for other processes.
- name: 'compress'
- dependencies: ['constants']
- isJson: false
- build-message(text-fragment):
  - result (json array):
    - role: system, content:
      
     > Act as an ai software analyst. You are reviewing the feature description of an application. It is your job to shorten the following text as much as possible and rephrase it in your own words, without loosing any meaning.
     > compress the following text:

    - role: user, content: `await deps.constants.getResult(text-fragment)`.
  - return result, [ ]
  
  
## double-compress service
- The double-compress-service takes the result of compress-service and makes it even shorter.
- Useful to check if the system understands the fragment and can be used as input for other processes.
- name: 'double compress'
- dependencies: ['compress']
- isJson: false
- build-message(text-fragment):
  - result (json array):
    - role: system, content:
      
     > condense the following text as much as possible, without loosing any meaning:

    - role: user, content: `await deps.compress.getResult(text-fragment)`.
  - return result, [ ]


## triple-compress service
- The triple-compress-service takes the result of double-compress-service and shortens it to 1 line.
- Used as a description for each fragment when searching for linked components and services.
- name: 'triple compress'
- dependencies: ['double compress']
- isJson: false
- function build-message(text-fragment):
  - result (json array):
    - role: system, content:
      
     > condense the following text to 1 sentence:

    - role: user, content: `await deps['double compress'].getResult(text-fragment)`.
  - return result, [ ]

## component-lister service
- the component-lister service is responsible for extracting all the component names it can find in a text-fragment.
- part of finding out which components need to be rendered
- name: 'components'
- dependencies: []
- isJson: true
- function build-message(textFragment):
  - if refs.projectService.textFragments.indexOf(textFragment) < 2: return null
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
    if len(refs.projectService.textFragments) >= 1:
      return result, [ textFragment.key, refs.projectService.textFragments[1].key ]
    else:
      result, []
    ```

## class-lister service
- the class-lister service is responsible for extracting all the names of the classes that are declared in a text fragment.
- determines which classes need to be rendered
- name: 'classes'
- dependencies: ['constants']
- isJson: true
- function build-message(textFragment):
  - if services.projectService.textFragments.indexOf(textFragment) < 2: return null
  - result (json array):
    - role: system, content:
      
      > Act as an ai software analyst.
      > The following development stack is used:
      > {{dev_stack_title}}
      > {{dev_stack_content}}
      
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

    - role: assistant, content:

      > Do not include UI components, but only list the classes that need to be custom built.
      > return an empty array if you can't detect any classes.
      > don't include any introduction. Don't include any explanation, just write the list of classes as a
      > json array.
      > 
      > bad:
      > [
      >   {
      >     "file": "x.js",
      >     "items": [
      >       "x"
      >     ]
      >   },
      >   {
      >     "file": "y.js",
      >     "items": [
      >       "y"
      >     ]
      >   }
      > ]
      > 
      > good:
      > [
      >     "x",
      >     "y"
      > ]
       
          - return:
            ```python
            if len(services.projectService.textFragments) >= 1:
              return result, [ services.projectService.textFragments[1].key ]
            else:
              result, [  ]
           ```


## primary-component service
- The primary-component service is responsible for identifying the component that is most of all described and stands out as the most important component in the text-fragment.
- part of determining which components to render and which to import
- name: 'primary component'
- dependencies: ['components']
- isJson: false
- functions:
  - buildMessage(fragment):
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
      - {{components}}: `await deps.components.getResult(fragment)`

    - role: assistant, content:

      > Remember: only return the name of the component that is the primary / root component.
      > 
      > good response:
      > x
      >
      > bad response:
      > the primary / root component is x
       
    - return: `result, [ ]`


## primary-class service
- The primary-class service is responsible for identifying the class that is most of all described and stands out as the most important item in the text-fragment.
- part of determining which classes to render and which to import
- name: 'primary class'
- dependencies: ['classes', 'constants']
- isJson: false
- functions:
  - buildMessage(fragment):
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
      - {{classes}}: `await deps.classes.getResult(fragment)`

    - role: assistant, content:

      > Remember: only return the name of the class that is the primary / root class.
      > 
      > good response:
      > x
      >
      > bad response:
      > the primary / root class is x
       
    - return: `result, [ ]`

## class-description service
- The class-description-service is responsible for generating descriptions of classes based on the text-fragments that contain references to those classes.
- Used as input for various other transformers that require the description of only 1 class in a fragment instead of everything.
- name: 'class description'
- dependencies: ['double compress', 'classes']
- isJson: false
- functions:
  - iterator(fragment, callback):
    ```python
      classes = await deps.classes.getResult(fragment)  
      for item in classes:
        callback(fragment, item)
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


## component-description service
- The component-description-service is responsible for generating descriptions of components based on the text-fragments that contain references to those components. A single description can still contain info about other components that are mentioned in the fragment.
- Used as input for various other transformers that require the description of only 1 component in a fragment instead of everything.
- name: 'component description'
- dependencies: ['double compress', 'components']
- isJson: false
- functions:
  - iterator(fragment, callback):
    ```python
      components = await deps.components.getResult(fragment)
      for item in components:
        callback(fragment, item)
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


## component-exact-description service
- The component-exact-description-service is responsible for generating descriptions of components based on the text-fragments that contain references to those components. A single description can only contain info about the requested component, any information about other components is removed.
- Used as input for various other transformers that require the description of exactly only 1 component in a fragment instead of everything.
- name: 'component exact description'
- dependencies: ['compress', 'components', 'primary component']
- isJson: false
- functions:
  - iterator(fragment, callback):
    ```python
      components = await deps.components.getResult(fragment)
      primary = await deps['primary component'].getResult(fragment)
      for item in components:
        callback(fragment, components, primary, item)
    ```

  - buildMessage(fragment, components, primary, item):
    - content, otherCompText, rememberPrompt = await buildContent(fragment, components, primary, item)
    - if not content return null
    - result (json array):
      - role: system, content:
        
        > Act as an ai feature classification system.
        > It is your task to build the feature list related to the UI component '{{name}}' using the provided feature list.
        > Only return what is in the feature list about {{name}}{{otherCompText}}. No introduction or explanation.
        
        replace:
        - {{name}}: `item`
        - {{otherCompText}}: `otherCompText`  
  
      - role: user, content:

        > the feature list:
        > {{content}}
        
        replace:
        - {{content}}: `content`    
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

## declare-or-use-component classification service
- The declare-or-use-component classification service is responsible for figuring out if a component gets declared or used in a text-fragment.
- Used to determine if a file needs to be generated for the component or the info needs to be used to find out from where to import the component.
- name: 'declare or use component'
- dependencies: ['double compress', 'components']
- isJson: true
- functions:
  - iterator(fragment, callback):
    ```python
      components = await deps.components.getResult(fragment)
      for item in components:
        callback(fragment, item)
    ```

  - buildMessage(fragment, item):
    - content = await deps['double compress'].getResult(fragment)
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


## declare-or-use-class classification service
- The declare-or-use-class classification service is responsible for figuring out if a class gets declared or used in a text-fragment.
- Used to determine if a file needs to be generated for the class or the info needs to be used to find out from where to import the class.
- name: 'declare or use class'
- dependencies: ['classes', 'class description', 'primary class']
- isJson: true
- functions:
  - calculateMaxTokens(inputTokenCount): inputTokenCount + 20
  - iterator(fragment, callback, result):
    ```python
      titles = await getKeysWithClasses(fragment.key)
      classes = await deps.classes.getResult(fragment)
      if len(classes) > 0:
        primary = await deps['primary class'].getResult(fragment)
        for item in classes:
          if item == primary:
            keys = [fragment.key, item]
            key = keys.join(' | ')
            result[key] = 'declare'
          else:
            callback(fragment, titles, item)
    ```
  - cleanResponse(response): if 'no' is returned, convert to 'declare'
    ```python
      if response.lower() == 'no':
        return 'declare'
      return response
    ```

  - getKeysWithClasses(toExclude): get every fragment-key in the project that currently has classes associated with it. This is done by searching the cache of the 'classes' transformer.
  ```python
    result = []
    for fragment in services.projectService.textFragments:
      classes = await deps.classes.getResult(fragment)
      if classes and fragment.key != toExclude:
        result.push(fragment.key)
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
        > It is your task to classify if the class '{{class}}', described as: '{{description}}', is declared in one of the given titles.
        > Only return 'no' or the title it is declared in, do not include any explanation. Only return 1 title.
        > 
        > good response:
        > no
        > 
        > bad response:
        > The class 'X' is not declared in any of the titles.

        replace:
        - {{class}}: `item`
        - {{description}}: `description`  
        
      - role: user, content:

        > Titles: 
        > {{titles}}

        replace:
        - {{titles}}: `titles`

    - return: `result, [ item ]`


## is-service-used service
- The is-service-used classification service is responsible for figuring out if a text fragment uses any of the currently known service-classes in the project.
- Used to determine which files should be imported and which interfaces should be known about.
- name: 'is service used'
- dependencies: ['declare or use class', 'class description', 'constants']
- isJson: false
- functions:
  - calculateMaxTokens(inputTokenCount): inputTokenCount + 4
  - iterator(fragment, callback, result):
    ```python
      for toCheck in services.projectService.textFragments:
        if toCheck.key == fragment.key: continue
        classes = await deps['declare or use class'].getResult(toCheck)
        for className, value in classes.items():
          if value == 'declare':
            callback(fragment, toCheck, className)
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

    - return: `result, [  checkAgainst.key, className ]`

## is-service-singleton service
- The is-service-singleton service is responsible for figuring out if a class that is declared in a text fragment is described as being a singleton or not.
- Used to determine how a class should be rendered.
- name: 'is service singleton'
- dependencies: ['declare or use class', 'constants']
- isJson: false
- functions:
  - calculateMaxTokens(inputTokenCount): inputTokenCount + 3
  - iterator(fragment, callback, result):
    ```python
        classes = await deps['declare or use class'].getResult(fragment)
        for className, value in classes.items():
          if value == 'declare':
            callback(fragment, className)
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

## list-component-props service
- The list-component-props service builds a list of properties that a component is described to have.
- Used to determine how a class should be rendered.
- name: 'component props'
- dependencies: ['declare or use component', 'component exact description']
- isJson: true
- functions:
  - calculateMaxTokens(inputTokenCount): inputTokenCount + 240
  - iterator(fragment, callback):
    ```python
        components = await deps['declare or use component'].getResult(fragment)
        for compName, value in components.items():
          if value == 'declare':
            callback(fragment, compName)
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

## is-service-for-all-components service
- The is-service-for-all-components  service is responsible for figuring out if a class described in the fragment should be usd by all components or not.
- Used to determine which files should be imported and which extra info needs to be added to component rendering.
- name: 'is service for all components'
- dependencies: ['declare or use class', 'class description']
- isJson: false
- functions:
  - calculateMaxTokens(inputTokenCount): inputTokenCount + 4
  - iterator(fragment, callback, result):
    ```python
        classes = await deps['declare or use class'].getResult(fragment)
        for className, value in classes.items():
          if value == 'declare':
            callback(fragment, className)
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


## service-usage service
- The service-usage service is responsible for extracting all the features described in a fragment that relate to a particular service.
- Used to determine the full set of feature requirements of a class.
- name: 'service usage'
- dependencies: ['declare or use class', 'is service used', 'constants']
- isJson: true
- functions:
  - calculateMaxTokens(inputTokenCount): inputTokenCount * 2
  - iterator(fragment, callback, result):
    ```python
        for toCheck in services.projectService.textFragments:
          if toCheck.key == fragment.key: continue
          classes = await deps['declare or use class'].getResult(toCheck)
          for className, value in classes.items():
            if value == 'declare':
              isUsed = await getIfClassIsUsed(fragment, toCheck, className)
              if isUsed:
                callback(fragment, className)
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

## global-component-features service
- The global-component-features service extracts the list of features that all components should implement according to a service.
- Used to determine how a components should be rendered.
- name: 'global component features'
- dependencies: ['is service for all components', 'constants']
- isJson: false
- functions:
  - calculateMaxTokens(inputTokenCount): inputTokenCount * 2
  - iterator(fragment, callback):
    ```python
        toCheck = await deps['is service for all components'].getResult(fragment)
        for service, value in toCheck.items():
          if value == 'yes':
            callback(fragment, service)
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

## component-imports service
- The component-imports service is responsible for generating the list of modules that should be imported by a component.
- Used to prepare the rendering of the code file for a component.
- name: 'component imports'
- dependencies: ['components', 'declare or use component', 'service usage', 'global component features', 'component description']
- isJson: false
- functions:
  - iterator(fragment, callback, result):
    ```python
      components = await deps.components.getResult(fragment)
      for component in components:
        isDeclare = await getIsDeclared(fragment, component) 
        if isDeclare:
            imports = await getServiceImports(fragment)
            results[component] = imports
        else:
            await resolveComponentImports(fragment, component, callback, results)
      return [result, None]
    ```
  - getIsDeclared(fragment, component): get the result of the declare-or-use transformer and see if the specified component is declared or not. 
  Do case insensitive search.
    ```python
      component = component.lower()
      result = await deps['declare or use component'].getResult(fragment)
      temp_items = {k.lower(): v for k, v in result.items()}
      if name in temp_items:
        return temp_items[name] == 'declare'
      else:
        return False
    ```
  - getAllDeclared(fragment):
    ```python
      data = await deps['declare or use component'].getResult(fragment)
      return [name for name in data if data[name] == 'declare']
    ```
  - getDeclaredIn(fragment, component): Returns the key of the text fragment where the item is declared. 
  Do case insensitive search.
    ```python
      component = component.lower()
      result = await deps['declare or use component'].getResult(fragment)
      temp_items = {k.lower(): v for k, v in result.items()}
      if name in temp_items:
        return temp_items[name]
      return None
    ```
  - buildPath(declaredIn, filename):
    ```python
      declaredIn = declaredIn.key 
      declared_in_parts = declaredIn.split(" > ")
      declared_in_parts[0] = 'src' # replace the first part with src so that it replaces the name of the project which isn't the root of the source code
      path = os.path.join(*declared_in_parts, filename.replace(" ", "_").replace('-', '_') )
      return path
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
              cur_path_parts = [part.replace(" ", "_") for part in cur_path_parts]
              cur_path_parts[0] = 'src' # replace the first part with src so that it replaces the name of the project which isn't the root of the source code
              if not service in imported:
                  imported[service] = True
                  service_path = os.path.join(*cur_path_parts, service.replace(" ", "_"))
                  results.append({'service': service, 'path': service_path, 'service_loc': service_loc})
      for fragment in refs.projectService.textFragments:
          globalFeatures = await deps['global component features'].getResult(fragment)
          if globalFeatures:
            cur_path_parts = fragment.key.split(" > ")
            # replace all spaces with underscores
            cur_path_parts = [part.replace(" ", "_").replace('-', '_') for part in cur_path_parts]
            cur_path_parts[0] = 'src' # replace the first part with src so that it replaces the name of the project which isn't the root of the source code
            for service, features in globalFeatures.items():
                if not service in imported:
                    imported[service] = True
                    service_path = os.path.join(*cur_path_parts, service.replace(" ", "_").replace('-', '_')).strip()
                    results.append({'service': service, 'path': service_path, 'service_loc': fragment.full_title})
      return results  
    ```     
  - resolveComponentImports(fragment, component, callback, results):
    ```python
      declared_in = await getDeclaredIn(fragment, component)
      if not declared_in:
          raise new Error(f"can't find import location for component {component} used in {fragment.key}")
      else:
          declaredInFragment = refs.projectService.getFragment(declared_in.replace("'", "").replace('"', '')) # remove quotes cause gpr sometimes adds them
          if not declaredInFragment:
            raise new Error(f'component declared in {declared_in}, but fragment cant be found at specified index')
          components = await deps.components.getResult(declaredInFragment)
          if component in components:
              path = buildPath(declaredInFragment, component)
              results[component] = path
          else:
              # if there is only 1 component declared in the fragment, we can presume that's the one we need
              declared_comps = await getAllDeclared(declaredInFragment)
              if len(declared_comps) == 1:
                  path = buildPath(declaredInFragment, declared_comps[0])
                  results[component] = path
              else:
                  iterator(fragment, component, declared_comps, declaredInFragment) # declaredInFragment is needed for cleanresponse
    ```
  - cleanResponse(response, fragment, component, declared_comps, declaredInFragment): `return buildPath(declaredInFragment, response)` 
  - buildMessage(fragment, component, declared_comps):
    - description = await deps['component description'].getResult(fragment)
      if not description return null
      description = description[component] # a fragment can have multiple classes, so get the description of the class we are searching for
      if not description return null
    - result (json array):
      - role: system, content:
        
        > Only return the name of the most likely match, don't give any introduction or explanation.
        
      - role: user, content:

        > Which of these component names best matches '{{component}}', described as {{description}}:
        > {{items}}

        replace:
        - {{description}}: `description`
        - {{items}}: `\n- '.join(declared_comps)`
        - {{component}}: `component`

    - return: `result, [ component ]`
    

## found-interface-parts service
- The found-interface-parts is responsible for listing all parts of the interface of a service that are used in the code.
- Used to find the exact definitions that are used in the code so that the same name and parameters can be used everywhere.
- name: 'found interface parts'
- dependencies: ['component renderer']
- isJson: true
- functions:

## interface-parts-used service
- The interface-parts-used is responsible for filtering the interface definition of a service or component to only those items that are used in the description.
- Used to remove all definitions from the prompt that have no relationship to the current task as to not confuse the llm.
- name: 'interface parts used'
- dependencies: ['components', 'component imports', 'found interface parts', 'component exact description', 'global component features']
- isJson: true
- functions:
  - iterator(fragment, callback, result):
    ```python
      components = await deps.components.getResult(fragment)
      for component in components:
        importsList = await deps['component imports'].getResult(fragment)
        if importsList:
          importsList = importsList[component] 
        if importsList:
          for import_def in importsList:
            service = import_def['service']
            serviceLoc = import_def['service_loc']
            serviceFragment = refs.projectService.getFragment(serviceLoc)
            if not serviceFragment:
              raise new Error(f'fragment with key {serviceLoc} not found in the project')
            interfaceDef = await deps['found interface parts'].getResult(serviceFragment)
            if interfaceDef:
              interfaceDef = interfaceDef[service]
            globalInterfaceDef = await deps['global component features'].getResults(serviceFragment)

      return [result, None]
    ```

## component-renderer service
- the component-renderer service is responsible for generating all the code related to UI components.
- used to build UI applications
- name: 'component renderer'
- dependencies: ['components', 'declare or use component', 'is service singleton', 'global component features', 'component exact description', 'component imports']
- isJson: false