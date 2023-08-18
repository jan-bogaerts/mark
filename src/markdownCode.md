# MarkdownCode
MarkdownCode is an ideation and software building tool driven by machine learning. It allows users to enter text in markdown which is automatically analyzed for various parameters and which can be converted into executable software code.

## development stack
- developed in javascript
- it uses electron as it's runtime
- The UI is built using react and antd

## components

### main window
- the main-window component is the content of the first window that is shown when the application starts.
- it contains the following components:
  - a toolbar: located at the top of the window.
  - a body: this component occupies all of the remaining space in the window

### toolbar

the application uses a toolbar similar to applications like mS Access, excel, word or draw: a single integrated menu and toolbar

- At the top of the toolbar are a nr of tabs (use the tabs from the antd library)
- all components on the toolbar show a tooltip (from the antd library) containing a short description of the action.

the following tabs are available:
- home: this is shown as the first tab when the application starts.
- format
- preferences

#### home
- the home-tab component is a wrapper that displays it's children in a row.
- This component contains the following child components :
  - file section
  - edit section
  - undo section
  - build section
  
##### file section
- the file-section component contains actions related to the project and file management.
- all buttons use an appropriate icon as content, no text.
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
- The undo service needs to be monitored for changes so that the state of the buttons can be updated.
  
##### edit section
- the edit-section component contains actions related to the clipboard and the currently selected data.
- all buttons use an appropriate icon as content, no text.
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
- all buttons use an appropriate icon as content, no text.
- the service supports the following actions
  - undo: a button to undo the last action
    - enabled when the undo-service has undo actions. 
    - calls the undo-service's undo function
  - redo: a button to redo the last action, preformed by the project's undo service.
    - enabled when the undo-service has redo actions
    - calls the undo-service's redo function.
- The undo service needs to be monitored for changes so that the state of the buttons can be updated.

##### build section
- the build-section component contains actions that the build-service can perform.
- all buttons use an appropriate icon as content, no text.
- it supports the following actions
  - all: a button to start rendering all the code for the entire project.
    - enabled when the result-cache of any of the services in the GPT-service's list has an out-of-date result fragment or missing result fragments.
  - code for active topic: a button to start rendering all the code files for the currently active fragment.
    - enabled when the selected fragment is out-of-date or missing in any of the result-caches of any of the services in the GPT-service's list.
  - active topic in active prompt
    - enabled when the selected fragment is out-of-date or missing in the service related to the currently selected 

#### format
- the format-tab component is a wrapper that displays it's children in a row.
- This component contains the following child components :
  - style section
  - paragraph section
  - font section

##### style section
- the style-section component contains actions related to the markup used in the text for applying markdown formatting.
- all buttons use an appropriate icon as content, no text.
- there is a button for each of the following formatting styles:
  - heading 1
  - heading 2
  - heading 3
  - heading 4
  - heading 5
  - heading 6
  - paragraph
  - quote
  - code
  - bullet list
  - numbered list
- when a button is pressed, the formatting style is applied to the currently selected text in the selection-service.
- only 1 button can be selected at the same time, it is not possible to have no selection at all.
- all the buttons are lined up in a single row.    
- the selection-service (not a component) is monitored for changes in the currently selected text. whenever the text selection is changed, the state of the toggle buttons is updated to reflect the style of the currently selected text. The selection service provides a method for retrieving the style of the currently selected text.

Remember that each button needs it's own appropriate icon.

##### paragraph section
- the paragraph-section component contains actions related to the markup used in the text for applying markdown formatting.
- all buttons use an appropriate icon as content, no text.
- it supports the following actions
  - indent: a button to increase the indent of the current line or selection. The selection-service performs this action on the selected text or current cursor position.
  - unindent: a button to decrease the indent of the current line or selection. The selection-service performs this action on the selected text or current cursor position.

  
##### font section
- the font-section component contains actions related to the markup used in the text for applying markdown formatting.
- all buttons use an appropriate icon as content, no text.
- whenever the text selection is changed (in the selection-service), the state of the toggle buttons is updated to reflect the state of the selected text.
- it supports the following actions
  - bold: a toggle button to set the bold state on/off on the selected text and to show the state of the current selection. 
  - italic: a toggle button to set the italic state on/off on the selected text and to show the state of the current selection. 
  - underline: a toggle button to set the underline state on/off on the selected text and to show the state of the current selection. 
  - strike-though: a toggle button to set the strike-through state on/off on the selected text and to show the state of the current selection. 

#### preferences
- the preferences-tab component is a wrapper that displays it's children in a row.
- This component contains the following child components :
  - GPT
  - View
  
##### GPT section
- the GPT-section component contains actions related to the configuration of the GPT service.
- all buttons use an appropriate icon as content, no text.
- The GPT-section component keeps track of the open state of the 'open-ai configuration dialog'
- it supports the following actions
  - key: this button opens the 'open-ai configuration dialog'.
    - use a key for the icon.
  - model: the ModelComboBox component (Select in antd) where the user can select the default model for requests sent to open-ai.
    - the list of available models used to populate the combobox, comes from the gpt-service.
    - get the initial value for the combobox from the gpt-service.
    - when the value is changed, save to the gpt-service.

