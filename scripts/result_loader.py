import json
import project
import os

def load(data_file, text_fragments, content_as_json=False, overwrite_data=None):
    '''
    Loads the data from the given file into the text_fragments list.
    If overwrite_data is given, it will also load the overwrites from that file.
    '''
    # this is actually a little bit of a backup test for me to check that I didn't forget the file param in launch.json
    load_results(data_file, text_fragments, content_as_json)
    if overwrite_data and os.path.exists(overwrite_data):
        load_overwrites(overwrite_data, text_fragments, content_as_json)

def load_overwrites(overwrite_data, text_fragments, content_as_json):
    with open(overwrite_data, "r") as reader:
        current_content = ''
        current_title = ''
        for line in reader.readlines():
            if line.startswith('#'):
                if current_title != '':
                    # parse the json array and convert to list
                    json_data = None
                    if content_as_json:
                        json_data = json.loads(current_content)
                    replace_data(current_title, current_content, json_data, text_fragments)
                current_title = line.strip()
                current_content = ''
            else:
                current_content += line
        if current_title != '':
            # parse the json array and convert to list
            json_data = None
            if content_as_json:
                json_data = json.loads(current_content)
            replace_data(current_title, current_content, json_data, text_fragments)


def replace_data(title, content, json_content, text_fragments):
    to_search = title.strip()
    if not to_search.startswith('# '):
        to_search = '# ' + to_search
    for fragment in text_fragments:
        if fragment.title == to_search:
            fragment.content = content
            fragment.data = json_content
            return
    text_fragments.append(project.TextFragment(title, content, None, json_content))

def load_results(data_file, text_fragments, content_as_json):
    with open(data_file, "r") as reader:
        current_content = ''
        current_title = ''
        for line in reader.readlines():
            if line.startswith('#'):
                if current_title != '':
                    content_list = None
                    # parse the json array and convert to list
                    if content_as_json:
                        content_list = json.loads(current_content)
                    text_fragments.append(project.TextFragment(current_title, current_content, None, content_list))
                current_title = line.strip()
                current_content = ''
            else:
                current_content += line
        if current_title != '':
            content_list = None
            # parse the json array and convert to list
            if content_as_json:
                content_list = json.loads(current_content)
            text_fragments.append(project.TextFragment(current_title, current_content, None, content_list))
