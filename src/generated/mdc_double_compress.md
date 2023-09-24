# MarkdownCode
MarkdownCode is a machine learning tool for ideation and software building. Users input markdown text, which is analyzed for parameters and converted into executable code.
# MarkdownCode > development stack
- Built with JavaScript and Electron
- Uses Monaco Editor for text editing
- UI made with React and Ant Design (antd)
# MarkdownCode > components > main window
The main window is the first window shown when the app starts. It has a toolbar at the top and the rest of the space is the body.
# MarkdownCode > components > toolbar > home > undo section
The undo-section component has actions for the undo/redo service. It supports undo and redo buttons that are enabled based on the project's undo-service actions.
# MarkdownCode > services > Undo service
The undo service records user text edits in monaco-editors and includes both undo and redo lists.
# MarkdownCode > components > toolbar > preferences
The preferences-tab component arranges its children in a row and includes the GPT and View sections on the toolbar.
# MarkdownCode > components > toolbar > home
The home-tab component arranges its children in a row and includes the following child components: File, Edit, Undo, and Build sections.
# MarkdownCode > components > toolbar > format
The format-tab component arranges its children in a row, including the Style, Paragraph, and Font sections.
# MarkdownCode > components > toolbar > format > paragraph section
The paragraph-section component applies markdown formatting to text using icon buttons. Supported actions include indenting and unindenting lines or selections.
# MarkdownCode > components > toolbar > format > font section
- The font-section component applies markdown formatting to text.
- Buttons in the component use icons instead of text.
- Toggle buttons update based on text selection changes in the selection-service.
- The component supports the following actions: Bold, Italic, Underline, and Strike-through.
# MarkdownCode > components > toolbar > format > style section
The style-section component applies markdown formatting to text using buttons with icons. The buttons assign different formatting styles to the selected text in the selection-service. Only one button can be selected at a time. The buttons are arranged in a single row and include heading styles, paragraph, quote, code, bullet list, and numbered list. The toggle buttons update to reflect the style of the selected text when the selection changes. The selection-service provides a method to retrieve the style of the selected text.
# MarkdownCode > components > toolbar > preferences > open-ai configuration dialog
The open-ai configuration dialog is used to edit settings. It has a title, description, and an input box for the api-key. The current api-key is retrieved and displayed. There are "Cancel" and "OK" buttons at the bottom.
# MarkdownCode > components > toolbar > preferences > view section
The view-section component configures the app's appearance. Buttons have icon-only content. It supports theme, font, and font size selection. These values are linked to the theme-service.
# MarkdownCode > components > toolbar > preferences > GPT section
- GPT-section component configures GPT service actions.
- Buttons in the component have icon content only.
- GPT-section component tracks the open state of the 'open-ai configuration dialog'.
- Supported actions:
  - Key button: Opens the 'open-ai configuration dialog'.
    - Icon: Key.
  - Model: ModelComboBox component allows user to select default model for open-ai requests.
    - Available models are fetched from gpt-service.
    - Initial value is obtained from gpt-service using getDefaultModel function.
    - When value is changed, it is saved to gpt-service using setDefaultModel function.
