# MarkdownCode > services > Undo service
{}
# MarkdownCode > services > dialog service
{"DialogService": "1. Components should use the dialog service as a common interface to display dialog boxes.\n2. Components should utilize the service to show dialog boxes for errors, warnings, and info.\n3. In case of an error, components should use the service to display an electron dialog box to the user with detailed information about the error."}
# MarkdownCode > services > Selection service
{}
# MarkdownCode > services > Theme service
{"ThemeService": "- All components should use the theme service to retrieve the currently selected theme and apply it. \n- Components do not need to subscribe for changes to the selected theme value, they only need to retrieve this value from the theme service and use the styling names based on the selected theme. \n- The main window should refresh its entire content when the selected theme is updated."}
# MarkdownCode > services > folder service
{}
# MarkdownCode > services > gpt service
{}
# MarkdownCode > services > cybertron service
{}
# MarkdownCode > services > transformer-base service
{}
# MarkdownCode > services > compress service
{}
# MarkdownCode > services > build service
{}
# MarkdownCode > services > line parser
{}
# MarkdownCode > services > position-tracking service
{}
# MarkdownCode > services > project service > change-processor service
{}
# MarkdownCode > services > build-stack service
{}
# MarkdownCode > services > constant-extractor service
{}
# MarkdownCode > services > project service
{}
# MarkdownCode > services > line parser > line parser helpers
{}
# MarkdownCode > services > project service > storage service
{"StorageService": "Components should use the storage service as follows:\n\n1. Use the `clear()` function to clear all references to previously loaded data.\n2. Use the `new()` function to set up a new project.\n3. Use the `open(filePath)` function to load all data from disk.\n4. Use the `updateOutOfDate()` function to update the list of out-of-date transformers for each text-fragment.\n5. Use the `markDirty()` function to mark the project as needing to be saved.\n6. Use the `save(file)` function to save the project to disk.\n7. The fs module should be remotely loaded through electron."}
# MarkdownCode > services > result-cache service
{}
