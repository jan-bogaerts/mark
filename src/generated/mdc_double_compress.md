# MarkdownCode
MarkdownCode is a machine learning tool for ideation and software building. Users input markdown text, which is analyzed for parameters and converted into executable code.
# MarkdownCode > development stack
- Built with JavaScript and Electron
- Uses Monaco Editor for text editing
- UI made with React and Ant Design (antd)
# MarkdownCode > components > main window
The main window is the first window shown when the app starts. It has a toolbar at the top and the rest of the space is the body.
# MarkdownCode > components > toolbar
The app has a toolbar like mS Access, Excel, Word, or Draw, with a single menu and toolbar. It has multiple tabs at the top, including Home, Format, and Preferences. Each component on the toolbar has a tooltip for a brief description.
# MarkdownCode > components > toolbar > home > file section
The file-section component manages project and file actions. Actions include creating a new project, opening an existing project, saving the current project, saving the current project to a new location, and toggling the auto-save state. Error handlers are included to display any errors.
# MarkdownCode > components > toolbar > home > edit section
The edit-section component handles clipboard and selected data actions. It supports cut, copy, paste, delete, select all, and clear selection. These actions are enabled based on the presence of selected data or text in the clipboard.
# MarkdownCode > components > toolbar > home > undo section
The undo-section component has actions for the undo/redo service. It supports undo and redo buttons that are enabled based on the project's undo-service actions.
# MarkdownCode > services > Undo service
The undo service records user text edits in monaco-editors and includes both undo and redo lists.
# MarkdownCode > services > dialog service
The dialog service is a shared interface for displaying dialog boxes in other components and services, supporting errors, warnings, and information. User-triggered actions in a component should be wrapped in an error handler to show an electron dialog box with error details if needed.
# MarkdownCode > components > toolbar > preferences
The preferences-tab component arranges its children in a row and includes the GPT and View sections on the toolbar.
# MarkdownCode > components > toolbar > home
The home-tab component arranges its children in a row and includes the following child components: File, Edit, Undo, and Build sections.
# MarkdownCode > components > body > horizontal splitter
The horizontal splitter manages the layout of 2 child components, allowing users to resize the panels above and below it. It has properties for the top and bottom components, the position of the bottom component, and a callback function for when the position value needs to be updated. The splitter includes a div component for dragging and triggering the callback.
# MarkdownCode > components > body > vertical splitter
The vertical splitter manages the layout of two child components, allowing users to adjust the width of the left panel while changing the size of the right panel. It has properties for the left and right components, position, and onPositionChanged callback. The splitter includes a div component for dragging and triggering the onPositionChanged callback.
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
# MarkdownCode > components > body > editor
- Editor component uses monaco editor npm package to display markdown text.
- Text for editor is retrieved from project service.
- Theme, font, and font-size retrieved from theme-service and applied to editor.
- Project service monitored for text changes.
- User changes in editor saved to project service.
- Editor monitored for events:
  - onDidFocusEditorWidget: editor reference stored in selection service.
  - onDidBlurEditorWidget: if selection service references this editor, editor reference set to null.
  - onDidChangeCursorPosition: if selection service references this editor, position-tracking service updated with new cursor position.
  - onDidChangeCursorSelection: if selection service references this editor, subscribers of selection-service informed of selection change.
