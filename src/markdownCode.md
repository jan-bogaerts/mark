# MarkdownCode
MarkdownCode is an ideation and software building tool driven by machine learning. It  allows users to enter text in markdown which is automatically analyzed for various parameters and which can automatically be converted into various stages of software code.

## development stack
- developed in javascript
- it uses electron as it's runtime
- text editing features are provided by the monaco editor.
- The UI is built using react and antd

## components
- The user can choose between a light or dark theme.
- All components need to have a light and dark styling option.

### main window
- the main-window component contains the content of the first window that is shown when the application starts.
- it contains the following components:
  - a toolbar: located at the top of the window.
  - a body: this component occupies all of the remaining space in the window

### toolbar

the application uses a toolbar similar to applications like mS Access, excel, word or draw:
a single integrated menu and toolbar

- At the top of the toolbar are a nr of tabs,
- all components on the toolbar (buttons, dropdowns, sliders, inputs,...) have a tooltip containing a short description of the action.

the following tabs are available:
- home
- format
- preferences

#### home

- The home tab is the component that is used as the main tab of the toolbar.
- This component contains the following sections:
  - file
  - edit
  - undo
  - build
  
##### file section
- the file-section component contains actions related to the project and file management.
- it supports the following actions
  - New Project: a button to create a new project
    - if there is a project loaded with changes (the project's undo-service has data in the undo list), ask to save first.
    - clears the current project data.
  - open: a button to open an existing project.
    - show a dialog box to
    - select a file -> electron dialog box
    - if a file is selected, ask the
    - project service to load the file.
    - wrap in an exception handler that shows an error dialog
  - save: a button to save the current project to file.
    - if the project file does not yet have a filename, show a save-as dialog
    - if the user doesn't provide a valid filename, stop the action
    - if the user provides a valid filename,
      - call the project-service 'save' function with filename as param.
    - if the project service already has a filename,
      - call project service save without param.
    - wrap in an error handler and show the error
  - save as: a button to save the current project to a new location.
    - show an electron save-as dialog
    - it the user selects a file, ask the project-service to save the project
    - wrap in an exceptions handler and show the error
  - auto-save: a toggle button, when pressed, the app will auto-save the project upon change.
  
##### edit section
- the edit-section component contains actions related to the clipboard and the currently selected data.
- it supports the following actions
  - cut: a button to initiate the cut command of the selection service
  - copy: a button to initiate the copy command of the selection service
  - paste: a button to initiate the paste command of the selection service
  - delete: a button to initiate the delete command of the selection service
  - select all: a button to select all the text in the currently active window.
  - clear selection: a button to clear the current selection buffer.

##### undo section
- the undo-section component contains actions that the undo / redo service can perform.
- it supports the following actions
  - undo: a button to undo the last action, performed by the current project's undo-service
    - enabled when the project's undo-service has undo actions
  - redo: a button to redo the last action, preformed by the project's undo service.
    - enabled when the undo-service has redo actions

##### build section
- the buil-section component contains actions that the build-service can perform.
- it supports the following actions
  - all: a button to start rendering all the code for the entire project
  - selection: a button to only start rendering the code for the currently active fragment (and all the other fragments of other services it needs to render properly).

#### format
- the format-tab component contains various commands to format the selected text or to activate a formatting style starting from the current cursor position.
- this toolbar tab has the following sections:
  - style
  - paragraph
  - font

##### style section
- the style-section component contains actions related to the markup used in the text for applying markdown formatting.
- whenever the text selection is changed, the state of the toggle buttons is updated to reflect the state of the selected text.
- it supports the following actions
  - paragraph style: this is a toggle group where the user can make a selection between:
    - heading 1
    - heading 2
    - heading 3
    - heading 4
    - heading 5
    - heading 6
    - paragraph
    - quote
    - code

##### paragraph section
- the paragraph-section component contains actions related to the markup used in the text for applying markdown formatting.
- whenever the text selection is changed, the state of the toggle buttons is updated to reflect the state of the selected text.
- it supports the following actions
  - bullet list: a toggle button to turn the current selection into a bullet list or when there is no selection but only a cursor position, to make the current line into a bullet point.
  - numbered list:a toggle button to turn the current selection into a numbered list or when there is no selection but only a cursor position, to make the current line into a numbered list item.
  - indent: a button to increase the indent of the current line or selection.
  - unindent: a button to decrease the indent of the current line or selection.
  
##### font section
- the font-section component contains actions related to the markup used in the text for applying markdown formatting.
- whenever the text selection is changed, the state of the toggle buttons is updated to reflect the state of the selected text.
- it supports the following actions
  - bold: a toggle button to set the bold state on/off on the selected text and to show the state of the current selection. 
  - italic: a toggle button to set the italic state on/off on the selected text and to show the state of the current selection. 
  - underline: a toggle button to set the underline state on/off on the selected text and to show the state of the current selection. 
  - strike-though: a toggle button to set the strike-through state on/off on the selected text and to show the state of the current selection. 

#### preferences
- the preferences-tab component contains various commands that the user can do to customize and set up his system.
- the preferences tab has the following sections:
  - project
  - GPT
  - View

##### project section:
- the project-section component contains actions related to the configuration of the project and file management.
- it supports the following actions
  - auto-save: this is a toggle button, when pressed, the project will automatically save when changed.
  
##### GPT section:
- the GPT-section component contains actions related to the configuration of the GPT service.
- it supports the following actions
  - key: this button opens a dialog box where the user can enter his api-key that will be used for api-calls with the open-ai platform.
  - model: this is a dropdown where the user can select which model should be used when requests are sent to open-ai.
    - the list of available models used to populate the dropdown, comes from the gpt-service.
  
##### view section:
- the view-section component contains actions related to the configuration of the appearance of the application
- it supports the following actions
  - theme: this is a dropdown where the user can select the preferred color mode: light or dark mode. This maps to the theme used by the monaco editor.
  - font: this is a dropdown that the user can use to select the font that is used by the monaco editor and markdown viewer.
  - font-size: this is a dropdown that the suer can use to select the size of the font in the monaco editor and markdown view.

### body
- the body component represents the main body of the application.
- it consists out of 1 or more resizable areas.
- each area contains a monaco editor
- These areas can be resized using a horizontal or vertical splitter.

#### editor
- the first and primary view in the body, is the  monaco editor which displays the markdown text of the currently loaded project.
- when the user moves the cursor to another line, the editor asks the position-tracking service to update the currently selected line

#### outline
- this view is positioned to the left of the editor
- it contains an outline of the currently active project: all headers in the document are present in the outline
- a tree structure is used to display the relationship between titles: root items are declared with the 1st header, 1d headers become their children and so on.
- there is 1 special root folder that is always present called 'generated'. This contains a list of documents that have been generated based on the available ML-services: each ml-service has 1 item.
- when the user clicks on a tree item, the related text is scrolled into view on the editor in case the user clicked on a tree-item that represents a header in the project.
- if the user clicked on an item from the generated list, first the markdown document is opened in the preview if it wasn't opened already, then the relevant part (related to the header currently active in the project editor) is scrolled into view.
- the view monitors the position-tracking service for changes to the currently selected text-fragment.
  - when this changes, set the corresponding tree-item as selected.

#### preview
- this is a view that is positioned to the right of the editor. It shows a formatted version of the markdown text.
- this view can have multile tabs at the top of the view. Each tab represents a markdown document that is opened.
- the html-formatted version of the currently opened project, is always visible. other tabs are for generated documents that the user opened from the outline view and which are underneath the 'generated' tree-item.
- the view monitors the position-tracking service for changes to the currently selected text-fragment. 
  - when this changes, update the cursor position on the active tab so that the header that matches the title of the text-fragment in the document is at the top of the screen


#### generated
- this view is positioned at the bottom of the main body
- the user can view various results that were generated based on the currently selected text block.
- For each service in the services list provided by the gpt-service, this view creates a tab.
  - the tabs are located at the top of the view
  - the service name is used as the title of the tab
  - the tab content shows:
    - in the center: an html-formatted version of the result that the related service produced, if available (could be that it's not yet generated)
      - if the result is marked as out-of-date, show the text as gayed-out.
    - in the top right corner is a 'refresh' button. When pressed, the service will update the result.
    - next to the refresh button is 1 dropdown box for each item in the argument-source list, as reported by the service
      - the values for the dropdown box come from the argument source (either the project or a service) and are retrieved with the get-headers function.
      - the first value in the list is used as the initial value for the combo-box
      - this value is used as the value for the argument that needs to be passed to the service when the result is refreshed.
        - the index position of the combo-box equals the index position in the argument list.
- the user can copy the current text displayed in the center to the clipboard.
- the view monitors the position-tracking service for changes to the currently selected text-fragment. 
  - when this changes update the content of the currently active tab by setting the selected value of the first dropdown-box to the header-title of the text-fragment.


## services
- The application makes use of a number of services to perform actions that are often shared across multiple user interfaces.
- all service functions that the user can trigger directly, should do proper error handling so that when an error occurs, a dialog box is shown to the user. 
- The dialogBox of the electron app should be used to display errors.

### project service
- the project service is responsible for:
  - creating a new project
    - all data is cleared from the project's data list
    - all registered gpt-services recreate their cache object.
    - an event is raised to indicate that the data has changed (for the project editor & and preview components, if they are opened)
  - opening an existing project.
    - read the contents of the file that is specified as a parameter. Read it as a string.
    - split the file in lines
    - for each line in the file, parse it and store the result object of the parse in the project's data list. This way, the list has an item for each line at the same index number as the line number in the file.
    - fore each registered gpt-service, recreate the cache object, with as parameter the name of the existing cached file so that it can be loaded again.
    - raise an event to indicate that the data has changed (for the project editor & and preview components, if they are opened)
  - saving the currently opened project.
    - open the file that was specied in the argument, for writing
    - convert all the parsed objects in the data list to a string and write to file
      - each object has a title and a list of lines.
    - reset the indicator that the project has changed
    - save the filename in the project service if the auto-save function needs to use it.
  - updating the project's data list whenever the user makes changes in the markdown editor. 
    - The markdown editor calls an update function provided by the project, whenever the user edits the document.
    - the item in the data-list at the specified line is updated and any possible links to and from other items in the data list are updated.
  - manage a data-list of the currently loaded data and provide the following functions to work with this data list:
    - retrieve a tree-structure (where each item in the tree represents a header that is used in the project) to be used in the outline or in drop-down boxes on the generated-view.
    - convert a title (aka header) to the full text:
- the project service also keeps track of some user configs like:
  - wether auto-save is on or not. This value is stored in the local storage. If it is turned on, whenever the update function is called, an auto-save timer is triggered or reset. When this auto-save timer goes off, the project is automatically saved. If the project doesn't yet have the filename, a temporary filename is generated and the file is saved there.
  - the code-style that should be applied when rendering source code. This is declared in a text file as markdown.

### line parser
- this service is used to parse markdown lines and update the links in the project's data-list items.
- the parse function of this service:
  - accepts as input:
    - a string as input, which is the text that needs to be parsed.
    - the index nr of the line in the project
  - performs:
    - first trim the line and convert it to lower case.
    - if the line starts with a '#', it's a header
      - if at that index position in the project, already is a text-fragment object: update this, otherwise create a new line object.
      - when it's a new text fragment, all 'line-fragments' below it, until the next text-fragment', need to be updated so that their 'parent' field points to the new text fragment.
      - count the nr of '#' that are in front of the title. this determines the level or depth of the text-fragment. so '#' is level 1, '##' is level 2, '###' is level 3 and so on.
      - find the first text-fragment that is above the current text-fragment that is 1 level higher than the current one (so if the current text-fragment has '###', it's at level 3, search for the first text-fragment that is at level 2 or has '##') and use that as parent of the text-fragment that represents the line we are parsing.
    - otherwise it's a regular line, so store it as a line-object. 
      - if at the index position in the project, there is already a line-object, just update the line
      - if there was no line-object yet (or a text-fragment), create a new line-object and find the first text-fragment that is higher up the data list and use that as the parent of the line-object.
  
### position-tracking service
- this service is responsible for tracking the text-fragment that the user is currently working on.
- The service keeps track of:
  - the currently selected line nr
  - the text-fragment related to the currently selected line.
  - an eventTarget that stores the events which monitor changes in the currently selected text-fragment.
- it provides the following methods:
  - set currently selected line.
      - if the new value is different from the current selected line:
        - get the related object from the project's data list.
        - If this is a new text-fragment or a line-object who's parent points to a text-fragment that is different from the currently selected text-fragment, then trigger the on-changed event for all the registered events.

### gpt service
- this service is responsible for communicating with the open-ai api backend. It is primarily used by other services that perform more specific tasks.
- the service uses the openai node.js library to communicate with the backend.
- it provides a function that other services (or components) can call to send an api request to open-ai.
  - this function accepts a list (called `messages`) json objects that contain a `role` and `content` field.
  - this `messages` list is sent to openai using the `createChatCompletion` function.
  - if the request fails, the service will retry 3 times before giving up and raising an error.
- the service also provides a method to retrieve the list of available models. To retrieve this list, the openai nodejs library is used.
- it manages a list of services that are currently available in the system. 
  - Other services can register themselves. this will add them to the list.
  - Other services can also unregister themselves. this will remove them from the list.
  - Each service that registers itself, should provide the following items in it's interface:
    - name: the display name of the service.
    - get-result: returns the result that the service has calculated for the specified list of arguments.
    - get-argument-sources: returns a list that describes the arguments that the service expects.
      - This can be:
        - a reference to the project.
        - a reference to another service.
      - used by the UI to build up the view.
    - get-headers: returns a list of keys that map to result-values for this service. Used by the generated-view as combo-box values

### result-cache service
- this service manages previously retrieved results for other services.
- It allows other services that perform calculations on text fragments, to store these results for each text fragment and keep track if the result has become out of date or not (the original text fragment has changed).
- because some services work on text fragments that come from the project directly and others that come from the result of other services, the result cache must be able to monitor changes in a project fragment and result fragment.
- A service that wants to cache it's results uses an instance of this class to perform these tasks on it's results.
- internally, the cache uses a dictionary that maps the keys (representing the service's inputs) to their results.
- whenever the service calculates a result, it asks the cache to update it's dictionary:
  - first the key is calculated based on 1 or more text fragments which were the inputs of the service. This key is a combination of titles of all the text fragments.
  - if the key is not yet present, a new cache-item object is created which contains:
    - the result of the service
    - the current state: still-valid (instead of out-of-date)
  - if the key is already present:
    - the cache item is retrieved,
    - it's result is updated to still-valid
  - for each text-fragment in the inputs of the service, the cache will also:
    - search for the title of the text-fragment in a secondary dictionary.
    - if the title is not yet in this secondary dictionary, add the key, and use as value, a list containing the key for the primary dictionary.
    - if it already has the title, add the key for the primary dictionary at the end of the list.
- the cache stores the results in a json file.
  - the name of this file is specified by the service that creates the class instance (constructor parameter)
  - the json file contains:
    - the primary dictionary that contains the results.
    - the secondary dictionary that contains the relationships between titles of text-fragments and full dictionary entries in the primary dict (which can consist out of multiple titles).
    - a date that specifies the last save date of the project file. This is used when loading the dictionary back from file to verify if the results are still valid or not (when this date doesn't match the last-modified date of the project, something is out-of sync and consider the results in the file out-of-date).
  - the cache tries to load this json file during construction of the instance.
- When the result-cache-service is created, it registers an event handler with each object that the parent service uses as input
  - this can be either:
    - with the project service to monitor when text fragments have changed.
    - or with an other cache-service, when cache-results have gone out-of-date.
  - whenever the event handler is triggered, the cache service checks in the secondary dictionary if there are any entries. This allows the system to react to changes in single text-fragments, even though there were multiple input text-fragments (and so the keys in the primary dictionary are a concatenation of multiple titles).
    - for each entry in the list:
      - search in the primary dictionary and mark as out-of-date
      - if there are any other cache services that monitor this cache-service (instead of the project service directly), then let them know that the specified text-fragment (from the result) has gone out-of-date.

### build service
- this service turns the markdown project data list into source code. It uses a set of gpt-services to iteratively generate conversions on the different text frames, starting with the original markdown code and finally ending with source code files that are stored on disk.
- to build the project, the service performs the following actions:
  - for each text-fragment in the project:
    - ask the package-extractor service for the list of packages that it can identify in the fragment and store this for later
    - get the list of components from the component-lister service
    - for each class:
      - ask the public discovery service to list everything that the class should make publicly available, with respect to all fragments (except the fragment where the class comes from).
      - ask the class generator to make the files for the class
    - for each constant:
      - ask the public discovery service to list everything that the constant should make publicly available, with respect to all fragments (except the fragment where the constant comes from).
      - ask the constant generator to make the files for the constant
    - for each component:
      - ask the public discovery service to list everything that the component should make publicly available, with respect to all fragments (except the fragment where the component comes from).
      - ask the component generator to make the files for the component.


### compress service
- takes a text fragment and asks the gpt service to make it shorter.
  - use the following system prompt: `condense the following text as much as possible, without loosing any meaning:`
  - for the user prompt, ask the project service to convert the title of the text-fragment (specified as argument) to it's text-content.
- Useful to check if the gpt service understands the fragment and can be used as input for other processes.
- this service uses a result-cache-service to store all the results and keep track of when the build has gone out-of-date.
- gpt-interface details:
  - name: `compress`
  - argument sources:
    - the project

### double compress service
- compresses an already compressed text again.
  - use the following system prompt: `condense the following text to half the length, without loosing any meaning. Remove the markdown, but use bullet points where appropriate.`
  - for the user prompt, ask the compress-service to convert the title of the text-fragment (specified as argument) to it's text-content. If the text fragment has any child text-fragments (sub-headers), also retrieve the text for them and include them in the text that needs to be compressed.
- Useful to check if the gpt service understands the fragment and can be used as input for other processes.
- this service uses a result-cache-service to store all the results and keep track of when the build has gone out-of-date.
- gpt-interface details:
  - name: `double-compress`
  - argument resources:
    - the compress service.

### package extractor service
- gets the list of packages that can be identified from the specified text fragment.
  - use the following system prompt: `You are an ai software developer tasked with writing software for an application called {0}, with as short description: {1}. It is your job to find all the packages that are needed. Make a list of all the packages that need to be installed according to you based on the following part of the application description:`
    - replace 
      - `{0}` with the title of the first text-fragment in the project (which should be the title of the application)
      - `{1}` with the text of the first and second text-fragments in the project, which should contain a short description, including the programming language that is used.
  - for the user prompt, ask the project service to convert the title of the text-fragment (specified as argument) to it's text-content.
- Used to check the validity of the project and during the build process.
- this service uses a result-cache-service to store all the results and keep track of when the build has gone out-of-date.
- gpt-interface details:
  - name: `packages`
  - argument resources:
    - the project

### feature merger service
- searches for features that are about fragment A and which are present in fragment B but can not be found in fragment A.
  - use this system prompt: `You are an ai software developer who is reviewing the feature descriptions for the application called '{0}', described as: '{1}'`
    - replace:
      - `{0}` with the title of the first text-fragment in the project (which should be the title of the application)
      - `{1}` with the text of the first and second text-fragments in the project, which should contain a short description, 
  - the user prompt has to be: `It is your task to search for features that are about {2} which are mentioned in the block about {3}: '{4}' but are not present in: '{5}'`
    - replace:
      - `{2}` with the first argument that was provided to the service (the title of the text-fragment to compare against something else)
      - `{3}` with the second argument that was provided to the service (the title of the second text-fragment, used to compare against the first text-fragment)
      - `{4}` with the text-content of the text-fragment who's title was provided as the second argument to the service.
      - `{5}` with the text-content of the text-fragment who's title was provided as the first argument to the service.
  - as the final system prompt, use: `List all features related to {2} that were found in {3}:`
    - replace:
      - `{2}` with the first argument that was provided to the service (the title of the text-fragment to compare against something else)
      - `{3}` with the second argument that was provided to the service (the title of the second text-fragment, used to compare against the first text-fragment)
- this is an ideation tool to find missing features.
- this service uses a result-cache-service to store all the results and keep track of when the build has gone out-of-date.
- gpt-interface details:
  - name: `features completion`
  - argument resources:
    - the project
    - the project
  

### toolbar completer service
- searches for features about the toolbar that can not be found in the text-fragment.
  - use this system prompt: `You are an ai software developer who is reviewing the feature descriptions in search for buttons, drop-downs, inputs, toggles or other components that are missing from the toolbar for the application called '{0}', described as: '{1}'. Currently, the toolbar has: {2}`
    - replace:
      - `{0}` with the title of the first text-fragment in the project (which should be the title of the application)
      - `{1}` with the text of the first and second text-fragments in the project, which should contain a short description, 
      - `{2}` with the text-content of the compressed version for the 'toolbar' text-fragment. This value is provided by the compress-service and is calculated for the 'toolbar' text-fragment.
    - the user prompt has to be: `Which toolbar items are mentioned in the following text and are missing from the current toolbar description: {3}`
    - replace:
      - `{3}` with the text-content of the text-fragment who's title was provided as the first argument to the service.
  - as the final system prompt, use: `Remember, make a list of all missing components and which actions they should perform.`
- this is an ideation tool to find missing features.
- this service uses a result-cache-service to store all the results and keep track of when the build has gone out-of-date.
- gpt-interface details:
  - name: `toolbar completion`
  - argument resources:
    - the project

### missing features service
- tries to find features which gpt thinks are missing and are about the subject that is found in the fragment.
  - use the system prompt: `You are an ai software developer who is reviewing the feature descriptions for the application called '{0}', described as: '{1}'`
    - replace:
      - `{0}` with the title of the first text-fragment in the project (which should be the title of the application)
      - `{1}` with the text of the first and second text-fragments in the project, which should contain a short description, 
    - the user prompt has to be: `It is your task to find all the features regarding '{2}' that are not mentioned in: {3}`
      - replace:
        - `{2}` with the first argument that was provided to the service 
        - `{3}` with the text-content of the text-fragment who's title was provided as the first argument to the service.
    - as the final system prompt, use: `List all missing features.`
- this is an ideation tool to find missing features.
- this service uses a result-cache-service to store all the results and keep track of when the build has gone out-of-date.
- gpt-interface details:
  - name: `missing features`
  - argument resources:
    - the project

### feature generator service
- takes the double-compressed version of the fragment and asks gpt to list features it thinks should be included.
  - use the system prompt: `You are an ai software developer who is working on the feature descriptions for the application called '{0}', described as: '{1}'`
    - replace:
      - `{0}` with the title of the first text-fragment in the project (which should be the title of the application)
      - `{1}` with the text of the first and second text-fragments in the project, which should contain a short description, 
    - the user prompt has to be: `It is your task to find all the features regarding '{2}', described as: {3}`
      - replace:
        - `{2}` with the first argument that was provided to the service 
        - `{3}` with the text-content of the text-fragment who's title was provided as the first argument to the service. The text-content is retrieved from teh double-compress service (if it doesn't exist yet, generate it first).
    - as the final system prompt, use: `List all required features.`
- this is an ideation tool to find missing features.
- this service uses a result-cache-service to store all the results and keep track of when the build has gone out-of-date.
- gpt-interface details:
  - name: `feature ideas`
  - argument resources:
    - the double compress service

### component lister service
- makes a list of all the components that it can identify in the specified text fragment, together with a short description of each component.
  - use the system prompt: `You are an ai software developer who is reviewing the feature descriptions for the application called '{0}', described as: '{1}'`
    - replace:
      - `{0}` with the title of the first text-fragment in the project (which should be the title of the application)
      - `{1}` with the text of the first and second text-fragments in the project, which should contain a short description, 
  - the user prompt has to be: `It is your job to list all the components that are regarding '{2}' and which are defined in the following part of the application description: {3}`
      - replace:
        - `{2}` with the first argument that was provided to the service (the title of the text-fragment to process).
        - `{3}` with the text-content of the text-fragment who's title was provided as the first argument to the service.
    - as the final system prompt, use: `Do not include UI components that are provided by the UI framework. So don't include: buttons, dropdowns, inputs, sliders, toggle buttons, but only list the components that need to be custom built and which aren't service classes related to the backend.`
- Used to check the validity of the project and during the build process.
- this service uses a result-cache-service to store all the results and keep track of when the build has gone out-of-date.
- gpt-interface details:
  - name: `components`
  - argument resources:
    - the project

### class lister service
- The class-lister service is responsible for making a list of all the classes that it can identify in the specified text fragment and which aren't components.
  - use the system prompt: `You are an ai software developer who is reviewing the feature descriptions for the application called '{0}', described as: '{1}'`
    - replace:
      - `{0}` with the title of the first text-fragment in the project (which should be the title of the application)
      - `{1}` with the text of the first and second text-fragments in the project, which should contain a short description, 
  - the user prompt has to be: `It is your job to list all the classes and features which are not UI components that are regarding '{2}' and which are defined in the following part of the application description: {3}`
      - replace:
        - `{2}` with the first argument that was provided to the service (the title of the text-fragment to process).
        - `{3}` with the text-content of the text-fragment who's title was provided as the first argument to the service.
    - as the final system prompt, use: `Only list the services and constants which need to be custom built, so are not part of an imported library and are not part of the user interface.`
- Used to check the validity of the project and during the build process.
- this service uses a result-cache-service to store all the results and keep track of when the build has gone out-of-date.
- gpt-interface details:
  - name: `classes`
  - argument resources:
    - the project

### constant lister service
- The constant lister service is responsible for making a list of all the constants that need to be made according to the specified text fragment and which aren't components.
  - use the system prompt: `You are an ai software developer who is reviewing the feature descriptions for the application called '{0}', described as: '{1}'`
    - replace:
      - `{0}` with the title of the first text-fragment in the project (which should be the title of the application)
      - `{1}` with the text of the first and second text-fragments in the project, which should contain a short description, 
  - the user prompt has to be: `It is your job to list all the classes and features which are not UI components that are regarding '{2}' and which are defined in the following part of the application description: {3}`
      - replace:
        - `{2}` with the first argument that was provided to the service (the title of the text-fragment to process).
        - `{3}` with the text-content of the text-fragment who's title was provided as the first argument to the service.
    - as the final system prompt, use: `Only list the services and constants which need to be custom built, so are not part of an imported library and are not part of the user interface.`
- Used to check the validity of the project and during the build process.
- this service uses a result-cache-service to store all the results and keep track of when the build has gone out-of-date.
- gpt-interface details:
  - name: `classes & constants`
  - argument resources:
    - the project


### import discovery service
- makes a list of all the components, services, classes and constants that text fragment A uses and which are defined by text fragment B
  - use the system prompt: `You are an ai software developer who is reviewing the feature descriptions for the application called '{0}', described as: '{1}'`
    - replace:
      - `{0}` with the title of the first text-fragment in the project (which should be the title of the application)
      - `{1}` with the text of the first and second text-fragments in the project, which should contain a short description, 
  - the user prompt has to be: 
  ```
  It is your task to list all items from the following set: '{2}' 
  extracted from: '{3}'
  that are used in the section about {4}: '{5}'
  ```
    - replace:
      - `{2}` with the concatenated (use ', ') text-content produced by the component lister service and the class & constants lister service.
        - concatenate each line of the result of each service so that it produces a string like: 'a, b, c, d'
      - `{3}` with the text-content, produced by the compress-service of the second argument that was provided to the function (the title of the second text-fragment)
      - `{4}` with the title was provided as the first argument to the service.
      - `{5}` with the text-content of the text-fragment who's title was provided as the first argument to the service.
  - as the final system prompt, use: `List all items from the previously provided set that are used in {4}:`
    - replace:
      - `{4}` with the title was provided as the first argument to the service.
- Used to check the validity of the project and during the build process.
- this service uses a result-cache-service to store all the results and keep track of when the build has gone out-of-date.
- gpt-interface details:
  - name: `import discovery`
  - argument resources:
    - the project
    - compress-service


### file lister service
- creates a list of files that should be generated for a text-fragment (containing 1  or more components, classes or constants).
  - use the system prompt: `You are an ai software developer who is preparing to write the code for the application called '{0}', described as: '{1}'`
    - replace:
      - `{0}` with the title of the first text-fragment in the project (which should be the title of the application)
      - `{1}` with the text of the first and second text-fragments in the project, which should contain a short description, 
  - the user prompt is: 
  ```
  It is your task to list all files that need to be generated to write code for the following items: '{2}' 
  extracted from the section about '{3}: '{4}'
  ```
    - replace:
      - `{2}` with the concatenated (use ', ') text-content produced by the component lister service and the class & constants lister service.
        - concatenate each line of the result of each service so that it produces a string like: 'a, b, c, d'
      - `{3}` with the title was provided as the first argument to the service.
      - `{4}` with the text-content of the text-fragment who's title was provided as the first argument to the service.
  - as the final system prompt, use:
  ```
  The response should follow these rules:
  - Try to add each component, class or service in it's own file
  - do not add paths to the files, only provide the file names and list the items that are in each file.
  - Do not add any explanation, only return a json array containing objects with the following fields:
    - the name of the file
    - a list of all the items that the declared in the file
  Write the list of files.
  ```
- Used to check the validity of the project and during the build process.
- this service uses a result-cache-service to store all the results and keep track of when the build has gone out-of-date.
- gpt-interface details:
  - name: `file list`
  - argument resources:
    - the project


### public discovery service
- The public discovery service can perform the following tasks:
  - make a list of methods, functions, fields and props that text fragment A uses and which are defined by text fragment B. This can be done in function of a specific component that was discovered in fragment B.
  - use the system prompt: `You are an ai software developer who is preparing to write the code for the application called '{0}', described as: '{1}'`
    - replace:
      - `{0}` with the title of the first text-fragment in the project (which should be the title of the application)
      - `{1}` with the text of the first and second text-fragments in the project, which should contain a short description, 
  - the user prompt is: 
  ```
  It is your task to list all functions, methods, properties and fields that need to be provided in the interfaces of '{2}' as defined in: '{3}'
  so that '{2}' can be used in: '{4}'
  ```
    - replace:
      - `{2}` with the concatenated (use ', ') text-content produced by the component lister service, the class lister service and the constant lister service.
        - concatenate each line of the result of each service so that it produces a string like: 'a, b, c, d'
      - `{3}` with the text-content of the text-fragment who's title was provided as the first argument to the service.
      - `{4}` with the text-content of the text-fragment who's title was provided as the second argument to the service.
  - as the final system prompt, use:
  ```
  The response should follow these rules:
  - Do not add any explanation, only return a json array containing objects with the following fields:
    - the name of the function, method, property or field
    - what type it is: a function, method, property or field
    - a short description
  Write the required public interfaces.
  ```
- Used to check the validity of the project and during the build process.
- this service uses a result-cache-service to store all the results and keep track of when the build has gone out-of-date.
- gpt-interface details:
  - name: `public interfaces`
  - argument resources:
    - the project
    - the project


### code generator
- The code generator service is responsible for putting the results of all the other services together to generate the final outcome of the project.
- The generate function performs the following tasks:
  - for each file produced by the file lister service:
    - writes a file to disk containing the component, class and/or constant definitions defined in the text fragment.
    - uses the output of:
      - file lister service: to get the list of files that need to be generated for a text-fragment
      - component lister service: to get the list of components that need to be generated
      - class & constants lister service: to get all the classes and constants that need to be rendered for the specified text-fragment.
      - import discovery service: to get a list of all the imports that need to be included
      - public discovery service: to find out what should be included in the render.
    - use the system prompt: `You are an ai software developer who is writing the code for the application called '{0}', described as: '{1}'`
      - replace:
        - `{0}` with the title of the first text-fragment in the project (which should be the title of the application)
        - `{1}` with the text of the first and second text-fragments in the project, which should contain a short description, 
    - the user prompt is: 
    ```
    It is your task to to write all the code for the file: '{2}', which has to contain the following:
    components: {3}
    classes: {3}
    constants: {5}
    The file needs to import: {6}
    the required functionality is described as: {7}
    ```
      - replace:
        - `{2}` the name of the file to generate. This is retrieved from the file-lister service for the text-fragment that is supplied as first argument to the service. The result of the file-lister may contain multiple files. In that case, the prompt is repeated for each file.
        - `{3}` the list of components that was retrieved from the text-fragment whose code is being generated.
          - for each component, the public interface that was discovered by the public-discovery service is also included
          - only include the 'components' part in the prompt if there are any components to be generated.
        - `{4}` the list of classes that was retrieved from the text-fragment whose code is being generated.
          - for each class, the public interface that was discovered by the public-discovery service is also included
          - only include the 'classes' part in the prompt if there are any components to be generated.
        - `{5}` the list of constants that was retrieved from the text-fragment whose code is being generated.
          - for each constant, the public interface that was discovered by the public-discovery service is also included
          - only include the 'constants' part in the prompt if there are any components to be generated.
        - `{6}` the result from the import discovery service that was generated for the text-fragment whose code is being generated.
        - `{7}` the text-fragment whose title was provided as the first argument
    - as the final system prompt, use:
    ```
    The response should follow these rules:
    - Only write the contents of the file and only what is supposed to go into the file
    - Do not add any explanation
    - adhere to the following code style: {7}
    Write the file.
    ```
      - replace: `{7}`: the content of the code-style provided by the project service.
- Used to check the validity of the project and during the build process.
- this service uses a result-cache-service to store all the results and keep track of when the build has gone out-of-date.
- gpt-interface details:
  - name: `code generator`
  - argument resources:
    - the project  

### unit test generator
- renders a unit-test for the specified component, class or constant.
  - uses the output of:
    - file lister service: to get the filename that contains the component for which a test is generated
    - public discovery service: to find out what should be included in the render.
  - use the system prompt: `You are an ai software developer who is writing unit test code for the application called '{0}', described as: '{1}'`
    - replace:
      - `{0}` with the title of the first text-fragment in the project (which should be the title of the application)
      - `{1}` with the text of the first and second text-fragments in the project, which should contain a short description, 
  - the user prompt is: 
  ```
  It is your task to to write all the required test code for the {2}: '{3}'
  which has the following public items: {4},
  the required functionality is described as: {5}
  ```
    - replace:
      - `{2}` with 'class', 'constant', 'component', depending on the type of the item that the service is rendering test code for.
      - `{3}` the name of the item that the service is rendering test code for.
      - `{4}` the public interface that was discovered by the public-discovery service for the item.
      - `{5}` the text-fragment whose title was provided as the first argument
  - as the final system prompt, use:
  ```
  The response should follow these rules:
  - Only write the contents of the file and only what is supposed to go into the file
  - Do not add any explanation
  - adhere to the following code style: {7}
  Write the unit test.
  ```
    - replace: `{7}`: the content of the code-style provided by the project service.
- Used to check the validity of the project and during the build process.
- this service uses a result-cache-service to store all the results and keep track of when the build has gone out-of-date.
- gpt-interface details:
  - name: `unit test generator`
  - argument resources:
    - the project  