# MarkdownCode
MarkdownCode is an ideation and software building tool driven by machine learning. It allows users to enter text in markdown which is automatically analyzed for various parameters and which can be converted into executable software code.

## development stack
- developed in javascript (ES6)
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
- create a json structure for all the tabs (fields: key, label, children).
- assign the json structure to the items property.
  
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
    - if there is a project loaded with changes `projectService.isDirty == true`, ask to save first.
    - call `storageService.new()`
  - open: a button to open an existing project.
    - show a dialog box to select a file `filename = await dialogService.showOpenDialog()`
    - if a file is selected, ask the storage-service to open the file.
    - wrap in an exception handler that shows an error dialog
  - save: a button to save the current project to file.
    - enabled when the project service has a filename for the project (field 'filename' has a value) and projectService.isDirty == true
    - if the project file does not yet have a filename, show a save-as dialog `filename = await dialogService.showSaveDialog()`
    - if the user doesn't provide a valid filename, stop the action
    - if the user provides a valid filename,
      - call the storage-service 'save' function with filename as param.
    - if the project service already has a filename,
      - call storage-service save without param.
    - wrap in an error handler and show the error
  - save as: a button to save the current project to a new location.
    - enabled when `projectService.isDirty = True`
    - show a save-as dialog `filename = await dialogService.showSaveDialog()`
    - if the user selects a file, ask the storage-service to save the project to the new location.
    - wrap in an exceptions handler and show the error
  - auto-save: a toggle button, when pressed, asks the project service to update the auto-save state.
    - the toggle button's state follows that of the project service's auto-save state.
- The project-service needs to be monitored for changes so that the state of the buttons can be updated (field: eventTarget, event: 'is-dirty-changed').
  
##### edit section
- the edit-section component contains actions related to the clipboard and the currently selected data.
- all buttons use an appropriate icon from the '@ant-design/icons' library as content, no text.
- it supports the following actions
  - cut: a button to initiate the cut command of the selection service
    - enabled when the selection service has any data marked as selected.
  - copy: a button to initiate the copy command of the selection service
    - enabled when the selection service has any data marked as selected.
  - paste: a button to initiate the paste command of the selection service
    - enabled when the clipboard contains text data.
    - use the BiPaste icon from react-icons
    - call `clipboard.readText()` to get the data that needs to be pasted.
  - delete: a button to initiate the delete command of the selection service
    - enabled when the selection service has any data marked as selected.
  - select all: a button to select all the text in the currently active window.
  - clear selection: a button to clear the current selection buffer.
    - enabled when the selection service has any data marked as selected.
- to check if the clipboard contains text data:
  - use the clipboard imported from electron
  - when the component is loaded and when the ipcRenderer emits the 'focused' event, call `clipboard.has('text/plain')` to see if there is data in the clipboard.

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
    - disabled when project-service.isAnyFragmentOutOfDate() == false.
    - calls `build-service.buildAll()`
  - code for active fragment: a button to start rendering all the code files for the currently active fragment.
    - disabled when `!positionTrackingService.activeFragment?.isOutOfDate`
    - calls `build-service.buildFragment(positionTrackingService.activeFragment)`
  - active fragment with active transformer: a button to start rendering the result for the currently active fragment and transformer.
    - disabled when `positionTrackingService.activeFragment && positionTrackingService.activeTransformer && (!positionTrackingService.activeFragment.isOutOfDate || !positionTrackingService.activeTransformer.cache.isOutOfDate(positionTrackingService.activeFragment.key))`
    - calls `build-service.runTransformer(positionTrackingService.activeFragment, positionTrackingService.activeTransformer)`
  - separator (type='vertical', height='24px')
  - debug: a toggle button, when pressed, asks the build-service to update the debug state.
    - the toggle button's state follows that of the build-service's debug state. 
  - run next: a button that will continue rendering to the next transformer
    - disabled when `!debug`
  - Store the disabled value of all the buttons in the state so that they can be updated from the event handlers.
  - initialize the button states when loaded
  - register event handlers to monitor for changes with:
    - project-service (field: eventTarget, event: fragment-out-of-date): update disabled state of the buttons
    - position-tracking service (field: eventTarget, event: change): update disabled state of the buttons
  - unregister the event handlers when unloaded.

#### format
- the format-tab component is a wrapper that displays it's children in a row.
- This component contains the following child components :
  - style section
  - paragraph section
  - font section

##### style section
- the style-section component contains actions related to the markup used in the text for applying markdown formatting.
- all buttons use an appropriate icon (from react-icons) as content, no text.
- there is a button for each of the following formatting styles:
  - heading 1 (btn: LuHeading1)
  - heading 2 (btn: LuHeading2)
  - heading 3 (btn: LuHeading3)
  - heading 4 (btn: LuHeading4)
  - heading 5 (btn: LuHeading5)
  - heading 6 (btn: LuHeading6)
  - paragraph (btn: PiParagraph)
  - quote (btn: LuCode2LuQuote)
  - code (btn: LuCode2)
  - bullet list (btn: LuList)
  - numbered list (btn: PiListNumbers)
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
- use the Split component of the  @geoffcox/react-splitter library 
- it's entire area is filled with a Split component.
  - initialPrimarySize = this.state.verticalSplitSize
  - minPrimarySize='50px'
  - minSecondarySize='15%'
  - children:
    - outline component
    - Split component:
      - initialPrimarySize = this.state.horizontalSplitSize
      - minPrimarySize='50px'
      - minSecondarySize='15%'
      - horizontal
      - children:
        - editor component
        - results view component
- The body component has an event handler for the 'onSplitChanged' callback of both the horizontal and vertical split that will store the new value for it's position (% value) (verticalSplitSize / horizontalSplitSize).
- When the body component is unloaded, the last position of the horizontal and vertical splitters are stored in the local storage.
- When the body component is loaded:
  - the last position of the horizontal and vertical splitters are restored from the local storage, if no value is found, the default '30%' is used.
  
  
#### editor
- The editor component displays markdown text. 
- to display the markdown text, the monaco editor npm package is used.
- When the editor is loaded:
  - the text for the monaco editor is retrieved from the project service (`projectService.content`).
  - theme (light or dark), font & font-size are retrieved from the theme-service and applied to the monaco editor.
- Whenever the project service triggers the 'content-changed' event, the editor will reload the text
  - note: register using `projectService.eventTarget.addEventListener('content-changed', handleContentChanged)`
