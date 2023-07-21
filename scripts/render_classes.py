import sys
import os
from time import sleep
from utils import clean_dir
from constants import  get_model_config, DEFAULT_MAX_TOKENS, OPENAI_API_KEY
import project
import class_lister
import declare_or_use_class_classifier
# import declare_or_use_class_classifier
import list_service_usage
import json
import result_loader

import openai
import tiktoken

ONLY_MISSING = True # only check if the fragment has not yet been processed

system_prompt = """Act as a full-stack ai software developer.
It is your task to write all the code for the class '{0}'

use the following development stack:
{1}
"""
user_prompt = """The class '{0}' is described as follows:
{1}
{2}

make certain that the following functionality is publicly available:
{3}
"""
term_prompt = """
Any text between ``` or \""" signs are declarations of constant values, assign them to constants and use the constants in the code.
Use small functions.
Add documentation to your code.
only write valid code
do not include any intro or explanation, only write code
add css styling

bad response:
```javascript
const a = 1;
```

good response:
const a = 1;
"""


def generate_response(params, key):

    total_tokens = 0
    model = get_model_config('render_classes', key)
    
    def reportTokens(prompt):
        encoding = tiktoken.encoding_for_model(model)
        # print number of tokens in light gray, with first 10 characters of prompt in green
        token_len = len(encoding.encode(prompt))
        print(
            "\033[37m"
            + str(token_len)
            + " tokens\033[0m"
            + " in prompt: "
            + "\033[92m"
            + prompt
            + "\033[0m"
        )
        return token_len

    # Set up your OpenAI API credentials
    openai.api_key = OPENAI_API_KEY

    messages = []
    prompt = system_prompt.format(params['class'], params['dev_stack'], params['imports'] ) + term_prompt
    messages.append({"role": "system", "content": prompt})
    total_tokens += reportTokens(prompt)
    prompt = user_prompt.format(params['class'], params['feature_title'], params['feature_description'], params['public_features'])
    messages.append({"role": "user", "content": prompt})
    total_tokens += reportTokens(prompt)
    
    total_tokens = DEFAULT_MAX_TOKENS # code needs max allowed
    if total_tokens > DEFAULT_MAX_TOKENS:
        total_tokens = DEFAULT_MAX_TOKENS
    params = {
        "model": model,
        "messages": messages,
        "max_tokens": total_tokens,
        "temperature": 0,
    }

    # Send the API request
    keep_trying = True
    response = None
    while keep_trying:
        try:
            response = openai.ChatCompletion.create(**params)
            keep_trying = False
        except Exception as e:
            # e.g. when the API is too busy, we don't want to fail everything
            print("Failed to generate response (retrying in 30 sec). Error: ", e)
            sleep(30)
            print("Retrying...")

    # Get the reply from the API response
    if response:
        reply = response.choices[0]["message"]["content"] # type: ignore
        return reply
    return None


def collect_file_list(title, file_names, writer):
    names_str = json.dumps(file_names)
    writer.write(f'# {title}\n')
    writer.write(f'{names_str}\n')
    writer.flush()


def collect_response(title, response, root_path):
    file_name = title.replace(" > ", "_")
    if not os.path.exists(root_path):
        os.makedirs(root_path)
    file_path = os.path.join(root_path, file_name.replace(" ", "_") + ".js")
    with open(file_path, "w") as writer:
        writer.write(response)
    return file_path


def get_to_render_and_imports(title, classes):
    imports = []
    to_render = []
    for cl in classes:
        is_declare = declare_or_use_class_classifier.get_is_declared(title, cl)
        if not is_declare:
            imports.append(cl)
        else:
            to_render.append(cl)
    return to_render, imports

def process_data(root_path, writer):
    dev_stack = project.fragments[1].content
    for fragment in project.fragments:
        if ONLY_MISSING and has_fragment(fragment.full_title):
            continue
        classes = class_lister.get_classes(fragment.full_title)
        if len(classes) > 0:
            file_names = [] # keep track of the file names generated for this fragment, so we can save it in the markdown file
            imports_txt = ''
            to_render, imports = get_to_render_and_imports(fragment.full_title, classes)
            imports_txt = '\n'.join([f"The class {cl} can be imported from './{cl.replace(' ', '_')}.js';" for cl in imports])    
            for cl in to_render:
                public_features = list_service_usage.get_all_expansions_for(cl)
                params = {
                    'class': cl,
                    'feature_title': fragment.title,
                    'feature_description': fragment.content,
                    'dev_stack': dev_stack,
                    'imports': imports_txt,
                    'public_features': public_features
                }
                response = generate_response(params, fragment.full_title)
                if response:
                    # remove the code block markdown, the 3.5 version wants to add it itself
                    response = response.strip() # need to remove the newline at the end
                    if response.startswith("```javascript"):
                        response = response[len("```javascript"):]
                    if response.endswith("```"):
                        response = response[:-len("```")]
                    path_section = os.path.join(root_path, *fragment.full_title.split(" > "))
                    file_name = collect_response(cl, response, path_section)
                    file_names.append(file_name)
            if file_names:
                collect_file_list(fragment.full_title, file_names, writer)
                    


def main(prompt, components_list, declare_or_use_list, expansions, root_path=None, file=None):
    # read file from prompt if it ends in a .md filetype
    if prompt.endswith(".md"):
        with open(prompt, "r") as promptfile:
            prompt = promptfile.read()

    print("loading project")

    # split the prompt into a toolbar, list of components and a list of services, based on the markdown headers
    project.split_standard(prompt)
    class_lister.load_results(components_list)
    declare_or_use_class_classifier.load_results(declare_or_use_list)
    list_service_usage.load_results(expansions)

    # save there result to a file while rendering.
    if file is None:
        file = 'output'
        
    open_mode = 'w'
    if ONLY_MISSING:
        load_results(file + "_class_files.md")
        open_mode = 'a'

    print("rendering results")

    # save there result to a file while rendering.
    if root_path is None:
        root_path = './'
    
    
    with open(file + "_class_files.md", open_mode) as writer:
        process_data(root_path, writer)
    
    print("done! check out the output file for the results!")



text_fragments = []  # the list of text fragments representing all the results that were rendered.

def load_results(filename, overwrite_file_name=None):
    if not overwrite_file_name:
        # modify the filename so that the filename without extension ends on _overwrite
        overwrite_file_name = filename.split('.')[0] + '_overwrite.' + filename.split('.')[1]
    result_loader.load(filename, text_fragments, True, overwrite_file_name)


def has_fragment(title):
    '''returns true if the title is in the list of fragments'''
    to_search = title.strip()
    if not to_search.startswith('# '):
        to_search = '# ' + to_search
    for fragment in text_fragments:
        if fragment.title == to_search:
            return True
    return False


def get_data(title):
    '''returns the list of components for the given title'''
    to_search = title.lower().strip()
    if not to_search.startswith('# '):
        to_search = '# ' + to_search
    for fragment in text_fragments:
        if fragment.title.lower() == to_search:
            return fragment.data or []
    return []    


if __name__ == "__main__":

    # Check for arguments
    if len(sys.argv) < 5:
        print("Please provide a prompt and a file containing the components to check")
        sys.exit(1)
    else:
        # Set prompt to the first argument
        prompt = sys.argv[1]
        components_list = sys.argv[2]
        declare_or_use_list = sys.argv[3]
        expansions = sys.argv[4]

    # Pull everything else as normal
    file = sys.argv[5] if len(sys.argv) > 5 else None

    # Run the main function
    main(prompt, components_list, declare_or_use_list, expansions, file)
