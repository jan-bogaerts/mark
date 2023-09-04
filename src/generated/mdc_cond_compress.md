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
# MarkdownCode > components > toolbar > home > file section
- The file-section component handles project and file management actions.
- Supported actions include:
  - New Project: Creates a new project. If there are unsaved changes in the current project, prompts the user to save first and clears the project data.
  - Open: Opens an existing project. Displays a dialog box to select a file. If a file is selected, loads the project using the project service. Includes an error handler to display any errors.
  - Save: Saves the current project to a file. Enabled when the project has a filename and there are unsaved changes. If the project does not have a filename, prompts the user to save as. Includes an error handler to display any errors.
  - Save As: Saves the current project to a new location. Enabled when there are unsaved changes. Displays an electron save-as dialog to select a file. If a file is selected, saves the project to the new location using the project service. Includes an error handler to display any errors.
  - Auto-Save: A toggle button that updates the auto-save state of the project service. The state of the toggle button follows the auto-save state of the project service.
# MarkdownCode > components > toolbar > home > edit section
- The edit-section component handles actions related to the clipboard and selected data.
- It supports the following actions:
  - Cut: Initiates the cut command of the selection service. Enabled when there is selected data.
  - Copy: Initiates the copy command of the selection service. Enabled when there is selected data.
  - Paste: Initiates the paste command of the selection service. Enabled when there is text data in the clipboard.
  - Delete: Initiates the delete command of the selection service. Enabled when there is selected data.
  - Select All: Selects all text in the active window.
  - Clear Selection: Clears the current selection buffer. Enabled when there is selected data.
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
# MarkdownCode > services > dialog service
- The dialog service is a shared interface for displaying dialog boxes in other components and services.
- It supports dialog boxes for errors, warnings, and information.
- All user-triggered actions or functions in a component should be wrapped in an error handler. If an error occurs, an electron dialog box will be shown to the user, providing details about the error.
# MarkdownCode > components > toolbar
- The application has a toolbar with a similar design to applications like MS Access, Excel, Word, or Draw.
- The toolbar consists of a single integrated menu and toolbar.
- At the top of the toolbar, there are multiple tabs, which are implemented using the tabs from the antd library.
- Each component on the toolbar displays a tooltip from the antd library, providing a brief description of the action.
- The available tabs on the toolbar are: Home (shown as the first tab when the application starts), Format, and Preferences.
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
# MarkdownCode > components > body > horizontal splitter
- The horizontal splitter manages the layout of 2 child components, allowing users to resize the panels above and below it.
- The horizontal-splitter component has the following properties:
  - top: the component placed at the top
  - bottom: the component placed at the bottom
  - position: the height assigned to the bottom component
  - onPositionChanged: a callback function called when the position value needs to be updated. It takes one parameter: the new value for position (number)
- The splitter includes a div component of 8 pixels height between the top and bottom components. When the user drags this bar, the onPositionChanged callback is triggered (if provided) with the new position value.
# MarkdownCode > components > body > vertical splitter
- The vertical splitter manages the layout of two child components, allowing users to adjust the width of the left panel while simultaneously changing the size of the right panel.
- The vertical-splitter component has the following properties:
  - left: the component placed on the left side
  - right: the component placed on the right side
  - position: the width assigned to the left component
  - onPositionChanged: a callback function that updates the position value. It takes one parameter: the new position value (number)
- The splitter includes a div component of 8 pixels width between the left and right components. When the user drags this bar, the onPositionChanged callback is triggered (if provided) with the new position value.
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
# MarkdownCode > components > body > editor
- The editor component uses the monaco editor npm package to display markdown text.
- The text for the editor is retrieved from the project service.
- The theme, font, and font-size are retrieved from the theme-service and applied to the editor.
- The project service is monitored for changes to the text.
- When the user changes the text in the editor, it is saved to the project service.
- The editor is monitored for various events:
  - onDidFocusEditorWidget: the editor reference is stored in the selection service.
  - onDidBlurEditorWidget: if the selection service currently references this editor, the editor reference is set to null.
  - onDidChangeCursorPosition: if the selection service currently references this editor, the position-tracking service is updated with the new cursor position.
  - onDidChangeCursorSelection: if the selection service currently references this editor, the subscribers of the selection-service are informed of the selection change.
- The editor always occupies all available space.
# MarkdownCode > components > body > results view
- Results-view component is at the bottom of the main body.
- Users can see results generated by registered transformers from the gpt-service for the selected text block.
- Each transformer in the list creates a tab in the view.
  - Tabs are located at the top left of the view.
  - The transformer name is the tab title.
  - The tab content displays a results-view-tab component.
# MarkdownCode > components > body > results view > results view tab
- The results-view-tab component displays the results of a transformer for a specific text fragment identified by its key.
- The monaco editor npm package is used to display the results in markdown, json data, javascript, html, or css.
- The monaco editor fills the available width and height of the component.
- When the results-view-tab is loaded:
  - The text for the monaco editor is retrieved from the result-cache of the assigned transformer using the current key, if available.
  - The theme (light or dark), font, and font-size are retrieved from the theme-service and applied to the monaco editor.
