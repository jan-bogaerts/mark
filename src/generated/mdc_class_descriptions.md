# MarkdownCode > services > Undo service
{"UndoService": "The UndoService is a class that records user text edits in monaco-editors and provides undo and redo functionality."}
# MarkdownCode > services > dialog service
{"DialogService": "The DialogService is a shared interface that allows for displaying dialog boxes in other components and services. It supports errors, warnings, and information, and can be used to show electron dialog boxes with error details when user-triggered actions encounter errors."}
# MarkdownCode > services > Theme service
{"ThemeService": "The ThemeService class manages the selected theme font and font-size globally, saving changes to local storage. It allows for light or dark theme selection and applies the selected theme to components without the need for subscription. The main window refreshes content when the theme is updated."}
# MarkdownCode > services > Selection service
{"SelectionService": "The SelectionService is a class that tracks selected text and the active editor. It allows monitoring for changes and supports various actions such as cut, copy, paste, delete, clear selection, and select all."}
# MarkdownCode > services > folder service
{"FolderService": "The FolderService is a global singleton that manages the location of the active project. It provides properties and actions to handle the root folder, project name, project file path, cache folder path, and project configuration file path."}
# MarkdownCode > services > gpt service
{"GPTService": "The 'GPTService' is a service class that acts as a global singleton for interacting with the open-ai API backend. It provides functions for making API requests, including sending a list of JSON objects called 'messages' to the backend using the 'createChatCompletion' function. The service also handles retries in case of request failures and offers a method to retrieve the available models list."}
# MarkdownCode > services > cybertron service
{"CybertronService": "The 'CybertronService' is a service class that globally manages transformers. It maintains a sub-list of entry-points for building text-fragments. Transformers can register and be added as entry-points, and they can also unregister and be removed from the available transformers and entry-points list."}
# MarkdownCode > services > transformer-base service
{"TransformerBaseService": "The 'TransformerBaseService' is a base class for transformers that provides a common interface and functionality. It handles the construction of transformers and their dependencies, utilizes a result cache service for storing and tracking results, and uses the GPT service to generate messages based on transformer-specific parameters."}
# MarkdownCode > services > compress service
{"CompressService": "The 'CompressService' is a service class that shortens text fragments and can be used for testing and other processes. It is a subclass of the transformer-base service and has a constructor that takes name and dependencies as parameters. The service instance is created and registered during startup. The build-message function takes a text fragment as input and returns a JSON array called result with system and user roles, as well as the text fragment key."}
# MarkdownCode > services > build service
{"BuildService": "The BuildService is responsible for handling text fragments in a project service and using transformers to generate conversions. It requests each transformer to render its result asynchronously for each text fragment in the project service's data list."}
# MarkdownCode > services > line parser
{"LineParser": "The LineParser service is a global singleton object that parses markdown lines and updates text-fragments in the project-service. It provides functions to create text-fragments, calculate keys, and clear the fragmentsIndex list."}
# MarkdownCode > services > position-tracking service
{"PositionTrackingService": "The PositionTrackingService is a service class that tracks the user's current text-fragment, including the selected line number and related text. It also stores events monitoring changes in the selected text-fragment. The service offers methods to set the selected line and clear the active fragment and current line."}
# MarkdownCode > services > project service > change-processor service
{"ChangeProcessorService": "The ChangeProcessorService is responsible for keeping the project structure synchronized with the source by processing changes in the project content. Its main function, \"process\", updates the project service based on user edits by replacing overwritten lines, deleting or inserting lines, and marking the storage service as dirty."}
# MarkdownCode > services > build-stack service
{"BuildStackService": "The BuildStackService is a service class that prevents circular references by tracking running textframe - transformer pairs and providing functions to register and unregister these pairs."}
# MarkdownCode > services > constant-extractor service
{"ConstantExtractorService": "The ConstantExtractorService is a service that extracts constant definitions from source code and stores them in a json file. It replaces constants in the source texts with json references."}
# MarkdownCode > services > project service
{"ProjectService": "The ProjectService manages a global data-list of text fragments and provides functions for working with the fragments, such as deleting, adding, marking as out of date, and retrieving by key. It also tracks user configurations and uses an EventTarget field to dispatch events for content changes and other actions."}
# MarkdownCode > services > line parser > line parser helpers
{"LineParserHelpers": "The 'LineParserHelpers' service class provides helper functions for the line parser service. It includes functions for tasks such as getting fragments, handling empty lines, updating titles, removing titles, inserting fragments, handling title lines, and updating fragment lines."}
# MarkdownCode > services > project service > storage service
{"StorageService": "The StorageService is a global singleton that provides functions for reading and writing project data. It includes functions for clearing data, creating new data, opening files, updating out-of-date data, marking data as dirty, and saving data to a file. The fs module should be loaded remotely through Electron."}
# MarkdownCode > services > result-cache service
{"ResultCacheService": "The ResultCacheService is a service class that manages cached results for transformers. It stores and tracks results for text fragments, allowing transformers to store their results in a JSON file. The cache is updated when a transformer calculates a result, and it contains dictionaries, overwritten values, and the last save date. The cache also handles fragment deletion and key changes, and provides functions to overwrite, retrieve, and check if a text fragment is out of date. Additionally, the cache can be cleared using the clearCache() function."}
