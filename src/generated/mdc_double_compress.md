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
# MarkdownCode > components > toolbar > home > build section
The build-section component has actions for the build-service. It supports the following actions: rendering all code for the entire project, rendering code files for the currently active fragment, and rendering code for the selected fragment in the currently selected service. These actions are enabled when there are out-of-date or missing results in the result-cache.
# MarkdownCode > components > toolbar > format > style section
The style-section component applies markdown formatting to text. Toggle buttons update their state based on selected text. Supported actions include paragraph style, where only one item can be selected at a time. Each item is represented as a button in a row. Pressing a button applies the selected style as markdown to the selected text. Available buttons: heading 1-6, paragraph, quote, code.
# MarkdownCode > components > toolbar > format > paragraph section
- The paragraph-section component applies markdown formatting to text.
- Toggle buttons update based on selected text changes.
- Supported actions: bullet list, numbered list, indent, unindent.
# MarkdownCode > components > toolbar > format > font section
The font-section component handles markdown formatting actions for text, including bold, italic, underline, and strike-through. Toggle buttons update based on the selected text.
# MarkdownCode > components > body > results view
- Bottom position displays results based on selected text block
- Services list creates tabs with service names
- Tab content includes:
  - Monaco editor displaying cached result
    - Grayed-out if out-of-date
    - Red if overwritten version
  - 'More' button opens context menu with options:
    - 'Model for all' selects GPT model for service
      - Sub-menu shows available models
      - Retrieves value from GPT service
      - Updates model name for service in results view
    - 'Model for fragment' selects GPT model for service and active fragment
      - Sub-menu shows available models
      - Retrieves value from GPT service using service and fragment title
      - Updates model name for service and fragment in results view
  - 'Refresh' button updates result
- Edits in Monaco editor stored as 'overwritten'
- User can copy current text to clipboard
- View monitors changes in selected text fragment from position-tracking service
  - Updates active tab content with fragment title
# MarkdownCode > services > Theme service
The theme service manages the selected theme, allowing for light or dark themes. Components use the service to apply the theme, and the main window refreshes when the theme is updated.
# MarkdownCode > services > project service
The project service creates and manages projects by clearing data, recreating cache objects, and notifying components of data changes. It opens existing projects by reading and parsing files, recreating cache objects, and notifying the project editor. It saves projects by writing parsed objects to a file, resetting the change indicator, and enabling auto-save. It updates the data list when the user makes changes in the markdown editor. It manages user configurations such as auto-save settings and code style for rendering source code.
# MarkdownCode > services > Selection service
The selection service is a global object managing selected text.
# MarkdownCode > services > Undo service
The undo service records user text edits in monaco-editors and includes both undo and redo lists.
# MarkdownCode > services > line parser
- Service for parsing markdown lines and updating links in project's data-list items.
- Parse function:
  - Accepts a string and line index as input.
  - Trims and converts the line to lowercase.
  - If line starts with '#', it's a header:
    - Update or create a new text-fragment object at the index.
    - Update line-fragments below with new text-fragment as parent.
    - Determine level of text-fragment based on '#' count.
    - Find first higher text-fragment above as parent.
  - If it's a regular line, store it as a line-object:
    - Update or create a new line-object at the index.
    - Use first higher text-fragment as parent if available.
# MarkdownCode > services > position-tracking service
- Tracks user's text-fragment.
- Keeps track of selected line number, related text-fragment, and event monitoring.
- Provides methods to set selected line and trigger events for changes in text-fragment.
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
# MarkdownCode > services > result-cache service
- This service manages cached results for other services, checking if they are out of date.
- It uses a dictionary to map keys to results.
- Services can use this class to cache their results.
- The cache updates the dictionary when a result is calculated.
- It also tracks relationships between text fragment titles and dictionary entries.
- Results are stored in a JSON file with a date to verify validity.
- The cache loads the JSON file during construction.
- Event handlers are registered with input objects used by the parent service.
- When triggered, the cache marks entries as out of date in the dictionary and notifies other cache services.
# MarkdownCode > services > build service
- Uses gpt-services to convert markdown project data into source code
- Generates conversions on multiple text frames
- Transforms original markdown code into source code files
- Utilizes compress service to render results for each text-fragment in the project
# MarkdownCode > services > compress service
The compress service uses the gpt service to shorten a text fragment. The get-result function calls the GPT-service with specific parameters, including a system message and the content of the text fragment. This service is useful for checking if the gpt service understands the fragment and can be used for other processes. It utilizes a result-cache-service to store and track results, updating the result-cache whenever the get-result function is called. The gpt-interface for this service is named "compress".
# MarkdownCode > components > toolbar > preferences > GPT section:
The GPT-section component configures the GPT service. It has actions for entering the API key and selecting the default model from a list provided by the GPT service.
# MarkdownCode > components > toolbar > preferences > view section:
The view-section component configures the application's appearance. It supports actions for selecting the theme (light or dark mode), font, and font size for the monaco editor and markdown viewer.
# MarkdownCode > components > body
The body component is the main part of the application, consisting of an outline component on the left, a results view at the bottom, and an editor filling the remaining space. The areas can be resized using horizontal and vertical splitters.
# MarkdownCode > components > body > editor
- The app's main view is the editor component, displaying markdown text.
- The monaco editor npm package is used for this purpose.
- When the user moves the cursor, the editor requests the position-tracking service to update the selected line.
# MarkdownCode > components > body > outline
- Left-aligned outline component
- Shows tree outline of active project
- Tree displays heading relationships
- Clicking tree item scrolls related text into view
- Monitors position-tracking service for selected text changes
- Updates selected tree item when position changes
# MarkdownCode > services > dialog service
The dialog service is a shared interface for displaying dialog boxes in other components and services, supporting errors, warnings, and information. User-triggered actions in a component should be wrapped in an error handler to show an electron dialog box with error details if needed.
# MarkdownCode > components > toolbar > home
The home-tab component arranges its children horizontally and includes the file, edit, undo, and build components.
# MarkdownCode > components > toolbar > format
The format-tab component arranges children horizontally and includes Style, Paragraph, and Font sections.
# MarkdownCode > components > toolbar > preferences
The preferences-tab component arranges its children in a row and includes the GPT and View sections on the toolbar.
