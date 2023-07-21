# Pelikaan
Pelikaan is an AI tool that uses machine learning to convert markdown text into software code.
# Pelikaan > development stack
- Built with JavaScript and Electron
- Uses Monaco Editor for text editing
- UI made with React and Ant Design (antd)
# Pelikaan > components
- User can choose light or dark theme, and all components must support both styles.
# Pelikaan > components > main window
The main window component shows the app's first window. It has a toolbar at the top and the rest is the body.
# Pelikaan > components > toolbar
The app has a toolbar like MS Access, Excel, Word, or Draw, with a single integrated menu and multiple tabs (Home, Format, Preferences). Each component on the toolbar has a tooltip with a brief description.
# Pelikaan > components > toolbar > home
The home tab is the main toolbar with sections for file, edit, undo, and build.
# Pelikaan > components > toolbar > home > file section
The file-section component manages project and file actions, including creating new projects, opening existing projects, saving projects, saving projects to a new location, and enabling auto-saving.
# Pelikaan > components > toolbar > home > edit section
The edit-section component handles clipboard and selected data actions, including cut, copy, paste, delete, select all, and clear selection.
# Pelikaan > components > toolbar > home > undo section
The undo-section component has actions for the undo/redo service. It supports undo and redo buttons that are enabled based on the project's undo-service actions.
# Pelikaan > components > toolbar > home > build section
The `build-section` component has actions for the `build-service`, including `all` to render all project code and `selection` to render code for the active fragment and other required fragments.
# Pelikaan > components > toolbar > format
- The format-tab component formats selected text and applies formatting styles.
- The toolbar tab has sections for style, paragraph, and font.
# Pelikaan > components > toolbar > format > style section
The style-section component applies markdown formatting to the text. Toggle buttons update based on selected text. Supported actions include selecting paragraph styles like headings, quotes, and code.
# Pelikaan > components > toolbar > format > paragraph section
- The paragraph-section component applies markdown formatting to text.
- Toggle buttons update based on selected text changes.
- Supported actions: bullet list, numbered list, indent, unindent.
# Pelikaan > components > toolbar > format > font section
The font-section component handles markdown formatting for text. Toggle buttons update based on selected text. Supported actions include bold, italic, underline, and strike-through formatting.
# Pelikaan > components > toolbar > preferences
The preferences tab lets users customize their system with different commands. It has sections for Project, GPT, and View.
# Pelikaan > components > toolbar > preferences > project section:
The project-section component manages project configuration and file management, including auto-saving when changes are made.
# Pelikaan > components > toolbar > preferences > GPT section:
The GPT-section component configures the GPT service. It has actions for entering the API key and selecting the desired model from a dropdown menu. The dropdown menu is populated with available models from the GPT service.
# Pelikaan > components > toolbar > preferences > view section:
The view-section component configures the application's appearance. It supports actions for selecting the theme (light or dark), font, and font size for the Monaco editor and markdown viewer.
# Pelikaan > components > body
The body component is the main part of the application with multiple resizable areas, each containing a Monaco editor. Areas can be resized using horizontal or vertical splitters.
# Pelikaan > components > body > editor
- The main view is the Monaco editor, displaying the markdown text.
- Cursor movement triggers the editor to request an update of the selected line from the position-tracking service.
# Pelikaan > components > body > outline
- Left view shows project outline with headers
- Tree structure displays title relationships
- 'Generated' folder contains ML-service documents
- Clicking on tree item scrolls related text in editor
- Clicking on generated item opens markdown document and scrolls to relevant part
- View tracks changes to selected text-fragment
- Selected tree-item updates when text-fragment changes
# Pelikaan > components > body > preview
- Right-positioned view shows formatted markdown text.
- Tabs represent opened markdown documents.
- Current project's HTML version always visible, other tabs show generated documents.
- View tracks changes to selected text using position-tracking service.
- Active tab's cursor position updates when selected text changes.
# Pelikaan > components > body > generated
- Bottom-positioned display shows results based on selected text block
- Tabs at top for each service in list
- Tab content includes HTML-formatted result (grayed-out if outdated), refresh button, dropdown for argument-source list
- Copy displayed text to clipboard
- Monitors changes in selected text-fragment, updates active tab content
# Pelikaan > services
The app uses multiple services for common actions across different interfaces. All user-triggered service functions should have error handling to display a dialog box when an error occurs. The electron app's dialog box should be used for showing errors.
# Pelikaan > services > project service
The project service creates and manages projects, including creating and opening projects, saving projects, updating project data, and managing user configurations such as auto-save settings and code style for rendering source code.
# Pelikaan > services > line parser
- Service for parsing markdown lines and updating links in project's data-list items.
- Parse function:
  - Accepts a string as input (text to be parsed) and the line index in the project.
  - Trims and converts the line to lowercase.
  - If the line starts with '#', it's a header:
    - Update or create a new text-fragment object at the index in the project.
    - Update line-fragments below to have the new text-fragment as their parent.
    - Determine the level of the text-fragment based on the number of '#' at the beginning of the title.
    - Find the first higher text-fragment above and use it as the parent.
  - If it's a regular line, store it as a line-object:
    - Update or create a new line-object at the index in the project.
    - Use the first higher text-fragment as its parent if no line-object or text-fragment exists yet.
