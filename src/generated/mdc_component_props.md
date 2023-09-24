# MarkdownCode > components > main window
{"MainWindow": {}}
# MarkdownCode > components > toolbar > home > undo section
{"UndoSection": {}, "UndoButton": {}, "RedoButton": {}}
# MarkdownCode > components > toolbar > home
{"HomeTab": {}}
# MarkdownCode > components > toolbar > format
{"FormatTab": {"style": "A property that defines the style of the FormatTab component.", "paragraph": "A property that defines the paragraph settings of the FormatTab component.", "font": "A property that defines the font settings of the FormatTab component."}}
# MarkdownCode > components > toolbar > format > paragraph section
{"ParagraphSection": {}, "IndentButton": {"onClick": "A function that is called when the button is clicked. This function should apply the indent action to the current line or selection of text.", "isActive": "A boolean indicating whether the indent action is currently active. This is used to change the appearance of the button, for example to show it as 'pressed' when the indent action is active.", "disabled": "A boolean indicating whether the button is currently disabled. If true, the button will be unclickable and may be displayed in a 'disabled' state.", "icon": "A string or element representing the icon to be displayed on the button. This should visually represent the indent action.", "tooltip": "A string to be displayed as a tooltip when the user hovers over the button. This should explain the function of the button, for example 'Indent text'."}, "UnindentButton": {}}
# MarkdownCode > components > toolbar > format > font section
{"FontSection": {"bold": "A boolean indicating whether the bold formatting should be applied to the selected text.", "italic": "A boolean indicating whether the italic formatting should be applied to the selected text.", "underline": "A boolean indicating whether the underline formatting should be applied to the selected text.", "strikeThrough": "A boolean indicating whether the strike-through formatting should be applied to the selected text.", "onBoldToggle": "A function that is called when the bold toggle button is clicked.", "onItalicToggle": "A function that is called when the italic toggle button is clicked.", "onUnderlineToggle": "A function that is called when the underline toggle button is clicked.", "onStrikeThroughToggle": "A function that is called when the strike-through toggle button is clicked."}}
# MarkdownCode > components > toolbar > format > style section
{"StyleSection": {"selectionService": "A service that handles the selection of text. The StyleSection component uses this to apply styles to the selected text.", "heading1": "A button that applies the 'heading 1' style to the selected text.", "heading2": "A button that applies the 'heading 2' style to the selected text.", "heading3": "A button that applies the 'heading 3' style to the selected text.", "heading4": "A button that applies the 'heading 4' style to the selected text.", "heading5": "A button that applies the 'heading 5' style to the selected text.", "heading6": "A button that applies the 'heading 6' style to the selected text.", "paragraph": "A button that applies the 'paragraph' style to the selected text.", "quote": "A button that applies the 'quote' style to the selected text.", "code": "A button that applies the 'code' style to the selected text.", "bulletList": "A button that applies the 'bullet list' style to the selected text.", "numberedList": "A button that applies the 'numbered list' style to the selected text."}}
# MarkdownCode > components > toolbar > preferences
{"PreferencesTab": {}}
# MarkdownCode > components > toolbar > preferences > GPT section
{"GPTSection": {"GPTServiceConfiguration": "Handles GPT service configuration actions", "IconContent": "Buttons in the component have icon content, no text", "OpenStateTracking": "Tracks the open state of the 'open-ai configuration dialog'", "KeyButton": "Opens the 'open-ai configuration dialog'", "KeyButtonIcon": "Icon for the key button", "ModelSelection": "Uses ModelComboBox component to allow user to select default model for open-ai requests"}, "ModelComboBox": {"defaultValue": "The initial value for the combobox, obtained from the getDefaultModel function.", "onChange": "A function that is triggered when the value of the combobox is changed. It saves the new value to the gpt-service using the setDefaultModel function.", "options": "The available models for the combobox, fetched from the gpt-service.", "disabled": "A boolean value that determines whether the combobox is disabled or not.", "style": "An object that defines the CSS styling for the combobox.", "className": "A string that assigns a class to the combobox for CSS styling."}}
# MarkdownCode > components > toolbar > preferences > open-ai configuration dialog
{"OpenAiConfigurationDialog": {}}
# MarkdownCode > components > toolbar > preferences > view section
{"ViewSection": {"Theme": "A combobox where the user can choose between light or dark mode. Linked to the theme-service.", "Font": "A combobox for selecting the font of the markdown text. Linked to the theme-service.", "Font size": "A combobox for selecting the font size of the markdown text. Linked to the theme-service."}}
# MarkdownCode > components > body > outline
{"Outline": {}}
# MarkdownCode > components > toolbar
{"Toolbar": {"items": "An array of objects representing each tab in the toolbar. Each object should have a key, label, and children properties.", "key": "A unique identifier for each tab in the toolbar.", "label": "The display name of the tab in the toolbar.", "children": "An array of objects representing each item in the tab. Each object should have a key, label, and action properties.", "action": "A function that will be executed when the item is clicked."}}
# MarkdownCode > components > body > editor
{"Editor": {}}
# MarkdownCode > components > body > results view > results view tab
{"ResultsViewTab": {}}
# MarkdownCode > components > toolbar > home > edit section
{"EditSection": {}}
# MarkdownCode > components > body
{"Body": {}}
