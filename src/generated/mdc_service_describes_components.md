# MarkdownCode > services > Theme service
{"ThemeService": "1. All components should use the theme service to retrieve the currently selected theme and apply it accordingly.\n2. The main window should use the service to refresh its entire content when the selected theme is updated.\n3. The service should be used to switch between a light or dark theme as per user preference."}
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
{"DialogService": "1. Components should use the dialog service as a common interface to display dialog boxes.\n2. Components should utilize the service to show dialog boxes for errors, warnings, and info.\n3. All user-triggered actions or functions within a component should be wrapped in an error handler that uses the dialog service.\n4. In case of an error, components should use the service to display an electron dialog box to the user with detailed information about the error."}
