import sys
from time import sleep
from constants import DEFAULT_MODEL, DEFAULT_MAX_TOKENS, OPENAI_API_KEY
import project
import json

import openai
import tiktoken

system_prompt = """Act as an ai software analyst.
You are tasked with writing software for an application called '{0}',
using the following development stack:
{1}
"""
user_prompt = """It is your job to list all the constants that are defined in: 
{0}

{1}"""
term_prompt = """Do not include UI components, but only list the constants that need to be custom built.
return an empty string if you can't detect any constants.
Classes that represent singletons should be implemented as constants.
Any text between ``` and ``` signs should be considered as the value of a constant, do not try to interpret the text between ``` signs, but treat the entire block as the value for a constant.
don't include any introduction. Don't include any explanation, just write the list of constants as a
json array consisting out of {constant_name: value} objects.

bad:
[
  "file": "constants.js",
    "items": [
      {
        "constant_name": "SYSTEM_PROMPT",
        "value": "You are an ai software developer who is preparing to write the code for the application called '{0}', described as: '{1}'"
      }
    ]
]

good:
[
     { "USER_PROMPT": "It is your job to list all the constants that are defined in: \n{0}\n\n{1}" },
]
"""


def generate_response(params):

    total_tokens = 0
    
    def reportTokens(prompt):
        encoding = tiktoken.encoding_for_model(DEFAULT_MODEL)
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
    prompt = system_prompt.format(params['project_name'], params['dev_stack'] )
    messages.append({"role": "system", "content": prompt})
    total_tokens += reportTokens(prompt)
    prompt = user_prompt.format(params['feature_title'], params['feature_description'])
    messages.append({"role": "user", "content": prompt})
    total_tokens += reportTokens(prompt)
    if term_prompt:
        messages.append({"role": "assistant", "content": term_prompt})
        total_tokens += reportTokens(term_prompt)
    
    total_tokens *= 2  # max result can be as long as the input, also need to include the input itself
    if total_tokens > DEFAULT_MAX_TOKENS:
        total_tokens = DEFAULT_MAX_TOKENS
    params = {
        "model": DEFAULT_MODEL,
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


def add_result(to_add, result, writer):
    result.append(to_add)
    writer.write(to_add + "\n")
    writer.flush()


def collect_response(title, response, result, writer):
    # get the first line in the component without the ## and the #
    add_result(f'# {title}', result, writer)
    add_result(response, result, writer)


def process_data(writer):
    result = []

    project_desc = project.fragments[0]
    dev_stack = project.fragments[1].content

    for to_check in project.fragments[2:]:  # skip the first two fragments cause that's the description and dev stack
        if to_check.content == '':
            continue
        # check if 'services' is in the full title, if so, skip it
        if not 'services' in to_check.full_title.lower():
            continue
        params = {
            'project_name': project_desc.title,
            # 'project_description': project_desc.content,
            'feature_title': to_check.title,
            'feature_description': to_check.content,
            'dev_stack': dev_stack,
        }
        response = generate_response(params)
        if response:
            collect_response(to_check.full_title, response, result, writer)
    return result
                    


def main(prompt, file=None):
    # read file from prompt if it ends in a .md filetype
    if prompt.endswith(".md"):
        with open(prompt, "r") as promptfile:
            prompt = promptfile.read()

    print("loading project")

    # split the prompt into a toolbar, list of components and a list of services, based on the markdown headers
    project.split_standard(prompt)

    print("rendering results")

    # save there result to a file while rendering.
    if file is None:
        file = 'output'
    with open(file + "_constants.md", "w") as writer:
        process_data(writer)
    
    print("done! check out the output file for the results!")


text_fragments = []  # the list of text fragments representing all the results that were rendered.

def load_results(filename):
    with open(filename, "r") as reader:
        current_content = ''
        current_title = ''
        for line in reader.readlines():
            if line.startswith('#'):
                if current_title != '':
                    # parse the json array and convert to list
                    content_list = json.loads(current_content)
                    text_fragments.append(project.TextFragment(current_title, current_content, None, content_list))
                current_title = line.strip()
                current_content = ''
            else:
                current_content += line
        if current_title != '':
            # parse the json array and convert to list
            content_list = json.loads(current_content)
            text_fragments.append(project.TextFragment(current_title, current_content, None, content_list))


def get_data(title):
    '''returns the list of components for the given title'''
    for fragment in text_fragments:
        if fragment.title == '# ' + title:
            return fragment.data or []
    return []    

if __name__ == "__main__":

    # Check for arguments
    if len(sys.argv) < 2:
        print("Please provide a prompt")
        sys.exit(1)
    else:
        # Set prompt to the first argument
        prompt = sys.argv[1]

    # Pull everything else as normal
    file = sys.argv[2] if len(sys.argv) > 2 else None

    # Run the main function
    main(prompt, file)
