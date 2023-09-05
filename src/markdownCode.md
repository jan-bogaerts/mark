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
- it contains the following actions:
  - all: a button to start rendering all the code for the entire project.
    - enabled when the result-cache of any of the transformers in the cybertron-service's list has an out-of-date result fragment or missing result fragments.
  - code for active topic: a button to start rendering all the code files for the currently active fragment.
    - enabled when the selected fragment is out-of-date or missing in any of the result-caches of any of the transformers in the cybertron-service's list.
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
    - get the initial value for the combobox from the gpt-service (getDefaultModel function).
    - when the value is changed, save to the gpt-service (setDefaultModel function).

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
  - theme: this is a combobox where the user can select the preferred color mode: light or dark mode. This value is linked to the value of the theme-service that manages the currently selected theme (get & set current theme).
  - font: this is a combobox that the user can use to select the font for the markdown text. This value is linked to the value of the theme-service (get & set current font). Supported fonts: Consolas (monospace) Helvetica (sans-serif), Arial (sans-serif), Arial Black (sans-serif), Verdana (sans-serif), Tahoma (sans-serif), Trebuchet MS (sans-serif), Impact (sans-serif), Gill Sans (sans-serif), Times New Roman (serif), Georgia (serif), Palatino (serif), Baskerville (serif), Andalé Mono (monospace), Courier (monospace), Lucida (monospace), Monaco (monospace), Bradley Hand (cursive), Brush Script MT (cursive), Luminari (fantasy), Comic Sans MS (cursive)
  - font-size: this is a combobox that the user can use to select the size of the font for the markdown text. This value is linked to the value of the theme-service (get & set current font-size). It supports values ranging from 6px up to 50px.

### body
- the body component represents the main body of the application.
- it's entire area is filled with a horizontal splitter component.
  - on the left of the horizontal splitter is an outline component.
  - to the right is a vertical splitter component.  
    - at the top of the vertical splitter component is an editor component
    - at the bottom of the vertical splitter component is a results view component
- The body component has an event handler for the 'onPositionChanged' callback of both the horizontal and vertical splitter that will store the new value for it's position (number).
- When the body component is unloaded, the last position of the horizontal and vertical splitters are stored in the local storage.
- When the body component is loaded:
  - the last position of the horizontal and vertical splitters are restored from the local storage, 
  - the clientWidth & clientHeight of the component are retrieved
  - if there was no previous value for the vertical splitter or the value is bigger then the clientWidth, use the value 'clientWidth / 4' instead
  - if there was no previous value for the horizontal splitter or the value is bigger then the clientHeight, use the value 'clientHeight / 4' instead
  

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
- Whenever the project service raises the 'data-changed' event, the editor will reload the text
- when the user changes the text in the monaco editor, the new text is saved to the project service.
- monitor the following events on the monaco editor:
  - onDidFocusEditorWidget: store a reference to the monaco editor in the selection service to indicate so that it can work with the correct editor.
  - onDidBlurEditorWidget: if the selection service currently references this monaco editor, assign null to the selection service's editor reference.
  - onDidChangeCursorPosition: if the selection service currently references this monaco editor, update the position-tracking service with the new cursor position
  - onDidChangeCursorSelection: if the selection service currently references this monaco editor, inform the subscribers of the selection-service that the selection has changed
- the monaco editor always occupies all the space that is available.

#### outline
- the outline component is positioned to the left of the editor
- it contains a tree representing the outline of the currently active project: all markdown headings in the document are present in the outline
- When the component is loaded and whenever the project-service raises an event to indicate that a new project was loaded, the project data is retrieved from the project-service and converted into a tree structure using the function 'convertToTreeData'.
- Whenever the project service raises an event that a data item was removed, look up the key in the tree structure and remove the node from the tree. Note: also search in the 'children' list of every node recursively until the key is found or at end of tree.
- Whenever the project service raises an event that a data item was added or (multiple) item(s) were changed, rebuild the tree structure.
- when the user selects a tree item, the key of the first selected item is assigned to the position-tracking service's activeFragment
- this component monitors the position-tracking service for changes to the currently selected text-fragment.
  - when the position changes, set the tree's selectedKeys property to the key of the selected text-fragment so that the corresponding tree node becomes selected.
