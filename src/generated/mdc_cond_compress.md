# MarkdownCode
- MarkdownCode is a machine learning-powered tool for ideation and software building.
- Users can input text in markdown format.
- The tool analyzes the text for different parameters.
- The text can be converted into executable software code.
# MarkdownCode > development stack
- Developed in JavaScript with Electron as the runtime
- Utilizes the Monaco Editor for text editing features
- UI is constructed with React and Ant Design (antd)
# MarkdownCode > components > main window
- The main window component is the initial window displayed when the application starts.
- It includes the following components:
  - Toolbar: positioned at the top of the window.
  - Body: occupies the remaining space in the window.
# MarkdownCode > components > toolbar > home > undo section
- The undo-section component holds actions for the undo/redo service.
- It supports the following actions:
  - Undo: A button to reverse the last action performed by the current project's undo-service.
    - Enabled when the project's undo-service has undo actions.
  - Redo: A button to repeat the last action performed by the project's undo-service.
    - Enabled when the undo-service has redo actions.
# MarkdownCode > services > Undo service
- The undo service records user text edits in different monaco-editors.
- It includes both an undo and redo list.
# MarkdownCode > components > toolbar > preferences
- The preferences-tab component is a wrapper that arranges its children in a row.
- This component includes the following child components (sections on the toolbar):
  - GPT
  - View
# MarkdownCode > components > toolbar > home
- The home-tab component is a wrapper that arranges its children in a row.
- The component includes the following child components:
  - File section
  - Edit section
  - Undo section
  - Build section
# MarkdownCode > components > toolbar > format
- The format-tab component is a wrapper that arranges its children in a row.
- Child components of the format-tab component include:
  - Style section
  - Paragraph section
  - Font section
# MarkdownCode > components > toolbar > format > paragraph section
- The paragraph-section component handles actions for applying markdown formatting to text.
- Buttons in the component use icons instead of text.
- Supported actions include:
  - Indent: Increases the indent of the current line or selection.
  - Unindent: Decreases the indent of the current line or selection.
# MarkdownCode > components > toolbar > format > font section
- The font-section component handles actions related to applying markdown formatting to text.
- Buttons in the component use icons instead of text.
- The state of the toggle buttons is updated whenever the text selection changes in the selection-service.
- The component supports the following actions:
  - Bold: A toggle button to enable or disable bold formatting on the selected text and display the current selection state.
  - Italic: A toggle button to enable or disable italic formatting on the selected text and display the current selection state.
  - Underline: A toggle button to enable or disable underline formatting on the selected text and display the current selection state.
  - Strike-through: A toggle button to enable or disable strike-through formatting on the selected text and display the current selection state.
# MarkdownCode > components > toolbar > format > style section
- The style-section component handles actions related to applying markdown formatting to text.
- Buttons in the component have icons as content, no text.
- The component has a list of buttons that assign different formatting styles to the selected text in the selection-service when pressed.
  - Only one button can be selected at a time, no option for no selection.
  - All buttons are arranged in a single row.
  - Available formatting styles: heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, paragraph, quote, code, bullet list, numbered list.
- The selection-service is monitored for changes in the selected text. When the selection changes, the toggle buttons update to reflect the style of the selected text. The selection-service provides a method to retrieve the style of the selected text.
# MarkdownCode > components > toolbar > preferences > open-ai configuration dialog
- The open-ai configuration dialog is a modal dialog used to edit the open-ai configuration settings.
- The dialog has a title with a short description at the top.
- It includes an input box for the user to enter their api-key, which will be used for api-calls with the open-ai platform.
  - When the dialog opens, the current api-key value is retrieved from the gpt-service and displayed in the input box.
- At the bottom of the dialog, there are two buttons:
  - "Cancel" to close the dialog without saving the value.
  - "OK" to close the dialog and save the new api-key value to the gpt-service.
# MarkdownCode > components > toolbar > preferences > view section
- The view-section component handles actions related to configuring the appearance of the application.
- All buttons have icons as content, with no text.
- It supports the following actions:
  - Theme: A combobox where the user can choose between light or dark mode. This value is linked to the theme-service, which manages the currently selected theme.
  - Font: A combobox for selecting the font of the markdown text. This value is also linked to the theme-service.
  - Font size: A combobox for selecting the font size of the markdown text. This value is also linked to the theme-service.
