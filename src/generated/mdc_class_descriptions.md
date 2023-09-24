# MarkdownCode > services > Undo service
{"UndoService": "The UndoService is a class that records user text edits in monaco-editors and provides undo and redo functionality."}
# MarkdownCode > services > Theme service
{"ThemeService": "The ThemeService class manages the selected theme font and font-size globally, saving changes to local storage. It allows for light or dark theme selection and applies the selected theme to components without the need for subscription. The main window refreshes content when the theme is updated."}
# MarkdownCode > services > Selection service
{"SelectionService": "The SelectionService is a class that tracks selected text and the active editor. It allows monitoring for changes and supports various actions such as cut, copy, paste, delete, clear selection, and select all."}
# MarkdownCode > services > folder service
{"FolderService": "The FolderService is a global singleton that manages the location of the active project. It provides properties and actions to handle the root folder, project name, project file path, cache folder path, and project configuration file path."}
# MarkdownCode > services > cybertron service
{"CybertronService": "The 'CybertronService' is a service class that globally manages transformers. It maintains a sub-list of entry-points for building text-fragments. Transformers can register and be added as entry-points, and they can also unregister and be removed from the available transformers and entry-points list."}
# MarkdownCode > services > transformer-base service
{"TransformerBaseService": "The 'TransformerBaseService' is a base class for transformers that provides a common interface and functionality. It handles the construction of transformers and their dependencies, utilizes a result cache service for storing and tracking results, and uses the GPT service to generate messages based on transformer-specific parameters."}
# MarkdownCode > services > compress service
{"CompressService": "The 'CompressService' is a service class that shortens text fragments and can be used for testing and other processes. It is a subclass of the transformer-base service and has a constructor that takes name and dependencies as parameters. The service instance is created and registered during startup. The build-message function takes a text fragment as input and returns a JSON array called result with system and user roles, as well as the text fragment key."}
# MarkdownCode > services > build service
{"BuildService": "The BuildService is responsible for handling text fragments in a project service and using transformers to generate conversions. It requests each transformer to render its result asynchronously for each text fragment in the project service's data list."}
# MarkdownCode > services > position-tracking service
{"PositionTrackingService": "The PositionTrackingService is a service class that tracks the user's current text-fragment, including the selected line number and related text. It also stores events monitoring changes in the selected text-fragment. The service offers methods to set the selected line and clear the active fragment and current line."}
# MarkdownCode > services > build-stack service
{"BuildStackService": "The BuildStackService is a service class that prevents circular references by tracking running textframe - transformer pairs and providing functions to register and unregister these pairs."}
# MarkdownCode > services > constant-extractor service
{"ConstantExtractorService": "The ConstantExtractorService is a service that extracts constant definitions from source code and stores them in a json file. It replaces constants in the source texts with json references."}
# MarkdownCode > services > project service > storage service
{"StorageService": "The StorageService is a global singleton that provides functions for reading and writing project data. It includes functions for clearing data, creating new data, opening files, updating out-of-date data, marking data as dirty, and saving data to a file. The fs module should be loaded remotely through Electron."}
# MarkdownCode > services > result-cache service
{"ResultCacheService": "The ResultCacheService is a service class that manages cached results for transformers. It stores and tracks results for text fragments, allowing transformers to store their results in a JSON file. The cache is updated when a transformer calculates a result, and it contains dictionaries, overwritten values, and the last save date. The cache also handles fragment deletion and key changes, and provides functions to overwrite, retrieve, and check if a text fragment is out of date. Additionally, the cache can be cleared using the clearCache() function."}
# MarkdownCode > services > project service
{"ProjectService": "The ProjectService class manages text fragments in a project globally. It provides functions to delete, add, mark as out of date, and retrieve fragments. It also handles user configurations and uses events for various actions."}
# MarkdownCode > services > dialog service
{"DialogService": "The DialogService is a global singleton that provides functionality for displaying dialog boxes. It can show dialog boxes for errors, warnings, and information. It also includes functions for showing specific types of dialog boxes, such as showErrorDialog, showSaveDialog, and showOpenDialog."}
# MarkdownCode > services > line parser
{"LineParser": "The 'LineParser' service is a singleton object that parses markdown lines and updates text-fragments in the project-service. It provides functions to create, calculate keys, clear, parse, insert, and delete lines."}
# MarkdownCode > services > all-spark service
{"AllSparkService": "The AllSparkService is a global singleton that creates and registers transformers into the Cybertron service. It provides a function called Load that is called during application construction. Transformers can be registered as either regular transformers or entry points. The transformers created by this service include the compress service (entry point) and the constant-extractor service."}
# MarkdownCode > services > line parser > line parser helpers
{"LineParserHelpers": "The 'LineParserHelpers' service class provides helper functions for a line parser service. It includes functions for retrieving fragments, handling empty lines, updating fragment titles, removing fragment titles, inserting fragments, handling title lines, updating fragment lines, handling regular lines, and deleting lines from fragments."}
# MarkdownCode > services > project service > change-processor service
{"ChangeProcessorService": "The 'ChangeProcessorService' is a service class that keeps the project structure in sync with the source by processing changes in the project content. It provides a function called `process(changes, full)` that updates the project service when the user makes edits. This function handles various operations such as updating the project service content, parsing and replacing lines, and marking the storage service as dirty."}
# MarkdownCode > services > gpt service
{"GPTService": "The 'GPTService' class is a service that communicates with the OpenAI API backend for specific tasks. It uses the OpenAI Node.js library for communication and provides methods such as sending requests to the API, retrieving available models, and updating the API key. The service ensures that the API key is valid and stored securely in localStorage."}
