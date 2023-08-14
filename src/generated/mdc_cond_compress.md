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
# MarkdownCode > components > toolbar > home > build section
- The build-section component contains actions for the build-service.
- It supports the following actions:
  - All: Renders all code for the entire project.
    - Enabled when any service in the GPT-service's list has an out-of-date or missing result fragment in the result-cache.
  - Code for active topic: Renders code files for the currently active fragment.
    - Enabled when the selected fragment is out-of-date or missing in any service's result-cache in the GPT-service's list.
  - Active topic in active prompt: Renders code for the selected fragment in the currently selected service.
    - Enabled when the selected fragment is out-of-date or missing in the related service.
# MarkdownCode > components > toolbar > format > style section
- The style-section component handles actions related to applying markdown formatting to the text.
- The toggle buttons in the component update their state based on the selected text.
- Supported actions include:
  - Paragraph style: a toggle group where only one item can be selected at a time.
  - Each item is represented as a button in a single row.
  - Pressing a button applies the selected style as markdown to the currently selected text.
  - Available buttons in the group: heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, paragraph, quote, code.
# MarkdownCode > components > toolbar > format > paragraph section
- The paragraph-section component handles actions related to applying markdown formatting to text.
- The toggle buttons are updated to reflect the state of the selected text whenever the text selection is changed.
- It supports the following actions:
  - Bullet list: Turns the current selection into a bullet list or makes the current line a bullet point if there is no selection.
  - Numbered list: Turns the current selection into a numbered list or makes the current line a numbered list item if there is no selection.
  - Indent: Increases the indent of the current line or selection.
  - Unindent: Decreases the indent of the current line or selection.
# MarkdownCode > components > toolbar > format > font section
- The font-section component handles markdown formatting actions for text.
- Toggle buttons in the component update based on the selected text.
- Supported actions include:
  - Bold: toggle button for setting bold state and displaying current selection state.
  - Italic: toggle button for setting italic state and displaying current selection state.
  - Underline: toggle button for setting underline state and displaying current selection state.
  - Strike-through: toggle button for setting strike-through state and displaying current selection state.

# MarkdownCode > components > body > results view
- Positioned at the bottom of the main body
- Displays various results based on the selected text block
- Each service in the services list creates a tab at the top of the view
- Tab title is the service name
- Tab content includes:
  - Monaco editor in the center displaying the result from the service's result cache
    - Grayed-out if result is marked as out-of-date
    - Red if the text is an overwritten version of the service output
  - 'More' button in the top right corner opens a context menu with the following options:
    - 'Model for all' allows selection of GPT model for the service
      - Sub-menu items are the available models from the GPT service
      - Current model is shown as selected
      - Retrieves the value for the current model from the GPT service
      - Updates the model name for the service related to the results view when a different model is selected
    - 'Model for fragment' allows selection of GPT model for the service and the currently active fragment
      - Sub-menu items are the available models from the GPT service
      - Current model is shown as selected
      - Retrieves the value for the current model from the GPT service using the service and fragment title
      - Updates the model name for the service related to the results view and the current fragment title when a different model is selected
  - 'Refresh' button updates the result when pressed
- Edits made in the tab's Monaco editor are stored back in the service's result cache as 'overwritten'
- User can copy the current text in the center to the clipboard
- View monitors changes in the currently selected text fragment from the position-tracking service
  - Updates the content of the active tab by setting the selected value of the first combobox to the header title of the text fragment.