# MarkdownCode > components > toolbar > preferences > GPT section
- GPT-section component handles GPT service configuration actions.
- Buttons in the component have icon content, no text.
- GPT-section component tracks the open state of the 'open-ai configuration dialog'.
- Supported actions:
  - Key button: Opens the 'open-ai configuration dialog'.
    - Icon: Key.
  - Model: ModelComboBox component (Select in antd) allows user to select default model for open-ai requests.
    - Available models for the combobox are fetched from gpt-service.
    - Initial value for the combobox is obtained from gpt-service using getDefaultModel function.
    - When value is changed, it is saved to gpt-service using setDefaultModel function.
# MarkdownCode > services > Theme service
- The theme service manages the currently selected theme font and font-size globally.
- It saves the new values to local storage when the selected theme, font, or font-size is changed.
- The service retrieves the previously stored values from local storage when it is created.
- The service allows for the selection of a light or dark theme.
- Every component uses the theme service to retrieve the currently selected theme and apply it.
- Components do not need to subscribe for changes to the selected theme value.
- The main window refreshes its content when the selected theme is updated.
# MarkdownCode > services > Selection service
- The selection service is a global object that tracks the currently selected text.
- It also keeps track of the active editor from the monaco editor npm package.
- The service can be monitored for selection changes.
- Supported actions include:
  - Cut: Requests the monaco editor to cut the selected text to the clipboard.
  - Copy: Requests the monaco editor to copy the selected text to the clipboard.
  - Paste: Requests the monaco editor to paste the clipboard content at the current cursor position.
  - Delete: Requests the monaco editor to delete the selected text.
  - Clear selection: Requests the monaco editor to clear the current selection.
  - Select all: Requests the monaco editor to select all the text.
# MarkdownCode > components > body > results view > results view context menu
- The results-view-context-menu is a component that wraps the Dropdown antd component.
- It requires the properties 'transformer' and 'key' to be provided.
- The dropdown's content consists of a 'more' button icon, and it is triggered by a click.
- The 'more' button is positioned as a floating button in the top-right corner of its parent, with a margin of 16px.
- The menu contains the following items:
  - "Model for all": Allows selection of the GPT model to be used by the transformer.
    - The submenu items are provided by the GPT service's list of available models, fetched from the internet.
    - The currently selected model is indicated as selected.
      - The value for the current model, registered under the name of the current transformer, is obtained from the GPT service.
    - When a different model is selected, the GPT service is asked to update the model name for the transformer related to the results-view.
  - "Model for fragment": Allows selection of the GPT model to be used by the transformer for the current key.
    - The submenu items are provided by the GPT service's list of available models.
    - The currently selected model is indicated as selected.
      - The value for the current model, registered under the name of the current transformer and key, is obtained from the GPT service.
    - When a different model is selected, the GPT service is asked to update the model name for the transformer and the current title.
  - A splitter
  - "Refresh": When pressed, the transformer associated with the current tab recalculates the result.
# MarkdownCode > services > folder service
- The folder service is a global singleton that manages the location of the currently active project.
- It has the following properties:
  - folder: the root folder of the project
  - project-name: the name of the active project (default is 'new project' if not provided)
  - project-file: the project file path (folder + project name + '.json')
  - cache: the cache folder path (folder + '\cache')
  - project-config: the configuration file path (folder + project name + '_config.json')
- It can perform the following actions:
  - clear: creates a temporary folder, sets it as the folder value, creates a temporary name, creates the cache folder
  - move to (new project file): moves the current project and related files to the new location
  - copy (new project file): saves the current project to a new location
  - set location (location): stores the new folder and project name
# MarkdownCode > services > cybertron service
- Cybertron-service is a global singleton that manages available transformers.
- The service maintains a sub-list of entry-points, which are transformers used as starting points for building text-fragments.
- Transformers register themselves, adding them to the list. An additional parameter determines if they should be added as entry-points.
- Transformers can unregister themselves, removing them from the available transformers and entry-points list.
# MarkdownCode > services > transformer-base service
- The transformer-base service is a base class for transformers, providing a common interface and functionality.
- The constructor of this service takes in the name of the transformer and a list of transformer names as dependencies. It replaces each name in the list with the corresponding object from the list of transformers. If a name cannot be found, an exception is raised with the necessary information. The list of objects is stored as 'dependencies'.
- This service utilizes a result-cache-service (field: cache) to store all the results and keep track of when the build becomes outdated. The constructor parameters for the result-cache-service are the transformer name (this.name) and the dependencies (this.dependencies).
- The render-result function (pseudo code) takes in a text fragment and performs the following steps:
  - Calls the buildMessage function to generate a message and a list of keys.
  - Sends a request to the GPT-service with the transformer name, text fragment key, and the generated message.
  - Joins the list of keys with a separator and sets the result in the cache using the joined keys as the key and the received result.