# Pelikaan > services > position-tracking service
- Tracks user's current text-fragment and selected line number.
- Stores related text-fragment and EventTarget for selected line.
- Offers methods to set the selected line.
- Triggers on-changed event for new or different text-fragments.
# Pelikaan > services > gpt service
- This service communicates with the open-ai api backend for specific tasks.
- It uses the openai node.js library to communicate with the backend.
- It provides a function for other services to send api requests to open-ai.
- The function accepts a list of json objects called `messages` with `role` and `content` fields.
- The `messages` list is sent to openai using the `createChatCompletion` function.
- If the request fails, the service retries 3 times before raising an error.
- The service can retrieve the list of available models using the openai nodejs library.
- It manages a list of currently available services in the system.
- Services can register and unregister themselves.
- Registered services should provide a name, get-result, get-argument-sources, and get-headers in their interface.
# Pelikaan > services > result-cache service
This service manages cached results for other services, allowing them to store and track results for text fragments. The cache monitors changes in both project and result fragments. Services can use this class to cache their results using a dictionary. When a service calculates a result, it asks the cache to update its dictionary. The cache also searches for the title of each input text fragment in a secondary dictionary. The cache stores the results in a JSON file and tries to load it during construction. The cache registers an event handler with each input object used by the parent service, marking entries as out-of-date if triggered. Other cache services monitoring this cache service are notified of the out-of-date text fragment.
# Pelikaan > services > build service
- This service converts markdown project data into source code using gpt-services.
- It iteratively generates conversions on different text frames, starting with the original markdown code and ending with source code files on disk.
- To build the project, the service performs the following actions:
  - For each text-fragment:
    - Asks the package-extractor service for identified packages and stores them.
    - Retrieves the list of components from the component-lister service.
    - For each class:
      - Asks the public discovery service to list publicly available items, excluding the fragment.
      - Uses the class generator to create class files.
    - For each constant:
      - Asks the public discovery service to list publicly available items, excluding the fragment.
      - Uses the constant generator to create constant files.
    - For each component:
      - Asks the public discovery service to list publicly available items, excluding the fragment.
      - Uses the component generator to create component files.
# Pelikaan > services > compress service
- The application uses the GPT service to condense a text fragment without losing meaning.
- The system prompt is "Condense the text as much as possible without losing meaning."
- The user prompt is generated by converting the title of the text fragment to its content.
- This feature helps verify if the GPT service understands the fragment and can be used as input for other processes.
- The service has a result cache to store and track outdated builds.
- GPT interface details: Name - "compress", Argument sources - The project.
# Pelikaan > services > double compress service
- Compress text further without losing meaning, removing markdown and using bullet points.
- Get text content and sub-headers from compress-service for user prompt.
- Check if gpt service understands fragment and can be used as input.
- Use result-cache-service to store and track results.
- GPT-interface details: Name - "double-compress", Argument resources - compress service.
# Pelikaan > services > package extractor service
- Retrieves packages from a text fragment.
- Uses a system prompt to gather application information.
- Replaces placeholders in the prompt with project values.
- Validates and assists in the build process.
- Relies on a result cache service for build tracking.
- GPT interface: `packages`
- Argument resources: project details.
# Pelikaan > services > feature merger service
- Use the system prompt: "You are reviewing the feature descriptions for the application called '{0}', described as: '{1}'"
- Replace '{0}' with the title of the first text-fragment in the project
- Replace '{1}' with the text of the first and second text-fragments in the project
- The user prompt: "Search for features about {2} mentioned in the block about {3}: '{4}' but not present in: '{5}'"
- Replace '{2}' with the first argument provided to the service
- Replace '{3}' with the second argument provided to the service
- Replace '{4}' with the text-content of the second text-fragment
- Replace '{5}' with the text-content of the first text-fragment
- Use the system prompt: "List all features related to {2} found in {3}:"
- Replace '{2}' with the first argument provided to the service
- Replace '{3}' with the second argument provided to the service
- This is an ideation tool to find missing features.
- This service uses a result-cache-service to store and track outdated builds.
- GPT-interface details:
  - Name: "features completion"
  - Argument resources:
    - The project
    - The project
