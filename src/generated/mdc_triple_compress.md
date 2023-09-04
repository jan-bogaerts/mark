# MarkdownCode
MarkdownCode is a machine learning tool that analyzes and converts markdown text into executable code for ideation and software building.
# MarkdownCode > development stack
The application is built using JavaScript and Electron, with Monaco Editor for text editing and a UI created using React and Ant Design (antd).
# MarkdownCode > components > main window
The main window of the app is displayed upon startup, featuring a top toolbar and a body section.
# MarkdownCode > components > toolbar
The app features a toolbar with multiple tabs, including Home, Format, and Preferences, and each component on the toolbar has a tooltip for a brief description.
# MarkdownCode > components > toolbar > home > file section
The file-section component handles project and file actions, such as creating, opening, saving, saving to a new location, and toggling auto-save, and includes error handlers for displaying errors.
# MarkdownCode > components > toolbar > home > edit section
The edit-section component enables cut, copy, paste, delete, select all, and clear selection actions based on the presence of selected data or text in the clipboard.
# MarkdownCode > components > toolbar > home > undo section
The undo-section component enables undo and redo buttons based on the project's undo-service actions.
# MarkdownCode > services > Undo service
The undo service in monaco-editors records user text edits and includes both undo and redo lists.
# MarkdownCode > services > dialog service
The dialog service is a shared interface for displaying dialog boxes in other components and services, including error handling and electron dialog box support.
# MarkdownCode > components > toolbar > preferences
The preferences-tab component organizes its children in a row and includes the GPT and View sections on the toolbar.
# MarkdownCode > components > toolbar > home
The home-tab component arranges its children in a row and includes the File, Edit, Undo, and Build sections.
# MarkdownCode > components > body > horizontal splitter
The horizontal splitter is a component that handles the layout of two child components, enabling users to resize the panels above and below it, and it includes properties for the top and bottom components, the position of the bottom component, and a callback function for updating the position value, as well as a div component for dragging and triggering the callback.
# MarkdownCode > components > body > vertical splitter
The vertical splitter is a component that allows users to adjust the width of the left panel and change the size of the right panel, and it includes properties for the left and right components, position, and onPositionChanged callback, as well as a div component for dragging and triggering the callback.
# MarkdownCode > components > toolbar > format
The format-tab component organizes its children, such as the Style, Paragraph, and Font sections, in a row.
# MarkdownCode > components > toolbar > format > paragraph section
The paragraph-section component uses icon buttons to apply markdown formatting to text, allowing for actions such as indenting and unindenting lines or selections.
# MarkdownCode > components > toolbar > format > font section
The font-section component applies markdown formatting to text and supports actions such as bold, italic, underline, and strike-through, while using icons instead of text for buttons and updating toggle buttons based on text selection changes in the selection-service.
# MarkdownCode > components > toolbar > format > style section
The style-section component applies markdown formatting to text using buttons with icons, allowing users to select different formatting styles for the selected text in the selection-service, with the buttons arranged in a single row and updating to reflect the style of the selected text when the selection changes.
# MarkdownCode > components > toolbar > preferences > open-ai configuration dialog
The open-ai configuration dialog allows users to edit settings, including the title, description, and api-key input box, with the current api-key being retrieved and displayed, and "Cancel" and "OK" buttons provided at the bottom.
# MarkdownCode > components > toolbar > preferences > view section
The view-section component configures the app's appearance, including buttons with icon-only content, theme, font, and font size selection, all linked to the theme-service.
# MarkdownCode > components > toolbar > preferences > GPT section
The GPT-section component configures GPT service actions, including opening the 'open-ai configuration dialog' using the key button, selecting a default model for open-ai requests using the ModelComboBox component, and saving the changed value to the gpt-service.
# MarkdownCode > components > body > editor
The editor component uses the Monaco Editor npm package to display markdown text, retrieves the text from the project service, applies the theme, font, and font-size from the theme service, monitors the project service for text changes, saves user changes in the editor to the project service, and monitors various events in the editor such as focus, blur, cursor position change, and cursor selection change, with the editor always occupying all available space.
# MarkdownCode > components > body > results view
The results-view component is located at the bottom of the main body and displays results from registered transformers, with each transformer having a corresponding tab at the top left of the view.
# MarkdownCode > components > body > results view > results view tab
The results-view-tab component displays the results of a transformer for a specific text fragment using the monaco editor npm package, which fills the available space, is styled based on the theme-service, and monitors the results-cache for changes, while the user changes in the editor are saved and marked as overwritten, the monaco editor events are monitored and the selection service is updated accordingly, and a results-view-context-menu component is placed on top of the editor to monitor the position-tracking service for changes and update the key and text in the editor.
# MarkdownCode > services > Theme service
The theme service globally manages the selected theme font and font-size, saving changes to local storage, allowing for light or dark theme selection, and refreshing the main window's content when the theme is updated.
# MarkdownCode > services > Selection service
The selection service tracks and monitors selected text and the active editor, supporting actions such as cut, copy, paste, delete, clear selection, and select all.
# MarkdownCode > services > position-tracking service
The position-tracking service tracks the user's selected text-fragment, including the line number, related text-fragment, and eventTarget, and provides a method to set the currently selected line, triggering the on-changed event if the object is different from the currently selected text-fragment.
# MarkdownCode > components > toolbar > home > build section
The build-section component has build-service actions, including buttons with icons instead of text, such as the "All" button that renders code for the entire project when any transformer in GPT-service's list has an out-of-date or missing result fragment in the result-cache, the "Code for active topic" button that renders code files for the active fragment when the selected fragment is out-of-date or missing in any transformer's result-cache in GPT-service's list, and the "Active topic in active prompt" button that renders selected fragment in the selected service when the selected fragment is out-of-date or missing in the related service.
# MarkdownCode > components > body
The body component contains a horizontal splitter that divides its area, with an outline component on the left side and a vertical splitter on the right side, which has an editor component at the top and a results view component at the bottom, and it also has event handlers for the 'onPositionChanged' callback of both splitters to store the new position values, and when unloaded, the last splitter positions are stored in local storage and restored when loaded, with the clientWidth and clientHeight of the component retrieved, and if there is no previous value for the vertical splitter or it is larger than the clientWidth, 'clientWidth / 4' is used, and if there is no previous value for the horizontal splitter or it is larger than the clientHeight, 'clientHeight / 4' is used.
# MarkdownCode > components > body > outline
The outline component on the left side of the editor displays a tree structure of headings, which is created using 'convertToTreeData' to convert project data retrieved from the project service into a tree structure, and allows for removing, adding, and changing data items that update the tree accordingly, with the selected tree item assigning its key to the activeFragment in the position-tracking service, and the tree being displayed with lines.
# MarkdownCode > components > body > results view > results view context menu
The results-view-context-menu is a component that wraps the Dropdown antd component, requiring the properties 'transformer' and 'key', and displaying a 'more' button icon in the top-right corner of its parent with a margin of 16px, allowing users to select a GPT model from a submenu fetched from the GPT service's available models, with the currently selected model indicated as selected, and the ability to update the model name for the transformer and refresh the result by pressing a button.
# MarkdownCode > services > line parser
The line-parser service is a global singleton object that parses markdown lines and updates text-fragments in the project-service, maintaining an array called fragmentsIndex, creating new text-fragments based on input lines, calculating their depth-level and key, and handling different types of lines through its parse function.
# MarkdownCode > services > line parser > line parser helpers
The 'LineParserHelpers' module contains functions for retrieving, handling, updating, removing, inserting, and managing fragments in text, including handling empty lines, title lines, and regular lines.
# MarkdownCode > services > folder service
The folder service is a global singleton that manages the location of the active project and performs actions such as clearing, moving, copying, and setting the project location, with properties for the root folder, project name, project file path, cache folder path, and project configuration file path.
# MarkdownCode > services > result-cache service
This service manages cached results for transformers, allowing them to store and track the validity of their results for each text fragment, monitoring changes in both project and result fragments, using a dictionary to map keys to results, updating the cache's dictionary and a secondary dictionary when a transformer calculates a result, storing results in a JSON file, registering event handlers to monitor changes in text fragments and input objects, marking entries in the secondary dictionary as out of date when triggered, and providing functions to overwrite and retrieve results for a key and retrieve all results related to a specific fragment.
# MarkdownCode > services > gpt service
The GPT service is a global singleton that communicates with the open-ai api backend for specific tasks, using the openai node.js library to interact with the backend, including a function for making api requests to open-ai with a list of json objects called `messages` and a method to retrieve the available models list.
# MarkdownCode > services > build service
The build service converts markdown project data into source code by requesting transformers to render their results asynchronously for each text fragment in the project's data list.
# MarkdownCode > services > project service
The project service performs various tasks such as creating, opening, saving, updating, and managing projects, including clearing data, managing folders, cache, and events, setting locations, reading file contents, reloading data, moving/copying files, writing data, resetting indicators, saving filenames, updating data and links, managing data lists, providing functions for outline and drop-down boxes, and tracking user configurations.
# MarkdownCode > services > cybertron service
Cybertron-service globally manages transformers by maintaining a sub-list of entry-points for building text-fragments, allowing transformers to register and be added as entry-points, as well as unregister and be removed from the available transformers and entry-points list.
# MarkdownCode > services > transformer-base service
The transformer-base service is a class that provides a common interface and functionality for transformers, replacing transformer names with corresponding objects from a list of dependencies, raising an exception if a name is not found, using a result-cache-service to store results and track build status, and generating a message and list of keys to send a request to the GPT-service and set the result in the cache.
# MarkdownCode > services > compress service
The compress service is a subclass of the transformer-base service that shortens text fragments and can be used for testing and other processes, with a constructor that takes name and dependencies as parameters, and during startup, an instance of the compress service is created and registered, while the build-message function takes a text fragment as input and returns a JSON array called result with system and user roles, along with the text fragment key.
