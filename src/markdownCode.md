# MarkdownCode
MarkdownCode is an ideation and software building tool driven by machine learning. It allows users to enter text in markdown which is automatically analyzed for various parameters and which can be converted into executable software code.

## development stack
- developed in javascript
- it uses electron as it's runtime
- text editing features are provided by the monaco editor.
- The UI is built using react and antd

## components

### main window
- the main-window component is the the content of the first window that is shown when the application starts.
- it contains the following components:
  - a toolbar: located at the top of the window.
  - a body: this component occupies all of the remaining space in the window

### toolbar

the application uses a toolbar similar to applications like mS Access, excel, word or draw: a single integrated menu and toolbar

- At the top of the toolbar are a nr of tabs
- all components on the toolbar have a tooltip containing a short description of the action.

the following tabs are available:
- home
- format
- preferences

#### home

- The home tab is the component that is used as the main tab of the toolbar. This is first shown when the application starts.
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
    - show a dialog box to select a file (use the default electron dialog box for this)
    - if a file is selected, ask the project service to load the file.
    - wrap in an exception handler that shows an error dialog
  - save: a button to save the current project to file.
    - enabled when the project service has a filename for the project and the undo service has undo data (indicating that the project has changed since the last save).
    - if the project file does not yet have a filename, show a save-as dialog
    - if the user doesn't provide a valid filename, stop the action
    - if the user provides a valid filename,
      - call the project-service 'save' function with filename as param.
    - if the project service already has a filename,
      - call project service save without param.
    - wrap in an error handler and show the error
  - save as: a button to save the current project to a new location.
    - enabled the undo service has undo data (indicating that the project has changed since the last save).
    - show an electron save-as dialog
    - if the user selects a file, ask the project-service to save the project to the new location.
    - wrap in an exceptions handler and show the error
  - auto-save: a toggle button, when pressed, asks the project service to update the auto-save state.
    - the toggle button's state follows that of the project service's auto-save state.
  
##### edit section
- the edit-section component contains actions related to the clipboard and the currently selected data.
- it supports the following actions
  - cut: a button to initiate the cut command of the selection service
    - enabled when the selection service has any data marked as selected.
  - copy: a button to initiate the copy command of the selection service
    - enabled when the selection service has any data marked as selected.
  - paste: a button to initiate the paste command of the selection service
    - enabled when the clipboard contains text data.
  - delete: a button to initiate the delete command of the selection service
    - enabled when the selection service has any data marked as selected.
  - select all: a button to select all the text in the currently active window.
  - clear selection: a button to clear the current selection buffer.
    - enabled when the selection service has any data marked as selected.

##### undo section
- the undo-section component contains actions that the undo / redo service can perform.
- it supports the following actions
  - undo: a button to undo the last action, performed by the current project's undo-service
    - enabled when the project's undo-service has undo actions
  - redo: a button to redo the last action, preformed by the project's undo service.
    - enabled when the undo-service has redo actions

##### build section
- the build-section component contains actions that the build-service can perform.
- it supports the following actions
  - all: a button to start rendering all the code for the entire project.
    - enabled when the result-cache of any of the services in the GPT-service's list has an out-of-date result fragment or missing result fragments.
  - code for active topic: a button to start rendering all the code files for the currently active fragment.
    - enabled when the selected fragment is out-of-date or missing in any of the result-caches of any of the services in the GPT-service's list.
  - active topic in active prompt
    - enabled when the selected fragment is out-of-date or missing in the service related to the currently selected 

#### format
- the format-tab component contains various commands to format the entire document, selected text or to activate a formatting style starting from the current cursor position.
- this toolbar tab has the following sections:
  - style
  - paragraph
  - font

##### style section
- the style-section component contains actions related to the markup used in the text for applying markdown formatting.
- whenever the text selection is changed, the state of the toggle buttons is updated to reflect the state of the selected text.
- it supports the following actions
  - paragraph style: this is a toggle group where the user can make a selection between one of the items
    - only 1 item can be selected at the same time, it is not possible to have no selection at all.
    - each item is represented as a button.
    - all the buttons are lined up in a single row.
    - when a button is pressed, the selected style is applied as markdown to the text that's currently in the selection service.
    - buttons in the group:
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
  - GPT
  - View
  