# MarkdownCode > services > compress service
- The compress service shortens a given text fragment.
- It can be used to test if the system understands the fragment and as input for other processes.
- The compress service is a subclass of the transformer-base service.
- The constructor parameters for the compress service are:
  - name: 'compress'
  - dependencies: []
- During application startup, an instance of the compress service is created and registered as an entry-point transformer using `cybertron-service.register(this, true)`.
- The `build-message` function takes a text fragment as input.
- It returns a JSON array called `result` with the following elements:
  - role: system, content: the value of the constant `resources.MarkdownCode_services_compress_service_0`
  - role: user, content: the joined lines of the `text-fragment`
- The function also returns `[ text-fragment.key ]`
# MarkdownCode > services > build service
- The build service is a single instance that handles all the text fragments in the project service. It utilizes a group of transformers to generate conversions on the text fragments.
- To build the project, the service follows these steps:
  - For each text fragment in the project service's data list:
    - For every transformer in the entry points list of the cybertron service:
      - Request the transformer to asynchronously render its result (renderResult).
# MarkdownCode > components > body > outline
- The outline component is on the left side of the editor.
- It displays a tree structure representing the headings in the active project.
- The project data is retrieved from the project service and converted into a tree structure using the 'convertToTreeData' function when the component is loaded or when a new project is loaded.
- When a data item is removed or added/changed, the tree structure is updated accordingly.
- The position-tracking service is monitored for changes to the selected text-fragment, and the corresponding tree node is selected.
- The tree is displayed with lines.
- The 'convertToTreeData' function creates a tree structure based on the data items, setting the parent-child relationships based on the level count of each item.
# MarkdownCode > services > position-tracking service
- The position-tracking service is responsible for tracking the text-fragment that the user is currently working on.
- It keeps track of the currently selected line number and the text-fragment related to that line.
- The service also stores events that monitor changes in the currently selected text-fragment.
- The service provides methods to set the currently selected line and to clear the active fragment and current line.
# MarkdownCode > components > toolbar
- The application has a toolbar with a similar design to applications like MS Access, Excel, Word, or Draw.
- The toolbar consists of a single integrated menu and toolbar.
- The toolbar has tabs at the top, which are taken from the antd library.
- Each component on the toolbar displays a tooltip from the antd library, providing a brief description of the action.
- The available tabs are: Home (shown as the first tab when the application starts), Format, and Preferences.
- A JSON structure should be created for all the tabs, including fields for key, label, and children.
- The JSON structure should be assigned to the items property.
# MarkdownCode > services > build-stack service
- The build-stack service prevents circular references in the build process.
- It uses a dictionary called "running" to keep track of the currently running textframe - transformer pairs.
- The "tryRegister" function checks if a pair is already running and returns false if it is, otherwise it adds the pair to the "running" dictionary and returns true.
- The "unRegister" function removes a pair from the "running" dictionary.
# MarkdownCode > services > constant-extractor service
- The constant-extractor service extracts constant definitions from source code and stores them in a json file. It replaces the constants in the source texts with references to the json entries.
- It inherits from the transformer-base service and has a constructor with the parameters 'constants' (name) and an empty array (dependencies). The isJson parameter is set to true.
- To use the service, create a global instance of it.
- Register the global instance of the service as a transformer with the cybertron-service using the code `cybertronService.register(this, false)`.
- The service has the following functions:
  - extract-quotes: This function extracts all the locations in the text that contain quotes.
  - render-result: This function renders the result by extracting quotes from the text fragment, caching the result, and returning it.
  - get-result: This function retrieves an up-to-date result value for the specified key. It uses the cache if possible. If the result is not available in the cache, it renders the result and returns it.
# MarkdownCode > components > toolbar > home > file section
- The file-section component manages project and file actions.
- Buttons in the component use icons instead of text.
- Supported actions include:
  - New Project: creates a new project, prompts to save if changes are present, and calls `storageService.new()`.
  - Open: opens an existing project, prompts to select a file, and calls `storageService.load()` with the selected file.
  - Save: saves the current project to a file, prompts to save as if no filename is present, and calls `storageService.save()` with the filename.
  - Save As: saves the current project to a new location, prompts to select a file, and calls `storageService.save()` with the new location.
  - Auto-save: a toggle button that updates the auto-save state in the project service.