- Editor always occupies all available space.
# MarkdownCode > components > body > results view
- Results-view component is at the bottom of the main body, showing results from registered transformers.
- Each transformer creates a tab at the top left of the view, displaying a results-view-tab component.
# MarkdownCode > components > body > results view > results view tab
The results-view-tab component displays the results of a transformer for a specific text fragment. It uses the monaco editor npm package to display the results in various formats. The editor fills the available space and is styled based on the theme-service. The results-cache is monitored for changes and the text is shown accordingly. User changes in the editor are saved and marked as overwritten. The monaco editor events are monitored and the selection service is updated accordingly. A results-view-context-menu component is placed on top of the editor. It monitors the position-tracking service for changes and updates the key and text in the editor.
# MarkdownCode > services > Theme service
The theme service globally manages the selected theme font and font-size, saving changes to local storage. It retrieves stored values on creation and allows for light or dark theme selection. Components use the service to apply the selected theme without needing to subscribe for changes. The main window refreshes content when the theme is updated.
# MarkdownCode > services > Selection service
The selection service tracks selected text and the active editor. It can be monitored for changes. Supported actions include cut, copy, paste, delete, clear selection, and select all.
# MarkdownCode > services > position-tracking service
The position-tracking service tracks the user's selected text-fragment. It keeps track of the selected line number, the related text-fragment, and an eventTarget for monitoring changes. It provides a method to set the currently selected line, which retrieves the object at that line index from the line-parser service. If the object is different from the currently selected text-fragment, it is stored as the new selected text-fragment and triggers the on-changed event for registered event handlers.
# MarkdownCode > components > toolbar > home > build section
- The build-section component has build-service actions.
- Buttons use icons instead of text.
- Actions:
  - "All" button: Renders code for the entire project.
    - Enabled when any transformer in GPT-service's list has an out-of-date or missing result fragment in the result-cache.
  - "Code for active topic" button: Renders code files for the active fragment.
    - Enabled when the selected fragment is out-of-date or missing in any transformer's result-cache in GPT-service's list.
  - "Active topic in active prompt" button: Renders selected fragment in the selected service.
    - Enabled when the selected fragment is out-of-date or missing in the related service.
# MarkdownCode > components > body
The body component is the main part of the application, containing a horizontal splitter that divides its area. On the left side is an outline component, and on the right side is a vertical splitter. The vertical splitter has an editor component at the top and a results view component at the bottom. The body component has event handlers for the 'onPositionChanged' callback of both splitters, storing the new position values. When unloaded, the last splitter positions are stored in local storage. When loaded, the last positions are restored from local storage. The clientWidth and clientHeight of the component are retrieved. If there is no previous value for the vertical splitter or it is larger than the clientWidth, 'clientWidth / 4' is used. If there is no previous value for the horizontal splitter or it is larger than the clientHeight, 'clientHeight / 4' is used.
# MarkdownCode > components > body > outline
- The outline component is on the left side of the editor and displays a tree structure of headings.
- Project data is retrieved from the project service and converted into a tree structure using 'convertToTreeData'.
- Removing a data item removes the corresponding node from the tree.
- Adding or changing a data item rebuilds the tree structure.
- Selecting a tree item assigns its key to the activeFragment in the position-tracking service.
- The component updates the tree based on changes to the selected text-fragment.
- The tree is displayed with lines.
- 'convertToTreeData' creates a tree structure with parent and child nodes based on item levels.
# MarkdownCode > components > body > results view > results view context menu
The results-view-context-menu is a component that wraps the Dropdown antd component. It requires the properties 'transformer' and 'key' to be provided. The dropdown's content consists of a 'more' button icon, positioned in the top-right corner of its parent with a margin of 16px. The menu contains options for selecting the GPT model to be used by the transformer. The submenu items are fetched from the GPT service's list of available models. The currently selected model is indicated as selected. When a different model is selected, the GPT service is asked to update the model name for the transformer. There is also an option to refresh the result by pressing a button.
# MarkdownCode > services > line parser
The line-parser service is a global singleton object that parses markdown lines and updates text-fragments in the project-service. It maintains an array called fragmentsIndex. It creates new text-fragments based on input lines, calculating their depth-level and key. It also has a function to calculate the key of a text-fragment. The parse function handles different types of lines.
# MarkdownCode > services > line parser > line parser helpers
'LineParserHelpers' module contains functions for handling fragments in text:

