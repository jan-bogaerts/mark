import sys
import os
from time import sleep
from utils import clean_dir
from constants import  get_model_config, DEFAULT_MAX_TOKENS, OPENAI_API_KEY, MAX_TOKENS
import project
import component_lister
import declare_or_use_comp_classifier
import get_if_service_is_used
import list_component_expansions
import list_how_service_describes_components
import json
import result_loader

import openai
import tiktoken

ONLY_MISSING = False # only check if the fragment has not yet been processed

system_prompt = """
"""
user_prompt = """
"""
term_prompt = """"""


def generate_response(params, key):

    total_tokens = 0
    model = get_model_config('resolve_component_imports', key)
    
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
    prompt = system_prompt.format(params['component'], params['dev_stack']) + term_prompt
    messages.append({"role": "system", "content": prompt})
    total_tokens += reportTokens(prompt)
    prompt = user_prompt.format(params['component'], params['feature_title'], params['feature_description'], params['public_features'], params['global_features'], params['imports'] )
    messages.append({"role": "user", "content": prompt})
    total_tokens += reportTokens(prompt)
    
    total_tokens = total_tokens + DEFAULT_MAX_TOKENS # code needs max allowed
    if total_tokens > MAX_TOKENS:
        total_tokens = MAX_TOKENS
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


def get_service_imports(full_title):
    imported = {} # so we don't list the same thing twice
    results = []
    missing = []
   
    services_used = get_if_service_is_used.get_data(full_title)
    if services_used:
        for service_loc, values in services_used.items():
            cur_path_parts = service_loc.split("#")[-1].split(" > ")
            for service, value in values.items():
                if value == 'yes' and not service in imported:
                    imported[service] = True
                    service_path = os.path.join(*cur_path_parts, service.replace(" ", "_"))
                    results.append({'service': service, 'path': service_path})
    for fragment in list_how_service_describes_components.text_fragments:
        cur_path_parts = fragment.full_title.split("#")[-1].split(" > ")
        if fragment.data:
            for service, features in fragment.data.items():
                if not service in imported:
                    imported[service] = True
                    service_path = os.path.join(*cur_path_parts, service.replace(" ", "_"))
                    results.append({'service': service, 'path': service_path})
    return missing, results  


def resolve_component_imports(full_title, component, results):
    declared_in = declare_or_use_comp_classifier.get_declared_in(full_title, component)
    if not declared_in:
        print(f"can't find import location for component {component} used in {full_title}")
        return # serious error
    else:
        components = component_lister.get_components(declared_in)
        if component in components:
            declared_in = declared_in.replace("'", "").replace('"', '') # remove quotes cause gpr sometimes adds them
            path = os.path.join(*declared_in.split(" > "), component.replace(" ", "_") )
            results[component] = path
        else:
            params = {
                'component': component,
                'items': '- ' + '\n- '.join(components),
            }
            response = generate_response(params, full_title)
            if response:
                results[component] = response
            else:
                print(f"can't find import location for component {component} used in {full_title}")
                return # serious error

def process_data(writer):
    for fragment in project.fragments:
        if ONLY_MISSING and has_fragment(fragment.full_title):
            continue
        components = component_lister.get_components(fragment.full_title)
        if len(components) > 0:
            results = {} # keep track of the file names generated for this fragment, so we can save it in the markdown file
            for component in components:
                is_declare = declare_or_use_comp_classifier.get_is_declared(fragment.full_title, component)
                if is_declare:
                    continue # testing
                    missing_imports, imports = get_service_imports(fragment.full_title)
                    for missing in missing_imports:
                        params = {
                            'component': component,
                            'feature_title': fragment.title,
                            'feature_description': fragment.content,
                            'imports': missing,
                        }
                        response = generate_response(params, fragment.full_title)
                        if response:
                            imports[missing] = response
                    results[component] = imports
                else:
                    resolve_component_imports(fragment.full_title, component, results)
            collect_response(fragment.full_title, json.dumps(results), writer)
                    


def main(prompt, components_list, declare_or_use_list, expansions, comp_features_from_service, is_service_used, file=None):
    # read file from prompt if it ends in a .md filetype
    if prompt.endswith(".md"):
        with open(prompt, "r") as promptfile:
            prompt = promptfile.read()

    print("loading project")

    # split the prompt into a toolbar, list of components and a list of services, based on the markdown headers
    project.split_standard(prompt)
    component_lister.load_results(components_list)
    declare_or_use_comp_classifier.load_results(declare_or_use_list)
    list_component_expansions.load_results(expansions)
    list_how_service_describes_components.load_results(comp_features_from_service)
    get_if_service_is_used.load_results(is_service_used)

    # save there result to a file while rendering.
    if file is None:
        file = 'output'
        
    filename = file + "_resolve_component_imports.md"
    open_mode = 'w'
    if ONLY_MISSING:
        load_results(filename)
        open_mode = 'a'

    print("rendering results")

    with open(filename, open_mode) as writer:
        process_data( writer)
    
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
    if len(sys.argv) < 6:
        print("Please provide a prompt and a file containing the components to check")
        sys.exit(1)
    else:
        # Set prompt to the first argument
        prompt = sys.argv[1]
        components_list = sys.argv[2]
        declare_or_use_list = sys.argv[3]
        expansions = sys.argv[4]
        comp_features_from_service = sys.argv[5]
        is_service_used = sys.argv[6]

    # Pull everything else as normal
    file = sys.argv[7] if len(sys.argv) > 7 else None

    # Run the main function
    main(prompt, components_list, declare_or_use_list, expansions, comp_features_from_service, is_service_used, file)