- The results-cache of the transformer is monitored for changes in the result with the current key.
  - If the result is marked as out-of-date, the text is shown as grayed-out.
  - If the result is marked as 'overwritten', the text is shown in red.
- When the user changes the text in the monaco editor, the new text is saved to the result-cache of the transformer and marked as overwritten.
- The following events are monitored on the monaco editor:
  - onDidFocusEditorWidget: The monaco editor reference is stored in the selection service.
  - onDidBlurEditorWidget: If the selection service currently references this monaco editor, the editor reference is set to null.
  - onDidChangeCursorSelection: If the selection service currently references this monaco editor, the subscribers of the selection-service are notified of the selection change.
- A results-view-context-menu component is placed on top of the monaco editor.
- The component monitors the position-tracking service for changes to the currently selected text fragment.
  - When this changes, the key value is updated and the text is retrieved from the result-cache and shown in the monaco editor.
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
# MarkdownCode > services > position-tracking service
- The position-tracking service is responsible for tracking the text-fragment that the user is working on.
- The service keeps track of:
  - the currently selected line number
  - the text-fragment related to the currently selected line
  - an eventTarget that stores events monitoring changes in the selected text-fragment
- It provides the following methods:
  - set currently selected line
    - if the new value is different from the current selected line index:
      - get the object at the line-index position from the line-parser service
      - if this object is different from the currently selected text-fragment, store it as the new selected text-fragment and trigger the on-changed event for all registered event handlers.
# MarkdownCode > components > toolbar > home > build section
- The build-section component contains actions for the build-service.
- Buttons have icons instead of text.
- Actions include:
  - "All" button: Renders code for the entire project.
    - Enabled when any transformer in the GPT-service's list has an out-of-date or missing result fragment in the result-cache.
  - "Code for active topic" button: Renders code files for the currently active fragment.
    - Enabled when the selected fragment is out-of-date or missing in any transformer's result-cache in the GPT-service's list.
  - "Active topic in active prompt" button: Renders the selected fragment in the currently selected service.
    - Enabled when the selected fragment is out-of-date or missing in the related service.
# MarkdownCode > components > body
- The body component is the main part of the application.
- It contains a horizontal splitter that divides its area.
- On the left side of the horizontal splitter is an outline component.
- On the right side is a vertical splitter.
- The vertical splitter has an editor component at the top and a results view component at the bottom.
- The body component has event handlers for the 'onPositionChanged' callback of both the horizontal and vertical splitters.
- These event handlers store the new position values.
- When the body component is unloaded, the last positions of the splitters are stored in local storage.
- When the body component is loaded:
  - The last positions of the splitters are restored from local storage.
  - The clientWidth and clientHeight of the component are retrieved.
  - If there is no previous value for the vertical splitter or the value is larger than the clientWidth, the value 'clientWidth / 4' is used instead.
  - If there is no previous value for the horizontal splitter or the value is larger than the clientHeight, the value 'clientHeight / 4' is used instead.
# MarkdownCode > components > body > outline
- The outline component is on the left side of the editor.
- It displays a tree structure representing the headings in the active project.
- When the component is loaded or a new project is loaded, the project data is retrieved from the project service and converted into a tree structure using the 'convertToTreeData' function.
- If a data item is removed, the corresponding node is removed from the tree.
- If a data item is added or changed, the tree structure is rebuilt.
- When a tree item is selected, the key of the selected item is assigned to the position-tracking service's activeFragment.
- The component monitors changes to the selected text-fragment and updates the tree accordingly.
- The tree is displayed with lines.
- The 'convertToTreeData' function creates a tree structure based on the data items, setting the parent node and adding child nodes based on the level count of each item.
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
# MarkdownCode > services > line parser
- The line-parser service is a global singleton object used to parse markdown lines and update the text-fragments stored in the project-service.
- The line-parser service maintains an array of text-fragment objects called fragmentsIndex, which is initially empty.
- The line-parser has a function for creating new text-fragments (json objects) based on the input line:
  - Trim and convert the line to lowercase.
  - Determine the depth-level of the text-fragment based on the number of '#' characters at the beginning of the line.
  - Remove the '#' characters from the line and assign the result to the title value of the text-fragment.
  - Calculate the key for the text-fragment and store it.
  - Set the 'out-of-date' flag to true.
  - Initialize an empty array for the 'lines' field.
  - Ask the project-service to add the text-fragment to its list of text-fragments.
- The line-parser has a function to calculate the key of a text-fragment, which takes a text-fragment and an index position as input:
  - Set the current depth to the depth-level of the text-fragment.
  - Set the result value to the title of the text-fragment.
  - Loop from the given index position to 0 using the field idx:
    - Get the previous text-fragment at position 'idx' from the project-service.
    - If the depth-level of the previous text-fragment is smaller than the current depth:
      - Update the current depth.
      - Prepend the title of the previous text-fragment followed by ' > ' to the result.
      - If the new current depth is 1, stop the loop.
