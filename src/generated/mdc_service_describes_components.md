# MarkdownCode > services > project service
{}
# MarkdownCode > services > Selection service
{}
# MarkdownCode > services > Undo service
{}
# MarkdownCode > services > line parser
{}
# MarkdownCode > services > position-tracking service
{}
# MarkdownCode > services > gpt service
{}
# MarkdownCode > services > result-cache service
{}
# MarkdownCode > services > build service
{}
# MarkdownCode > services > compress service
{}
# MarkdownCode > services > dialog service
{"DialogService": "1. Components should use the dialog service as a common interface to display dialog boxes.\n2. Components should utilize the service to show dialog boxes for errors, warnings, and info.\n3. In case of an error, components should use the service to display an electron dialog box to the user with detailed information about the error."}
# MarkdownCode > services > Theme service
{"ThemeService": "1. Components should use the theme service to retrieve the currently selected theme in order to apply it. \n2. Components do not need to subscribe for changes to the selected theme value. They only need to retrieve this value from the theme service.\n3. Components should use the styling names based on the selected theme.\n4. The main window should use the theme service to refresh its entire content when the selected theme is updated."}
