# MarkdownCode > components > main window
[{"component_name": "Body", "value": "- a body: this component occupies all of the remaining space in the window", "source": "# MarkdownCode > components > body"}, {"component_name": "Toolbar", "value": "- a toolbar: located at the top of the window.", "source": "# MarkdownCode > components > toolbar"}]
# MarkdownCode > components > toolbar > home > file section
[]
# MarkdownCode > components > toolbar > home > edit section
[]
# MarkdownCode > components > toolbar > home > undo section
[]
# MarkdownCode > components > toolbar > home > build section
[]
# MarkdownCode > components > toolbar > format > paragraph section
[]
# MarkdownCode > components > toolbar > format > font section
[]
# MarkdownCode > components > body > outline
[{"component_name": "Editor", "value": "- The outline component is positioned to the left of the editor\n- When the user clicks on a tree item, the related text is scrolled into view on the editor.", "source": "# MarkdownCode > components > body > editor"}]
# MarkdownCode > components > body > results view
[{"component_name": "Body", "value": "- the results-view component is positioned at the bottom of the main body", "source": "# MarkdownCode > components > body"}, {"component_name": "Editor", "value": "- In the center of the tab content, there is a monaco editor containing the result from the result-cache of the service, if available.\n- If the result is marked as out-of-date, the text in the editor is shown as grayed-out.\n- If the text in the editor is an overwritten version of the service output, the text is shown in red. (dark-red for the light theme, light-red for the dark theme)\n- When the users performs edits in the monaco-editor of the tab, all changes are stored back in the result-cache of the service, marked as 'overwritten'.", "source": "# MarkdownCode > components > body > editor"}, {"component_name": "MonacoEditor", "value": "- A Monaco editor is used in the center of the tab content to display the result from the result-cache of the service.\n- If the result is marked as out-of-date, the text in the Monaco editor is shown as grayed-out.\n- If the text is an overwritten version of the service output, the text in the Monaco editor is shown in red. The shade of red depends on the theme (dark-red for the light theme, light-red for the dark theme).\n- When the user performs edits in the Monaco editor of the tab, all changes are stored back in the result-cache of the service, marked as 'overwritten'.", "source": "# MarkdownCode > components > body > editor"}]
# MarkdownCode > services
[]
# MarkdownCode > services > Theme service
[{"component_name": "MainWindow", "value": "The main window refreshes it's entire content when the selected theme is updated.", "source": "# MarkdownCode > components > main window"}, {"component_name": "Theme", "value": "- Theme service\n- Managing the currently selected theme\n- Selection between a light or dark theme\n- Every component uses the theme service to retrieve the currently selected theme\n- The main window refreshes its entire content when the selected theme is updated", "source": "# MarkdownCode > components > toolbar > preferences > view section"}]
# MarkdownCode > services > project service
[{"component_name": "Outline", "value": "- The project service provides a function to retrieve a tree-structure, where each item in the tree represents a header that is used in the project. This tree-structure can be used in the outline or in drop-down boxes on the results-view.", "source": "# MarkdownCode > components > body > outline"}]
# MarkdownCode > services > Selection service
[]
# MarkdownCode > services > Undo service
[{"component_name": "Editor", "value": "- The user performs text edits on various monaco-editors.", "source": "# MarkdownCode > components > body > editor"}, {"component_name": "MonacoEditor", "value": "- The undo service keeps track of all the text edits that the user performs on the various monaco-editors.\n- It has an undo and redo list.", "source": "# MarkdownCode > components > body > editor"}, {"component_name": "MonacoEditor", "value": "- The undo service keeps track of all the text edits that the user performs on the various monaco-editors.\n- It has an undo and redo list.", "source": "# MarkdownCode > components > body > results view"}]
# MarkdownCode > services > line parser
[]
# MarkdownCode > services > position-tracking service
[]
# MarkdownCode > services > gpt service
[]
# MarkdownCode > services > result-cache service
[]
# MarkdownCode > services > build service
[]
# MarkdownCode > services > compress service
[]
# MarkdownCode > services > dialog service
[]
# MarkdownCode > components > toolbar
[{"component_name": "Tab", "value": "- The application uses a toolbar with a number of tabs.\n- The tabs are from the antd library.\n- The following tabs are available: home, format, preferences.\n- The home tab is shown as the first tab when the application starts.", "source": "# MarkdownCode > components > body > results view"}, {"component_name": "HomeTab", "value": "- Home: This is shown as the first tab when the application starts.", "source": "# MarkdownCode > components > toolbar > home"}, {"component_name": "FormatTab", "value": "The source text declares that there is a 'Format' tab available in the toolbar of the application.", "source": "# MarkdownCode > components > toolbar > format"}, {"component_name": "PreferencesTab", "value": "The source text mentions a 'Preferences' tab as one of the available tabs in the application's toolbar.", "source": "# MarkdownCode > components > toolbar > preferences"}]
# MarkdownCode > components > toolbar > home
[]
# MarkdownCode > components > toolbar > format
[]
# MarkdownCode > components > toolbar > preferences
[{"component_name": "Tab", "value": "- The 'preferences-tab' component is a wrapper that displays its children in a row.", "source": "# MarkdownCode > components > body > results view"}]
# MarkdownCode > components > body
[{"component_name": "Editor", "value": "- At the top of the vertical splitter component is an editor component.", "source": "# MarkdownCode > components > body > editor"}, {"component_name": "Outline", "value": "- On the left of the horizontal splitter is an outline component.", "source": "# MarkdownCode > components > body > outline"}, {"component_name": "HorizontalSplitter", "value": "- The entire area of the body component is filled with a horizontal splitter component.\n- On the left of the horizontal splitter is an outline component.\n- The body component has an event handler for the 'onPositionChanged' callback of the horizontal splitter that will store the new value for its position.\n- When the body component is unloaded, the last position of the horizontal splitter is stored in the local storage.\n- When the body component is loaded, the last position of the horizontal splitter is restored from the local storage, but only if the previous value fits in the current size of the component, otherwise 1/3 of the component's height is used for the horizontal splitter.", "source": "# MarkdownCode > components > body > horizontal splitter"}, {"component_name": "VerticalSplitter", "value": "- The vertical splitter component is located to the right of the horizontal splitter in the body component.\n- At the top of the vertical splitter component is an editor component.\n- At the bottom of the vertical splitter component is a results view component.\n- The body component has an event handler for the 'onPositionChanged' callback of the vertical splitter that will store the new value for its position.\n- When the body component is unloaded, the last position of the vertical splitter is stored in the local storage.\n- When the body component is loaded, the last position of the vertical splitter is restored from the local storage, but only if the previous value fits in the current size of the component, otherwise 1/3 of the width for the vertical splitter is used.", "source": "# MarkdownCode > components > body > vertical splitter"}]
# MarkdownCode > components > body > horizontal splitter
[]
# MarkdownCode > components > body > vertical splitter
[]