##### GPT section:
- the GPT-section component contains actions related to the configuration of the GPT service.
- it supports the following actions
  - key: this button opens a dialog box where the user can enter his api-key that will be used for api-calls with the open-ai platform.
  - model: this is a combobox where the user can select which default model should be used when requests are sent to open-ai.
    - the list of available models used to populate the combobox, comes from the gpt-service.
  
##### view section:
- the view-section component contains actions related to the configuration of the appearance of the application
- it supports the following actions
  - theme: this is a combobox where the user can select the preferred color mode: light or dark mode. This maps to the theme used by the monaco editor.
  - font: this is a combobox that the user can use to select the font that is used by the monaco editor and markdown viewer.
  - font-size: this is a combobox that the suer can use to select the size of the font in the monaco editor and markdown view.

### body
- the body component represents the main body of the application.
- it consists out of the following areas:
  - an outline: this component is aligned to the left of the body
  - a results view: this component is located at the bottom of the body.
  - an editor: this component fills the remainder of the space.
- These areas can be resized using a horizontal or vertical splitter. 
  - So there is a vertical splitter between the outline and the rest
  - a horizontal splitter between the results-view and the editor.

#### editor
- the first and primary view in the body, is the editor component which displays the markdown text of the currently loaded project.
- to display the markdown text, the monaco editor npm package is used.
- when the user moves the cursor to another line, the editor asks the position-tracking service to update the currently selected line

#### outline
- the outline component is positioned to the left of the editor
- it contains a tree representing te outline of the currently active project: all markdown headings in the document are present in the outline
- a tree structure is used to display the relationship between titles: text-fragments that have a heading of level 1, become the root items, text-fragments with level 2 headings become the children of the first  previous text-fragment of a higher level. An example of a tree:
  - # app title
    - ## specs
    - ## components
      - ### comp 1
    - ## services
      - ### service 1
- when the user clicks on a tree item, the related text is scrolled into view on the editor.
- this component monitors the position-tracking service for changes to the currently selected text-fragment.
  - when the position changes, set the corresponding tree-item as selected.


