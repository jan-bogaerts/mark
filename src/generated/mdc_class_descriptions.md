# MarkdownCode > services > Undo service
{"UndoService": "The UndoService is a class that records user text edits in monaco-editors and provides undo and redo functionality."}
# MarkdownCode > services > dialog service
{"DialogService": "The DialogService is a shared interface that allows for displaying dialog boxes in other components and services. It supports errors, warnings, and information, and can be used to show electron dialog boxes with error details when user-triggered actions encounter errors."}
# MarkdownCode > services > Theme service
{"ThemeService": "The ThemeService class manages the selected theme font and font-size globally, saving changes to local storage. It allows for light or dark theme selection and applies the selected theme to components without the need for subscription. The main window refreshes content when the theme is updated."}
# MarkdownCode > services > Selection service
{"SelectionService": "The SelectionService is a class that tracks selected text and the active editor. It allows monitoring for changes and supports various actions such as cut, copy, paste, delete, clear selection, and select all."}
# MarkdownCode > services > line parser > line parser helpers
{"LineParserHelpers": "The 'LineParserHelpers' service class provides functions for handling fragments in text. It includes methods for retrieving fragments, handling empty lines, updating fragment titles, removing fragment titles, inserting new fragments, handling title lines, updating fragment lines, and handling regular lines."}
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
# MarkdownCode > services > project service
{"ProjectService": "The 'ProjectService' class is responsible for creating, opening, and saving projects. It manages data files, clears the cache, and handles content changes. Additionally, it processes data changes in the markdown editor, manages a data list of text fragments, and handles user configurations."}
# MarkdownCode > services > line parser
{"LineParser": "The LineParser service is a global singleton object that parses markdown lines and updates text-fragments in the project-service. It provides functions to create text-fragments, calculate keys, and clear the fragmentsIndex list."}
# MarkdownCode > services > position-tracking service
{"PositionTrackingService": "The PositionTrackingService is a service that tracks the user's current text-fragment, including the selected line number and related text. It also allows for monitoring changes in the selected text-fragment and provides methods to set the current line and clear the active fragment."}
# MarkdownCode > services > result-cache service
{"ResultCacheService": "The ResultCacheService is a service class that manages cached results for transformers. It stores and tracks results for text fragments, monitors changes in both project and result fragments, and allows transformers to cache their results. The cache also tracks relationships between text fragment keys and stores results in a JSON file specified by the transformer. It registers event handlers with the project service to monitor fragment changes, marks results as out of date, and notifies other cache services. It provides functions to overwrite or retrieve results for a specific key, check if a text fragment is out of date, clear the cache, and retrieve all results related to a fragment. Fragment deletion and key changes are handled using event handlers."}