# MarkdownCode > services > project service
- The project service is responsible for:
  - Creating a new project:
    - Clears all data from the project's data list.
    - Recreates cache objects for all registered GPT services.
    - Raises an event to indicate data change for the project editor and results view components if they are open.
  - Opening an existing project:
    - Reads the specified file as a string.
    - Splits the file into lines.
    - Parses each line and stores the result object in the project's data list.
    - Recreates cache objects for each registered GPT service using the name of the existing cached file.
    - Raises an event to indicate data change for the project editor.
  - Saving the currently opened project:
    - Opens the specified file for writing.
    - Converts all parsed objects in the data list to a string and writes them to the file.
    - Resets the project's change indicator.
    - Saves the filename in the project service for auto-save functionality.
  - Updating the project's data list when the user makes changes in the markdown editor:
    - The markdown editor calls an update function provided by the project.
    - Updates the item in the data list at the specified line and updates any links to and from other items.
  - Managing a data list of the currently loaded data and providing functions to work with it:
    - Retrieves a tree structure representing project headers for use in the outline or drop-down boxes on the results view.
    - Converts a header to its full text.
- The project service also tracks user configurations:
  - Auto-save setting stored in local storage.
  - If auto-save is on, triggers or resets an auto-save timer when the update function is called.
  - Automatically saves the project when the auto-save timer goes off, using a temporary filename if necessary.
  - Code style for rendering source code declared in a markdown text file.
# MarkdownCode > services > Selection service
- The selection service is a global singleton object that manages the currently selected text.
# MarkdownCode > services > Undo service
- The undo service records user text edits in different monaco-editors.
- It includes both an undo and redo list.
# MarkdownCode > services > line parser
- Service for parsing markdown lines and updating links in project's data-list items.
- Parse function:
  - Accepts a string and the line index as input.
  - Performs the following:
    - Trims and converts the line to lowercase.
    - If the line starts with '#', it's a header:
      - If a text-fragment object already exists at that index in the project, update it. Otherwise, create a new line object.
      - Update all line-fragments below the new text-fragment to have the new text-fragment as their parent.
      - Count the number of '#' at the beginning of the line to determine the level of the text-fragment.
      - Find the first text-fragment above the current one that is one level higher and use it as the parent of the new text-fragment.
    - If it's a regular line, store it as a line-object:
      - If a line-object already exists at that index in the project, update it.
      - If no line-object or text-fragment exists yet, create a new line-object and use the first higher text-fragment as its parent.
# MarkdownCode > services > position-tracking service
- Tracks the text-fragment the user is working on.
- Keeps track of:
  - Currently selected line number.
  - Text-fragment related to the currently selected line.
  - EventTarget that stores events monitoring changes in the selected text-fragment.
- Provides the following methods:
  - Set currently selected line.
    - If the new value is different from the current selected line:
      - Get the related object from the project's data list.
      - If this is a new text-fragment or a line-object with a different parent text-fragment, trigger the on-changed event for all registered events.
# MarkdownCode > services > gpt service
- Responsible for communication with the open-ai api backend, primarily used by other services.
- Uses the openai node.js library for communication.
- Provides a function for sending api requests to open-ai.
  - Function accepts a list of json objects with `role` and `content` fields.
  - Sends the list to openai using the `createChatCompletion` function.
  - Retries the request 3 times before raising an error.
- Provides a method to retrieve the list of available models using the openai nodejs library.
- Manages a list of available services.
  - Services can register and unregister themselves.
  - Registered services should provide a name and a `get-result` function.
# MarkdownCode > services > result-cache service
- This service manages previously retrieved results for other services.
- It allows other services to store and track results for text fragments, checking if they have become out of date.
- The cache can monitor changes in both project fragments and result fragments.
- Services can use an instance of this class to cache their results.
- Internally, the cache uses a dictionary to map keys to results.
- When a service calculates a result, it asks the cache to update its dictionary:
  - The key is calculated by combining the key of the project text fragment with the keys of any additional result values used in the calculation.
  - If the key is not present, a new cache item is created with the result and marked as still valid.
  - If the key is already present, the cache item is retrieved and its result is updated to still valid.