- `getFragmentAt(service, index)`: Retrieves the fragment at the specified index, handling null or empty cases.
- `handleEmptyLine(service, index)`: Handles empty lines by checking and adding null values if necessary. Updates fragment's lines if a fragment is found at the index.
- `updateFragmentTitle(service, fragment, line, fragmentPrjIndex)`: Updates fragment's title by calculating depth and replacing '#' characters. Emits event when fragment's key changes.
- `removeFragmentTitle(service, fragment, index)`: Removes fragment's title by inserting line at the beginning. Copies lines to previous fragment if it exists.
- `insertFragment(service, fragment, fragmentStart, line, fragmentPrjIndex, index)`: Inserts new fragment at index by creating a new text fragment and adjusting lines and index.
- `handleTitleLine(service, line, index)`: Handles title lines by creating a new fragment or updating existing fragment's title.
- `updateFragmentLines(service, fragment, index, fragmentStart)`: Updates fragment's lines at index by replacing or adding lines.
- `handleRegularLine(service, line, index)`: Handles regular lines by creating a new fragment or updating existing fragment's lines.
# MarkdownCode > services > folder service
The folder service is a global singleton that manages the location of the active project. It has properties for the root folder, project name, project file path, cache folder path, and project configuration file path. It can perform actions to clear, move, copy, and set the project location.
# MarkdownCode > services > result-cache service
- This service manages cached results for transformers, allowing them to store and track the validity of their results for each text fragment.
- The cache can monitor changes in both project and result fragments.
- Transformers use this class to cache their results, using a dictionary to map keys to results.
- When a transformer calculates a result, it updates the cache's dictionary based on the key calculated from the project text fragment and other result values.
- The cache also updates a secondary dictionary to track relationships between text fragment titles and dictionary entries.
- The cache stores results in a JSON file specified by the transformer.
- Event handlers are registered to monitor changes in text fragments and input objects.
- When triggered, the cache marks entries in the secondary dictionary as out of date.
- The cache can overwrite and retrieve results for a key, as well as determine if a text fragment is out of date.
- A function is available to retrieve all results related to a specific fragment.
# MarkdownCode > services > gpt service
- GPT service is a global singleton that communicates with the open-ai api backend for specific tasks.
- It uses the openai node.js library to interact with the backend.
- The service has a function for making api requests to open-ai, which accepts a list of json objects called `messages` with `role` and `content` fields.
- The `messages` list is sent to openai using the `createChatCompletion` function.
- If the request fails, the service retries it 3 times before raising an error.
- The service also provides a method to retrieve the available models list using the openai nodejs library.
# MarkdownCode > services > build service
The build service converts markdown project data into source code using transformers. It performs actions for each text fragment in the project's data list by requesting transformers to render their results asynchronously.
# MarkdownCode > services > project service
The project service creates, opens, saves, updates, and manages projects. When creating a project, it clears data, folder service, GPT cache, and raises an event. When opening a project, it sets location, reads file contents, reloads data, and raises an event. When saving a project, it moves/copies the file, writes data, resets indicator, and saves filename. It updates data and links when changes are made in the markdown editor. It manages a data list and provides functions for the outline and drop-down boxes. It tracks user configurations like auto-save settings.
# MarkdownCode > services > cybertron service
- Cybertron-service globally manages transformers.
- It maintains a sub-list of entry-points for building text-fragments.
- Transformers register and can be added as entry-points.
- Transformers can unregister and be removed from the available transformers and entry-points list.
# MarkdownCode > services > transformer-base service
The transformer-base service is a base class for transformers, providing a common interface and functionality. Its constructor takes in the transformer name and a list of dependencies, replacing each name with the corresponding object from the list of transformers. If a name is not found, an exception is raised. The service uses a result-cache-service to store results and track when the build becomes outdated. The render-result function generates a message and a list of keys, sends a request to the GPT-service with the transformer name, text fragment key, and the message, and sets the result in the cache using the joined keys as the key and the received result.
# MarkdownCode > services > compress service
The compress service shortens text fragments and can be used for testing and other processes. It is a subclass of the transformer-base service. The constructor parameters are name and dependencies. During startup, an instance of the compress service is created and registered. The build-message function takes a text fragment as input and returns a JSON array called result with system and user roles. It also returns the text fragment key.
