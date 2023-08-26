
# MarkdownCode > services > project service
{"ProjectService": "The ProjectService class is responsible for creating, managing, and updating projects. It handles tasks such as clearing data, recreating cache objects, notifying components of data changes, reading and parsing files, saving projects, and managing user configurations."}
# MarkdownCode > services > Undo service
{"UndoService": "The UndoService is a class that records user text edits in monaco-editors and provides undo and redo functionality."}
# MarkdownCode > services > gpt service
{"GptService": "The 'GptService' class is responsible for communication with the OpenAI API backend. It uses the OpenAI Node.js library to send API requests and retrieve available models. The class also manages a list of available services, allowing them to register and unregister. Registered services should provide a name and a 'get-result' function."}
# MarkdownCode > services > build service
{"BuildService": "The 'BuildService' is a service class that uses gpt-services to convert markdown project data into source code. It can generate conversions on multiple text frames and transform the original markdown code into source code files. Additionally, it utilizes a compress service to render results for each text-fragment in the project."}
# MarkdownCode > services > compress service
{"CompressService": "The 'CompressService' is a service that uses the GPT service to shorten a text fragment. It provides a 'get-result' function that calls the GPT service with specific parameters and utilizes a result-cache-service to store and track results. The service is useful for checking if the GPT service understands the fragment and can be used for other processes.", "ResultCacheService": "The ResultCacheService is a service that stores and tracks results obtained from the GPT service. It is used to check if the GPT service understands a text fragment and can be utilized for other processes."}
# MarkdownCode > services > dialog service
{"DialogService": "The DialogService is a shared interface that allows for displaying dialog boxes in other components and services. It supports errors, warnings, and information, and can be used to show electron dialog boxes with error details when user-triggered actions encounter errors."}
# MarkdownCode > services > Theme service
{"ThemeService": "The ThemeService class manages the selected theme font and font-size globally, saving changes to local storage. It allows for light or dark theme selection and applies the selected theme to components without the need for subscription. The main window refreshes content when the theme is updated."}
# MarkdownCode > services > Selection service
{"SelectionService": "The SelectionService is a class that tracks selected text and the active editor. It allows monitoring for changes and supports various actions such as cut, copy, paste, delete, clear selection, and select all."}
# MarkdownCode > services > line parser
{"LineParser": "The 'LineParser' service is responsible for parsing markdown lines and updating text-fragments in the project-service. It can create new text-fragments, calculate keys, and handle various scenarios related to parsing and updating lines."}
# MarkdownCode > services > position-tracking service
{"PositionTrackingService": "The PositionTrackingService is a service that tracks the user's selected text-fragment and provides methods to set and retrieve the currently selected line. It also triggers an on-changed event for registered event handlers when the selected text-fragment changes."}
# MarkdownCode > services > result-cache service
{"ResultCacheService": "The ResultCacheService is a service class that manages cached results for transformers. It allows transformers to cache results using a dictionary and maintains a secondary dictionary to track relationships between text-fragment keys and dictionary entries. The cache can create cache-item objects with results, update existing results, and store them in a JSON file specified by the transformer. It also registers event handlers to monitor changes and determine if a text fragment is out-of-date."}