##### open-ai configuration dialog
- The open-ai configuration dialog is a modal dialog (from the antd library) implementation that is used to edit the open-ai configuration settings.
- the top of the dialog contains a title with short description.
- the dialog contains an input box where the user can enter his api-key that will be used for api-calls with the open-ai platform.
  - When the dialog box opens, the current value of the api-key is retrieved from the gpt-service and shown in the input box.
- At the bottom of the dialog box are 2 buttons:
  - cancel: close the modal dialog without saving the value.
  - ok: close the modal dialog after saving the new api-key value to the gpt-service. 
  
##### view section
- the view-section component contains actions related to the configuration of the appearance of the application
- all buttons use an appropriate icon as content, no text.
- it supports the following actions
  - theme: this is a combobox where the user can select the preferred color mode: light or dark mode. This value is linked to the value of the theme-service that manages the currently selected theme.
  - font: this is a combobox that the user can use to select the font for the markdown text. This value is linked to the value of the theme-service.
  - font-size: this is a combobox that the suer can use to select the size of the font for the markdown text. This value is linked to the value of the theme-service.

### body
- the body component represents the main body of the application.
- it's entire area is filled with a horizontal splitter component.
  - on the left of the horizontal splitter is an outline component.
  - to the right is a vertical splitter component.  
    - at the top of the vertical splitter component is an editor component
    - at the bottom of the vertical splitter component is a results view component
- The body component has an event handler for the 'onPositionChanged' callback of both the horizontal and vertical splitter that will store the new value for it's position.
- When the body component is unloaded, the last position of the horizontal and vertical splitters are stored in the local storage.
- When te body component is loaded, the last position of the horizontal and vertical splitters are restored from the local storage, but only if the previous value fits in the current size of the component, otherwise 1/3 of the width for the vertical splitter is used and 1/3 of the component's height is used for the horizontal splitter.

#### horizontal splitter
- The horizontal splitter is a component that is responsible for managing the layout of 2 child components so that users can increase the size of the panel above the splitter while simultaneously decreasing the size of the panel below it, or vice versa.
- The horizontal-splitter component has the following properties:
  - top: the component that should be placed at the top
  - bottom: the component that should be placed at the bottom
  - position: the height assigned to the bottom component
  - onPositionChanged: a callback function, called when the position value should be updated. This callback has 1 parameter: the new value for position (number)
- between the bottom and top component, the splitter puts a div component of 8 pixels high. When the user drags this bar up or down, the onPositionChanged callback is called (when provided) with the new position value.

#### vertical splitter
- The vertical splitter is a component that is responsible for managing the layout of 2 child components so that users can increase the width of the panel to the left of the splitter while simultaneously decreasing the size of the panel right of it, or vice versa.
- The vertical-splitter component has the following properties:
  - left: the component that should be placed to the left
  - right: the component that should be placed to the right
  - position: the width assigned to the left component
  - onPositionChanged: a callback function, called when the position value should be updated. This callback has 1 parameter: the new value for position (number)
- between the left and right component, the splitter puts a div component of 8 pixels wide. When the user drags this bar left or right, the onPositionChanged callback is called (when provided) with the new position value.

#### editor
- The editor component displays markdown text. 
- to display the markdown text, the monaco editor npm package is used.
- When the editor is loaded:
  - the text for the monaco editor is retrieved from the project service.
  - theme (light or dark), font & font-size are retrieved from the theme-service and applied to the monaco editor.
- the project service is monitored for changes to the text (ex: when another project is loaded).
- when the user changes the text in the monaco editor, the new text is saved to the project service. The position-tracking service is also updated.
- when the user moves the cursor to another line, the editor asks the position-tracking service to update the currently selected line
- the monaco editor always occupies all the space that is available.

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

### dialog service
- the dialog service is a global singleton that provides a common interface for other components and services to show dialog boxes.
- the service can show a dialog box for errors, warnings and info.
- all actions or functions that the user can trigger from a component, should be wrapped in a proper error handler so that when an error occurs, an electron dialog box is shown to the user with details on the error. 

### Theme service
- The theme service is a global singleton, responsible for managing the currently selected theme: when the selected theme is changed, the new value is saved to the local storage. When the service is created, the value previously stored in local storage, is retrieved.
- The service allows for a selection between a light or dark theme.
- Every component uses this service to retrieve the currently selected theme so it can apply this. Components don't need to subscribe for changes to the selected theme value, they only need to retrieve this value from the theme service and use the styling names, based on the selected. theme.
- The main window refreshes it's entire content when the selected theme is updated.

### project service
- the project service is a global singleton that is responsible for:
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
- The undo service is a global singleton that keeps track of all the text edits that the user performs on the various monaco-editors.
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
- the GPT service is a global singleton that is responsible for communicating with the open-ai api backend. It is primarily used by other services that perform more specific tasks.
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
- the build service is a global singleton that turns the markdown project data list into source code. It uses a set of gpt-services to iteratively generate conversions on the different text frames, starting with the original markdown code and finally ending with source code files that are stored on disk.
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
