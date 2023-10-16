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
# MarkdownCode > components > body > outline
- The outline component is on the left side of the editor.
- It displays a tree structure representing the headings in the active project.
- The project data is retrieved from the project service and converted into a tree structure using the 'convertToTreeData' function when the component is loaded or when a new project is loaded.
- When a data item is removed or added/changed, the tree structure is updated accordingly.
- The position-tracking service is monitored for changes to the selected text-fragment, and the corresponding tree node is selected.
- The tree is displayed with lines.
- The 'convertToTreeData' function creates a tree structure based on the data items, setting the parent-child relationships based on the level count of each item.
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
# MarkdownCode > services > transformers > constant-extractor service
- The constant-extractor service extracts constant definitions from source code and stores them in a json file. It replaces the constants in the source texts with references to the json entries.
- It inherits from the transformer-base service and has a constructor with the parameters 'constants' (name) and an empty array (dependencies). The isJson parameter is set to true.
- To use the service, create a global instance of it.
- Register the global instance of the service as a transformer with the cybertron-service using the code `cybertronService.register(this, false)`.
- The service has the following functions:
  - extract-quotes: This function extracts all the locations in the text that contain quotes.
  - render-result: This function renders the result by extracting quotes from the text fragment, caching the result, and returning it.
  - get-result: This function retrieves an up-to-date result value for the specified key. It uses the cache if possible. If the result is not available in the cache, it renders the result and returns it.
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
- The GPT service is responsible for communicating with the OpenAI API backend and is primarily used by transformers for specific tasks.
- It uses the OpenAI Node.js library to communicate with the backend.
- The defaultModel field stores the default model to use during API calls. It can be set and retrieved using setDefaultModel and getDefaultModel methods. The defaultModel is loaded from localStorage during construction.
- The modelsMap field stores which model should be used for individual transformers and text fragments. It can be set and retrieved using setModelForTransformer, getModelForTransformer, setModelForFragment, and getModelForFragment methods.
- The sendRequest method allows other services or components to send an API request to OpenAI. It takes messages, transformerName, and fragmentKey as parameters and uses the createChatCompletion function to send the messages to OpenAI. The model parameter for createChatCompletion is determined based on the modelsMap dictionary.
- If the request fails, the service will retry 3 times before giving up and raising an error.
- The getModels method retrieves the list of available models using the OpenAI Node.js library. It only retrieves the list if a valid API key is available. If not, it shows a dialog message asking the user to provide a valid API key. The list is sorted and stored in a local variable for future use.
- The apiKey field stores the API key used to create the OpenAI object. It is loaded from localStorage during construction and can be updated using the setApiKey method. The OpenAI object is recreated with the new API key.
- The OpenAI library is only instantiated if a valid API key is provided.
# MarkdownCode > components > body > results view > results view context menu
- The results-view-context-menu is a component that wraps the Dropdown antd component.
- It requires the properties 'transformer' and 'key' to be provided.
- The dropdown's content consists of a 'more' button icon, and it is triggered by a click.
- The 'more' button is positioned as a floating button in the top-right corner of the parent, using absolute positioning with top: 0 and right: 16.
- The menu contains the following items:
  - "Model for all": Allows the selection of a GPT model to be used by the transformer.
    - The submenu items are provided by the gpt-service's list of available models, fetched from the internet.
    - The currently selected model is indicated as selected.
      - The value for the current model, registered for the current transformer, is obtained from the gpt-service using `gptService.getModelForFragment(transformer)`.
    - When a different model is selected, the gpt-service is asked to update the model name used for the transformer using `gptService.setModelForFragment(model, transformer)`.
  - "Model for fragment": Allows the selection of a GPT model to be used by the transformer for the current key.
    - The submenu items are provided by the gpt-service's list of available models.
    - The currently selected model is indicated as selected.
      - The value for the current model, registered under the name of the current transformer and key, is obtained from the gpt-service using `gptService.setModelForFragment(transformer, key)`.
    - When a different model is selected, the gpt-service is asked to update the model name of the transformer and the current title using `gptService.setModelForFragment(model, transformer, key)`.
  - A splitter.
  - "Refresh": When pressed, the transformer associated with the current tab recalculates the result.
