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
# MarkdownCode > services > folder service
The folder service is a global singleton that manages the location of the active project. It has properties for the root folder, project name, project file path, cache folder path, and project configuration file path. It can perform actions to clear, move, copy, and set the project location.
# MarkdownCode > services > cybertron service
- Cybertron-service globally manages transformers.
- It maintains a sub-list of entry-points for building text-fragments.
- Transformers register and can be added as entry-points.
- Transformers can unregister and be removed from the available transformers and entry-points list.
# MarkdownCode > components > body > outline
- The outline component is on the left side and displays a tree structure of headings in the active project.
- Project data is retrieved from the project service and converted into a tree structure using 'convertToTreeData' when the component is loaded or when a new project is loaded.
- The tree structure is updated when data items are added/changed or removed.
- The position-tracking service selects the corresponding tree node when the selected text-fragment changes.
- The tree is displayed with lines.
- 'convertToTreeData' creates a tree structure based on data items and sets parent-child relationships based on the level count.
# MarkdownCode > components > toolbar
- The application's toolbar has a similar design to MS Access, Excel, Word, or Draw.
- It consists of a single integrated menu and toolbar with tabs at the top.
- Each component on the toolbar displays a tooltip with a brief description.
- The available tabs are Home, Format, and Preferences.
- A JSON structure should be created for all tabs, including key, label, and children fields.
- The JSON structure should be assigned to the items property.
# MarkdownCode > services > build-stack service
The build-stack service prevents circular references. It uses a "running" dictionary to track running textframe - transformer pairs. The "tryRegister" function checks if a pair is already running and returns false if it is, otherwise it adds the pair to the "running" dictionary and returns true. The "unRegister" function removes a pair from the "running" dictionary.
# MarkdownCode > services > transformers > constant-extractor service
The constant-extractor service extracts constant definitions from source code and stores them in a json file. It replaces constants in the source texts with json references. It inherits from the transformer-base service and has a constructor with the parameters 'constants' and an empty array. To use the service, create a global instance and register it with the cybertron-service. The service has functions to extract quotes, render results, and retrieve up-to-date values.
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
# MarkdownCode > services > line parser
The line-parser service is a singleton object that parses markdown lines and updates text-fragments in the project-service. It has a fragmentIndex array to store text-fragment objects. The createTextFragment function trims and converts the line to lowercase, determines the depth-level of the text-fragment, assigns the title, calculates the key, and adds it to the project-service. The calculateKey function calculates the key of a text-fragment based on its depth-level and title. The clear function clears the fragmentIndex list. The parse function handles different types of lines, and the insertLine and deleteLine functions insert and delete lines respectively.
# MarkdownCode > services > project service > change-processor service
The change-processor service keeps the project structure in sync with the source by processing changes in the project content. Its main function, `process(changes, full)`, updates the project service when the user makes edits. This function sets the project service content to the editor's value, gets the editor's model, and iterates through each change in the changes list. It then splits the change's text into lines, sets the current line to the start line number of the change, and sets the line end to the end line number of the change. The function also sets the line index to 0, replaces overwritten lines by parsing the line content and incrementing the line and index, and deletes or inserts lines based on the remaining lines and increments the line and index accordingly. Finally, it marks the storage service as dirty.
# MarkdownCode > services > gpt service
The GPT service communicates with the OpenAI API backend for specific tasks. It uses the OpenAI Node.js library. The defaultModel and modelsMap fields store and retrieve models for API calls. The sendRequest method sends API requests using createChatCompletion. It retries 3 times if the request fails. The getModels method retrieves available models if a valid API key is provided. The apiKey field stores the API key and can be updated. The OpenAI library is instantiated with a valid API key.
# MarkdownCode > components > body > results view > results view context menu
The results-view-context-menu is a component that wraps the Dropdown antd component. It requires the properties 'transformer' and 'key'. The dropdown's content includes a 'more' button icon, triggered by a click. The 'more' button is positioned as a floating button in the top-right corner of the parent using absolute positioning. The menu contains options for selecting a GPT model for all or for a specific fragment. The submenu items are fetched from the gpt-service's list of available models. The currently selected model is indicated as selected. The value for the current model is obtained from the gpt-service. When a different model is selected, the gpt-service is asked to update the model name. The menu also includes a splitter and a refresh option to recalculate the result.
# MarkdownCode > services > transformers > double-compress service
The double-compress-service shortens the result of compress-service. It is useful for testing and as input for other processes. It inherits from transformer-base service with constructor parameters: name, dependencies, and isJson. The build-message function takes a text-fragment and returns a result (json array) and the key. The result includes system and user roles. The system role contains a constant value and the user role contains the result of compressService.getResult. The function returns the result and key.
# MarkdownCode > services > all-spark service
The All-Spark service creates and registers transformers into the Cybertron service. It has a Load function that is called during application construction. Transformers are registered using `cybertronService.register(transformer, false)` or `cybertronService.register(transformer, true)` for entry points. All transformers should be registered after construction to ensure they can be found by others. The transformers to create are the Compress service (entry point), Constant-extractor service, and Double-compress service.
# MarkdownCode > services > project service > storage service
The storage service is responsible for reading and writing project data globally. It has functions to clear data, set up a new project, load data from disk, load models for the project, update out-of-date transformers, mark the project as dirty for auto-saving, and save the project and models to disk.
# MarkdownCode > services > line parser > line parser helpers
- 'LineParserHelpers' module: helper functions for line parser service.
- 'getFragmentAt': retrieves fragment at given index, handles null fragments.
- 'handleEmptyLine': handles empty lines, updates fragments index.
- 'updateFragmentTitle': updates fragment title, dispatches 'key-changed' event.
- 'removeFragmentTitle': removes fragment title, sets to empty or merges with previous fragment.
- 'insertFragment': inserts new fragment at given index, adjusts lines, updates project's status.
- 'isInCode': checks if fragment is in code block by counting '```' lines.
- 'handleTitleLine': handles title lines, creates or updates fragments.
- 'updateFragmentLines': updates fragment lines at given index, adjusts lines and index.
- 'handleRegularLine': handles regular lines, creates or updates fragments.
- 'deleteLine': deletes line at given index, removes from corresponding fragment if applicable.
# MarkdownCode > services > transformers > triple-compress service
The triple-compress-service reduces the output of the double-compress-service to a single line. It is used as a description for linked components and services. It is a subclass of the transformer-base service with the constructor parameters: Name: 'triple compress', Dependencies: ['double compress'], isJson: false. During construction, it sets `this.doubleCompressService` to the first element of the dependencies array. The function `build-message(text-fragment)` takes a text fragment as input and returns a result (in JSON array format) with the roles and contents: system - Condense the following text to one sentence, user - `await this.doubleCompressService.getResult(text-fragment)`. The function also returns the result and the key of the text fragment.
# MarkdownCode > services > transformers > component-lister service
The component-lister service extracts component names from text and determines which components to render. It inherits from the transformer-base service named 'triple compress' and depends on 'double compress'. The build-message function takes a text fragment and returns a JSON array with a system role and content, and a user role with the result of calling doubleCompressService on the fragment. The function also returns the result and key of the fragment.
# MarkdownCode > services > project service
The project service manages project aspects globally. It tracks loaded text fragments, stores content and project filename. It has an "isDirty" property that triggers an event when changed. Functions include deleting, adding, and marking fragments as out of date. It retrieves specific fragments and checks for outdated ones. It dispatches events using an EventTarget field. It tracks user configurations and raises events for content changes, fragment actions, and dirty status changes.
# MarkdownCode > components > toolbar > home > file section
- File-section component has actions for project and file management with icon buttons.
- Supported actions:
  - New Project: creates a new project, prompts to save unsaved changes, calls storage service.
  - Open: opens an existing project, shows file selection dialog, calls storage service, handles errors.
  - Save: saves current project to file, enabled when there are unsaved changes and a filename exists, shows save-as dialog if no filename, calls storage service, handles errors.
  - Save As: saves current project to new location, enabled when there are unsaved changes, shows save-as dialog, calls storage service, handles errors.
  - Auto-Save: toggle button that updates auto-save state in project service, reflects project service's auto-save state.