- Whenever the position-tracking service raises the event 'moveTo', do: `this.editorRef.current.revealLineNearTop(e.detail)`
- monitor the following events on the monaco editor:
  - editorDidMount: store a reference to the editor for further use and register the other event handlers with the mounted editor.
  - onDidChangeModelContent: ask the change-processor-service to process the changes. in pseudo:
  ```python (pseudo)
  def handleDidChangeModelContent(ev):
      try:
        if not editor: # ref to the editor needs to be loaded, should be the case cause event is triggered
          return
        changeProcessorService.process(ev.changes, editor)
      catch (e):
        dialogService.showErrorDialog(e)
  ```
  - onDidFocusEditorWidget: store a reference to the monaco editor in the selection service to indicate so that it can work with the correct editor.
  - onDidBlurEditorWidget: if the selection service currently references this monaco editor, assign null to the selection service's editor reference.
  - onDidChangeCursorPosition: if the selection service currently references this monaco editor, ask the position-tracking service to update the current line with the new cursor position `setCurrentLine(e.position.lineNumber - 1)`
  - onDidChangeCursorSelection: if the selection service currently references this monaco editor, inform the subscribers of the selection-service that the selection has changed `selectionService.notifySubscribers()`
- the monaco editor always occupies all the space that is available.

#### outline
- the outline component is positioned to the left of the editor
- it contains a tree representing the outline of the currently active project: all markdown headings in the document are present in the outline
- When the component is loaded and whenever the project-service raises the 'content-changed' event to indicate that a new project was loaded, the project data (field: textFragments) is retrieved from the project-service and converted into a tree structure using the function 'convertToTreeData'.
  - note: register using `projectService.eventTarget.addEventListener('content-changed', handleContentChanged)`
- Whenever the project service raises an event that a data item was removed (event: fragment-deleted), call the 'removeNode' function
- Whenever the project service raises an event that a data item was added (fragment-inserted) or (multiple) item(s) were changed (the event 'key-changed'), rebuild the tree structure.
- when the user selects a tree item, the key of the first selected item is assigned to the position-tracking service's activeFragment
- this component monitors the position-tracking service for changes to the currently selected text-fragment.
  - use `positionTrackingService.eventTarget.addEventListener('change', eventHandler)` to attach the event handler
  - when the position changes, set the tree's selectedKeys property to the key (if any) of the text-fragment so that the corresponding tree node becomes selected. `key = e.detail?.key`
- show the tree with lines
- when the user clicks on a tree-item (onSelect):
  ```python
    if len(selectedKeys) > 0:
      fragment = projectService.getFragment(selectedKeys[0])
      if fragment:
        positionTrackingService.setActiveFragment(fragment)
  ```

- the function 'convertToTreeData' is described as:
  set parent to null
  for every data item:
    create a new node for the data item. Set the title & key of the node to the title & key of the data item. also keep a reference to the data item itself in the node
    if the item's field depth = 1, add the new node to the root node and make that node the parent 
    else if there is no parent yet, skip the item
    if the item's depth is higher then parent.data.depth: add the new node to the parent's children. assign node.parent = parent. make the new node parent 
    if the item's depth equals parent.data.depth or is lower:
      get the parent of the current parent until the depth of this new parent is 1 higher then the depth of the item and add the item as a child of this new parent. assign node.parent = parent. Make the item the new parent.
  
- pseudo for removeNodeFromTree:
  ```javascript (pseudo)
  removeNode = (e) => {
    key = e.detail
    const treeData = this.removeNodeByKey(this.state.treeData, key);
    this.setState({ treeData });
  };

  removeNodeByKey = (nodes, key) => {
    return nodes.reduce((result, node) => {
      if (node.key === key) return result;
      return [...result, { ...node, children: this.removeNodeByKey(node.children || [], key) }];
    }, []);
  }

  ```


#### results view
- the results-view component is positioned at the bottom of the main body
- the user can view the results that were generated by the transformers that were registered with the cybertron-service, for the currently selected text block.
- tabs are placed at the bottom of the results view, size = small, tabBarStyle={{marginTop: 0}}
- For each transformer in the transformers list provided by the cybertron-service (field: transformers), this view creates a tab.
  - the tabs are located at the top of the view
  - the transformer name is used as the title and key of the tab
  - the tab content shows a results-view-tab component
- create a json structure for all the tabs (fields: key, label, children).
- assign the json structure to the items property.