# MarkdownCode > services > transformers > double-compress service
- The double-compress-service takes the result of compress-service and further shortens it.
- It is useful for testing if the system understands the fragment and can be used as input for other processes.
- This service inherits from the transformer-base service and has the following constructor parameters:
  - name: 'double compress'
  - dependencies: ['compress']
  - isJson: false

- The function build-message takes a text-fragment as input and returns a result (json array) and the key of the text-fragment.
- The result includes two roles: system and user.
- The system role contains the value of the constant resources.MarkdownCode_services_double-compress_service_0.
- The user role contains the result of `await compressService.getResult(text-fragment)`.
- The function then returns the result and the text-fragment key.
# MarkdownCode > services > all-spark service
- The All-Spark service is a global singleton responsible for creating and registering all transformers into the Cybertron service.
- Functions:
  - Load: Creates transformers and registers them with the Cybertron service.
    - Called during application construction.
    - Use `cybertronService.register(transformer, false)` to register, and `cybertronService.register(transformer, true)` to register as an entry point.
    - Register every transformer after construction to ensure it can be found by other transformers.
    - Transformers to create:
      - Compress service (entry point)
      - Constant-extractor service
      - Double-compress service
# MarkdownCode > services > project service > storage service
- The storage service is a global singleton responsible for reading and writing project data to and from storage.
- Functions:
  - clear(): clears all references to previously loaded data.
  - new(): sets up everything for a new project.
  - open(filePath): loads all data from disk.
  - loadModelsMap(filePath): loads the json file that defines the models for the project.
  - updateOutOfDate(): updates the list of out-of-date transformers for each text-fragment.
  - markDirty(): marks the project as dirty for auto-saving.
  - save(file): saves the project to disk.
  - saveModelsMap(file): saves the models map to a json file.
# MarkdownCode > services > line parser > line parser helpers
- The 'LineParserHelpers' module contains helper functions used by the line parser service.
- The 'getFragmentAt' function retrieves a fragment at a given index, taking into account any null fragments.
- The 'handleEmptyLine' function handles empty lines in the line parser service, ensuring that the fragments index is updated correctly.
- The 'updateFragmentTitle' function updates the title of a fragment, calculating a new key and dispatching a 'key-changed' event.
- The 'removeFragmentTitle' function removes the title of a fragment, either setting it to empty or merging it with the previous fragment.
- The 'insertFragment' function inserts a new fragment at a given index, adjusting the lines and updating the project's out-of-date status.
- The 'isInCode' function checks if a fragment is within a code block by counting the number of lines starting with '```'.
- The 'handleTitleLine' function handles title lines in the line parser service, creating new fragments or updating existing ones.
- The 'updateFragmentLines' function updates the lines of a fragment at a given index, adjusting the fragment's lines and the fragments index.
- The 'handleRegularLine' function handles regular lines in the line parser service, creating new fragments or updating existing ones.
- The 'deleteLine' function deletes a line at a given index, removing the line from the corresponding fragment if applicable.
# MarkdownCode > services > transformers > triple-compress service
- The triple-compress-service takes the output of the double-compress-service and reduces it to a single line.
- It is used as a description for each fragment when searching for linked components and services.
- The triple-compress-service is a subclass of the transformer-base service and has the following constructor parameters:
  - Name: 'triple compress'
  - Dependencies: ['double compress']
  - isJson: false
- During construction, the triple-compress-service sets `this.doubleCompressService` to the first element of the dependencies array.
- The function `build-message(text-fragment)` takes a text fragment as input and returns a result (in JSON array format) with the following roles and contents:
  - Role: system, Content: Condense the following text to one sentence.
  - Role: user, Content: `await this.doubleCompressService.getResult(text-fragment)`.
