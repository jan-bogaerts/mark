import sys
import os
import json
import project
import result_loader



ONLY_MISSING = False # only check if the fragment has not yet been processed

def write_line(to_add, writer):
    writer.write(to_add + "\n")
    writer.flush()


def collect_response(title, quotes, result, writer):
    if len(quotes) > 0:
        quote_locs, quote_lines = zip(*quotes)
        key = title.split('# ')[-1].replace(' > ', '_').replace(' ', '_').strip()
        count = 0
        for quote in quote_lines:
            quote_key = '{0}_{1}'.format(key, count)
            quote_key = quote_key.replace(' ', '_').replace('-', '_').replace('(', '').replace(')', '')
            quote_locs[count]['name'] = quote_key # this helps later on when we need to rebuild the orignal text but with the texts replaced with the contant names
            count += 1
            result[quote_key] = '\n'.join(quote)
        write_line(f'# {title}', writer)
        write_line(json.dumps(quote_locs), writer)
    else:
        write_line(f'# {title}', writer)
        write_line('[]', writer)


def get_resource_filename(root_path):
    return os.path.join(root_path, 'src', 'resources.json')

def save_resource_file(root_path, result):
    file_name = get_resource_filename(root_path)
    with open(file_name, 'w') as writer:
        writer.write(json.dumps(result, indent=4))


def process_data(root_path, writer):
    result = {}

    if ONLY_MISSING:
        result = json.loads(open(get_resource_filename(root_path), 'r').read())

    for to_check in project.fragments:  # skip the first two fragments cause that's the description and dev stack
        if not to_check.content: # skip empty fragments
            continue
        if ONLY_MISSING and has_fragment(to_check.full_title):
            continue
        quotes = []
        lines = to_check.content.split('\n')
        current_quote = None
        cur_lines = []
        line_nr = 0
        for line in lines:
            line = line.lstrip()
            if line.startswith('>'):
                line = line[1:] # remove the > 
                if len(line) > 0 and line[0] == ' ':  # and the space but leave everything else cause we want the exact quote
                    line = line[1:]
                cur_lines.append(line)
                if not current_quote:
                    # could be that the previous line was empty, in that case, start the quote a line earlier
                    if line_nr > 0 and not lines[line_nr - 1].strip():
                        current_quote = {'start': line_nr - 1}
                    else:
                        current_quote = {'start': line_nr}
            elif not line and current_quote: # empty line so we need to close the quote
                current_quote['end'] = line_nr
                quotes.append((current_quote, cur_lines))
                current_quote = None
                cur_lines = []
            line_nr += 1
        if current_quote:
            current_quote['end'] = line_nr
            quotes.append((current_quote, cur_lines))
        collect_response(to_check.full_title, quotes, result, writer)
    save_resource_file(root_path, result)
    return result
                    


def main(prompt, root_path=None, file=None):
    # read file from prompt if it ends in a .md filetype
    if prompt.endswith(".md"):
        with open(prompt, "r") as promptfile:
            prompt = promptfile.read()


    print("loading project")

    # split the prompt into a toolbar, list of components and a list of services, based on the markdown headers
    project.split_standard(prompt)

    # save there result to a file while rendering.
    if file is None:
        file = 'output'
    
    file_name = file + "_constants.md"
    open_mode = 'w'
    if ONLY_MISSING:
        load_results(file_name)
        open_mode = 'a'

    # save there result to a file while rendering.
    if root_path is None:
        root_path = './'
    print("rendering results")
    with open(file_name, open_mode) as writer:
        process_data(root_path, writer)
    
    print("done! check out the output file for the results!")


text_fragments = []  # the list of text fragments representing all the results that were rendered.


def load_results(filename, overwrite_file_name=None, overwrite=True):
    if not overwrite_file_name and overwrite:
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


def has_constants(title):
    '''returns true if the title is in the list of fragments and has data'''
    to_search = title.strip()
    if not to_search.startswith('# '):
        to_search = '# ' + to_search
    for fragment in text_fragments:
        if fragment.title == to_search and fragment.data:
            return True
    return False


def get_fragment(full_title, original):
    to_search = full_title.strip()
    if not to_search.startswith('# '):
        to_search = '# ' + to_search
    for fragment in text_fragments:
        if fragment.full_title.strip() == to_search and fragment.data:
            lines = original.split('\n')
            new_lines = []
            consts = [*fragment.data] # make a copy of the list so we can remove items from it
            current_const = consts.pop(0)
            cur_line = 0
            while cur_line < len(lines):
                if current_const and cur_line == current_const['start']:
                    # add the constant to the previous line
                    new_lines[-1] += f' the value of the constant resources.{current_const["name"]}'
                    cur_line = current_const['end'] + 1
                    if len(consts) > 0:
                        current_const = consts.pop(0)
                    else:
                        current_const = None
                else:
                    new_lines.append(lines[cur_line])
                    cur_line += 1
            return '\n'.join(new_lines)
    return original


if __name__ == "__main__":

    # Check for arguments
    if len(sys.argv) < 2:

        # Looks like we don't have a prompt. Check if prompt.md exists
        if not os.path.exists("prompt.md"):

            # Still no? Then we can't continue
            print("Please provide a prompt")
            sys.exit(1)

        # Still here? Assign the prompt file name to prompt
        prompt = "prompt.md"

    else:
        # Set prompt to the first argument
        prompt = sys.argv[1]

    # Pull everything else as normal
    folder = sys.argv[2] if len(sys.argv) > 2 else None
    file = sys.argv[3] if len(sys.argv) > 3 else None

    # Run the main function
    main(prompt, folder, file)
