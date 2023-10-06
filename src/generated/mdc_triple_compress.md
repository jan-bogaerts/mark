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
# MarkdownCode > services > folder service
The folder service is a global singleton that manages the location of the active project and performs actions such as clearing, moving, copying, and setting the project location, with properties for the root folder, project name, project file path, cache folder path, and project configuration file path.
# MarkdownCode > services > cybertron service
Cybertron-service globally manages transformers by maintaining a sub-list of entry-points for building text-fragments, allowing transformers to register and be added as entry-points, as well as unregister and be removed from the available transformers and entry-points list.
# MarkdownCode > components > body > outline
The outline component on the left displays a tree structure of headings in the active project, retrieved from the project service and converted using 'convertToTreeData', with the tree structure being updated when data items are added/changed or removed, and the position-tracking service selecting the corresponding tree node when the selected text-fragment changes, while the tree is displayed with lines and 'convertToTreeData' creates a tree structure based on data items and sets parent-child relationships based on the level count.
# MarkdownCode > components > toolbar
The application's toolbar has a similar design to MS Access, Excel, Word, or Draw, consisting of a single integrated menu and toolbar with tabs at the top, each displaying a tooltip with a brief description, including the Home, Format, and Preferences tabs, and a JSON structure should be created for all tabs with key, label, and children fields, assigned to the items property.
# MarkdownCode > services > build-stack service
The build-stack service prevents circular references by using a "running" dictionary to track running textframe - transformer pairs, with the "tryRegister" function checking if a pair is already running and returning false if it is, and the "unRegister" function removing a pair from the "running" dictionary.
# MarkdownCode > services > transformers > constant-extractor service
The constant-extractor service extracts constant definitions from source code, stores them in a json file, replaces constants in source texts with json references, inherits from the transformer-base service, has a constructor with the parameters 'constants' and an empty array, can be used by creating a global instance and registering it with the cybertron-service, and has functions to extract quotes, render results, and retrieve up-to-date values.
# MarkdownCode > services > result-cache service
This service manages a cache for transformers, storing and tracking results for text fragments, with functions to store, retrieve, and check the validity of cached results.
# MarkdownCode > components > body > results view > results view tab
The results-view-tab component uses the monaco editor npm package to display transformer results for a specific text fragment, adjusting to the component's size, retrieving text from the result-cache, applying theme settings, monitoring the cache for changes, saving user changes to the cache, monitoring the monaco editor's events for selection changes, and displaying a results-view-context-menu component on top of the editor to update the key and display text when the selected fragment changes.
# MarkdownCode > components > toolbar > home > edit section
The edit-section component supports clipboard actions such as cut, copy, paste, delete, select all, and clear selection, and uses icons instead of text for buttons, with the ability to check if the clipboard contains text data using `clipboard.has('text/plain')` when the component is loaded or when the 'focused' event is emitted by ipcRenderer.
# MarkdownCode > components > body
The application uses components from the @geoffcox/react-splitter library, including a body component with a Split component, an outline component, and another Split component, all with specific initial and minimum sizes, and event handlers for the 'onSplitChanged' callback, with the positions of the splitters stored and restored from local storage.
# MarkdownCode > services > dialog service
The dialog service is a global singleton that can display dialog boxes for errors, warnings, information, and user-triggered actions in a component, including functions such as showErrorDialog, showSaveDialog, and showOpenDialog.
# MarkdownCode > services > line parser
The line-parser service is a singleton object that parses markdown lines and updates text-fragments in the project-service, using a fragmentIndex array to store text-fragment objects, a createTextFragment function to trim and convert the line to lowercase, determine the depth-level of the text-fragment, assign the title, calculate the key, and add it to the project-service, a calculateKey function to calculate the key of a text-fragment based on its depth-level and title, a clear function to clear the fragmentIndex list, and parse, insertLine, and deleteLine functions to handle different types of lines and insert or delete lines.
# MarkdownCode > services > project service > change-processor service
The change-processor service updates the project service with the user's edits by processing changes in the project content, including updating the content, parsing and replacing lines, and marking the storage service as dirty.
# MarkdownCode > services > gpt service
The GPT service uses the OpenAI Node.js library to communicate with the OpenAI API backend, storing and retrieving models for API calls, sending requests with createChatCompletion, retrying failed requests 3 times, retrieving available models with a valid API key, and instantiating the OpenAI library with a valid API key.
# MarkdownCode > components > body > results view > results view context menu
The results-view-context-menu is a component that wraps the Dropdown antd component, requiring the properties 'transformer' and 'key', and includes a 'more' button icon positioned as a floating button in the top-right corner of the parent using absolute positioning, with options for selecting a GPT model for all or for a specific fragment fetched from the gpt-service's list of available models, indicating the currently selected model as selected and obtaining the value for the current model from the gpt-service, and allowing the gpt-service to update the model name when a different model is selected, as well as including a splitter and a refresh option to recalculate the result.
# MarkdownCode > services > transformers > double-compress service
The double-compress-service is a transformer-based service that shortens the result of compress-service, useful for testing and as input for other processes, with a build-message function that takes a text-fragment and returns a result (json array) and key, including system and user roles where the system role contains a constant value and the user role contains the result of compressService.getResult, ultimately returning the result and key.
# MarkdownCode > services > all-spark service
The All-Spark service registers transformers into the Cybertron service, including the Compress service (entry point), Constant-extractor service, and Double-compress service, using the `cybertronService.register(transformer, false)` or `cybertronService.register(transformer, true)` functions, with all transformers needing to be registered after construction for accessibility.
# MarkdownCode > services > project service > storage service
The storage service handles global reading and writing of project data, including functions for clearing data, setting up new projects, loading data and models, updating transformers, auto-saving, and saving to disk.
# MarkdownCode > services > line parser > line parser helpers
The 'LineParserHelpers' module provides helper functions for the line parser service, including functions to retrieve fragments at a given index, handle empty lines, update fragment titles, remove fragment titles, insert new fragments, check if a fragment is in a code block, handle title lines, update fragment lines, handle regular lines, and delete lines.
# MarkdownCode > services > transformers > triple-compress service
The triple-compress-service is a subclass of the transformer-base service that reduces the output of the double-compress-service to a single line, and it has a constructor with specific parameters and a function that takes a text fragment as input and returns a result with roles and contents.
# MarkdownCode > services > transformers > component-lister service
The component-lister service is a transformer-based service that extracts component names from text, determines which components to render, and depends on the 'double compress' service, with the build-message function returning a JSON array containing system and user roles, the result of calling doubleCompressService on the text fragment, and the fragment's result and key.
# MarkdownCode > services > project service
The project service manages project aspects globally, including tracking loaded text fragments, storing content and project filename, and providing functions for deleting, adding, and marking fragments as out of date, as well as retrieving specific fragments, checking for outdated ones, and dispatching events using an EventTarget field to track user configurations and raise events for content changes, fragment actions, and dirty status changes.
# MarkdownCode > components > toolbar > home > file section
The file-section component has actions for project and file management with icon buttons, including new project creation, opening existing projects, saving current projects, saving current projects to a new location, and toggling auto-save functionality, all of which are handled by the storage service and require monitoring by the project service for button state updates.
# MarkdownCode > components > body > editor
The editor component uses the Monaco editor npm package to display markdown text, retrieves text from the project service and applies theme, font, and font-size from the theme service, reloads text on 'content-changed' event from the project service, moves the editor to a specified line on 'moveTo' event from the position-tracking service, subscribes to the theme service for changes and updates editor options, and monitors various events on the Monaco editor such as model content changes, focus, blur, cursor position changes, and cursor selection changes, while always occupying all available space.
# MarkdownCode > components > body > results view
The results-view component displays results generated by registered transformers for the selected text block, with tabs at the top showing each transformer's name and key, and selecting a tab executes `positionTrackingService.setActiveTransformer(transformer)`; on initialization, the first tab is selected and `positionTrackingService.setActiveTransformer(transformer)` is called for the correct transformer, and a JSON structure is created for all tabs with fields: key, label, and children, which is then assigned to the items property.
# MarkdownCode > services > position-tracking service
The position-tracking service tracks the user's selected text-fragment and transformer, providing methods for setting the selected line, clearing the selection, setting the active fragment, and setting the active transformer, triggering events when necessary.
# MarkdownCode > components > toolbar > home > build section
The build-section component contains actions for the build-service, including buttons with icons and tooltips, such as rendering code for the project, active fragment, and result, toggling debug state, and continuing rendering to the next transformer, with button disabled values stored in the state for updating from event handlers, button states initialized on load, and event handlers registered to monitor changes in the project-service and position-tracking service, and unregistered on unload.
# MarkdownCode > services > build service
The build service processes text fragments using transformers and builds the project by calling the `buildFragment` function for each fragment, which in turn calls the `runTransformer` function for each transformer to render the result asynchronously, while the debug property determines if the build service is in debug mode and is loaded and saved from local storage, and the isBuilding property indicates if a build function is currently running.
# MarkdownCode > services > transformers > compress service
The compress service is a transformer-based service that shortens text fragments and returns a JSON array with system and user roles, as well as the text-fragment key.
# MarkdownCode > services > transformer-base service
The transformer-base service is a class that provides a common interface and functionality for transformers, with a constructor that takes parameters for the transformer's name, dependencies, JSON treatment, language, and temperature, and utilizes a result-cache-service to store results and track the build's status, including functions for rendering results, retrieving values, and calculating maximum tokens.