##### results view tab
- the results-view-tab component displays the results of a transformer for a particular text-fragment, identified by it's key.
- to display the results as markdown, json data, javascript, html or css, the monaco editor npm package is used.
- The monaco editor fills the full width and height that are available to the component.
- When the results-view-tab is loaded:
  - the text for the monaco editor is retrieved from the result-cache of the transformer that is assigned to this component using the currently assigned key, if available (could be that it's null): 
  ```python
  editorKey = positionTrackingService.activeFragment?.key
  if editorKey:
    toDisplay = this.props.transformer.cache.getFragmentResults(editorKey)
    if this.props.transformer.isJson:
      toDisplay = JSON.stringify(toDisplay, 0, 2) # do a pretty format with 2 tabs spacing
  ```
  - theme (light or dark), font & font-size are retrieved from the theme-service and applied to the monaco editor.
- the results-cache of the transformer is monitored for changes in the result (only for changes in the result with the current key).
  - if the result is marked as 'out-of-date' or 'deleted', show the text as grayed-out.
  - if the result is marked as 'overwritten', show the text in red 
- when the user changes the text in the monaco editor, the new text is saved to the result-cache of the transformer, marked as overwritten. In pseudo: 
  ```python
  if this.props.transformer.isJson:
    try:
      newValue = JSON.parse(newValue)
    except:
      continue # if we cant parse to json, save as text so we still have the value.  
  transformer.cache.overwriteResult(editorKey, newValue)
  ```
- monitor the following events on the monaco editor:
  - onDidFocusEditorWidget: 
    - store a reference to the monaco editor in the selection service to indicate so that it can work with the correct editor.
    - set `position-tracking-service.activeTransformer = transformer`
  - onDidBlurEditorWidget: if the selection service currently references this monaco editor, assign null to the selection service's editor reference.
  - onDidChangeCursorSelection: if the selection service currently references this monaco editor, inform the subscribers of the selection-service that the selection has changed
- put a results-view-context-menu component below the monaco editor (so it's rendered after the editor)
- the component monitors the position-tracking service (field: eventTarget, event: change) for changes to the currently selected text-fragment. 
  - when this changes update the key value and retrieve the json object from the result-cache, convert to a string and show in the monaco-editor


##### results view context menu
- this results-view-context-menu is a component that is a wrapper for the Dropdown antd component.
- it has the properties 'transformer' and 'key' that needs to be supplied 
- The dropdown's content is a 'more' button icon and the trigger for the dropdown is 'click'.
- the 'more' button is positioned in the top-right corner of the parent as a floating button (position: 'absolute', top: 0, right: 16).
- it contains the following menu items:
  - model for all: select the gpt model to be used by the transformer.
    - the sub menu items are provided by the gpt-service's list of available models. `await gptService.getModels()`
    - the menu item that contains the name of the currently selected model, is shown as selected.
      - Get the value for the current model, registered for the current transformer, from the gpt-service. `gptService.getModelForFragment(transformer)`
    - when an other model is selected, ask the gpt-service to update the model-name used for the transformer. `gptService.setModelForFragment(model, transformer)`
  - model for fragment: select the gpt model to be used by the transformer, for the current key.
    - the sub menu items are provided by the gpt-service's list of available models.
    - the menu item that contains the name of the currently selected model, is shown as selected.
      - Get the value for the current model, registered under the name of the current transformer and current key, from the gpt-service `gptService.setModelForFragment(transformer, key)`
    - when an other model is selected, ask the gpt-service to update the model-name of the transformer and the current title. `gptService.setModelForFragment(model, transformer, key)`
  - a splitter
  - refresh: when pressed, the transformer associated with the current tab recalculates the result

## services

### dialog service
- the dialog service is a global singleton that provides a common interface for other components and services to show dialog boxes.
- the service can show a dialog box for errors, warnings and info.
- all actions or functions that the user can trigger from a component, should be wrapped in a proper error handler so that when an error occurs, an electron dialog box is shown to the user with details on the error. 
- electron.openDialog is globally available through the contextBridge loade by the preloader script. Dont import the dialog module from electron. 
- functions:
  - showErrorDialog(param1, param2): 
    ```python (pseudo) 
      config = { title: (param2 ? param1 : 'Error'), content: param2 or param1 }
      electron.openDialog('showErrorBox', config)
    ```
  - showSaveDialog():
    ```python (pseudo)
      config = { filters: [{ name: 'markdown', extensions: ['md']}, { name: 'any', extensions: ['*']}] }
      return electron.openDialog('showSaveDialog', config)
    ```
  - showOpenDialog():
    ```python (pseudo)
      config = { filters: [{ name: 'markdown', extensions: ['md']}, { name: 'any', extensions: ['*']}] }
      return electron.openDialog('showOpenDialog', config)
    ```

### Theme service
- The theme service is a global singleton, responsible for managing the currently selected theme font & font-size: when the selected theme, font or font-size is changed, the new value is saved to the local storage (the global `localStorage`). When the service is created, the values previously stored in local storage, are retrieved.
- The service allows for a selection between a light or dark theme.
- Every component uses this service to retrieve the currently selected theme (not the font or font-size)  so it can apply this. Components don't need to subscribe for changes to the selected theme value, they only need to retrieve this value from the theme service and use the styling names, based on the selected. theme.
- The main window refreshes it's entire content when the selected theme is updated.

### project service
- the project service is a global singleton that:
  - manages a data-list of the currently loaded text-fragments (field: text-fragments). This stores the parsed text.
  - stores the raw data content (field: content): this is the text displayed to the user.
  - keep track of the filename of the currently loaded project (field: filename)
  - isDirty: a property, when set and the value changes, raises the 'is-dirty-changed' event.
  - provide the following functions to work with the text-fragments:
    - deleteTextFragment(fragment): remove the object from the text-fragments list & raise the fragment-deleted event, parameter = fragment.key
    - addTextFragment(fragment, index): if index is at end of the text-fragments list, add to list, otherwise insert the fragment at the specified position in the text-fragments list. raise the fragment-inserted event.
    - markOutOfDate(fragment): fragment.isOutOfDate = true, raise the event fragment-out-of-date, param = fragment.key
    - getFragment(key): search for the text-fragment with the specified key and return it: `return this.textFragments.find(t => t.key == key)`
    - tryAddToOutOfDate(key, transformer):
      ```python
      fragment = this.getFragment(key)
      if not fragment:
        dialogService.showError('Unknown key: ' + key)
        return
      if not fragment.isOutOfDate: # first tranformer out of date
        fragment.outOfDateTransformers = [transformer]
        this.markOutOfDate(fragment)
      elif len(fragment.outOfDateTransformers) > 0: # only part is dirty, not yet full fragment
        fragment.outOfDateTransformers.push(transformer)
        if len(fragment.outOfDateTransformers) == len(CybertronService.transformers): # fragment just became full dirty
          fragment.outOfDateTransformers = []
        this.dispatchEvent('fragment-out-of-date', key) # raise again so ui can adjust
      # fragment is already marked as fully out-of-date (no specific fragment.outOfDateTransformers)
      ```
    - isAnyFragmentOutOfDate(): returns true if any of the fragments in textFragments array is marked as isOutOfDate.
    - dispatchEvent(event, value): dispatches events
      - creates a custom event object if there is a value, otherwise a regular event object, and 
      - calls eventTarget.dispatch if this.blockEvents == false (initialize blockEvents to false during construction)
    - setIsDirty(value): if this.isDirty !== value: this.isDirty = value; this.dispatchEvent('is-dirty-changed', value)
- the project service also keeps track of some user configs like:
  - wether auto-save is on or not. This value is stored in the local storage. 
- The project service uses an EventTarget field to dispatch events. Other objects can add / remove event listeners to / from the event target to receive events. 
- it raises the following events:
  - content-changed: when the project is loaded or a new project is created.
  - fragment-deleted: when a text fragment is removed from the list
  - fragment-inserted: when a text fragment is added to the list
  - fragment-out-of-date: when a fragment is marked as out of date.
  - key-changed: when the key of a fragment was changed (raised externally)
  - is-dirty-changed: when the project was saved or first time it is modified after saving/loading/creating.


#### storage service
- the storage service is a global singleton that is responsible for reading and writing project data to and from storage.
- functions:
  - clear(): makes certain all references to data that was previously loaded, is cleared
    ```python (pseudo)
    projectService.textFragments = []
    projectService.content = ''
    lineParser.clear()
    positionTrackingService.clear()
    folderService.clear()
    for transformer in cybertronService.transformers:
      transformer.cache.clearCache()
    gptService.modelsMap = {}
    ```
  - new(): set everything up for a new project.
    ```python
      this.clear()
      projectService.dispatchEvent('content-changed')
      projectService.setIsDirty(True)
      ```
  - open(filePath): load all the data from disk 
    ```python (pseudo)
      projectService.blockEvents = True
      try:
        this.clear()
        folderService.setLocation(filePath)
        content = fs.readFileSync(filePath, 'utf8')
        projectService.content = content
        content.split('\n').forEach((line, index) => lineParser.parse(line, index));
        for transformer in cybertronService.transformers:
          transformer.cache.loadCache()
        this.loadModelsMap(filePath)
      finally:
        projectService.blockEvents = False
        projectService.setIsDirty(False)
        projectService.dispatchEvent('content-changed')
      this.updateOutOfDate()
    ```
  - loadModelsMap(filePath): loads the json file that defines the models to be used with the project
    - build the json file name by replacing '.md' with '_models.json' at the end of the field 'file'
    - if the json file exists, load it and assign the parsed json to `gptService.modelsMap`
  
  - updateOutOfDate(): updates the list of out-of-date transformers for each text-fragment.
    ```python (pseudo)
    def updateOutOfDate():
      for fragment in projectService.textFragments:
        outOfDateTransformers = []
        for transformer in cybertronService.transformers:
          if transformer.cache.isOutOfDate(fragment.key):
            outOfDateTransformers.push(transformer)
        if len(outOfDateTransformers) == len(cybertronService.transformers): #all, so fragment is fully out-of-date
          projectService.markOutOfDate(fragment)
        elif len(outOfDateTransformers) > 0:
          fragment.outOfDateTransformers = outOfDateTransformers
          projectService.markOutOfDate(fragment)
    ```
  - markDirty():
    ```python
    def markDirty():
      projectService.setIsDirty(True)
      if projectService.autoSave and projectService.filename and not this.saveTimer:
        this.saveTimer = setTimeout(() => {
          this.save(projectService.filename)
        }, 5000)
  
    ```
  - save(file): saves the project to disk
    ```python (pseudo)
    async def save(file):
      if not projectService.filename:
        folderService.moveTo(file)
      elif projectService.filename != file:
        folderService.copyTo(file)
      await fs.writeFileASync(file, projectService.content, 'utf8')
      for transformer in cybertronService.transformers:
        await transformer.cache.saveCacheToFile()
      await this.saveModelsMap(file)
      projectService.filename = file
      projectService.setIsDirty(False)
      this.saveTimer = None
    ```
  - saveModelsMap(file): 
    - build the json file name by replacing '.md' wit '_models.json' at the end of the field 'file'
    - convert the json object in `gptService.modelsMap` to a string
    - save the stringified json to the json file name



#### change-processor service
- the change-processor service is responsible for processing changes in the project content so that the project structure remains in sync with the source.
- functions:
  - static process(changes, full): makes certain that the project service remains in sync when the user performs edits. in pseudo:
  ```python (pseudo)
    def process(changes, editor):
      projectService.content = editor.getValue()
      model = editor.getModel()
      for change in changes:
        lines = change.text.split('\n')
        curLine = change.range.startLineNumber - 1
        lineEnd = change.range.endLineNumber - 1
        lineIdx = 0
        # first replace lines that are overwritten. change can contain only part of line so get full line
        if change.text.length > 0 or (change.rangeLength > 0 and curLine === lineEnd):
          while lineIdx < len(lines) and curLine <= lineEnd:
            lineParser.parse(model.getLineContent(curLine + 1), curLine)
            lineIdx += 1
            curLine += 1
        # now there are either lines to delete or to insert
        while curLine < lineEnd:
          lineParser.deleteLine(lineEnd) # need to do in reverse otherwise the wrong line is removed
          lineEnd -= 1
        if change.text.length > 0 and change.rangeLength > 0:
          while lineIdx < len(lines):
            LineParser.parse(model.getLineContent(curLine + 1), curLine)
            lineIdx += 1
            curLine += 1
        storageService.markDirty()
  ``` 

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
- The fs module should be remotely loaded through @electron/remote.

### Selection service
- The selection service is a global singleton object that keeps track of the currently selected text.
- the selection service keeps track of the currently active editor (an object from the monaco editor npm package)
- the service can be monitored for changes in the selection.
- supports the following actions / functions:
  - cut: if there is a reference to an editor, ask the monaco editor to cut the selected text to the clipboard.
  - copy: if there is a reference to an editor, ask the monaco editor to copy the selected text to the clipboard.
  - paste: if there is a reference to an editor, ask the monaco editor to paste the clipboard content at the current cursor position.
  - delete: if there is a reference to an editor, ask the monaco editor to delete the selected text.
  - clear selection: if there is a reference to an editor, ask the monaco editor to clear the current selection.
  - select all: if there is a reference to an editor, ask the monaco editor to select all the text.
  - hasSelection: returns true if there is an editor and it has a non-empty selection


### Undo service
- The undo service is a global singleton that keeps track of all the text edits that the user performs on the various monaco-editors.
- It has an undo and redo list.
- don't freeze the global object

### line parser
- the line-parser service is a global singleton object used to parse markdown lines and update the the text-fragments stored in the project-service.
- It has:
  - fragmentIndex: the line-parser service maintains an array of text-fragment objects. When the service is created, this list is empty.
  - createTextFragment: a function for creating new text-fragments (json objects). it accepts as input a string which is the line that is being processed and the index nr at which the object should be placed.
    - trim the line and convert it to lower case.
    - count the nr of '#' that are in front of the title and assign to the depth-level of the text-fragment. so '#' is level 1, '##' is level 2, '###' is level 3 and so on.
    - remove all the '#' from the line, trim again (to remove any spaces at the front) and assign to the title value of the text-fragment.
    - calculate the key for the text-fragment and store in the text-fragment.
    - set the 'out-of-date' flag to true, indicating that this fragment hasn't been processed yet
    - initialize an empty array for the 'lines' field
    - initialize an empty arry for the 'outOfDateTransformers'
    - ask the project-service to add the text-fragment in it's list of text-fragments (projectService.addTextFragment(textFragment, index)).
    - do not add to the fragmentsIndex (is done separately)
    - return textFragment
  - calculateKey: for calculating the key of a text-fragment. It accepts as input a text-fragment and an index position. it goes as follows:
    - the current depth = the depth-level of the text-fragment
    - the result value = the title of the text-fragment
    - loop from the given index position until 0 using the field idx
      - prev-fragment = the text-fragment that the project-service has at position 'idx' `ProjectService.textFragments[idx]`
      - if there is a prev-fragment and the depth-level of the prev-fragment is smaller then the current depth:
        - store the new current depth
        - prepend the title of the prev-fragment + ' > ' to the result
        - if the new current depth == 1, stop the loop
  - clear: clear the fragmentsIndex list.
  - getStartLine(fragment): `return this.fragmentsIndex.indexOf(fragment)`
  - pseudo code for the parse function and related:
    ```python (pseudo)

      def parse(line, index):
        line = line.trim()
        if line == '':
          lineParserHelpers.handleEmptyLine(this, index)
        elif line.startsWith('#'):
          lineParserHelpers.handleTitleLine(this, line, index)
        else:
          lineParserHelpers.handleRegularLine(this, line, index)

      def insertLine(line, index):
        this.fragmentsIndex.insert(index, null)
        this.parse(line, index)

      def deleteLine(index):
        lineParserHelpers.deleteLine(this, index)
        del this.fragmentsIndex[index]
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
        fragmentsIndexEmpty = service.fragmentsIndex.length == 0 or service.fragmentsIndex.find(t => t==null)?.length == service.fragmentsIndex.length
        if fragmentsIndexEmpty:
          while service.fragmentsIndex.length <= index:
             service.fragmentsIndex.push(null)
        else:
          fragment, fragmentStart = getFragmentAt(service, index)
          if not fragment:
            raise Exception('internal error: no fragment found in non empty index table')
          if index == fragmentStart:
            this.removeFragmentTitle(service, fragment, null, index)
          else:
            fragmentLineIndex = index - fragmentStart + 1
            while fragment.lines.length < fragmentLineIndex:
              fragment.lines.push('')
              service.fragmentsIndex[fragmentStart + fragment.lines.length] = fragment
            if fragment.lines.length > fragmentLineIndex:
              fragment.lines.insert(fragmentLineIndex, '')
              service.fragmentsIndex[index] = fragment


      def updateFragmentTitle(service, fragment, line, fragmentPrjIndex):
        oldKey = fragment.key
        line = line.trim().toLowerCase()
        fragment.depth = line.split('#').length - 1
        fragment.title = line.replace(/#/g, '').trim();
        fragment.key = service.calculateKey(fragment, fragmentPrjIndex);
        eventParams = { fragment, oldKey }
        projectService.eventTarget.dispatchEvent(new CustomEvent('key-changed', { detail: eventParams } ))


      def removeFragmentTitle(service, fragment, line, index):
        prevFragment, prevIndex = getFragmentAt(service, index-1)
        if not prevFragment: # title of first was removed, set title to empty
          if line:
            fragment.lines.insert(0, line)
          fragmentPrjIndex = projectService.textFragments.indexOf(fragment)
          updateFragmentTitle(service, fragment, '', fragmentPrjIndex)
        else:
          if line:
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
        fragmentLineIndex = index - (fragmentStart + fragment.lines.length + 1)
        # copy over all the lines and adjust the index
        while fragmentLineIndex > 0 and fragment.lines.length > 0:
          toAdd.lines.insert(0, fragment.lines.pop())
          service.fragmentsIndex[index + fragmentLineIndex] = toAdd
          fragmentLineIndex -= 1
        projectService.markOutOfDate(fragment)


      def isInCode(fragment):
        linesStartingWithCode = 0
        for line in fragment.lines:
          trimmed = line.trim()
          if trimmed.startsWith('```'):
            linesStartingWithCode += 1
        return linesStartingWithCode % 2 == 1


      def handleTitleLine(service, line, index):
        if fragmentsIndex.length == 0 or fragmentsIndex.length < index or fragmentsIndex[index] == null:
          toAdd = service.createTextFragment(line, projectService.textFragments.length)
          while service.fragmentsIndex.length <= index:
             service.fragmentsIndex.push(null)
          service.fragmentsIndex[index] = toAdd
        else:
          fragment, fragmentStart = getFragmentAt(service, index)
          if not fragment:
            raise Exception('internal error: no fragment found in non empty index table')
          fragmentPrjIndex = projectService.textFragments.indexOf(fragment)
          if fragmentStart == index:
            updateFragmentTitle(service, fragment, line, fragmentPrjIndex)
          elif isInCode(fragment):
            handleRegularLine(service, line, index)
          else:
            insertFragment(service, fragment, fragmentStart, line, fragmentPrjIndex + 1, index)


      def updateFragmentLines(service, fragment, line, index, fragmentStart):
        fragmentLineIndex = index - fragmentStart - 1 # extra - 1 cause the text starts at the line below the title
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
          toAdd.lines.push(line)
          while service.fragmentsIndex.length <= index:
             service.fragmentsIndex.push(null)
          service.fragmentsIndex[index] = toAdd
        elif fragmentStart == index and fragment.title: # went from title to regular
          removeFragmentTitle(service, fragment, line, index)
        else:
          updateFragmentLines(service, fragment, line, index, fragmentStart)

      
      def deleteLine(service, index):
        fragment, fragmentStart = service.getFragmentAt(index)
        if fragment:
          if fragmentStart == index: # fragment is being removed. if it still has lines, copy to prev, if no prev, leave with no title
            removeFragmentTitle(service, fragment None, index)
          else:
            del fragment.lines[index - fragmentStar + 1]

    ```
  
### position-tracking service
- the position-tracking service is a global singleton object responsible for tracking the text-fragment and transformer that the user is currently working on / with.
- The service keeps track of:
  - the currently selected line nr
  - the text-fragment related to the currently selected line. This is an object that can be assigned (property: activeFragment). When this value changes, an event needs to be raised so that other parts of the application can move to the new active fragment.
  - a reference to the currently active transformer. This is used to run a build only for the active transformer (field: activeTransformer)
  - an eventTarget that stores the events which monitor changes in the currently selected text-fragment.
- it provides the following methods:
  - set currently selected line, input: line-index.
      - if the new value is different from the current selected line index:
        - get the object at the line-index position found on the fragmentsIndex array of the line-parser service.
        - If this object differs from currently selected text-fragment, then store the object as the new currently selected text-fragment and trigger the 'change' event for all the registered event handlers, passing the text-fragment as event data.
  - clear:
    - set activeFragment & currentLine to null
  - setActiveFragment(fragment):
    ```python
      if not this.activeFragment == fragment:
        startPos = lineParser.getStartLine(fragment)
        if startPos > -1:
          event = new CustomEvent('moveTo', {detail: startPos + 1})
          this.eventTarget.dispatchEvent(event)

    ```
  

### gpt service
- the GPT service is a global singleton that is responsible for communicating with the open-ai api backend. It is primarily used by transformers that perform more specific tasks.
- the service uses the openai node.js library to communicate with the backend.
- defaultModel: stores the default model to use during api calls.
  - setDefaultModel: store the default model in the field & in localStorage
  - getDefaultModel: return the field
  - during construction, load the defaultModel from localStorage
- modelsMap: a field (initialized as dictionary), stores which model should be used for individual transformers and also per transformer, for each individual text-fragment.
  - setModelForTransformer(model, transformer): assign a model to a transformer:
    ```python
      if not transformer.name in this.modelsMap:
        map = {}
        this.modelsMap[transformer.name] = map
      else:
        map = this.modelsMap[transformer.name]
      map['__default'] = model
    ```
  - getModelForTransformer(transformer): `return this.modelsMap[transformer.name]?.['__default']`
  - setModelForFragment(model, transformer, key): assign a model to a transformer:
    ```python
      if not transformer.name in this.modelsMap:
        map = {}
        this.modelsMap[transformer.name] = map
      else:
        map = this.modelsMap[transformer.name]
      map[key] = model
    ```
  - getModelForFragment(transformer, key): `return this.modelsMap[transformer.name]?.[key]`
- sendRequest: other services (or components) can call to send an api request to open-ai.
  - function parameters:
    - messages: json objects that contain a `role` and `content` field.
    - transformerName: the name of the object that is calling the function
    - fragmentKey: the key of the fragment that is being processed 
  - the `messages` list is sent to openai using the `createChatCompletion` function.
  - the model parameter for createChatCompletion can be found in the modelsMap dictionary:
    ```python
    def getModelForRequest(transformerName, fragmentKey):
      if transformerName in this.modelsMap:
        section = this.modelsMap[transformerName]
        if fragmentKey in section:
          return section[fragmentKey]
        if '__default' in section:
          return section['__default']
      return this.getDefaultModel()
    ```
  - if the request fails, the service will retry 3 times before giving up and raising an error (use the async-es lib).
- getModels: a method to retrieve the list of available models. 
  - To retrieve this list, the openai nodejs library is used. `(await this.openai.models.list())?.data?.map((model) => model.id) ?? [];`
  - only try to retrieve the list of models if there is a key available
  - if there is no key available, show a dialog message to the user asking him to provide a valid open-ai api key. Only ask 1 time. Return an empty list.
  - sort the list
  - after retrieving the list from openai, store in local variable. if this variable is set, return this instead of retrieving the value.
- apiKey: stores the api key to use when creating the openAI object.
  - load from localStorage (globally available) during construction of the service
- setApiKey: updates the api key
  - save to localStorage
  - recreate openAI object `new OpenAI({apiKey, dangerouslyAllowBrowser: true})`.
  - reset flag so errors can be shown again
- only instantiate the OpenAI library if a valid apiKey is provided

### result-cache service
- this service manages previously retrieved results for transformers.
- It allows transformers that transform text fragments into results, to store these results for each text fragment and keep track if the result has become out of date or not (any of the inputs of the transform operation has changed).
- because some transformers work on text fragments that come from the project directly and others that come from the result of other transformers, the result cache must be able to monitor changes in a project fragment and result fragment.
- A transformer that wants to cache it's results uses an instance of this class to perform these tasks on it's results.
- internally, the cache uses a dictionary that maps the keys to their results.
- whenever the transformer calculates a result, it asks the cache to update it's dictionary by calling 'setResult'.
- the cache stores the results in a json file.
  - if the 'is-dirty' flag is not set, no need to save the results
  - file writes are done async. The fs module should be remotely loaded through @electron/remote.
  - after saving the cache, the 'is-dirty' flag is reset.
  - the name of this file is specified by the transformer that creates the class instance (the transformer is a constructor parameter, use the field 'name', store a ref to the transformer for later usage)
  - the location of the file (folder) is provided by folder-service.cache
  - the json file contains:
    - the primary dictionary that contains the results.
    - the secondary dictionary that contains the relationships between keys of text-fragments and full dictionary entries in the primary dict (which can consist out of multiple keys cause 1 result value can have multiple inputs).
    - a third dictionary that contains all the overwritten values of the results (if any)
    - a date that specifies the last save date of the project file. This is used when loading the dictionary back from file to verify if the results are still valid or not (when this date doesn't match the last-modified date of the project, something is out-of sync and consider the results in the file out-of-date).
  - the cache tries to load this json file during construction of the instance. If the file doesn't exist, clearCache() is called to make certain that the cache is empty again.
- When the result-cache-service is created, it:
  - initializes the 'is-dirty' flag to false
  - initialize eventTarget `this.eventTarget = new EventTarget()`
  - registers the event handler 'handleKeyChanged' with the project service to monitor when the key of a fragment changes
    - register using pseudo: `projectService.eventTarget.addEventListener('fragment-deleted', handleKeyChanged)`
  - registers the event handler 'handleFragmentDeleted' with the project service to monitor when a fragment is deleted
    - register using pseudo: `projectService.eventTarget.addEventListener('key-changed', handleFragmentDeleted)`
  - registers an event handler with the project service to monitor when text fragments have changed
    - register using pseudo: `projectService.eventTarget.addEventListener('fragment-out-of-date', handleTextFragmentChanged)`
  - and registers the same event handler with each object that the parent transformer uses as input (provided in the constructor as a list of transformer services, each service has a field 'cache')
  - whenever the event handler is triggered (event.detail = fragment-key), the cache service checks in the secondary dictionary if there are any entries for that key. This allows the system to react to changes in single text-fragments, even though there were multiple input text-fragments (and so the keys in the primary dictionary are a concatenation of multiple titles).
    - for each entry in the list:
      - search in the primary dictionary
      - if not yet marked as out-of-date:
        - mark as out-of-date
        - set the 'is-dirty' flag
        - if there are any other cache services that monitor this cache-service (instead of the project service directly), then let them know that the specified text-fragment (from the result) has gone out-of-date.
    - call projectService.tryAddToOutOfDate(fragmentKey, this.transformer)
- the result-cache has a function to overwrite the result for a key. this overwritten text value is stored in the 'overwrites' dictionary, under the supplied key. When called, set the 'is-dirty' flag.
- the result-cache has a function to retrieve the result for a particular key: the key is first searched in the 'overwrites' dictionary. if this has a result, return this value, otherwise try to return the value found in the results dictionary.
- the result-cache has a function to retrieve if a text fragment is out-of-date or not (from the key): if the result is marked as out-of-date, returns true
- clearCache(): a function to clear the cache, secondary cache & overwrites
- handleFragmentDeleted: an event handler called when a fragment is deleted. in pseudo:
  ```python (pseudo)
  def handleFragmentDeleted(e):
    fragment = e.detail
    fragment.state = 'deleted'
    this.isDirty = True
  ```
- getFragmentResults: a function to retrieve all the results related to a particular fragment. Definition in pseudo:

  ```python (pseudo)
  def getFragmentResults(fragmentKey):
    if this.overwrites[key]: # entire fragment could be overwritten, if so, return this
      return this.overwrites[key]
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
- handleKeyChanged: an event handler, called when the key of a text-fragment has changed, definition in pseudo:
  ```python (pseudo)
  def handlekeyChanged(e):
    params = e.detail
    oldKeys = this.secondaryCache[params.oldKey]
    if oldKeys:
      newKeys = []
      for oldKey in oldKeys:
        newKey = oldKey.replace(params.oldKey, params.fragment.key)
        newKeys.push(newKey)
        this.cache[newKey] = this.cache[oldKey]
        delete this.cache[oldKey]
      this.secondaryCache[params.fragment.key] = newKeys
      delete this.secondaryCache[params.oldKey] 
      this.isDirty = True
  ```
- setResult: stores the result in the cache. in pseudo:
  ```python (pseudo)
  def setResult(key, result):
    isModified = True
    if not key in this.cache:
      this.cache[key] = { result, state: 'still-valid' }
      keyParts = key.split(' | ')
      for part in keyParts:
        if not part in this.secondaryCache:
          this.secondaryCache[part] = [key]
        else:
          this.secondaryCache[part].push(key)
    elif this.cache[key].result != result:
      this.cache[key].result = result
      this.cache[key].state = 'still-valid'
    else:
      isModified = False
    if isModified:
      this.isDirty = True
      this.eventTarget.dispatchEvent(new CustomEvent('fragment-out-of-date', { detail: key }))
  ```
- isOutOfDate(keyPart): checks if the specified key is present and marked as still-valid
  ```python (pseudo)
  def isOutOfDate(keyPart):
    if keyPart in this.secondaryCache:
      for key in this.secondaryCache[keyPart]:
        if this.cache[key].state != 'still-valid':
          return True
      return False
    return True
  ```


### build service
- the build service is a global singleton that processes all the text-fragments of the project-service. It uses a set of transformers to iteratively generate conversions on the different text-fragments.
- async buildAll: to build the project, the service performs the following actions:
  - for each text-fragment in project-service.data-list: `this.buildFragment(text-fragment)`
- async buildFragment(fragment): 
  - for every transformer in the list of entry-points of the cybertron-service: `await this.runTransformer(text-fragment, transformer)`
- async runTransformer(fragment, transformer):
  - ask the transformer to render it's result (renderResult) (async)
- debug: a property to indicate if the build service is currently in debug mode or not. Load the value from local storage upon creation. Save to local storage whenever the value is updated.
- isBuilding: a property to indicate if one of the build functions is currently running or not.
  

### build-stack service
- the build-stack service is used during the build process to make certain that there are no circular references in the process. This occurs when a transformer depends on the result of another transformer that (eventually) again relies on the result of the first transformer, which can't be rendered yet.
- fields:
  - running = {} : a dictionary that keeps track of the textframe - transformer pairs that are currently running. Key calculation for the dict = transformer.name + textframe.key
- functions:
  - tryRegister(name, key):
    ```python
    toSearch = key + '-' + name
    if toSearch in this.running:
      return False
    this.running[toSearch] = True
    return True
    ```
  - unRegister(name, key):
    ```python
    toSearch = key + '-' + name
    delete this.running[toSearch] = True
    ```

### cybertron service
- the cybertron-service is a global singleton that is responsible for managing the list of available transformers.
- the service also maintains a list of entry-points: this is a sub-list of the available transformers which can be used as starting points for building text-fragments.
- Transformers can be register. this adds them to the list. A second parameter indicates if the transformer should also be added as an entry-point
- Transformers can also be unregister. this will remove them from the list of available transformers and the list of entry-points.
- getTransformer(name): search for the transformer with the specified name in this.transformers and return the result


### all-spark service
- the all-spark service is a global singleton that is responsible for creating all the transformers and registering them into the cybertron service. 
- functions:
  - load: create the transformers and register them with the cybertron-service. 
    - This function is called during construction of the application
    - to register, use: `cybertronService.register(transformer, false)`, to register as entry point, use: `cybertronService.register(transformer, true)`
    - register every transformer after construction so that it can be found in the list by other transformers.
    - transformers to create:
      - compress service (entry point)
      - constant-extractor service
      - double-compress service
      - triple-compress service
      - component-lister service


### transformer-base service
- The transformer-base service acts as a base class for transformers: it provides a common interface and functionality
- constructor:
  - name: the name of the transformer
  - dependencies: a list of names of transformers. Replace every name in the list with the object found in the cybertron-service's list of transformers. If a name can not be found, raise an exception with the necessary info. Store the list of objects as 'dependencies'
  - isJson: when true, the result values should be treated as json structures, otherwise as regular text.
- this service uses a result-cache-service (field: cache) to store all the results and keep track of when the build has gone out-of-date. 
  - constructor params:
    - transformer-name = this.name
    - dependencies = this.dependencies
- functions:
  - render-result(pseudo):
    ```python (pseudo)
    def renderResult(textFragment):
      message, keys = await this.buildMessage(textFragment)
      if not message: 
        return None
      result = await GPT-service.sendRequest(this.name, textFragment.key, message) # need name and key so the gpt service can select the correct model
      key = ' | '.join(keys)
      this.cache.setResult(key, result)
      return result
    ```
  - get-result(key): get an up-to-date result value for the specified key. Use the cache when possible.
    ```python (pseudo)
    async def getResult(fragment):
      if not this.cache.isOutOfDate(fragment.key):
        return this.cache.getFragmentResults(fragment.key)
      if not buildStackService.tryRegister(this.name, fragment.key):
        return # circular reference, not good, stop the process
      try:
        result = await this.renderResult(fragment)
        return result
      finally:
        buildStackService.unregister(this, fragment.key)
    ```

### transformers

#### compress service
- The compress service takes a text fragment and makes it shorter.
- Useful to check if the system understands the fragment and can be used as input for other processes.
- inherits from transformer-base service. Constructor parameters:
  - name: 'compress'
  - dependencies: ['constants']
  - isJson: false

- function build-message(text-fragment):
  - result (json array):
    - role: system, content:
      
     > Act as an ai software analyst. You are reviewing the feature description of an application. It is your job to shorten the following text as much as possible and rephrase it in your own words, without loosing any meaning.
     > Any text between markdown code blocks (``` or \""" signs) are declarations of constant values, do not change them, but replace with the name of the constant. Remove the markdown, but use bullet points where appropriate.
     > compress the following text:

    - role: user, content: `text-fragment.lines.join('\n')`.
  - return result, [ text-fragment.key ]


#### constant-extractor service
- The constant-extractor service makes certain all constant definitions (between quotes) are extracted from the source code, rendered to a json file and replaced with references to the json-entries in the source texts.
- inherits from transformer-base service. Constructor parameters:
  - name: 'constants'
  - dependencies: []
  - isJson: true
- functions:
  - extract-quotes: extract all the locations in the text that contain quotes
  ```python (pseudo)
    def extractQuotes(lines):
      quotes = []
      current_quote = None
      cur_lines = []
      line_nr = 0
      for line in lines:
          line = line.lstrip()
          if line.startswith('>'):
              line = line[1:] # remove the > 
              if len(line) > 0 and line[0] == ' ':  # and the space but leave everything else cause we want the exact quote
                  line = line[1:]
              cur_lines.append(line)
              if not current_quote:
                  # could be that the previous line was empty, in that case, start the quote a line earlier
                  if line_nr > 0 and not lines[line_nr - 1].strip():
                      current_quote = {'start': line_nr - 1}
                  else:
                      current_quote = {'start': line_nr}
          elif not line and current_quote: # empty line so we need to close the quote
              current_quote['end'] = line_nr
              quotes.append((current_quote, cur_lines))
              current_quote = None
              cur_lines = []
          line_nr += 1
      if current_quote:
          current_quote['end'] = line_nr
          quotes.append((current_quote, cur_lines))
      return quotes
  ```
  - render-result(pseudo):
    ```python (pseudo)
    def renderResult(textFragment):
      result = this.extractQuotes(textFragment.lines)
      this.cache.setResult(textFragment.key, result)
      return result
    ```
  - get-result(key): get an up-to-date result value for the specified key. Use the cache when possible.
    ```python (pseudo)
    async def getResult(fragment):
      quotes = []
      if not this.cache.isOutOfDate(fragment.key):
        quotes = this.cache.getFragmentResults(fragment.key)
      else:
        quotes = await this.renderResult(fragment)
      if not quotes:
        return fragment.lines.join('\n')
      else:
        lines = fragment.lines
        new_lines = []
        consts = [*quotes] # make a copy of the list so we can remove items from it
        current_const = consts.pop(0)
        cur_line = 0
        while cur_line < len(lines):
            if current_const and cur_line == current_const['start']:
                # add the constant to the previous line
                new_lines[-1] += f' the value of the constant resources.{current_const["name"]}'
                cur_line = current_const['end'] + 1
                if len(consts) > 0:
                    current_const = consts.pop(0)
                else:
                    current_const = None
            else:
                new_lines.append(lines[cur_line])
                cur_line += 1
        return new_lines.join('\n')
    ```


#### double-compress service
- The double-compress-service takes the result of compress-service and makes it even shorter.
- Useful to check if the system understands the fragment and can be used as input for other processes.
- inherits from transformer-base service. Constructor parameters:
  - name: 'double compress'
  - dependencies: ['compress']
  - isJson: false
- set during construction: `this.compressService = this.dependencies[0]`
- function build-message(text-fragment):
  - result (json array):
    - role: system, content:
      
     > condense the following text as much as possible, without loosing any meaning:

    - role: user, content: `await this.compressService.getResult(text-fragment)`.
  - return result, [ text-fragment.key ]


#### triple-compress service
- The triple-compress-service takes the result of double-compress-service and shortens it to 1 line.
- Used as a description for each fragment when searching for linked components and services.
- inherits from transformer-base service. Constructor parameters:
  - name: 'triple compress'
  - dependencies: ['double compress']
  - isJson: false
- set during construction: `this.doubleCompressService = this.dependencies[0]`
- function build-message(text-fragment):
  - result (json array):
    - role: system, content:
      
     > condense the following text to 1 sentence:

    - role: user, content: `await this.doubleCompressService.getResult(text-fragment)`.
  - return result, [ text-fragment.key ]

#### component-lister service
- the component-lister services is responsible for extracting all the component names it can find in a text.
- part of finding out which components need to be rendered
- inherits from transformer-base service. Constructor parameters:
  - name: 'components'
  - dependencies: []
  - isJson: true
- function build-message(textFragment):
  - if projectService.textFragments.indexOf(textFragment) < 2: return null
  - result (json array):
    - role: system, content:
      
      > Act as an ai software analyst.
      > It is your task to list all the components that you can find in the text, keeping in mind that the following development stack is used:
      > {{dev_stack_title}}
      > {{dev_stack_content}}
      >
      > Do not include UI components that are provided by the UI framework. So don't include: buttons, dropdowns, inputs, sliders, toggle buttons, but only list the components that need to be custom built.
      > Don't include any non visual services.
      > Don't include any explanation, just write the list of component names as a json array and nothing else.
      > If no components can be found, return an empty json array.
      >
      > good response:
      > ["SomethingX", "SomethingY"]
      > 
      > bad response:
      > ["something-x", "something y"]

      replace:
      - dev_stack_title: `projectService.textFragments[1]?.title`
      - dev_stack_title: `projectService.textFragments[1]?.lines.join('\n')`

    - role: user, content:

      > {{title}}
      > {{content}}
      
      replace:
      - title: `textFragment.title`
      - content: `textFragment.lines.join('\n')`

    - role: assistant, content:

      > Remember: only components and use CamelCasing for the component names.

  - return:
    ```python
    if len(projectService.textFragments) >= 1:
      return result, [ textFragment.key, projectService.textFragments[1].key ]
    else:
      result, [ textFragment.key ]
    ```