- The function also returns the result and the key of the text fragment.
# MarkdownCode > services > transformers > component-lister service
The component-lister service extracts component names from text and is used to determine which components need to be rendered. It inherits from the transformer-base service with the name 'triple compress' and dependencies on 'double compress'. The build-message function takes a text fragment as input and returns a JSON array with a system role and content, as well as a user role with the content being the result of calling the doubleCompressService on the text fragment. The function also returns the result and the key of the text fragment.
# MarkdownCode > services > project service
- The project service is a global singleton that manages various aspects of a project.
- It keeps track of a data list of currently loaded text fragments, stores the raw content, and tracks the filename of the project.
- It has a property called "isDirty" that raises an event when its value changes.
- The project service provides functions to work with text fragments, such as deleting, adding, and marking them as out of date.
- It also has functions to retrieve specific fragments and check if any fragment is marked as out of date.
- The project service uses an EventTarget field to dispatch events, allowing other objects to listen for and handle these events.
- It also keeps track of user configurations, such as auto-save settings.
- The project service raises various events, including when the content is changed, a fragment is deleted or inserted, a fragment is marked as out of date, the key of a fragment is changed, and when the project's dirty status changes.
# MarkdownCode > components > toolbar > home > file section
- The file-section component has actions for project and file management.
- All buttons have icons instead of text.
- Supported actions:
  - New Project: creates a new project
    - If there are unsaved changes in the loaded project, prompt to save first.
    - Call the storage service to create a new project.
  - Open: opens an existing project.
    - Show a dialog box to select a file.
    - If a file is selected, ask the storage service to open it.
    - Handle any errors with an error dialog.
  - Save: saves the current project to a file.
    - Enabled when the project has a filename and there are unsaved changes.
    - If the project doesn't have a filename, show a save-as dialog.
    - If the user provides a valid filename, call the storage service to save the project.
    - If the project already has a filename, call the storage service to save without specifying a filename.
    - Handle any errors with an error dialog.
  - Save As: saves the current project to a new location.
    - Enabled when there are unsaved changes.
    - Show a save-as dialog.
    - If the user selects a file, ask the storage service to save the project to the new location.
    - Handle any errors with an error dialog.
  - Auto-Save: a toggle button that updates the auto-save state in the project service when pressed.
    - The toggle button's state reflects the project service's auto-save state.
- The project service needs to be monitored for changes to update the button states.
# MarkdownCode > components > body > editor
- The editor component uses the monaco editor npm package to display markdown text.
- When the editor is loaded, it retrieves the text from the project service and applies the theme, font, and font-size from the theme service.
- The editor will reload the text whenever the project service triggers the 'content-changed' event.
- The position-tracking service will move the editor to the specified line when the 'moveTo' event is raised.
- The component subscribes to the theme service for changes and updates the editor options accordingly.
- The component monitors various events on the monaco editor, such as model content changes, focus, blur, cursor position changes, and cursor selection changes.
- The monaco editor always occupies all available space.
# MarkdownCode > components > body > results view
- Results-view component is positioned at the bottom of the main body.
- Users can view results generated by registered transformers for the selected text block.
- Tabs are placed at the top of the results view with a small size and tabBarStyle={{marginTop: 0}}.
- Each transformer in the transformers list creates a tab with the transformer name as the title and key.
- The tab content displays a results-view-tab component.
- When a tab is selected, `positionTrackingService.setActiveTransformer(transformer)` is executed.
- On initialization, the first tab is selected and `positionTrackingService.setActiveTransformer(transformer)` is called for the correct transformer.
- Create a JSON structure for all the tabs with fields: key, label, children.
- Assign the JSON structure to the items property.
# MarkdownCode > services > position-tracking service
- The position-tracking service is responsible for tracking the user's currently selected text-fragment and transformer.
- The service keeps track of the currently selected line number, the text-fragment related to the selected line, the currently active transformer, and events monitoring changes in the selected text-fragment.
- It provides methods for setting the currently selected line, clearing the selection, setting the active fragment, and setting the active transformer.
- When setting the currently selected line, the service checks if the new value is different from the current selected line index. If it is, it retrieves the object at the line-index position and stores it as the new currently selected text-fragment.
- The clear method sets the active fragment and current line to null.
- The setActiveFragment method checks if the provided fragment is different from the currently active fragment. If it is, it retrieves the start line of the fragment and triggers a 'moveTo' event with the start line as the event data.
- The setActiveTransformer method checks if the provided transformer is different from the currently active transformer. If it is, it sets the provided transformer as the active transformer and triggers a 'change' event with the transformer as the event data.
# MarkdownCode > components > toolbar > transformers > build section
- The build-section component contains actions for the build-service.
- Buttons have icons instead of text.
- Buttons have tooltips with detailed descriptions.
- Actions in the build-section component include:
  - "All" button: Renders all code for the project.
    - Disabled when no fragment is out of date.
    - Calls build-service.buildAll().
  - "Code for active fragment" button: Renders code files for the active fragment.
    - Disabled when the active fragment is not out of date.
    - Calls build-service.buildFragment() with the active fragment.
  - "Active fragment with active transformer" button: Renders the result for the active fragment and transformer.
    - Disabled when there is no active fragment or active transformer.
    - Calls build-service.runTransformer() with the active fragment and transformer.
  - Separator with vertical type and height of 24px.
  - "Debug" toggle button: Updates the debug state in the build-service.
    - The button's state follows the build-service's debug state.
  - "Run next" button: Continues rendering to the next transformer.
    - Disabled when debug is not enabled.