- The buttons' states are updated based on changes in the undo service.
# MarkdownCode > services > project service > storage service
- The storage service is a global singleton responsible for reading and writing project data to and from storage.
- Functions:
  - clear(): clears all references to previously loaded data.
  - new(): sets up everything for a new project.
  - open(filePath): loads all data from disk.
  - updateOutOfDate(): updates the list of out-of-date transformers for each text-fragment.
  - markDirty(): marks the project as dirty for auto-saving.
  - save(file): saves the project to disk.
- Note: The fs module should be loaded remotely through Electron.
# MarkdownCode > components > toolbar > home > build section
- The build-section component has actions for the build-service.
- Buttons have icons instead of text.
- Actions include:
  - "All" button: renders all code for the project.
    - Disabled when no fragment is out of date.
    - Calls build-service.buildAll().
  - "Code for active fragment" button: renders code files for the active fragment.
    - Disabled when active fragment is not out of date.
    - Calls build-service.buildFragment(activeFragment).
  - "Active fragment with active transformer" button: renders result for active fragment and transformer.
    - Disabled when active fragment or transformer is not out of date.
    - Calls build-service.runTransformer(activeFragment, activeTransformer).
  - Separator.
  - "Debug" toggle button: updates debug state in build-service.
    - State follows build-service's debug state.
  - "Run next" button: continues rendering to the next transformer.
    - Disabled when not in debug mode.
- Store disabled values of buttons in state for updating from event handlers.
- Initialize button states on load.
- Register event handlers for changes in project-service and position-tracking service.
- Unregister event handlers on unload.
# MarkdownCode > components > body > editor
- The editor component uses the monaco editor npm package to display markdown text.
- When the editor is loaded, it retrieves the text from the project service and applies the theme, font, and font-size from the theme service.
- The editor will reload the text whenever the project service triggers the 'content-changed' event.
- The monaco editor monitors several events:
  - onDidChangeModelContent: it asks the change-processor-service to process the changes.
  - onDidFocusEditorWidget: it stores a reference to the monaco editor in the selection service.
  - onDidBlurEditorWidget: it removes the reference to the monaco editor from the selection service.
  - onDidChangeCursorPosition: it updates the position-tracking service with the new cursor position.
  - onDidChangeCursorSelection: it informs the subscribers of the selection-service that the selection has changed.
- The monaco editor always occupies all available space.
# MarkdownCode > services > result-cache service
- This service manages cached results for transformers.
- Transformers can store results for text fragments and track if the results are out of date.
- The cache can monitor changes in both project fragments and result fragments.
- Transformers use this service to cache their results.
- The cache uses a dictionary to store the results.
- The cache saves the results in a JSON file.
- The cache is updated whenever a transformer calculates a result.
- The cache file name is specified by the transformer.
- The cache file location is provided by the folder-service.cache.
- The cache file contains the primary dictionary, secondary dictionary, overwritten values, and last save date.
- The cache tries to load the JSON file during construction and clears the cache if the file doesn't exist.
- The result-cache-service initializes the 'is-dirty' flag and registers event handlers with the project service and input transformers.
- When a fragment is changed or deleted, the cache service updates the cache and sets the 'is-dirty' flag.
- The cache has functions to overwrite and retrieve results for a key.
- The cache has a function to check if a text fragment is out of date.
- The cache can be cleared using the clearCache() function.
- The cache has functions to handle fragment deletion and key changes.
- The setResult function stores the result in the cache and updates the 'is-dirty' flag.
- The isOutOfDate function checks if a key is marked as still-valid in the cache.
# MarkdownCode > components > body > results view > results view tab
- The results-view-tab component displays the results of a transformer for a specific text fragment identified by its key.
- The monaco editor npm package is used to display the results in markdown, JSON data, JavaScript, HTML, or CSS.
- The monaco editor fills the available width and height of the component.
- When the results-view-tab is loaded:
  - The text for the monaco editor is retrieved from the result-cache of the assigned transformer using the current key.
  - The theme (light or dark), font, and font-size are retrieved from the theme-service and applied to the monaco editor.
- The results-cache of the transformer is monitored for changes in the result with the current key.
  - If the result is marked as 'out-of-date' or 'deleted', the text is shown as grayed-out.
  - If the result is marked as 'overwritten', the text is shown in red.