# MarkdownCode > services > Theme service
The theme service globally manages the selected theme font and font-size, saving changes to local storage. It retrieves stored values on creation and allows for light or dark theme selection. Components use the service to apply the selected theme without needing to subscribe for changes. The main window refreshes content when the theme is updated.
# MarkdownCode > services > Selection service
The selection service tracks selected text and the active editor. It can be monitored for changes. Supported actions include cut, copy, paste, delete, clear selection, and select all.
# MarkdownCode > components > body > results view > results view context menu
The results-view-context-menu is a component that wraps the Dropdown antd component. It requires the properties 'transformer' and 'key' to be provided. The dropdown's content consists of a 'more' button icon, positioned in the top-right corner of its parent with a margin of 16px. The menu contains options for selecting the GPT model to be used by the transformer. The submenu items are fetched from the GPT service's list of available models. The currently selected model is indicated as selected. When a different model is selected, the GPT service is asked to update the model name for the transformer. There is also an option to refresh the result by pressing a button.
# MarkdownCode > services > folder service
The folder service is a global singleton that manages the location of the active project. It has properties for the root folder, project name, project file path, cache folder path, and project configuration file path. It can perform actions to clear, move, copy, and set the project location.
# MarkdownCode > services > cybertron service
- Cybertron-service globally manages transformers.
- It maintains a sub-list of entry-points for building text-fragments.
- Transformers register and can be added as entry-points.
- Transformers can unregister and be removed from the available transformers and entry-points list.
# MarkdownCode > services > transformer-base service
The transformer-base service is a base class for transformers, providing a common interface and functionality. Its constructor takes in the transformer name and a list of dependencies, replacing each name with the corresponding object from the list of transformers. If a name is not found, an exception is raised. The service uses a result-cache-service to store results and track when the build becomes outdated. The render-result function generates a message and a list of keys, sends a request to the GPT-service with the transformer name, text fragment key, and the message, and sets the result in the cache using the joined keys as the key and the received result.
# MarkdownCode > services > compress service
The compress service shortens text fragments and can be used for testing and other processes. It is a subclass of the transformer-base service. The constructor parameters are name and dependencies. During startup, an instance of the compress service is created and registered. The build-message function takes a text fragment as input and returns a JSON array called result with system and user roles. It also returns the text fragment key.
# MarkdownCode > services > build service
The build service handles all text fragments in the project service using transformers to generate conversions. To build the project, the service requests each transformer to asynchronously render its result for each text fragment in the project service's data list.
# MarkdownCode > components > body > outline
- The outline component is on the left side and displays a tree structure of headings in the active project.
- Project data is retrieved from the project service and converted into a tree structure using 'convertToTreeData' when the component is loaded or when a new project is loaded.
- The tree structure is updated when data items are added/changed or removed.
- The position-tracking service selects the corresponding tree node when the selected text-fragment changes.
- The tree is displayed with lines.
- 'convertToTreeData' creates a tree structure based on data items and sets parent-child relationships based on the level count.
# MarkdownCode > services > position-tracking service
The position-tracking service tracks the user's current text-fragment, including the selected line number and related text. It also stores events monitoring changes in the selected text-fragment. The service offers methods to set the selected line and clear the active fragment and current line.
# MarkdownCode > components > toolbar
- The application's toolbar has a similar design to MS Access, Excel, Word, or Draw.
- It consists of a single integrated menu and toolbar with tabs at the top.
- Each component on the toolbar displays a tooltip with a brief description.
- The available tabs are Home, Format, and Preferences.
- A JSON structure should be created for all tabs, including key, label, and children fields.
- The JSON structure should be assigned to the items property.
# MarkdownCode > services > build-stack service
The build-stack service prevents circular references. It uses a "running" dictionary to track running textframe - transformer pairs. The "tryRegister" function checks if a pair is already running and returns false if it is, otherwise it adds the pair to the "running" dictionary and returns true. The "unRegister" function removes a pair from the "running" dictionary.
# MarkdownCode > services > constant-extractor service
The constant-extractor service extracts constant definitions from source code and stores them in a json file. It replaces constants in the source texts with json references. It inherits from the transformer-base service and has a constructor with the parameters 'constants' and an empty array. To use the service, create a global instance and register it with the cybertron-service. The service has functions to extract quotes, render results, and retrieve up-to-date values.
# MarkdownCode > components > toolbar > home > file section
The file-section component manages project and file actions using icon buttons. Supported actions include creating a new project, opening an existing project, saving the current project, saving the current project to a new location, and toggling auto-save. The buttons' states are updated based on changes in the undo service.
# MarkdownCode > services > project service > storage service
The storage service is a global singleton for reading and writing project data. Functions include clear(), new(), open(filePath), updateOutOfDate(), markDirty(), and save(file). Note: fs module should be loaded remotely through Electron.
# MarkdownCode > components > toolbar > home > build section
- The build-section component has actions for the build-service, including buttons with icons instead of text.
- Actions include: "All" button (renders all code for the project), "Code for active fragment" button (renders code files for the active fragment), "Active fragment with active transformer" button (renders result for active fragment and transformer), "Debug" toggle button (updates debug state in build-service), and "Run next" button (continues rendering to the next transformer).
- Buttons are disabled based on certain conditions, such as when no fragment is out of date or when not in debug mode.
- Button states are stored in state for updating from event handlers.
- Button states are initialized on load and event handlers are registered for changes in project-service and position-tracking service.
- Event handlers are unregistered on unload.
# MarkdownCode > components > body > editor
The editor uses the monaco editor npm package to display markdown text. It retrieves text from the project service and applies theme, font, and font-size from the theme service. It reloads text when the project service triggers the 'content-changed' event. The monaco editor monitors events for change processing, editor focus and blur, cursor position and selection changes. It always occupies all available space.
# MarkdownCode > services > result-cache service
- This service manages cached results for transformers, storing and tracking results for text fragments.
- The cache monitors changes in project and result fragments.
- Transformers use the cache to store their results in a JSON file.
- The cache is updated when a transformer calculates a result.
- The cache file name and location are specified by the transformer.
- The cache contains dictionaries, overwritten values, and last save date.
- The cache loads the JSON file during construction and clears the cache if the file doesn't exist.
- The result-cache-service initializes the 'is-dirty' flag and registers event handlers.
- When a fragment is changed or deleted, the cache updates and sets the 'is-dirty' flag.
- The cache has functions to overwrite, retrieve, and check if a text fragment is out of date.
- The cache can be cleared using the clearCache() function.
- The cache handles fragment deletion and key changes.
- The setResult function stores the result and updates the 'is-dirty' flag.
- The isOutOfDate function checks if a key is still valid in the cache.
# MarkdownCode > components > body > results view > results view tab
The results-view-tab component displays transformer results for a specific text fragment. It uses the monaco editor npm package to display results in various formats. The editor adjusts to the component's size. When loaded, the component retrieves text from the result-cache and applies theme settings. The cache is monitored for changes, and text is displayed accordingly. User changes are saved to the cache. The monaco editor's events are monitored for selection changes. A results-view-context-menu component is placed on top of the editor, which updates the key and displays text when the selected fragment changes.
# MarkdownCode > components > toolbar > home > edit section
The edit-section component has actions for clipboard and selected data. Buttons use icons instead of text. Supported actions include cut, copy, paste, delete, select all, and clear selection. To check if the clipboard contains text data, use the clipboard imported from electron and call `clipboard.has('text/plain')` when the component is loaded or when the ipcRenderer emits the 'focused' event.
# MarkdownCode > services > project service
The project service manages text fragments in a project globally. It tracks loaded fragments, stores content and project filename. It provides functions to delete, add, mark as out of date, and retrieve fragments. It also handles user configurations and uses events for various actions.
# MarkdownCode > components > body
- The application uses the body component and the Split component from the @geoffcox/react-splitter library.
- The body component is filled with a Split component, with initial and minimum sizes set for the primary and secondary splits.
- The children of the body component are an outline component and another Split component.
- The Split component is set to be horizontal and has an editor component and a results view component as children.
- The body component has event handlers for the 'onSplitChanged' callback of both splits, storing the new position value in the state.
- The last positions of the horizontal and vertical splitters are stored and restored from local storage when the body component is loaded and unloaded.
# MarkdownCode > services > dialog service
- The dialog service is a global singleton for displaying dialog boxes.
- It can show dialog boxes for errors, warnings, and information.
- All user-triggered actions in a component should have proper error handling, showing an electron dialog box with error details if necessary.
- Functions: showErrorDialog(param1, param2), showSaveDialog(), showOpenDialog().
# MarkdownCode > components > body > results view
- Results-view component is at bottom of main body.
- Users view results from registered transformers in cybertron-service for selected text block.
- Each transformer in list creates a tab at top of view.
- Tab title and key are transformer name.
- Tab content displays results-view-tab component.
- Create JSON structure for tabs with fields: key, label, children.
- Assign JSON structure to items property.
# MarkdownCode > services > line parser
The line-parser service is a singleton object that parses markdown lines and updates text-fragments in the project-service. It has a fragmentIndex array to store text-fragment objects. The createTextFragment function trims and converts the line to lowercase, determines the depth-level of the text-fragment, assigns the title, calculates the key, and adds it to the project-service. The calculateKey function calculates the key of a text-fragment based on its depth-level and title. The clear function clears the fragmentIndex list. The parse function handles different types of lines, and the insertLine and deleteLine functions insert and delete lines respectively.
# MarkdownCode > services > all-spark service
The all-spark service is a global singleton that creates and registers transformers into the cybertron service. It has a function called Load that is called during application construction. To register a transformer, use `cybertronService.register(transformer, false)`. To register as an entry point, use `cybertronService.register(transformer, true)`. The transformers to create are the compress service (entry point) and the constant-extractor service.
# MarkdownCode > services > line parser > line parser helpers
- 'LineParserHelpers' module: helper functions for line parser service.
- 'getFragmentAt' function: retrieves fragment at given index.
- 'handleEmptyLine' function: handles empty line by adding/updating fragments.
- 'updateFragmentTitle' function: updates fragment title.
- 'removeFragmentTitle' function: removes fragment title and updates index.
- 'insertFragment' function: inserts new fragment at given index.
- 'handleTitleLine' function: handles line with title by creating/updating fragments.
- 'updateFragmentLines' function: updates fragment lines.
- 'handleRegularLine' function: handles regular line by creating/updating fragments.
- 'deleteLine' function: deletes line from fragment.
# MarkdownCode > services > project service > change-processor service
The change-processor service keeps the project structure in sync with the source by processing changes in the project content. Its main function, `process(changes, full)`, updates the project service when the user makes edits. This function sets the project service content to the editor's value, gets the editor's model, and iterates through each change in the changes list. It then splits the change's text into lines, sets the current line to the start line number of the change, and sets the line end to the end line number of the change. The function also sets the line index to 0, replaces overwritten lines by parsing the line content and incrementing the line and index, and deletes or inserts lines based on the remaining lines and increments the line and index accordingly. Finally, it marks the storage service as dirty.
# MarkdownCode > services > gpt service
- GPT service communicates with the open-ai api backend for specific tasks.
- It uses the openai node.js library for communication.
- The sendRequest function sends a list of json objects to openai using createChatCompletion function, retrying 3 times if the request fails.
- The getModels method retrieves the list of available models using the openai nodejs library, only if a valid key is available.
- The apiKey is stored and loaded from localStorage during service construction.
- The setApiKey function updates the api key, saves it to localStorage, recreates the openAI object, and resets the error flag.
- The OpenAI library is instantiated only if a valid apiKey is provided.
