
app = ''
dev_stack = ''
fragments = []

toolbar = ''
toolbars = []

ui = ''
body = ''
service = ''
main_window = ''
components = []
services = []

class TextFragment:
    def __init__(self, title, content, full_title=None, data=None) -> None:
        self.title = title   # the title of the current fragment
        self.full_title = full_title or title # the title of the current fragment, preceded by the titles of all the parent fragments
        self.content = content.strip()
        self.data = data  # in case the content is json, this is the parsed json data

def collect(collecting_for, current):
    """
    checks the value in collecting_for and adds the current value to the appropriate list or assigsn it to the appropriate variable
    """
    global app, toolbar, ui, body, service, dev_stack, main_window
    if collecting_for == 'app':
        app = current
    elif collecting_for == 'dev_stack':
        dev_stack = current
    elif collecting_for == 'main_window':
        main_window = current
    elif collecting_for == 'toolbar':
        toolbar = current
    elif collecting_for == 'ui':
        ui = current
    elif collecting_for == 'body':
        body = current
    elif collecting_for == 'service':
        service = current
    elif collecting_for == 'components':
        components.append(current)
    elif collecting_for == 'services':
        services.append(current)
    elif collecting_for == 'toolbars':
        toolbars.append(current)
    else:
        raise ValueError(f"unknown collecting_for value: {collecting_for}")


def split_data(prompt):
    """splits up the prompt into a toolbar, list of components and a list of services, based on the markdown headers"""
    current = ''
    collecting_for = None
    for line in prompt.split("\n"):
        # if the line starts with a #, it is a header
        if line.startswith("#"):
            if current:
                collect(collecting_for, current)
                current = line + "\n"
            if line.startswith("# "):
                collecting_for = 'app'
            elif line == '## development stack':
                collecting_for = 'dev_stack'
            elif line == '## UI' or line == '## components':
                collecting_for = 'ui'
            elif line == '### main window':
                collecting_for = 'main_window'
            elif line == '### toolbar':
                collecting_for = 'toolbar'
            elif line == '### body':
                collecting_for = 'body'
            elif line == '## services':
                collecting_for = 'service'
            # either for a toolbar or component, depends on what we were collecting before
            elif collecting_for in ['body', 'components']:
                collecting_for = 'components'
            elif collecting_for in ['service', 'services']:
                collecting_for = 'services'
            elif collecting_for in ['toolbar', 'toolbars']:
                collecting_for = 'toolbars'
            else:
                raise ValueError(f"unknown collecting_for value: {collecting_for}")
        elif collecting_for is not None and line != '\n': # skip empty lines
            # only collect a line if we need to
            current += line + "\n"
    if current:
        collect(collecting_for, current)


def split_standard(prompt):
    """splits up the markdown into a list of text-fragments"""
    global toolbar, dev_stack
    current_title = ''
    current_content = ''
    collecting_for = None
    in_toolbar = False
    toolbar_level = 0
    parents = [] # all the titles of the parent fragments, so we can build the full title
    for line in prompt.split("\n"):
        # if the line starts with a #, it is a header
        if line.startswith("#"):
            if current_title:
                fragments.append(TextFragment(current_title, current_content, ' > '.join(parents)))
                if collecting_for is not None:
                    collect(collecting_for, current_title + '\n' + current_content)
            current_title = line.split('#')[-1].strip()
            current_content = ''
            if line.strip().endswith('toolbar'):
                in_toolbar = True
                toolbar_level = len(line.split('#')[0])
            elif in_toolbar and len(line.split('#')[0]) <= toolbar_level:
                in_toolbar = False
            elif in_toolbar:
                collecting_for = 'toolbars'
            elif line.strip().endswith('development stack'):
                collecting_for = 'dev_stack'
            elif line.strip().startswith('# '):
                collecting_for = 'app'
            else:
                collecting_for = None
            # need to keep track of the level to build the parent list
            level = len(line.split(' ')[0])  
            if level > len(parents):
                parents.append(current_title)
            elif level < len(parents):
                parents = parents[:level]
            parents[-1] = current_title

        elif line != '\n' and line != '': # skip empty lines
            current_content += line + "\n"
    if current_title:
        fragments.append(TextFragment(current_title, current_content, ' > '.join(parents)))



def get_fragment(title):
    """Returns the fragment with the given title"""
    to_search = title.strip()
    if to_search.startswith('# '):
        to_search = to_search.split('# ')[-1]
    for fragment in fragments:
        if fragment.full_title.strip() == to_search:
            return fragment
    return None