- When the user changes the text in the monaco editor, the new text is saved to the result-cache of the transformer as overwritten.
- The following events are monitored on the monaco editor:
  - onDidFocusEditorWidget: The monaco editor is stored in the selection service and the position-tracking-service is set to the active transformer.
  - onDidBlurEditorWidget: If the selection service references this monaco editor, the editor reference is set to null.
  - onDidChangeCursorSelection: If the selection service references this monaco editor, the subscribers of the selection-service are notified of the selection change.
- A results-view-context-menu component is placed on top of the monaco editor.
- The component monitors the position-tracking service for changes to the currently selected text-fragment.
  - When this changes, the key value is updated and the text is retrieved from the result-cache and shown in the monaco editor.
# MarkdownCode > components > toolbar > home > edit section
- The edit-section component has actions related to clipboard and selected data.
- Buttons in the component use icons instead of text.
- Supported actions include:
  - Cut: initiates the cut command of the selection service. Enabled when there is selected data.
  - Copy: initiates the copy command of the selection service. Enabled when there is selected data.
  - Paste: initiates the paste command of the selection service. Enabled when there is text data in the clipboard. Uses the BiPaste icon from react-icons. Retrieves the data to be pasted using `clipboard.readText()`.
  - Delete: initiates the delete command of the selection service. Enabled when there is selected data.
  - Select all: selects all text in the active window.
  - Clear selection: clears the current selection buffer. Enabled when there is selected data.
- To check if the clipboard contains text data:
  - Use the clipboard imported from electron.
  - Call `clipboard.has('text/plain')` when the component is loaded or when the ipcRenderer emits the 'focused' event.
# MarkdownCode > services > project service
- The project service is a global singleton that manages data related to text fragments in a project.
  - It keeps track of the currently loaded text fragments, stores the raw content displayed to the user, and the filename of the project.
  - It provides functions to work with the text fragments:
    - deleteTextFragment: removes a text fragment from the list and raises an event.
    - addTextFragment: adds a text fragment to the list at a specified position and raises an event.
    - markOutOfDate: marks a fragment as out of date and raises an event.
    - getFragment: searches for a fragment with a specified key and returns it.
    - tryAddToOutOfDate: adds a transformer to a fragment if it is not already out of date, or adds it to the list of transformers if it is partially out of date.
    - isAnyFragmentOutOfDate: returns true if any fragment is marked as out of date.
- The project service also stores user configurations, such as the auto-save setting.
- It uses an EventTarget field to dispatch events, allowing other objects to listen for and handle these events.
- It raises events for various actions, such as when the project is loaded or created, when a fragment is deleted or inserted, when a fragment is marked as out of date, and when the key of a fragment is changed externally.
# MarkdownCode > components > body
- The main body of the application is represented by the body component.
- The @geoffcox/react-splitter library's Split component is used.
- The entire area of the body component is filled with a Split component.
  - The initial size of the primary split is set to the value of verticalSplitSize in the state.
  - The minimum size of the primary split is set to '50px'.
  - The minimum size of the secondary split is set to '15%'.
  - The children of the body component are an outline component and a Split component.
    - The initial size of the primary split in the Split component is set to the value of horizontalSplitSize in the state.
    - The minimum size of the primary split is set to '50px'.
    - The minimum size of the secondary split is set to '15%'.
    - The Split component is set to be horizontal.
    - The children of the Split component are an editor component and a results view component.
- The body component has an event handler for the 'onSplitChanged' callback of both the horizontal and vertical split. It stores the new position value (as a percentage) in the state (verticalSplitSize / horizontalSplitSize).
- When the body component is unloaded, the last position of the horizontal and vertical splitters are stored in the local storage.
- When the body component is loaded, the last position of the horizontal and vertical splitters are restored from the local storage. If no value is found, the default value of '30%' is used.
# MarkdownCode > services > dialog service
- The dialog service is a global singleton that provides a common interface for displaying dialog boxes.
- The service can show dialog boxes for errors, warnings, and information.
- All user-triggered actions or functions in a component should have proper error handling. If an error occurs, an electron dialog box should be shown to the user with error details.
- Functions:
  - showErrorDialog(param1, param2): Shows an error dialog box with the title and content specified in the parameters.
  - showSaveDialog(): Shows a save dialog box with filters for markdown and any file types.
  - showOpenDialog(): Shows an open dialog box with filters for markdown and any file types.
# MarkdownCode > components > body > results view
- Results-view component is positioned at the bottom of the main body.
- Users can view results generated by registered transformers from the cybertron-service for the selected text block.
- Each transformer in the transformers list creates a tab in the view.
  - Tabs are located at the top of the view.
  - The transformer name is used as the title and key of the tab.
  - The tab content displays a results-view-tab component.
