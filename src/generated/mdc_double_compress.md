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

# MarkdownCode > services > project service
The project service creates and manages projects by clearing data, recreating cache objects, and notifying components of data changes. It opens existing projects by reading and parsing files, recreating cache objects, and notifying the project editor. It saves projects by writing parsed objects to a file, resetting the change indicator, and enabling auto-save. It updates the data list when the user makes changes in the markdown editor. It manages user configurations such as auto-save settings and code style for rendering source code.
# MarkdownCode > services > Undo service
The undo service records user text edits in monaco-editors and includes both undo and redo lists.
# MarkdownCode > services > gpt service
- Responsible for communication with open-ai api backend, primarily for other services.
- Uses openai node.js library for communication.
- Provides function for sending api requests to open-ai.
  - Function accepts list of json objects with `role` and `content` fields.
  - Sends list to openai using `createChatCompletion` function.
  - Retries request 3 times before raising error.
- Provides method to retrieve list of available models using openai nodejs library.
- Manages list of available services.
  - Services can register and unregister.
  - Registered services should provide name and `get-result` function.
# MarkdownCode > services > build service
- Uses gpt-services to convert markdown project data into source code
- Generates conversions on multiple text frames
- Transforms original markdown code into source code files
- Utilizes compress service to render results for each text-fragment in the project
# MarkdownCode > services > compress service
The compress service uses the gpt service to shorten a text fragment. The get-result function calls the GPT-service with specific parameters, including a system message and the content of the text fragment. This service is useful for checking if the gpt service understands the fragment and can be used for other processes. It utilizes a result-cache-service to store and track results, updating the result-cache whenever the get-result function is called. The gpt-interface for this service is named "compress".
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
# MarkdownCode > components > body > results view > results view context menu
The results-view-context-menu is a component that wraps the Dropdown antd component. It requires the properties 'transformer' and 'key' to be provided. The dropdown displays a 'more' button icon and is triggered by a click. It is positioned in the top-right corner with a 16px margin. The menu items include "Model for all" and "Model for fragment" which allow selection of the GPT model to be used by the transformer. The submenu items are provided by the GPT service's list of available models and the currently selected model is highlighted. When a different model is selected, the GPT service is asked to update the model name for the transformer. There is also a "Refresh" option that recalculates the result when pressed.
# MarkdownCode > services > Theme service
The theme service globally manages the selected theme font and font-size, saving changes to local storage. It retrieves stored values on creation and allows for light or dark theme selection. Components use the service to apply the selected theme without needing to subscribe for changes. The main window refreshes content when the theme is updated.
# MarkdownCode > services > Selection service
The selection service tracks selected text and the active editor. It can be monitored for changes. Supported actions include cut, copy, paste, delete, clear selection, and select all.
# MarkdownCode > services > line parser
The line-parser service parses markdown lines and updates text-fragments in the project-service. It has an empty array called fragmentsIndex to store text-fragment objects. It can create new text-fragments by trimming and converting the line to lowercase, determining the depth-level based on the number of '#' at the beginning of the line, removing the '#' and assigning it as the title, calculating the key, and setting the 'out-of-date' flag to true. It can also calculate the key of a text-fragment by looping through the fragmentsIndex array. The parse function accepts a string and line index, and handles different scenarios such as filling the fragmentsIndex array, finding the index of the first occurrence, calculating the index value of the line, creating/updating text-fragments, and appending lines.
# MarkdownCode > services > position-tracking service
The position-tracking service tracks the user's selected text-fragment. It keeps track of the selected line number, the related text-fragment, and an eventTarget for monitoring changes. It provides a method to set the currently selected line, which retrieves the object at that line index from the line-parser service. If the object is different from the currently selected text-fragment, it is stored as the new selected text-fragment and triggers the on-changed event for registered event handlers.
# MarkdownCode > services > result-cache service
This service manages cached results for transformers, which store and track calculation results on text fragments. The cache monitors changes in project and result fragments. Transformers use this class to cache results using a dictionary. The cache creates cache-item objects with results if the key is not present, or updates the result if the key is already present. The cache also maintains a secondary dictionary to track relationships between text-fragment titles and dictionary entries. Results are stored in a JSON file specified by the transformer, which includes the primary and secondary dictionaries, overwritten values, and last save date. The cache registers event handlers to monitor changes and marks entries in the secondary dictionary as out-of-date. It can overwrite and retrieve results for specific keys and determine if a text fragment is out-of-date based on the key.

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
