# Pelikaan > services
[
  { "ERROR_DIALOG_TITLE": "Error" },
  { "ERROR_DIALOG_MESSAGE": "An error occurred. Please try again later." },
  { "FILE_NOT_FOUND_ERROR": "File not found." },
  { "NETWORK_ERROR": "Network error. Please check your internet connection." },
  { "INVALID_INPUT_ERROR": "Invalid input. Please provide valid data." },
  { "AUTHENTICATION_ERROR": "Authentication failed. Please login again." },
  { "SERVER_ERROR": "Server error. Please try again later." },
  { "SERVICE_UNAVAILABLE_ERROR": "Service is currently unavailable. Please try again later." }
]
# Pelikaan > services > project service
[
  { "CLEAR_PROJECT_DATA": "clearProjectData" },
  { "RECREATE_CACHE": "recreateCache" },
  { "DATA_CHANGED_EVENT": "dataChangedEvent" },
  { "OPEN_PROJECT": "openProject" },
  { "READ_FILE": "readFile" },
  { "PARSE_LINE": "parseLine" },
  { "UPDATE_CACHE": "updateCache" },
  { "SAVE_PROJECT": "saveProject" },
  { "WRITE_FILE": "writeFile" },
  { "UPDATE_DATA_LIST": "updateDataList" },
  { "GET_TREE_STRUCTURE": "getTreeStructure" },
  { "CONVERT_TITLE_TO_TEXT": "convertTitleToText" },
  { "GET_AUTO_SAVE_STATUS": "getAutoSaveStatus" },
  { "SET_AUTO_SAVE_STATUS": "setAutoSaveStatus" },
  { "GET_CODE_STYLE": "getCodeStyle" },
  { "SET_CODE_STYLE": "setCodeStyle" }
]
# Pelikaan > services > line parser
[
  { "LINE_PARSER_SERVICE": "LineParserService" },
  { "HEADER_PREFIX": "#" },
  { "TEXT_FRAGMENT_LEVEL_1": "#" },
  { "TEXT_FRAGMENT_LEVEL_2": "##" },
  { "TEXT_FRAGMENT_LEVEL_3": "###" }
]
# Pelikaan > services > position-tracking service
[
  { "CURRENTLY_SELECTED_LINE": "currentlySelectedLine" },
  { "SELECTED_TEXT_FRAGMENT": "selectedTextFragment" },
  { "EVENT_TARGET": "eventTarget" },
  { "ON_CHANGED_EVENT": "onChangedEvent" }
]
# Pelikaan > services > gpt service
[
  { "GPT_SERVICE_RETRY_LIMIT": 3 },
  { "GPT_SERVICE_API_ENDPOINT": "https://api.openai.com/v1/chat/completions" },
  { "GPT_SERVICE_AVAILABLE_MODELS_ENDPOINT": "https://api.openai.com/v1/engines" },
  { "GPT_SERVICE_REGISTER_ENDPOINT": "/api/services/register" },
  { "GPT_SERVICE_UNREGISTER_ENDPOINT": "/api/services/unregister" }
]
# Pelikaan > services > result-cache service
[
  { "CACHE_FILE_NAME": "result-cache.json" },
  { "CACHE_ITEM_STATE": { "VALID": "still-valid", "OUT_OF_DATE": "out-of-date" } }
]
# Pelikaan > services > build service
[
  { "BUILD_SERVICE": "build service" },
  { "PACKAGE_EXTRACTOR_SERVICE": "package-extractor service" },
  { "COMPONENT_LISTER_SERVICE": "component-lister service" },
  { "PUBLIC_DISCOVERY_SERVICE": "public discovery service" },
  { "CLASS_GENERATOR": "class generator" },
  { "CONSTANT_GENERATOR": "constant generator" },
  { "COMPONENT_GENERATOR": "component generator" }
]
# Pelikaan > services > compress service
[
  { "SYSTEM_PROMPT": "condense the following text as much as possible, without losing any meaning:" },
  { "GPT_INTERFACE_NAME": "compress" }
]
# Pelikaan > services > double compress service
[
  { "SYSTEM_PROMPT": "condense the following text to half the length, without loosing any meaning. Remove the markdown, but use bullet points where appropriate." },
  { "GPT_INTERFACE_NAME": "double-compress" }
]
# Pelikaan > services > package extractor service
[
  { "USER_PROMPT": "You are an ai software developer tasked with writing software for an application called Pelikaan, with as short description: Pelikaan is a text editing application developed in JavaScript using Electron as its runtime. The UI is built using React and Antd(5). It is your job to find all the packages that are needed. Make a list of all the packages that need to be installed according to you based on the following part of the application description:" },
  { "GPT_INTERFACE_NAME": "packages" },
  { "GPT_INTERFACE_ARGUMENT_RESOURCES": ["the project"] }
]
# Pelikaan > services > feature merger service
[
  { "SYSTEM_PROMPT": "You are an ai software developer who is reviewing the feature descriptions for the application called '{0}', described as: '{1}'" },
  { "USER_PROMPT": "It is your task to search for features that are about {2} which are mentioned in the block about {3}: '{4}' but are not present in: '{5}'" },
  { "FINAL_SYSTEM_PROMPT": "List all features related to {2} that were found in {3}:" },
  { "FEATURE_MERGER_SERVICE": "feature merger service" },
  { "GPT_INTERFACE_NAME": "features completion" },
  { "GPT_INTERFACE_ARGUMENTS": ["the project", "the project"] }
]
# Pelikaan > services > toolbar completer service
[
  { "SYSTEM_PROMPT": "You are an ai software developer who is reviewing the feature descriptions in search for buttons, drop-downs, inputs, toggles or other components that are missing from the toolbar for the application called '{0}', described as: '{1}'. Currently, the toolbar has: {2}" },
  { "USER_PROMPT": "Which toolbar items are mentioned in the following text and are missing from the current toolbar description: {3}" },
  { "FINAL_PROMPT": "Remember, make a list of all missing components and which actions they should perform." },
  { "GPT_INTERFACE_NAME": "toolbar completion" },
  { "ARGUMENT_RESOURCES": ["project"] }
]
# Pelikaan > services > missing features service
[
  { "USER_PROMPT": "It is your task to find all the features regarding '{2}' that are not mentioned in: {3}" },
  { "SYSTEM_PROMPT": "List all missing features." }
]
# Pelikaan > services > feature generator service
[
  { "SYSTEM_PROMPT": "You are an ai software developer who is working on the feature descriptions for the application called '{0}', described as: '{1}'" },
  { "USER_PROMPT": "It is your task to find all the features regarding '{2}', described as: {3}" },
  { "SYSTEM_PROMPT": "List all required features." },
  { "GPT_INTERFACE_NAME": "feature ideas" },
  { "GPT_INTERFACE_ARGUMENT_RESOURCES": ["double compress service"] }
]
# Pelikaan > services > component lister service
[
  { "USER_PROMPT": "It is your job to list all the components that are regarding '{2}' and which are defined in the following part of the application description: {3}" },
  { "DO_NOT_INCLUDE": "Do not include UI components that are provided by the UI framework. So don't include: buttons, dropdowns, inputs, sliders, toggle buttons, but only list the components that need to be custom built and which aren't service classes related to the backend." }
]
# Pelikaan > services > class lister service
[
  { "USER_PROMPT": "It is your job to list all the classes and features which are not UI components that are regarding '{2}' and which are defined in the following part of the application description: {3}" },
  { "CACHE_SERVICE": "ResultCacheService" }
]
# Pelikaan > services > constant lister service
[
  { "USER_PROMPT": "It is your job to list all the classes and features which are not UI components that are regarding '{2}' and which are defined in the following part of the application description: {3}" },
  { "SYSTEM_PROMPT": "Only list the services and constants which need to be custom built, so are not part of an imported library and are not part of the user interface." }
]
# Pelikaan > services > import discovery service
[
  { "DEVELOPMENT_STACK": {
      "JAVASCRIPT": "javascript",
      "ELECTRON_RUNTIME": "electron",
      "TEXT_EDITOR": "monaco editor",
      "UI_LIBRARY": "react and antd(5)"
    }
  }
]
# Pelikaan > services > file lister service
[
  {
    "file": "constants.js",
    "items": [
      {
        "constant_name": "SYSTEM_PROMPT",
        "value": "You are an ai software developer who is preparing to write the code for the application called '{0}', described as: '{1}'"
      },
      {
        "constant_name": "USER_PROMPT",
        "value": "It is your task to list all files that need to be generated to write code for the following items: '{2}' extracted from the section about '{3}: '{4}'"
      },
      {
        "constant_name": "RESPONSE_PROMPT",
        "value": "The response should follow these rules:\n- Try to add each component, class or service in its own file\n- do not add paths to the files, only provide the file names and list the items that are in each file.\n- Do not add any explanation, only return a json array containing objects with the following fields:\n  - the name of the file\n  - a list of all the items that the declared in the file\nWrite the list of files."
      },
      {
        "constant_name": "FILE_LIST_GPT_NAME",
        "value": "file list"
      }
    ]
  }
]
# Pelikaan > services > public discovery service
[
  { "USER_PROMPT": "It is your task to list all functions, methods, properties and fields that need to be provided in the interfaces of '{2}' as defined in: '{3}'\nso that '{2}' can be used in: '{4}'" },
  { "SYSTEM_PROMPT": "The response should follow these rules:\n- Do not add any explanation, only return a json array containing objects with the following fields:\n  - the name of the function, method, property or field\n  - what type it is: a function, method, property or field\n  - a short description\nWrite the required public interfaces." }
]
# Pelikaan > services > code generator
Based on the provided information, the constants defined in the code generator are as follows:

```javascript
[
  { "USER_PROMPT": "It is your task to write all the code for the file: '{2}', which has to contain the following:
    components: {3}
    classes: {3}
    constants: {5}
    The file needs to import: {6}
    the required functionality is described as: {7}" },
  { "RESPONSE_PROMPT": "The response should follow these rules:
    - Only write the contents of the file and only what is supposed to go into the file
    - Do not add any explanation
    - adhere to the following code style: {7}
    Write the file." }
]
```

Please note that the provided information does not specify any other constants defined in the code generator.
# Pelikaan > services > unit test generator
[
  { "USER_PROMPT": "It is your task to to write all the required test code for the {2}: '{3}'
  which has the following public items: {4},
  the required functionality is described as: {5}" },
  { "SYSTEM_PROMPT": "The response should follow these rules:
  - Only write the contents of the file and only what is supposed to go into the file
  - Do not add any explanation
  - adhere to the following code style: {7}
  Write the unit test." }
]