#### results view
- the results-view component is positioned at the bottom of the main body
- the user can view the results that were generated by the services that were registered with the gpt-service, for the currently selected text block.
- For each service in the services list provided by the gpt-service, this view creates a tab.
  - the tabs are located at the top of the view (to the left)
  - the service name is used as the title of the tab
  - the tab content shows:
    - in the center: a monaco editor containing the result from the result-cache of the service, if available (could be that it's not yet available)
      - if the result is marked as out-of-date, show the text as grayed-out.
      - if the text is an overwritten version of the service output, show the text in red. (dark-red for the light theme, light-red for the dark theme)
    - in the top right corner is a 'more' button that opens a context menu. This context menu has the following menu items:
      - model for all: select the gpt model to be used by the service associated with the current tab.
        - the sub menu items are provided by the gpt-service's list of available models.
        - the menu item that contains the name of the currently selected model, is shown as selected.
          - Get the value for the current model, registered under the name of the current service, from the gpt-service
        - when an other model is selected, ask the gpt-service to update the model-name for the name of the service related to the results-view.
      - model for fragment: select the gpt model to be used by the service associated with the current tab, for the currently active fragment.
        - the sub menu items are provided by the gpt-service's list of available models.
        - the menu item that contains the name of the currently selected model, is shown as selected.
          - Get the value for the current model, registered under the name of the current service and current fragment-title, from the gpt-service
        - when an other model is selected, ask the gpt-service to update the model-name for the name of the service related to the results-view and the current fragment-title.
    - next, to the right of the previous button, is a 'refresh' button. When pressed, the service will update the result.
  - when the users performs edits in the monaco-editor of the tab, all changes are stored back in the result-cache of the service, marked as 'overwritten'
    - 
- the user can copy the current text displayed in the center to the clipboard.
- the view monitors the position-tracking service for changes to the currently selected text-fragment. 
  - when this changes update the content of the currently active tab by setting the selected value of the first combobox to the header-title of the text-fragment.


## services
- The application makes use of a number of services to perform actions that are often shared across multiple components.
- all service functions that the user can trigger directly, should do proper error handling so that when an error occurs, a dialog box is shown to the user. 
- The dialogBox of the electron app should be used to display errors.

### Theme service
- The theme service is responsible for managing the currently selected theme.
- The service allows for a selection between a light or dark theme.
- Every component uses this service to retrieve the currently selected theme so it can apply this.
- The main window refreshes it's entire content when the selected theme is updated.

### project service
- the project service is responsible for:
  - creating a new project
    - all data is cleared from the project's data list
    - all registered gpt-services recreate their cache object.
    - an event is raised to indicate that the data has changed (for the project-editor & and results-view components, if they are opened)
  - opening an existing project.
    - read the contents of the file that is specified as a parameter. Read it as a string.
    - split the file in lines
    - for each line in the file, parse it and store the result object of the parse in the project's data list. This way, the list has an item for each line at the same index number as the line number in the file.
    - fore each registered gpt-service, recreate the cache object, with as parameter the name of the existing cached file so that it can be loaded again.
    - raise an event to indicate that the data has changed (for the project editor)
  - saving the currently opened project.
    - open the file that was specified in the argument, for writing
    - convert all the parsed objects in the data list to a string and write to file
      - each object has a title and a list of lines.
    - reset the indicator that the project has changed
    - save the filename in the project service if the auto-save function needs to use it.
  - updating the project's data list whenever the user makes changes in the markdown editor. 
    - The markdown editor calls an update function provided by the project, whenever the user edits the document.
    - the item in the data-list at the specified line is updated and any possible links to and from other items in the data list are updated.
  - manage a data-list of the currently loaded data and provide the following functions to work with this data list:
    - retrieve a tree-structure (where each item in the tree represents a header that is used in the project) to be used in the outline or in drop-down boxes on the results-view.
    - convert a title (aka header) to the full text:
- the project service also keeps track of some user configs like:
  - wether auto-save is on or not. This value is stored in the local storage. If it is turned on, whenever the update function is called, an auto-save timer is triggered or reset. When this auto-save timer goes off, the project is automatically saved. If the project doesn't yet have the filename, a temporary filename is generated and the file is saved there.
  - the code-style that should be applied when rendering source code. This is declared in a text file as markdown.

### Selection service
- The selection service is a global singleton object that keeps track of the currently selected text.


### Undo service
- The undo service keeps track of all the text edits that the user perforsms on the various monaco-editors.
- It has an undo and redo list.

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
    - get-result: returns the result that the service has calculated for the specified project text-fragment (identified by the key of the text-fragment).

### result-cache service
- this service manages previously retrieved results for other services.
- It allows other services that perform calculations on text fragments, to store these results for each text fragment and keep track if the result has become out of date or not (the original text fragment has changed).
- because some services work on text fragments that come from the project directly and others that come from the result of other services, the result cache must be able to monitor changes in a project fragment and result fragment.
- A service that wants to cache it's results uses an instance of this class to perform these tasks on it's results.
- internally, the cache uses a dictionary that maps the keys to their results.
- whenever the service calculates a result, it asks the cache to update it's dictionary:
  - first the key is calculated (by the service):
    - the first part of the key is the key of the project text-fragment which was the primary input for the service.
    - for every extra result-value coming from other services that the service uses to calculate the current result, the key of the result value is appended to the new key, separated with a '|'.
    example: 
      - if the service is processing text-fragment with key 'a > b' 
      - and the service uses the result of the 'class lister' service, where the result, for this calculation, comes from the text-fragment with the key 'c > d'
      - than the key would become 'a > b | c > d' 
  - if the key is not yet present, a new cache-item object is created which contains:
    - the result of the service
    - the current state: still-valid (instead of out-of-date)
  - if the key is already present:
    - the cache item is retrieved,
    - it's result is updated to still-valid
  - for each text-fragment in the inputs of the service (each section separated with '|'), the cache will also:
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
    - ask the compress service to render it's result.
  


### compress service
- The compress service takes a text fragment and asks the gpt service to make it shorter.
- the get-result function calls the GPT-service with the following parameters:
  - messages:
    - role: system, content:
      ```
      Act as an ai software analyst. You are reviewing the feature description of an application. It is your job to shorten the following text as much as possible and rephrase it in your own words, without loosing any meaning.
      Any text between markdown code blocks (``` or \""" signs) are declarations of constant values, do not change them, but replace with the name of the constant. Remove the markdown, but use bullet points where appropriate.
      compress the following text:
      ``` 
    - role: user content: the content of the text fragment to process.
- Useful to check if the gpt service understands the fragment and can be used as input for other processes.
- this service uses a result-cache-service to store all the results and keep track of when the build has gone out-of-date.
  - whenever the get-result function is called, the result-cache is updated.
  - the result of get-result is stored under the same key as the input parameter of get-result
- gpt-interface name: `compress`
