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
  - return result, [ text-fragment.key ]
  
  
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
  - return result, [ text-fragment.key ]


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
  - return result, [ text-fragment.key ]

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
      result, [ textFragment.key ]
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
              return result, [ textFragment.key, services.projectService.textFragments[1].key ]
            else:
              result, [ textFragment.key ]
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
       
    - return: `result, [ textFragment.key ]`


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
       
    - return: `result, [ fragment.key ]`

## class-description service
- The class-description-service is responsible for generating descriptions of classes based on the text-fragments that contain references to those classes.
- Used as input for various other transformers that require the description of only 1 class in a fragment instead of everything.
- name: 'class description'
- dependencies: ['double compress', 'classes']
- isJson: true
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
    - return: `result, [ fragment.key, item ]`


## component-description service
- The component-description-service is responsible for generating descriptions of components based on the text-fragments that contain references to those components. A single description can still contain info about other components that are mentioned in the fragment.
- Used as input for various other transformers that require the description of only 1 component in a fragment instead of everything.
- name: 'component description'
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
    - return: `result, [ fragment.key, item ]`


## component-exact-description service
- The component-exact-description-service is responsible for generating descriptions of components based on the text-fragments that contain references to those components. A single description can only contain info about the requested component, any information about other components is removed.
- Used as input for various other transformers that require the description of exactly only 1 component in a fragment instead of everything.
- name: 'component exact description'
- dependencies: ['compress', 'components', 'primary component']
- isJson: true
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
    - return: `result, [ fragment.key, item ]`
  
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
    - return: `result, [ fragment.key, item ]`


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
      titles = getKeysWithClasses(fragment.key)
      classes = await deps.classes.getResult(fragment)
      if len(classes) > 0:
        primary = await deps['primary class'].getResult(fragment)
        for item in classes:
          if item == primary:
            keys = [fragment.key, item]
            key = keys.join(' | ')
            result[key] = 'declare'
          else:
            callback(fragment, item)
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
      classes = deps.classes.cache.getResult(fragment.key)
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

    - return: `result, [ fragment.key, item ]`


## is-service-used service
- The is-service-used classification service is responsible for figuring out if a text fragment uses any of the currently known service-classes in the project.
- Used to determine which files should be imported and which interfaces should be known about.
- name: 'is service used'
- dependencies: ['declare or use class', 'class description', 'constants']
- isJson: true
- functions:
  - calculateMaxTokens(inputTokenCount): inputTokenCount + 4
  - renderResult(fragment):
    ```python
    titles = getKeysWithClasses(fragment.key)
    result = []

    for toCheck in services.projectService.textFragments:
      if toCheck.key -= fragment.key: continue
      classes = deps['declare or use class'].cache.getResult(toCheck.key)
      if len(classes) == 0: continue



        primary = await deps['primary class'].getResult(fragment)
        for item in classes:
          if item == primary:
            itemResult = 'declare'
            keys = [fragment.key, item]
          else:
            message, keys = await buildMessage(fragment, titles, item)
            if not message:
              continue
            itemResult = await services.GPTService.sendRequest(this, fragment.key, message)
            if itemResult.lower() == 'no':
              itemResult = 'declare'
          key = keys.join(' | ')
          services.cache.setResult(key, itemResult)
          result[item] = itemResult
    return result
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

    - return: `result, [ fragment.key, checkAgainst.key, item ]`