- Project service needs monitoring for changes to update button states.
# MarkdownCode > components > body > editor
- Editor component uses monaco editor npm package to display markdown text.
- Editor retrieves text from project service and applies theme, font, and font-size from theme service.
- Editor reloads text on 'content-changed' event from project service.
- Position-tracking service moves editor to specified line on 'moveTo' event.
- Component subscribes to theme service for changes and updates editor options.
- Component monitors various events on monaco editor: model content changes, focus, blur, cursor position changes, and cursor selection changes.
- Monaco editor always occupies all available space.
# MarkdownCode > components > body > results view
- Results-view component is positioned at the bottom of the main body, displaying results generated by registered transformers for the selected text block.
- Tabs at the top of the results view show each transformer's name and key.
- The tab content is a results-view-tab component.
- Selecting a tab executes `positionTrackingService.setActiveTransformer(transformer)`.
- On initialization, the first tab is selected and `positionTrackingService.setActiveTransformer(transformer)` is called for the correct transformer.
- Create a JSON structure for all tabs with fields: key, label, children.
- Assign the JSON structure to the items property.
# MarkdownCode > services > position-tracking service
The position-tracking service tracks the user's selected text-fragment and transformer. It keeps track of the selected line number, text-fragment, active transformer, and monitors changes in the selected text-fragment. It provides methods for setting the selected line, clearing the selection, setting the active fragment, and setting the active transformer. When setting the selected line, it retrieves the object at the line index and stores it as the new selected text-fragment if the new value is different. The clear method sets the active fragment and current line to null. The setActiveFragment method triggers a 'moveTo' event with the start line as the event data if the provided fragment is different from the currently active fragment. The setActiveTransformer method sets the provided transformer as the active transformer and triggers a 'change' event with the transformer as the event data if it is different from the currently active transformer.
# MarkdownCode > components > toolbar > home > build section
- The build-section component contains actions for the build-service, including buttons with icons and tooltips.
- Actions include rendering all code for the project, rendering code files for the active fragment, rendering the result for the active fragment and transformer, toggling the debug state, and continuing rendering to the next transformer.
- Button disabled values are stored in the state for updating from event handlers.
- Button states are initialized on load.
- Event handlers are registered to monitor changes in the project-service and position-tracking service, and unregistered on unload.
# MarkdownCode > services > build service
The build service processes text fragments using transformers. It builds the project by calling the `buildFragment` function for each fragment. The `buildFragment` function calls the `runTransformer` function for each transformer. The `runTransformer` function renders the result asynchronously. The debug property determines if the build service is in debug mode and is loaded and saved from local storage. The isBuilding property indicates if a build function is currently running.
# MarkdownCode > services > transformers > compress service
The compress service shortens a given text fragment and can be used for testing and input for other processes. It is based on the transformer-base service with constructor parameters: name, dependencies, and isJson. The build-message function takes a text fragment as input and returns a JSON array with two elements: one for the system role and one for the user role. The function also returns the text-fragment key as a separate array.
# MarkdownCode > services > transformer-base service
The transformer-base service is a base class for transformers, providing a common interface and functionality. Its constructor has parameters for the transformer's name, dependencies, JSON treatment, language, and temperature. It utilizes a result-cache-service to store results and track the build's status. The service includes functions for rendering results, retrieving values, and calculating maximum tokens.