- Pseudo code for the parse function and related:
  ```python (pseudo)
    def parse(line, index):
      if line == '':
        lineParserHelpers.handleEmptyLine(index)
      elif line.startsWith('#'):
        lineParserHelpers.handleTitleLine(line, index)
      else:
        lineParserHelpers.handleRegularLine(line, index)
  ```
# MarkdownCode > services > line parser > line parser helpers
The 'LineParserHelpers' module contains helper functions described in pseudo code:

- `getFragmentAt(service, index)`: Retrieves the fragment at the specified index, handling cases where the fragment is null or the index is empty.
- `handleEmptyLine(service, index)`: Handles empty lines by checking if the fragments index is empty or contains null values, and adds null values to the index if necessary. If a fragment is found at the index, it updates the fragment's lines accordingly.
- `updateFragmentTitle(service, fragment, line, fragmentPrjIndex)`: Updates the title of a fragment by calculating its depth and replacing the '#' characters with an empty string. It also emits an event when the fragment's key changes.
- `removeFragmentTitle(service, fragment, index)`: Removes the title of a fragment by inserting the line at the beginning of the fragment's lines. If the previous fragment is null, it sets the title to empty. Otherwise, it copies all the lines from the current fragment to the previous fragment and updates the index accordingly.
- `insertFragment(service, fragment, fragmentStart, line, fragmentPrjIndex, index)`: Inserts a new fragment at the specified index by creating a new text fragment and adjusting the lines and index accordingly.
- `handleTitleLine(service, line, index)`: Handles title lines by checking if the fragments index is empty or null at the specified index. If it is, it creates a new text fragment and adds it to the index. Otherwise, it updates the title of the fragment at the index or inserts a new fragment if the index is different from the fragment's start.
- `updateFragmentLines(service, fragment, index, fragmentStart)`: Updates the lines of a fragment at the specified index by replacing an existing line or adding a new line if the index is greater than the fragment's line length.
- `handleRegularLine(service, line, index)`: Handles regular lines by creating a new fragment if there is no fragment at the index or in front of it. If the fragment's start is equal to the index, it removes the fragment's title. Otherwise, it updates the fragment's lines.
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
# MarkdownCode > services > result-cache service
- This service manages cached results for transformers.
- Transformers can store their results for each text fragment and track if the result has become out of date.
- The cache can monitor changes in both project fragments and result fragments.
- Transformers use an instance of this class to cache their results.
- The cache uses a dictionary to map keys to results.
- When a transformer calculates a result, it asks the cache to update its dictionary:
  - The key is calculated based on the project text fragment and any additional result values from other transformers.
  - If the key is not present, a new cache item is created with the result and marked as still valid.
  - If the key is already present, the cache item is retrieved and its result is updated to still valid.
  - The cache also updates a secondary dictionary to track the relationships between text fragment titles and dictionary entries.
- The cache stores the results in a JSON file specified by the transformer.
- The cache registers event handlers to monitor changes in text fragments and input objects.
- When triggered, the cache checks the secondary dictionary for entries and marks them as out of date.
- The cache can overwrite results for a key and retrieve results for a key.
- The cache can determine if a text fragment is out of date.
- The cache has a function to retrieve all results related to a specific fragment.
# MarkdownCode > services > gpt service
- GPT service is a global singleton responsible for communicating with the open-ai api backend, mainly used by transformers for specific tasks.
- It utilizes the openai node.js library to interact with the backend.
- The service offers a function for other services or components to make api requests to open-ai.
  - This function accepts a list of json objects called `messages`, containing `role` and `content` fields.
  - The `messages` list is sent to openai using the `createChatCompletion` function.
  - In case of failure, the service retries the request 3 times before raising an error.
- Additionally, the service provides a method to retrieve the available models list, utilizing the openai nodejs library.
# MarkdownCode > services > build service
- The build service is a single instance that converts a list of markdown project data into source code.
- It utilizes transformers to generate conversions on different text frames, starting from the original markdown code and ending with source code files stored on disk.
- To build the project, the service performs the following actions:
  - For each text fragment in the project's data list:
    - For every transformer in the entry points list of the cybertron service:
      - Asynchronously request the transformer to render its result.
# MarkdownCode > services > project service
- The project service is responsible for creating and opening projects, saving projects, updating project data, and managing user configurations.
- When creating a new project, the project service clears all data from the project's data list, clears the folder service, asks the GPT service to empty its cache, and raises an event to indicate data changes.
- When opening an existing project, the project service sets the folder location, reads the file contents, parses each line, reloads the data file for registered transformers, and raises an event for data changes.
- When saving a project, the project service moves or copies the file, opens it for writing, converts parsed objects to a string, writes to the file, resets the project change indicator, and saves the filename for auto-save.
- When the user makes changes in the markdown editor, the project service updates the data list and any related links.
- The project service manages a data list and provides functions to work with it, such as retrieving a tree structure for the outline or drop-down boxes.
- The project service also tracks user configurations, such as auto-save settings stored in local storage.
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