- The cache also maintains a secondary dictionary to track relationships between text fragment titles and dictionary entries.
- The cache stores results in a JSON file specified by the service.
- The JSON file contains the primary dictionary, secondary dictionary, and a date to verify if the results are still valid.
- The cache tries to load the JSON file during construction.
- The cache registers event handlers with input objects used by the parent service.
- When triggered, the cache checks the secondary dictionary for entries and marks them as out of date in the primary dictionary.
- If other cache services are monitoring this cache service, they are notified of the out-of-date text fragment.
# MarkdownCode > services > build service
- Converts markdown project data list into source code using a set of gpt-services
- Iteratively generates conversions on different text frames
- Starts with original markdown code and ends with source code files stored on disk
- Performs the following actions to build the project:
  - Asks the compress service to render the result for each text-fragment in the project.
# MarkdownCode > services > compress service
- The compress service uses the gpt service to shorten a text fragment.
- The get-result function calls the GPT-service with specific parameters.
  - The parameters include a system message and the content of the text fragment.
- This service is useful for checking if the gpt service understands the fragment and can be used for other processes.
- The service utilizes a result-cache-service to store and track results.
  - The result-cache is updated whenever the get-result function is called.
  - The result is stored under the same key as the input parameter of get-result.
- The gpt-interface for this service is named "compress".
# MarkdownCode > components > toolbar > preferences > GPT section:
- The GPT-section component handles actions for configuring the GPT service.
- It includes the following actions:
  - Key: Opens a dialog box for the user to enter their API key, which will be used for API calls with the OpenAI platform.
  - Model: A combobox where the user can select the default model to use for requests sent to OpenAI.
    - The list of available models in the combobox is populated from the GPT service.
# MarkdownCode > components > toolbar > preferences > view section:
- The view-section component handles actions for configuring the application's appearance.
- It supports the following actions:
  - Theme: A combobox for selecting the preferred color mode (light or dark mode), which corresponds to the theme used by the monaco editor.
  - Font: A combobox for selecting the font used by the monaco editor and markdown viewer.
  - Font-size: A combobox for selecting the font size in the monaco editor and markdown viewer.
# MarkdownCode > components > body > editor
- The main view in the application is the editor component, which shows the markdown text of the project.
- The monaco editor npm package is used to display the markdown text.
- When the user moves the cursor to a different line, the editor requests the position-tracking service to update the selected line.
# MarkdownCode > components > body > outline
- Outline component positioned to the left of the editor
- Displays a tree representing the outline of the active project
- Tree structure shows the relationship between headings
- Clicking on a tree item scrolls the related text into view on the editor
- Monitors position-tracking service for changes to the selected text-fragment
- Sets the corresponding tree-item as selected when the position changes
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
# MarkdownCode > components > toolbar > format
- The format-tab component is a wrapper that arranges its children in a horizontal row.
- The component includes the following child components (sections on the toolbar):
  - Style
  - Paragraph
  - Font
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
# MarkdownCode > services > Theme service
- The theme service manages the currently selected theme by saving the new value to local storage when it is changed. It retrieves the previously stored value from local storage when the service is created.
- The service allows for selecting between a light or dark theme.
- Components use this service to retrieve the currently selected theme and apply it. They do not need to subscribe for changes to the selected theme value, they only need to retrieve the value from the theme service and use the corresponding styling names.
- The main window refreshes its content when the selected theme is updated.
# MarkdownCode > components > body
- The main body of the application is represented by the body component.
- The body component contains a horizontal splitter component that fills its entire area.
  - On the left side of the horizontal splitter is an outline component.
  - On the right side is a vertical splitter component.
    - The top part of the vertical splitter component is an editor component.
    - The bottom part of the vertical splitter component is a results view component.
- The body component has an event handler for the 'onPositionChanged' callback of both the horizontal and vertical splitters. This handler stores the new position values.
- When the body component is unloaded, the last positions of the horizontal and vertical splitters are saved in the local storage.
- When the body component is loaded, the last positions of the horizontal and vertical splitters are retrieved from the local storage. However, this only happens if the previous values fit within the current size of the component. If not, the vertical splitter uses 1/3 of the width and the horizontal splitter uses 1/3 of the component's height.
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