- Button disabled values are stored in the state for updating from event handlers.
- Button states are initialized on load.
- Event handlers are registered to monitor changes in the project-service and position-tracking service.
- Event handlers are unregistered on unload.
# MarkdownCode > services > build service
- The build service is a global singleton that processes text fragments in the project service using a set of transformers.
- To build the project, the service performs the following actions:
  - It calls the `buildFragment` function for each text fragment in the project service's data list.
- The `buildFragment` function calls the `runTransformer` function for every transformer in the cybertron service's list of entry points.
- The `runTransformer` function asks the transformer to render its result asynchronously.
- The debug property indicates if the build service is in debug mode or not. Its value is loaded from local storage upon creation and saved to local storage when updated.
- The isBuilding property indicates if one of the build functions is currently running or not.
# MarkdownCode > services > transformers > compress service
- The compress service shortens a given text fragment.
- It can be used to test if the system understands the fragment and as input for other processes.
- The compress service is based on the transformer-base service.
- The constructor parameters for the compress service are:
  - name: 'compress'
  - dependencies: ['constants']
  - isJson: false
- The build-message function takes a text fragment as input.
- It returns a result in the form of a JSON array.
- The result contains two elements:
  - The first element has the role "system" and its content is the value of the constant resources.MarkdownCode_services_transformers_compress_service_0.
  - The second element has the role "user" and its content is `text-fragment.lines.join('\n')`.
- The build-message function also returns the text-fragment key as a separate array.
# MarkdownCode > services > transformer-base service
- The transformer-base service is a base class for transformers, providing a common interface and functionality.
- The constructor of this service has several parameters:
  - "name" represents the name of the transformer.
  - "dependencies" is a list of transformer names. These names are replaced with the corresponding transformer objects from the cybertron-service's list. If a name is not found, an exception is raised.
  - "isJson" determines whether the result values should be treated as JSON structures or regular text.
  - "language" specifies the language in which the result data should be shown. If not provided, it defaults to 'markdown'.
  - "temperature" is the temperature to use for the llm requests, with a default value of 0.
- This service utilizes a result-cache-service (field: cache) to store results and track the build's status.
  - The constructor parameters for the result-cache-service are:
    - "transformer" set to "this".
    - "dependencies" set to "this.dependencies".
- The service includes the following functions:
  - "render-result(pseudo)" is used to render a result for a given text fragment.
  - "get-result(key)" retrieves an up-to-date result value for a specified key, utilizing the cache when possible.
  - "calculateMaxTokens(inputTokens)" calculates the maximum tokens for the llm to optimize speed and cost.
# MarkdownCode > components > body > fragment-status icon
- The fragment-status icon component displays the current status of a text-fragment object.
- Consumers of the component need to provide the following properties:
  - fragment: a reference to the text-fragment object
- The icon shown depends on the value of `fragment?.level`:
  - 1: LuHeading1
  - 2: LuHeading2
  - ...
  - 6 or more: LuHeading6
- The component includes a tooltip from the antd library that shows the status.
- The color of the icon is determined by:
  - green if `!fragment?.isOutOfDate` (fragment is up to date)
  - orange if `fragment?.isOutOfDate && fragment?.outOfDateTransformers?.length > 0` (fragment is not up to date for some transformers)
    - The tooltip displays the `name` of each transformer.
  - red if `fragment?.isOutOfDate && !(fragment?.outOfDateTransformers?.length > 0)` (fragment is not up to date for all transformers)
- The component registers an event handler with the project-service (prop: eventTarget) upon construction to handle the following events (unregisters when unloading):
  - `fragment-out-of-date`:
    - If `e.detail === fragment?.key`, the icon color and tooltip content are refreshed when the event is triggered.
  - `key-changed`:
    - If `e.detail?.key === fragment?.key`, the icon is refreshed based on the new value of `fragment?.level`.
