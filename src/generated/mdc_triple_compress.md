# MarkdownCode
MarkdownCode is a machine learning tool that analyzes and converts markdown text into executable code for ideation and software building.
# MarkdownCode > development stack
The application is built using JavaScript and Electron, with Monaco Editor for text editing and a UI created using React and Ant Design (antd).
# MarkdownCode > components > main window
The main window of the app is displayed upon startup, featuring a top toolbar and a body section.
# MarkdownCode > components > toolbar > home > undo section
The undo-section component enables undo and redo buttons based on the project's undo-service actions.
# MarkdownCode > services > Undo service
The undo service in monaco-editors records user text edits and includes both undo and redo lists.
# MarkdownCode > components > toolbar > preferences
The preferences-tab component organizes its children in a row and includes the GPT and View sections on the toolbar.
# MarkdownCode > components > toolbar > home
The home-tab component arranges its children in a row and includes the File, Edit, Undo, and Build sections.
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
# MarkdownCode > services > Theme service
The theme service globally manages the selected theme font and font-size, saving changes to local storage, allowing for light or dark theme selection, and refreshing the main window's content when the theme is updated.
# MarkdownCode > services > Selection service
The selection service tracks and monitors selected text and the active editor, supporting actions such as cut, copy, paste, delete, clear selection, and select all.
# MarkdownCode > components > body > results view > results view context menu
The results-view-context-menu is a component that wraps the Dropdown antd component, requiring the properties 'transformer' and 'key', and displaying a 'more' button icon in the top-right corner of its parent with a margin of 16px, allowing users to select a GPT model from a submenu fetched from the GPT service's available models, with the currently selected model indicated as selected, and the ability to update the model name for the transformer and refresh the result by pressing a button.
# MarkdownCode > services > folder service
The folder service is a global singleton that manages the location of the active project and performs actions such as clearing, moving, copying, and setting the project location, with properties for the root folder, project name, project file path, cache folder path, and project configuration file path.
# MarkdownCode > services > cybertron service
Cybertron-service globally manages transformers by maintaining a sub-list of entry-points for building text-fragments, allowing transformers to register and be added as entry-points, as well as unregister and be removed from the available transformers and entry-points list.
# MarkdownCode > services > transformer-base service
The transformer-base service is a class that provides a common interface and functionality for transformers, replacing transformer names with corresponding objects from a list of dependencies, raising an exception if a name is not found, using a result-cache-service to store results and track build status, and generating a message and list of keys to send a request to the GPT-service and set the result in the cache.
# MarkdownCode > services > compress service
The compress service is a subclass of the transformer-base service that shortens text fragments and can be used for testing and other processes, with a constructor that takes name and dependencies as parameters, and during startup, an instance of the compress service is created and registered, while the build-message function takes a text fragment as input and returns a JSON array called result with system and user roles, along with the text fragment key.
# MarkdownCode > services > build service
The build service uses transformers to generate conversions for all text fragments in the project service's data list, rendering the results asynchronously.
# MarkdownCode > components > body > outline
The outline component on the left displays a tree structure of headings in the active project, retrieved from the project service and converted using 'convertToTreeData', with the tree structure being updated when data items are added/changed or removed, and the position-tracking service selecting the corresponding tree node when the selected text-fragment changes, while the tree is displayed with lines and 'convertToTreeData' creates a tree structure based on data items and sets parent-child relationships based on the level count.
# MarkdownCode > services > position-tracking service
The position-tracking service tracks and stores the user's selected text-fragment and line number, while also monitoring changes and providing methods to set and clear the selected line and fragment.
# MarkdownCode > components > toolbar
The application's toolbar has a similar design to MS Access, Excel, Word, or Draw, consisting of a single integrated menu and toolbar with tabs at the top, each displaying a tooltip with a brief description, including the Home, Format, and Preferences tabs, and a JSON structure should be created for all tabs with key, label, and children fields, assigned to the items property.
# MarkdownCode > services > build-stack service
The build-stack service prevents circular references by using a "running" dictionary to track running textframe - transformer pairs, with the "tryRegister" function checking if a pair is already running and returning false if it is, and the "unRegister" function removing a pair from the "running" dictionary.
# MarkdownCode > services > constant-extractor service
The constant-extractor service extracts constant definitions from source code, stores them in a json file, replaces constants in source texts with json references, inherits from the transformer-base service, has a constructor with the parameters 'constants' and an empty array, can be used by creating a global instance and registering it with the cybertron-service, and has functions to extract quotes, render results, and retrieve up-to-date values.
# MarkdownCode > components > toolbar > home > file section
The file-section component handles project and file actions with icon buttons, including creating, opening, saving, saving to a new location, and toggling auto-save, and the buttons' states are updated by the undo service.
# MarkdownCode > services > project service > storage service
The storage service is a global singleton that provides functions for reading and writing project data, including clearing, creating new projects, opening files, updating out-of-date data, marking data as dirty, and saving files, with the note that the fs module should be loaded remotely through Electron.
# MarkdownCode > components > toolbar > home > build section
The build-section component has actions for the build-service, including buttons with icons instead of text, which are disabled based on certain conditions and have their states stored and updated through event handlers that are registered on load and unregistered on unload.
# MarkdownCode > components > body > editor
The editor uses the monaco editor npm package to display markdown text, retrieving it from the project service and applying theme, font, and font-size from the theme service, reloading text when the project service triggers the 'content-changed' event, and monitoring events for change processing, editor focus and blur, cursor position and selection changes, while always occupying all available space.
# MarkdownCode > services > result-cache service
This service manages a cache for transformers, storing and tracking results for text fragments, with functions to store, retrieve, and check the validity of cached results.
# MarkdownCode > components > body > results view > results view tab
The results-view-tab component uses the monaco editor npm package to display transformer results for a specific text fragment, adjusting to the component's size, retrieving text from the result-cache, applying theme settings, monitoring the cache for changes, saving user changes to the cache, monitoring the monaco editor's events for selection changes, and displaying a results-view-context-menu component on top of the editor to update the key and display text when the selected fragment changes.
# MarkdownCode > components > toolbar > home > edit section
The edit-section component supports clipboard actions such as cut, copy, paste, delete, select all, and clear selection, and uses icons instead of text for buttons, with the ability to check if the clipboard contains text data using `clipboard.has('text/plain')` when the component is loaded or when the 'focused' event is emitted by ipcRenderer.
# MarkdownCode > services > project service
The project service manages text fragments in a project globally, tracking loaded fragments, storing content and project filename, providing functions for deletion, addition, marking as out of date, and retrieval, handling user configurations, and utilizing events for various actions.
# MarkdownCode > components > body
The application uses components from the @geoffcox/react-splitter library, including a body component with a Split component, an outline component, and another Split component, all with specific initial and minimum sizes, and event handlers for the 'onSplitChanged' callback, with the positions of the splitters stored and restored from local storage.
# MarkdownCode > services > dialog service
The dialog service is a global singleton that can display dialog boxes for errors, warnings, information, and user-triggered actions in a component, including functions such as showErrorDialog, showSaveDialog, and showOpenDialog.
# MarkdownCode > components > body > results view
The results-view component is located at the bottom of the main body, allowing users to view the results from registered transformers in the cybertron-service for the selected text block, with each transformer creating a tab at the top of the view displaying the results-view-tab component, using a JSON structure for the tabs with fields for key, label, and children, and assigning this JSON structure to the items property.
# MarkdownCode > services > line parser
The line-parser service is a singleton object that parses markdown lines and updates text-fragments in the project-service, using a fragmentIndex array to store text-fragment objects, a createTextFragment function to trim and convert the line to lowercase, determine the depth-level of the text-fragment, assign the title, calculate the key, and add it to the project-service, a calculateKey function to calculate the key of a text-fragment based on its depth-level and title, a clear function to clear the fragmentIndex list, and parse, insertLine, and deleteLine functions to handle different types of lines and insert or delete lines.
# MarkdownCode > services > all-spark service
The all-spark service is a global singleton that creates and registers transformers into the cybertron service, with the Load function being called during application construction, and the transformers to create being the compress service (entry point) and the constant-extractor service.
# MarkdownCode > services > line parser > line parser helpers
The 'LineParserHelpers' module contains helper functions for the line parser service, including functions to retrieve fragments at a given index, handle empty lines by adding or updating fragments, update fragment titles, remove fragment titles and update indexes, insert new fragments at a given index, handle lines with titles by creating or updating fragments, update fragment lines, handle regular lines by creating or updating fragments, and delete lines from fragments.
# MarkdownCode > services > project service > change-processor service
The change-processor service updates the project service with the user's edits by processing changes in the project content, including updating the content, parsing and replacing lines, and marking the storage service as dirty.
# MarkdownCode > services > gpt service
The GPT service communicates with the open-ai api backend for specific tasks using the openai node.js library, including sending requests and retrieving available models, with the apiKey being stored and loaded from localStorage, and the OpenAI library being instantiated only if a valid apiKey is provided.