- show the tree with lines

the function 'convertToTreeData' is described as:
  set parent to null
  for every data item:
    create a new node for the data item. Set the title & key of the node to the title & key of the data item. also keep a reference to the data item itself in the node
    if the item's field level-count = 1, add the new node to the root node and make that node the parent 
    else if there is no parent yet, skip the item
    if the item's level count is higher then parent.data.level-count: add the new node to the parent's children. make the new node parent 
    if the item's level count equals parent.data.level-count or is lower:
      get the parent of the current parent until the level count of this new parent is 1 higher then the level count of the item and add the item as a child of this new parent. Make the item the new parent.


#### results view
- the results-view component is positioned at the bottom of the main body
- the user can view the results that were generated by the transformers that were registered with the cybertron-service, for the currently selected text block.
- For each transformer in the transformers list provided by the cybertron-service, this view creates a tab.
  - the tabs are located at the top of the view (to the left)
  - the transformer name is used as the title of the tab
  - the tab content shows a results-view-tab component


##### results view tab
- the results-view-tab component displays the results of a transformer for a particular text-fragment, identified by it's key.
- to display the results as markdown, json data, javascript, html or css, the monaco editor npm package is used.
- The monaco editor fills the full width and height that are available to the component.
- When the results-view-tab is loaded:
  - the text for the monaco editor is retrieved from the result-cache of the transformer that is assigned to this component using the currently assigned key, if available (could be that it's null)
  - theme (light or dark), font & font-size are retrieved from the theme-service and applied to the monaco editor.
- the results-cache of the transformer is monitored for changes in the result (only for changes in the result with the current key).
  - if the result is marked as out-of-date, show the text as grayed-out.
  - if the result is marked as 'overwritten', show the text in red 
- when the user changes the text in the monaco editor, the new text is saved to the result-cache of the transformer, marked as overwritten.
- monitor the following events on the monaco editor:
  - onDidFocusEditorWidget: store a reference to the monaco editor in the selection service to indicate so that it can work with the correct editor.
  - onDidBlurEditorWidget: if the selection service currently references this monaco editor, assign null to the selection service's editor reference.
  - onDidChangeCursorSelection: if the selection service currently references this monaco editor, inform the subscribers of the selection-service that the selection has changed
- put a results-view-context-menu component on top of the monaco editor
- the component monitors the position-tracking service for changes to the currently selected text-fragment. 
  - when this changes update the key value and retrieve the text from the result-cache and show in the monaco-editor


##### results view context menu
- this results-view-context-menu is a component that is a wrapper for the Dropdown antd component.
- it has the properties 'transformer' and 'key' that needs to be supplied 
- The dropdown's content is a 'more' button icon and the trigger for the dropdown is 'click'.
- the 'more' button is positioned in the top-right corner (with a margin of 16px) of the parent as a floating button.
- it contains the following menu items:
  - model for all: select the gpt model to be used by the transformer.
    - the sub menu items are provided by the gpt-service's list of available models (fetched from the internet).
    - the menu item that contains the name of the currently selected model, is shown as selected.
      - Get the value for the current model, registered under the name of the current transformer, from the gpt-service
    - when an other model is selected, ask the gpt-service to update the model-name of the transformer related to the results-view.
  - model for fragment: select the gpt model to be used by the transformer, for the current key.
    - the sub menu items are provided by the gpt-service's list of available models.
    - the menu item that contains the name of the currently selected model, is shown as selected.
      - Get the value for the current model, registered under the name of the current transformer and current key, from the gpt-service
    - when an other model is selected, ask the gpt-service to update the model-name of the transformer and the current title.
  - a splitter
  - refresh: when pressed, the transformer associated with the current tab recalculates the result

## services

### dialog service
- the dialog service is a global singleton that provides a common interface for other components and services to show dialog boxes.
- the service can show a dialog box for errors, warnings and info.
- all actions or functions that the user can trigger from a component, should be wrapped in a proper error handler so that when an error occurs, an electron dialog box is shown to the user with details on the error. 

### Theme service
- The theme service is a global singleton, responsible for managing the currently selected theme font & font-size: when the selected theme, font or font-size is changed, the new value is saved to the local storage. When the service is created, the values previously stored in local storage, are retrieved.
- The service allows for a selection between a light or dark theme.
- Every component uses this service to retrieve the currently selected theme (not the font or font-size)  so it can apply this. Components don't need to subscribe for changes to the selected theme value, they only need to retrieve this value from the theme service and use the styling names, based on the selected. theme.
- The main window refreshes it's entire content when the selected theme is updated.

### project service
- the project service is a global singleton that is responsible for:
  - creating a new project
    - all data is cleared from the project's data list
    - call folder-service.clear
    - ask the gpt=service to have all registered gpt-transformers recreate their cache object (to empty the data).
    - an event is raised to indicate that the data has changed (for the project-editor & and results-view components, if they are opened)
  - opening an existing project.
    - call folder-service.set-location(file-path)
    - read the contents of the file that is specified as a parameter. Read it as a string.
    - split the file in lines
    - for each line in the file, call line-parser-service.parse(line, index).
    - for each transformer that is registered with the cybertron-service, ask the cache object to reload the data file.
    - raise an event to indicate that the data has changed (for the project editor)
  - saving the currently opened project (param: file).
    - if there was no previous file path (first time project is saved), call folder-service.move(file)
    - if the previous file path is different from the new file (save-as was called), call folder-service.copy(file)
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
- the project service also keeps track of some user configs like:
  - wether auto-save is on or not. This value is stored in the local storage. If it is turned on, whenever the update function is called, an auto-save timer is triggered or reset. When this auto-save timer goes off, the project is automatically saved. 


### folder service
- the folder service is a global singleton, responsible for managing the location of the currently active project.
- it has:
  - folder: the current root folder of the project (this folder contains the project file)
  - project-name: the name of the currently active project. if no name has been provided, use 'new project'
  - project-file: folder + project name + '.json'
  - cache: sub-folder of the root folder = folder + '\cache'
  - project-config: configuration file that accompanies the project = folder + project name + '_config.json'
- it can:
  - clear: called when a new project is created and the location & name is not yet known.
    - create a temp folder, set value as 'folder'
    - create a temp name, set as project name
    - create the cache folder
  - move to (new project file): moves the current project and related files to the new location
    - split 'new project file' into new-folder and new-project name (no extension)
    - move the file project-file (if it exists) to the 'new project file'
    - build the new project config : new-folder + new-project-file + '_config.json'
    - move the configuration file (if it exists) to the new project config location.
    - create a new cache folder at new-folder + '\cache'
    - move all files from the cache (if it exists) to the new-cache-folder location
    - store the new folder and project name
  - copy (new project file): saves the current project to a new location.
    - split 'new project file' into new-folder and new-project name (no extension)
    - copy the file project-file (if it exists) to the 'new project file'
    - build the new project config : new-folder + new-project-file + '_config.json'
    - copy the configuration file (if it exists) to the new project config location.
    - create a new cache folder at new-folder + '\cache'
    - copy all files from the cache (if it exists) to the new-cache-folder location
    - store the new folder and project name
  - set location (location)
    - store the new folder and project name

### Selection service
- The selection service is a global singleton object that keeps track of the currently selected text.
- the selection service keeps track of the currently active editor (an object from the monaco editor npm package)
- the service can be monitored for changes in the selection.
- supports the following actions:
  - cut: if there is a reference to an editor, ask the monaco editor to cut the selected text to the clipboard.
  - copy: if there is a reference to an editor, ask the monaco editor to copy the selected text to the clipboard.
  - paste: if there is a reference to an editor, ask the monaco editor to paste the clipboard content at the current cursor position.
  - delete: if there is a reference to an editor, ask the monaco editor to delete the selected text.
  - clear selection: if there is a reference to an editor, ask the monaco editor to clear the current selection.
  - select all: if there is a reference to an editor, ask the monaco editor to select all the text.


### Undo service
- The undo service is a global singleton that keeps track of all the text edits that the user performs on the various monaco-editors.
- It has an undo and redo list.

### line parser
- the line-parser service is a global singleton object used to parse markdown lines and update the the text-fragments stored in the project-service.
- the line-parser service maintains an array of text-fragment objects (called fragmentsIndex). When the service is created, this list is empty.
- the line-parser has a function for creating new text-fragments (json objects). it accepts as input a string which is the line that is being processed.
  - trim the line and convert it to lower case.
  - count the nr of '#' that are in front of the title and assign to the depth-level of the text-fragment. so '#' is level 1, '##' is level 2, '###' is level 3 and so on.
  - remove all the '#' from the line and assign to the title value of the text-fragment.
  - calculate the key for the text-fragment and store in the text-fragment.
  - set the 'out-of-date' flag to true, indicating that this fragment hasn't been processed yet
  - initialize an empty array for the 'lines' field
  - ask the project-service to add the text-fragment in it's list of text-fragments.
- the line-parser has a function to calculate the key of a text-fragment, which accepts as input a text-fragment and an index position. it goes as follows:
  - the current depth = the depth-level of the text-fragment
  - the result value = the title of the text-fragment
  - loop from the given index position until 0 using the field idx
    - prev-fragment = the text-fragment that the project-service has at position 'idx'
    - if the depth-level of the prev-fragment is smaller then the current depth:
      - store the new current depth
      - prepend the title of the prev-fragment + ' > ' to the result
      - if the new current depth == 1, stop the loop
- pseudo code for the parse function and related:
    ```python (pseudo)

      def parse(line, index):
        if line == '':
          lineParserHelpers.handleEmptyLine(this, index)
        elif line.startsWith('#'):
          lineParserHelpers.handleTitleLine(this, line, index)
        else:
          lineParserHelpers.handleRegularLine(this, line, index)

    ```

#### line parser helpers

The module 'LineParserHelpers' contains the following helper functions used by the line parser service, described in pseudo code:

    ```python (pseudo)
 
      def getFragmentAt(service, index):
        curFragment = service.fragmentsIndex[index]
        while not curFragment and index >= 0:
          index -= 1
          curFragment = service.fragmentsIndex[index]
        if curFragment and index > 0:
          while index > 0 and service.fragmentsIndex[index-1] == curFragment:
            index -= 1
        return curFragment, index


      def handleEmptyLine(service, index):
        fragmentsIndexEmpty = service.fragmentsIndex.length == 0 or service.fragmentsIndex.find(t => t==null).length == service.fragmentsIndex.length
        if fragmentsIndexEmpty:
          while service.fragmentsIndex.length <= index:
             service.fragmentsIndex.push(null)
        else:
          fragment, fragmentStart = getFragmentAt(service, index)
          if not fragment:
            raise Exception('internal error: no fragment found in non empty index table')
          fragmentLineIndex = index - fragmentStart
          while fragment.lines.length < fragmentLineIndex:
            fragment.lines.push('')
          if fragment.lines.length > fragmentLineIndex:
            fragment.lines.insert(fragmentLineIndex, '')
          else:
            fragment.lines.push('')


      def updateFragmentTitle(service, fragment, line, fragmentPrjIndex):
        oldKey = fragment.key
        line = line.trim().toLowerCase();
        fragment.depth = line.split('#').length - 1;
        fragment.title = line.replace(/#/g, '');
        fragment.key = service.calculateKey(fragment, fragmentPrjIndex);
        eventParams = { fragment, oldKey }
        projectService.emit('keyChanged', eventParams)


      def removeFragmentTitle(service, fragment, index):
        prevFragment, prevIndex = getFragmentAt(service, index-1)
        if not prevFragment: # title of first was removed, set title to empty
          fragment.lines.insert(0, line)
          fragmentPrjIndex = projectService.textFragments.indexOf(fragment)
          updateFragmentTitle(service, fragment, '', fragmentPrjIndex)
        else:
          prevFragment.lines.push(line)
          #copy all the lines to the previous fragment
          for l in fragment.lines:
            prevFragment.lines.push(l)
          # update the index cause the fragment will be replaced by the previous
          while (service.fragmentsIndex[index] == fragment):
            service.fragmentsIndex[index] = prevFragment
          projectService.deleteTextFragment(fragment)
          projectService.markOutOfDate(prevFragment)


      def insertFragment(service, fragment, fragmentStart, line, fragmentPrjIndex, index):
        toAdd = service.createTextFragment(line, fragmentPrjIndex)
        service.fragmentsIndex[index] = toAdd
        fragmentLineIndex = index - fragmentStart
        # copy over all the lines and adjust the index
        while fragmentLineIndex > 0:
          toAdd.lines.insert(0, fragment.lines.pop())
          service.fragmentsIndex[index + fragmentLineIndex] = toAdd
        projectService.markOutOfDate(fragment)


      def handleTitleLine(service, line, index):
        if fragmentsIndex.length == 0 or fragmentsIndex.length < index or fragmentsIndex[index] == null:
          toAdd = createTextFragment(service, line, projectService.textFragments.length)
          while service.fragmentsIndex.length < index:
             service.fragmentsIndex.push(null)
          service.fragmentsIndex.push(toAdd)
        else:
          fragment, fragmentStart = getFragmentAt(service, index)
          if not fragment:
            raise Exception('internal error: no fragment found in non empty index table')
          fragmentPrjIndex = projectService.textFragments.indexOf(fragment)
          if fragmentStart == index:
            updateFragmentTitle(service. fragment, line, fragmentPrjIndex)
          else:
            insertFragment(service, fragment, fragmentStart, line, fragmentPrjIndex, index)


      def updateFragmentLines(service, fragment, index, fragmentStart):
        fragmentLineIndex = index - fragmentStart
        if fragmentLineIndex < fragment.lines.length: # changing existing line
          fragment.lines[fragmentLineIndex] = line
        else:
          while fragment.lines.length < fragmentLineIndex:
            service.fragmentsIndex[fragmentStart + fragment.lines.length] = fragment
            fragment.lines.push('')
          fragment.lines.push(line)
          service.fragmentsIndex[index] = fragment
          projectService.markOutOfDate(fragment)


      def handleRegularLine(service, line, index):
        fragment, fragmentStart = service.getFragmentAt(index)
        # no fragment yet at this line or in front of it, create new one
        if not fragment:
          toAdd = service.createTextFragment('', 0)
          while service.fragmentsIndex.length < index:
             service.fragmentsIndex.push(null)
          service.fragmentsIndex.push(toAdd)
        elif fragmentStart == index: # went from title to regular
          removeFragmentTitle(service, fragment, index)
        else:
          updateFragmentLines(service, fragment, index, fragmentStart)


    ```
  
### position-tracking service
- the position-tracking service is a global singleton object responsible for tracking the text-fragment that the user is currently working on.
- The service keeps track of:
  - the currently selected line nr
  - the text-fragment related to the currently selected line. This is an object that can be assigned (property: activeFragment). When this value changes, an event needs to be raised so that other parts of the application can move to the new active fragment.
  - an eventTarget that stores the events which monitor changes in the currently selected text-fragment.
- it provides the following methods:
  - set currently selected line, input: line-index.
      - if the new value is different from the current selected line index:
        - get the object at the line-index position found on the fragmentsIndex array of the line-parser service.
        - If this object differs from currently selected text-fragment, then store the object as the new currently selected text-fragment and trigger the on-changed event for all the registered event handlers.

### gpt service
- the GPT service is a global singleton that is responsible for communicating with the open-ai api backend. It is primarily used by transformers that perform more specific tasks.
- the service uses the openai node.js library to communicate with the backend.
- it provides a function that other services (or components) can call to send an api request to open-ai.
  - this function accepts a list (called `messages`) json objects that contain a `role` and `content` field.
  - this `messages` list is sent to openai using the `createChatCompletion` function.
  - if the request fails, the service will retry 3 times before giving up and raising an error.
- the service also provides a method to retrieve the list of available models. To retrieve this list, the openai nodejs library is used.

### result-cache service
- this service manages previously retrieved results for transformers.
- It allows transformers that transform text fragments into results, to store these results for each text fragment and keep track if the result has become out of date or not (any of the inputs of the transform operation has changed).
- because some transformers work on text fragments that come from the project directly and others that come from the result of other transformers, the result cache must be able to monitor changes in a project fragment and result fragment.
- A transformer that wants to cache it's results uses an instance of this class to perform these tasks on it's results.
- internally, the cache uses a dictionary that maps the keys to their results.
- whenever the transformer calculates a result, it asks the cache to update it's dictionary:
  - first the key is calculated (by the transformer):
    - the first part of the key is the key of the project text-fragment which was the primary input for the transformer.
    - for every extra result-value coming from other transformers that the transformer uses to calculate its result, the key of the result value is appended to the new key, separated with a '|'.
    example: 
      - if the transformer is processing text-fragment with key 'a > b' 
      - and the transformer uses the result of the 'class lister' transformer, where the result, for this calculation, comes from the text-fragment with the key 'c > d'
      - than the key would become 'a > b | c > d' 
  - if the key is not yet present, a new cache-item object is created which contains:
    - the result of the transformer
    - the current state: still-valid (instead of out-of-date)
  - if the key is already present:
    - the cache item is retrieved,
    - it's result is updated to still-valid
  - for each text-fragment in the inputs of the transformer (each section separated with '|'), the cache will also:
    - search for the title of the text-fragment in a secondary dictionary.
    - if the title is not yet in this secondary dictionary, add the key, and use as value, a list containing the key for the primary dictionary.
    - if it already has the title, add the key for the primary dictionary at the end of the list.
- the cache stores the results in a json file.
  - the name of this file is specified by the transformer that creates the class instance (constructor parameter)
  - the location of the file (folder) is provided by folder-service.cache
  - the json file contains:
    - the primary dictionary that contains the results.
    - the secondary dictionary that contains the relationships between keys of text-fragments and full dictionary entries in the primary dict (which can consist out of multiple keys cause 1 result value can have multiple inputs).
    - a third dictionary that contains all the overwritten values of the results (if any)
    - a date that specifies the last save date of the project file. This is used when loading the dictionary back from file to verify if the results are still valid or not (when this date doesn't match the last-modified date of the project, something is out-of sync and consider the results in the file out-of-date).
  - the cache tries to load this json file during construction of the instance.
- When the result-cache-service is created, it:registers an event handler with the project service to monitor when text fragments have changed and with each object that the parent transformer uses as input (provided in the constructor as a list of transformer services, each service has a field 'cache')
  - whenever the event handler is triggered, the cache service checks in the secondary dictionary if there are any entries. This allows the system to react to changes in single text-fragments, even though there were multiple input text-fragments (and so the keys in the primary dictionary are a concatenation of multiple titles).
    - for each entry in the list:
      - search in the primary dictionary
      - if not yet marked as out-of-date:
        - mark as out-of-date
        - if there are any other cache services that monitor this cache-service (instead of the project service directly), then let them know that the specified text-fragment (from the result) has gone out-of-date.
- the result-cache has a function to overwrite the result for a key. this overwritten text value is stored in the 'overwrites' dictionary, under the supplied key.
- the result-cache has a function to retrieve the result for a particular key: the key is first searched in the 'overwrites' dictionary. if this has a result, return this value, otherwise try to return the value found in the results dictionary.
- the result-cache has a function to retrieve if a text fragment is out-of-date or not (from the key): if the result is marked as out-of-date, returns true
- getFragmentResults: a function to retrieve all the results related to a particular fragment. Definition in pseudo:

  ```python (pseudo)
  def getFragmentResults(fragmentKey):
    result = {}
    cacheKeys = this.secondaryCache[fragmentKey]
    if cacheKeys:
      for key in cacheKeys:
        cacheValue = this.getResult(key)
        keyParts = key.split(' | ')
        addTo = result
        for part in keyParts[:-1]: # last is the key for the cache value
          nextAddTo = None
          if not part in addTo:
            nextAddTo = {}
            addTo[part] = nextAddTo
          else:
            nextAddTo = addTo[part]
          addTo = nextAddTo
        addTo[keyParts[-1]] = cacheValue
    return result
  ```

### build service
- the build service is a global singleton that processes all the text-fragments of the project-service. It uses a set of transformers to iteratively generate conversions on the different text-fragments.
- to build the project, the service performs the following actions:
  - for each text-fragment in project-service.data-list:
    - for every transformer in the list of entry-points of the cybertron-service:
      - ask the transformer to render it's result (renderResult) (async).
  

### cybertron service
- the cybertron-service is a global singleton that is responsible for managing the list of available transformers.
- the service also maintains a list of entry-points: this is a sub-list of the available transformers which can be used as starting points for building text-fragments.
- Transformers register themselves. this adds them to the list. A second parameter indicates if the transformer should also be added as an entry-point
- Transformers can also unregister themselves. this will remove them from the list of available transformers and the list of entry-points.


### transformer-base service
- The transformer-base service acts as a base class for transformers: it provides a common interface and functionality
- constructor:
  - name: the name of the transformer
  - dependencies: a list of names of transformers. Replace every name in the list with the object found in the list of transformers. If a name can not be found, raise an exception with the necessary info. Store the list of objects as 'dependencies'
- this service uses a result-cache-service (field: cache) to store all the results and keep track of when the build has gone out-of-date. 
  - constructor params:
    - transformer-name = this.name
    - dependencies = this.dependencies
- function render-result(pseudo):

  ```python (pseudo)
  def renderResult(textFragment):
    message, keys = this.buildMessage(textFragment)
    result = await GPT-service.sendRequest(this.name, textFragment.key, message) # need name and key so the gpt service can select the correct model
    key = ' | '.join(keys)
    this.cache.setResult(key, result)
  ```


### compress service
- The compress service takes a text fragment and makes it shorter.
- Useful to check if the system understands the fragment and can be used as input for other processes.
- inherits from transformer-base service. Constructor parameters:
  - name: 'compress'
  - dependencies: []
- create a global instance of the service
- register the global instance of the service as an entry-point transformer with the cybertron-service: `cybertronService.register(this, true)`

- function build-message(text-fragment):
  - result (json array):
    - role: system, content:
      
     > Act as an ai software analyst. You are reviewing the feature description of an application. It is your job to shorten the following text as much as possible and rephrase it in your own words, without loosing any meaning.
     > Any text between markdown code blocks (``` or \""" signs) are declarations of constant values, do not change them, but replace with the name of the constant. Remove the markdown, but use bullet points where appropriate.
     > compress the following text:

    - role: user, content: `text-fragment.lines.join('\n')`.
  - return result, [ text-fragment.key ]
