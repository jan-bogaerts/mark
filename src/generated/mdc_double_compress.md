# MarkdownCode
MarkdownCode is a machine learning tool for ideation and software building. Users input markdown text, which is analyzed for parameters and converted into executable code.
# MarkdownCode > development stack
- Built with JavaScript and Electron
- Uses Monaco Editor for text editing
- UI made with React and Ant Design (antd)
# MarkdownCode > components > main window
The main window is the first window shown when the app starts. It has a toolbar at the top and the rest of the space is the body.
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
# MarkdownCode > services > Theme service
The theme service globally manages the selected theme font and font-size, saving changes to local storage. It retrieves stored values on creation and allows for light or dark theme selection. Components use the service to apply the selected theme without needing to subscribe for changes. The main window refreshes content when the theme is updated.
# MarkdownCode > services > Selection service
The selection service tracks selected text and the active editor. It can be monitored for changes. Supported actions include cut, copy, paste, delete, clear selection, and select all.
# MarkdownCode > components > body
The body component is the main part of the application, containing a horizontal splitter that divides its area. On the left side is an outline component, and on the right side is a vertical splitter. The vertical splitter has an editor component at the top and a results view component at the bottom. The body component has event handlers for the 'onPositionChanged' callback of both splitters, storing the new position values. When unloaded, the last splitter positions are stored in local storage. When loaded, the last positions are restored from local storage. The clientWidth and clientHeight of the component are retrieved. If there is no previous value for the vertical splitter or it is larger than the clientWidth, 'clientWidth / 4' is used. If there is no previous value for the horizontal splitter or it is larger than the clientHeight, 'clientHeight / 4' is used.
# MarkdownCode > components > body > results view > results view context menu
The results-view-context-menu is a component that wraps the Dropdown antd component. It requires the properties 'transformer' and 'key' to be provided. The dropdown's content consists of a 'more' button icon, positioned in the top-right corner of its parent with a margin of 16px. The menu contains options for selecting the GPT model to be used by the transformer. The submenu items are fetched from the GPT service's list of available models. The currently selected model is indicated as selected. When a different model is selected, the GPT service is asked to update the model name for the transformer. There is also an option to refresh the result by pressing a button.
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
# MarkdownCode > services > gpt service
- GPT service is a global singleton that communicates with the open-ai api backend for specific tasks.
- It uses the openai node.js library to interact with the backend.
- The service has a function for making api requests to open-ai, which accepts a list of json objects called `messages` with `role` and `content` fields.
- The `messages` list is sent to openai using the `createChatCompletion` function.
- If the request fails, the service retries it 3 times before raising an error.
- The service also provides a method to retrieve the available models list using the openai nodejs library.
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
# MarkdownCode > components > body > editor
The editor uses the monaco editor npm package to display markdown text. It retrieves text from the project service and applies theme, font, and font-size from the theme-service. It reloads text when the project service triggers the 'content-changed' event. The monaco editor monitors events for content changes, focus, blur, cursor position, and cursor selection. It always occupies all available space.
# MarkdownCode > components > body > outline
- The outline component is on the left side and displays a tree structure of headings in the active project.
- Project data is retrieved from the project service and converted into a tree structure using 'convertToTreeData' when the component is loaded or when a new project is loaded.
- The tree structure is updated when data items are added/changed or removed.
- The position-tracking service selects the corresponding tree node when the selected text-fragment changes.
- The tree is displayed with lines.
- 'convertToTreeData' creates a tree structure based on data items and sets parent-child relationships based on the level count.
# MarkdownCode > services > line parser
The line-parser service is a global singleton object that parses markdown lines and updates text-fragments in the project-service. It has functions to create text-fragments, calculate keys, and clear the fragmentsIndex list. The parse function and pseudo code demonstrate its usage for different line types.
# MarkdownCode > components > body > results view > results view tab
The results-view-tab component displays transformer results for a specific text fragment. It uses the monaco editor npm package to display results in various formats. The editor adjusts to the component's size. When loaded, the component retrieves text from the result-cache and applies theme settings. The cache is monitored for changes, and text is displayed accordingly. User changes are saved to the cache. The monaco editor events are monitored and the selection service is used. A results-view-context-menu component is placed on top of the editor and tracks selected text changes.
# MarkdownCode > components > body > results view
- Results-view component is located at the bottom of the main body, displaying results from registered transformers for the selected text block.
- Each transformer in the list has a tab at the top left of the view, showing the transformer's name.
- The tab content contains a results-view-tab component.
# MarkdownCode > services > project service
The project service creates, opens, and saves projects. It clears data, reloads cache, and raises events when creating or opening a project. It moves or copies files, writes content, and saves filenames when saving a project. It processes data changes in the markdown editor and marks projects as dirty. It manages a data list of text fragments and provides functions for deletion, addition, and marking as out of date. It stores user configs in local storage. It uses events to notify others of changes.
# MarkdownCode > services > result-cache service
- This service manages cached results for transformers, storing and tracking results for text fragments.
- The cache monitors changes in both project and result fragments.
- Transformers use this class to cache their results, stored in a dictionary.
- Results are saved in a JSON file specified by the transformer, loaded during construction.
- Event handlers are registered to monitor changes in text fragments.
- When a fragment changes, the cache marks related entries as out of date.
- The cache can overwrite and retrieve results for a key.
- It can determine if a text fragment is out of date and clear the cache.
- It can retrieve all results related to a fragment.
- Event handlers are present for fragment deletion and key changes.
- Results are stored in a dictionary, updating the 'is-dirty' flag when modified.
# MarkdownCode > components > toolbar > home > file section
The file-section component manages project and file actions using icon buttons. Supported actions include creating a new project, opening an existing project with error handling, saving the current project with error handling, saving the current project to a new location with error handling, and toggling the auto-save state. The buttons' state is updated based on changes in the undo service.
# MarkdownCode > services > position-tracking service
The position-tracking service tracks the user's current text-fragment, including the selected line number and related text. It also stores events monitoring changes in the selected text-fragment. The service offers methods to set the selected line and clear the active fragment and current line.
# MarkdownCode > components > toolbar
- The application's toolbar has a similar design to MS Access, Excel, Word, or Draw.
- It consists of a single integrated menu and toolbar with tabs at the top.
- Each component on the toolbar displays a tooltip with a brief description.
- The available tabs are Home, Format, and Preferences.
- A JSON structure should be created for all tabs, including key, label, and children fields.
- The JSON structure should be assigned to the items property.
# MarkdownCode > components > toolbar > home > build section
- The build-section component has actions for the build-service.
- Buttons have icons instead of text.
- Actions include:
  - "All" button for rendering code for the entire project.
    - Disabled when project-service.isAnyFragmentOutOfDate() is false.
  - "Code for active fragment" button for rendering code files for the currently active fragment.
    - Disabled when `!positionTrackingService.activeFragment.isOutOfDate`.
  - "Active fragment with active transformer" button.
    - Disabled when `positionTrackingService.activeFragment && positionTrackingService.activeTransformer && !positionTrackingService.activeFragment.isOutOfDate || !positionTrackingService.activeTransformer.cache.isOutOfDate(positionTrackingService.activeFragment.key)`.
  - Separator.
  - "Debug" toggle button to update the debug state.
    - The toggle button's state follows the build-service's debug state.
  - "Run next" button to continue rendering to the next transformer.
    - Disabled when `!debug`.
