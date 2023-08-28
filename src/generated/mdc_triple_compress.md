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
# MarkdownCode > services > project service
The project service handles project creation, opening, saving, and updates, as well as managing user configurations for auto-save settings and code style.
# MarkdownCode > services > Undo service
The undo service in monaco-editors records user text edits and includes both undo and redo lists.
# MarkdownCode > services > gpt service
This text describes a communication module that is responsible for interacting with the open-ai api backend, using the openai node.js library, to send api requests and retrieve available models, as well as managing a list of registered services with their respective functions.
# MarkdownCode > services > build service
The text describes the use of gpt-services to convert markdown project data into source code, generating conversions on multiple text frames and transforming the original markdown code into source code files, while utilizing a compress service to render results for each text-fragment in the project.
# MarkdownCode > services > compress service
The compress service utilizes the gpt service to shorten text fragments and stores and tracks the results using a result-cache-service, with the gpt-interface named "compress".
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
# MarkdownCode > components > body > results view > results view context menu
The results-view-context-menu is a component that wraps the Dropdown antd component, requiring the properties 'transformer' and 'key', and displays a 'more' button icon in the top-right corner with a 16px margin, triggering a dropdown menu with options to select the GPT model to be used by the transformer, provided by the GPT service's list of available models, with the currently selected model highlighted, and the ability to update the model name for the transformer when a different model is selected, as well as a "Refresh" option to recalculate the result when pressed.
# MarkdownCode > services > Theme service
The theme service globally manages the selected theme font and font-size, saving changes to local storage, allowing for light or dark theme selection, and refreshing the main window's content when the theme is updated.
# MarkdownCode > services > Selection service
The selection service tracks and monitors selected text and the active editor, supporting actions such as cut, copy, paste, delete, clear selection, and select all.
# MarkdownCode > services > line parser
The line-parser service parses markdown lines and updates text-fragments in the project-service, creating new text-fragments by trimming and converting the line to lowercase, determining the depth-level based on the number of '#' at the beginning of the line, removing the '#' and assigning it as the title, calculating the key, and setting the 'out-of-date' flag to true, as well as calculating the key of a text-fragment by looping through the fragmentsIndex array, and handling different scenarios such as filling the fragmentsIndex array, finding the index of the first occurrence, calculating the index value of the line, creating/updating text-fragments, and appending lines.
# MarkdownCode > services > position-tracking service
The position-tracking service tracks the user's selected text-fragment, including the line number, related text-fragment, and eventTarget, and provides a method to set the currently selected line, triggering the on-changed event if the object is different from the currently selected text-fragment.
# MarkdownCode > services > result-cache service
This service manages cached results for transformers, storing and tracking calculation results on text fragments, creating cache-item objects with results if the key is not present, or updating the result if the key is already present, maintaining a secondary dictionary to track relationships between text-fragment titles and dictionary entries, storing results in a JSON file specified by the transformer, registering event handlers to monitor changes and marking entries in the secondary dictionary as out-of-date, and providing methods to overwrite and retrieve results for specific keys and determine if a text fragment is out-of-date based on the key.
# MarkdownCode > components > toolbar > home > build section
The build-section component has build-service actions, including buttons with icons instead of text, such as the "All" button that renders code for the entire project when any transformer in GPT-service's list has an out-of-date or missing result fragment in the result-cache, the "Code for active topic" button that renders code files for the active fragment when the selected fragment is out-of-date or missing in any transformer's result-cache in GPT-service's list, and the "Active topic in active prompt" button that renders selected fragment in the selected service when the selected fragment is out-of-date or missing in the related service.
# MarkdownCode > components > body
The body component contains a horizontal splitter that divides its area, with an outline component on the left side and a vertical splitter on the right side, which has an editor component at the top and a results view component at the bottom, and it also has event handlers for the 'onPositionChanged' callback of both splitters to store the new position values, and when unloaded, the last splitter positions are stored in local storage and restored when loaded, with the clientWidth and clientHeight of the component retrieved, and if there is no previous value for the vertical splitter or it is larger than the clientWidth, 'clientWidth / 4' is used, and if there is no previous value for the horizontal splitter or it is larger than the clientHeight, 'clientHeight / 4' is used.
# MarkdownCode > components > body > outline
The outline component on the left side of the editor displays a tree structure of headings, which is created using 'convertToTreeData' to convert project data retrieved from the project service into a tree structure, and allows for removing, adding, and changing data items that update the tree accordingly, with the selected tree item assigning its key to the activeFragment in the position-tracking service, and the tree being displayed with lines.