- Create a JSON structure for all the tabs with fields: key, label, and children.
- Assign the JSON structure to the items property.
# MarkdownCode > services > line parser
- The line-parser service is a global singleton object that parses markdown lines and updates the text-fragments stored in the project-service.
- It has:
  - fragmentIndex: an empty array that stores text-fragment objects.
  - createTextFragment: a function that creates new text-fragments. It takes a line and an index as input.
    - Trims and converts the line to lowercase.
    - Counts the number of '#' at the beginning of the line to determine the depth-level of the text-fragment.
    - Removes the '#' from the line and assigns it as the title of the text-fragment.
    - Calculates the key for the text-fragment and stores it.
    - Sets the 'out-of-date' flag to true.
    - Initializes empty arrays for the 'lines' and 'outOfDateTransformers' fields.
    - Asks the project-service to add the text-fragment to its list.
  - calculateKey: calculates the key of a text-fragment. It takes a text-fragment and an index position as input.
    - Sets the current depth to the depth-level of the text-fragment.
    - Sets the result value to the title of the text-fragment.
    - Loops from the given index position until 0.
    - Compares the depth-level of the previous text-fragment with the current depth.
    - If the previous depth-level is smaller, updates the current depth and prepends the title of the previous text-fragment to the result.
    - Stops the loop if the new current depth is 1.
  - clear: clears the fragmentsIndex list.
  - Pseudo code for the parse function and related:
    ```python (pseudo)

      def parse(line, index):
        if line == '':
          handleEmptyLine(this, index)
        elif line.startsWith('#'):
          handleTitleLine(this, line, index)
        else:
          handleRegularLine(this, line, index)

      def insertLine(line, index):
        fragmentsIndex.insert(index, null)
        parse(line, index)

      def deleteLine(index):
        deleteLine(index)
        del fragmentsIndex[index]
    ```
# MarkdownCode > services > all-spark service
- The all-spark service is a global singleton that creates and registers transformers into the cybertron service.
- Functions:
  - Load: Creates transformers and registers them with the cybertron service.
    - Called during application construction.
    - To register, use `cybertronService.register(transformer, false)`. To register as an entry point, use `cybertronService.register(transformer, true)`.
    - Transformers to create:
      - Compress service (entry point)
      - Constant-extractor service
# MarkdownCode > services > line parser > line parser helpers
- The 'LineParserHelpers' module contains helper functions used by the line parser service.
- The 'getFragmentAt' function retrieves a fragment at a given index.
- The 'handleEmptyLine' function handles an empty line by adding or updating fragments.
- The 'updateFragmentTitle' function updates the title of a fragment.
- The 'removeFragmentTitle' function removes the title of a fragment and updates the index.
- The 'insertFragment' function inserts a new fragment at a given index.
- The 'handleTitleLine' function handles a line with a title by creating or updating fragments.
- The 'updateFragmentLines' function updates the lines of a fragment.
- The 'handleRegularLine' function handles a regular line by creating or updating fragments.
- The 'deleteLine' function deletes a line from a fragment.
# MarkdownCode > services > project service > change-processor service
- The change-processor service ensures that the project structure stays synchronized with the source by processing changes in the project content.
- Functions:
  - `process(changes, full)`: Updates the project service when the user makes edits. Here's a simplified version of the code:
    - Set the project service content to the editor's value.
    - Get the editor's model.
    - Iterate through each change in the changes list.
    - Split the change's text into lines.
    - Set the current line to the start line number of the change.
    - Set the line end to the end line number of the change.
    - Set the line index to 0.
    - Replace overwritten lines by parsing the line content and incrementing the line and index.
    - Delete or insert lines based on the remaining lines and increment the line and index accordingly.
    - Mark the storage service as dirty.
# MarkdownCode > services > gpt service
- GPT service communicates with the open-ai api backend and is used by transformers for specific tasks.
- The service uses the openai node.js library for communication.
- sendRequest function accepts a list of json objects containing role and content fields, and sends them to openai using createChatCompletion function. It retries 3 times if the request fails.
- getModels method retrieves the list of available models using the openai nodejs library. It only retrieves the list if a valid key is available, otherwise it asks the user for a valid key once. The retrieved list is stored in a local variable.
- apiKey stores the api key and is loaded from localStorage during service construction.
- setApiKey updates the api key, saves it to localStorage, recreates the openAI object, and resets the error flag.
- OpenAI library is instantiated only if a valid apiKey is provided.