# MarkdownCode > services > project service > project configuration service
- The project configuration service manages project configurations.
- It includes the following fields:
  - eventTarget: used to register/unregister event handlers for configuration changes.
  - config: a JSON object that grants full access to the entire configuration set.
# MarkdownCode > services > transformers > plugin-transformer service
- The plugin-transformer service wraps a JavaScript object provided by a plugin.
  - The plugin provides configuration information for the transformer.
  - The transformer requests the plugin to build the transformer's result and allows the plugin to override default behavior at various points.
- It inherits from the transformer-base service.
- The constructor takes a plugin object as a parameter, created by the plugin code that provides access to the necessary functions.
  - If the plugin does not have a `getDescription` function, an error is raised to indicate that the provided plugin is invalid and cannot be used as a transformer.
  - The plugin object is assigned to `this.plugin`.
  - The plugin's description is obtained using `plugin.getDescription()`.
    - If no description is provided, an exception is raised.
  - The transformer's description, dependencies, and JSON status are set based on the plugin's description.
  - If the plugin has a `setDependencies` function, it is called with the transformer's dependencies.
  - The plugin's services are assigned to `plugin.services`.
- The `calculateMaxTokens` function checks if the plugin has a `calculateMaxTokens` function.
  - If it does, the plugin's `calculateMaxTokens` function is called with the input tokens.
  - If not, the transformer's `calculateMaxTokens` function is called.
- The `buildMessage` function checks if the plugin has a `buildMessage` function.
  - If it does, the plugin's `buildMessage` function is called with the fragment.
  - If not, an error is raised.
- The `renderResult` function checks if the plugin has a `renderResult` function.
  - If it does, the plugin's `renderResult` function is called with the fragment.
  - If not, the transformer's `renderResult` function is called.
# MarkdownCode > components > toolbar > transformers
- The transformers-tab component arranges its children in a horizontal row.
- It includes the configuration section and the build section as child components.
# MarkdownCode > components > toolbar > transformers > transformers-configuration section
- The transformers-configuration section contains actions related to the available transformers in the application.
- All buttons have tooltips (from the antd library) with action descriptions.
- Actions in the section include:
  - Edit transformers: Opens a new window of the markdownCode editor in plugin-mode, using the specified project path. Calls the function `window.electron.openPluginEditor(folderService.plugins)`.
    - Disabled when `window.electron.isPluginMode == true`.
  - Active entry point: A dropdown list populated with the names of transformers found in `cybertronService.entryPoints`. The selected item in the dropdown list is from `cyberTronService.activeEntryPoint`. This field is updated whenever the selection changes in the dropdown list.
# MarkdownCode > services > transformers > plugin-renderer service
- The plugin-renderer service translates a plugin definition into a javascript module.
- It is used to build plugin transformers that can be loaded and used by the application.
- The plugin-renderer service inherits from the transformer-base service and has the following constructor parameters:
  - name: 'plugin renderer'
  - dependencies: ['constants']
  - isJson: false
- During construction, the plugin-renderer service sets `this.constantsService` to `this.dependencies[0]`.
- The plugin-renderer service has the following functions:
  - `saveFile(key, content)`: saves the content to a file with a specific file name and returns the file path.
  - `cleanResult(content)`: removes code block markdown from the content and returns the cleaned content.
  - `renderResult(fragment)`: builds a message using the fragment, sends a request to GPTService, cleans the result, saves it to a file, and returns the file path.
  - `buildMessage(fragment)`: builds a message using the fragment and returns the result and a list containing the fragment key.
# MarkdownCode > services > transformers > plugin-list renderer service
- The plugin-list renderer service generates a file that contains all the plugins that need to be loaded.
- It is used to inform the application about which files to load for the transformer-plugins.
- The plugin-list renderer service inherits from the transformer-base service, with the following constructor parameters:
  - Name: 'plugin-list renderer'
  - Dependencies: ['plugin renderer']
  - isJson: true
- During construction, the pluginRendererService is set as the first dependency.
- The plugin-list renderer service has two functions:
  - saveFile(items): This function saves the array to a file. It creates the output folder if it doesn't exist and writes the content to the "plugins.json" file.
  - renderResults(fragments): This function builds an array of files, one for each fragment, provided by the plugin-renderer service. It then saves the array to the output folder by calling the saveFile function.