# Pelikaan > services > toolbar completer service
AI developer reviewing feature descriptions for application '{0}'. Current toolbar has: {2}. Missing toolbar items mentioned in text: {3}. Remember to list missing components and actions. Tool finds missing features. Service uses result cache to store and track results. GPT interface details: Name: "toolbar completion", Argument resources: project.
# Pelikaan > services > missing features service
As an AI software developer, review the feature descriptions for the application '{0}', described as: '{1}'. Find missing features related to the subject found in the fragment using GPT. Use the system prompt: "You are an AI software developer reviewing the feature descriptions for the application '{0}', described as: '{1}'". Replace `{0}` with the title of the first text-fragment in the project (application title). Replace `{1}` with the text of the first and second text-fragments in the project (short description). Use the user prompt: "Find all features regarding '{2}' that are not mentioned in: {3}". Replace `{2}` with the first argument provided to the service. Replace `{3}` with the text-content of the text-fragment whose title was provided as the first argument. Finally, use the system prompt: "List all missing features." This tool generates ideas for missing features using the GPT-interface named "missing features" with the argument resources being the project. The service utilizes a result-cache-service to store and track outdated build results.
# Pelikaan > services > feature generator service
- Use double-compressed text to generate feature ideas using GPT system.
- Set system prompt as: "You are an AI software developer working on feature descriptions for application '{0}', described as: '{1}'"
- Replace '{0}' with first text-fragment's title (application title)
- Replace '{1}' with text of first and second text-fragments (short description)
- User prompt: "Find all features related to '{2}', described as: {3}"
- Replace '{2}' with first argument provided to service
- Replace '{3}' with text-content of text-fragment whose title was provided as first argument to service
- Final system prompt: "List all required features."
- Tool used for ideation to identify missing features.
- Service uses result-cache-service to store and track results/updates.
- GPT interface details:
  - Name: "feature ideas"
  - Argument resources: double compress service.
# Pelikaan > services > component lister service
- Generates a list of identified components in a given text fragment, with descriptions.
- System prompt: "You are an AI software developer reviewing the feature descriptions for the application '{0}', described as: '{1}'"
- User prompt: "List all components related to '{2}' in the application description: {3}"
- Exclude UI components provided by the framework.
- Used for project validity checks and during the build process.
- Utilizes a result cache service for build tracking.
- GPT interface details: Name: `components`, Argument resources: The project.
# Pelikaan > services > class lister service
- Class-lister service creates a list of non-UI component classes in a given text fragment.
- System prompt: "AI software developer reviewing feature descriptions for application '{0}', described as: '{1}'"
- User prompt: "List non-UI component classes and features related to '{2}' in the following part of the application description: {3}"
- System prompt: "Include custom-built services and constants, exclude imported libraries or UI components."
- Used for project validation and build process.
- Service uses result-cache-service to store and track build results.
- GPT interface details: Name - "classes", Argument resources - the project.
# Pelikaan > services > constant lister service
- Lister service creates constants from specified text, excluding components.
- System prompt: "AI software developer reviewing feature descriptions for application '{0}', described as: '{1}'"
- User prompt: "List non-UI component classes and features related to '{2}' in application description: {3}"
- Final system prompt: "Include only custom-built services and constants not from imported libraries or UI."
- Used for project validation and build process.
- Utilizes result cache service to store and track build results.
- GPT interface details: "Classes & Constants", Argument resources: The project.
# Pelikaan > services > import discovery service
- Create a list of components, services, classes, and constants used by text fragment A and defined by text fragment B.
- Use the system prompt: "You are an AI software developer reviewing the feature descriptions for the application '{0}', described as: '{1}'"
- Replace `{0}` with the title of the first text fragment (application title) and `{1}` with the text of the first and second text fragments (short description).
- User prompt: "List all items from the following set: '{2}' extracted from: '{3}' that are used in the section about {4}: '{5}'"
- Replace `{2}` with the concatenated text content from the component lister service and the class & constants lister service.
- Replace `{3}` with the text content produced by the compress-service of the second argument (title of the second text fragment).
- Replace `{4}` with the title provided as the first argument to the service.
- Replace `{5}` with the text content of the text fragment whose title was provided as the first argument to the service.
- Final system prompt: "List all items from the previously provided set that are used in {4}:"
- Replace `{4}` with the title provided as the first argument to the service.
- Used for project validity checking and during the build process.
- This service utilizes a result-cache-service to store results and track build status.
- GPT-interface details: Name: "import discovery", Argument resources: the project, compress-service
# Pelikaan > services > file lister service
- Generate code files based on a text-fragment.
- Prompt the system for application information.
- Prompt the user for a list of code generation files.
- Utilize a result-cache-service to store and track build results.
- GPT-interface details: "file list" with the project as argument resources.
# Pelikaan > services > public discovery service
The public discovery service identifies methods, functions, fields, and props used and defined by different text fragments. It generates code for an application using prompts and lists required components based on project text fragments. It validates projects and is used during the build process. It uses a result-cache-service to store build results. The gpt-interface includes "public interfaces" and project resources as arguments.
# Pelikaan > services > code generator
The code generator service combines other services to generate the final project outcome. It performs tasks such as writing files with component, class, and constant definitions, determining necessary code elements, and prompting the user for code writing. It is used for project validation and during the build process, utilizing a result cache service. The GPT interface for this service is called Code Generator and it requires project argument resources.
# Pelikaan > services > unit test generator
- Generates unit tests for components, classes, or constants.
- Relies on the File lister service to retrieve the component's filename.
- Relies on the Public discovery service to determine what to include in the render.
- Uses a system prompt to provide information about the application being tested.
- Uses a user prompt to specify the task and required functionality.
- Provides a final system prompt with rules and code style guidelines.
- Validates the project and is used during the build process.
- Utilizes a result-cache-service to store results and track build status.
- GPT-interface details: Name is "unit test generator" and it requires the project as argument resources.
