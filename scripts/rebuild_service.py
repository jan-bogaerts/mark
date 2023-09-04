import os
import class_descriptions
import class_lister
import compress
import declare_or_use_class_classifier
import double_compress
import get_if_service_is_used
import get_interface_parts_usage
import get_interface_parts
import primary_class
import render_classes
import resolve_class_imports
import triple_compress
import constant_lister
import get_if_service_is_singleton
import get_is_service_for_all_components
import list_how_service_describes_components
import list_service_usage
import project
import json
import sys

transformers = [
    (constant_lister, 'mdc_constants.md'),
    (compress, 'mdc_cond_compress.md'),
    (double_compress, 'mdc_double_compress.md'),
    (triple_compress, 'mdc_triple_compress.md'),
    (class_lister, 'mdc_classes.md'),
    (primary_class, 'mdc_primary_class.md'),
    (class_descriptions, 'mdc_class_descriptions.md'),
    (declare_or_use_class_classifier, 'mdc_declare_or_use_class.md'),
    (get_if_service_is_used, 'mdc_is_service_used.md'),
    (get_if_service_is_singleton, 'mdc_is_service_singleton.md'),
    (get_is_service_for_all_components, 'mdc_is_service_for_all_components.md'),
    (list_service_usage, 'mdc_class_usage.md'),
    (list_how_service_describes_components, 'mdc_service_describes_components.md'), # this is only for services that describe 'global' features, common to all or most components
    (resolve_class_imports, 'mdc_resolve_class_imports.md'),
    (render_classes, 'mdc_class_files.md'),
    (get_interface_parts, 'mdc_interface_parts.md'),
    (get_interface_parts_usage, 'mdc_interface_parts_usage.md'),
]


root = 'C:\\Users\\janbo\\Documents\\dev\\markdownCode\\src\\generated'
arg_root = 'C:\\Users\\janbo\\Documents\\dev\\markdownCode'




def load_data():
    for transformer, file in transformers:
        transformer.load_results(os.path.join(root, file), None, False)


def delete_from(key, list):
    '''todo'''
    to_search = key.lower().strip()
    if not to_search.startswith('# '):
        to_search = '# ' + to_search
    for item in list:
        if item.full_title.lower().strip() == to_search:
            list.remove(item)
            return


def delete_files(key):
    files = render_classes.get_data(key)
    if files:
        for file in files:
            if os.path.exists(file):
                os.remove(file)


def delete(key):
    delete_files(key)
    for transformer, file in transformers:
        delete_from(key, transformer.text_fragments)


def save_data(fragments, file):
    with open(file, 'w') as f:
        for fragment in fragments:
            f.write(fragment.full_title + '\n')
            f.write(fragment.content + '\n')
            f.flush()



def save():
    for transformer, file in transformers:
        save_data(transformer.text_fragments, os.path.join(root, file))


def clear():
    project.fragments.clear()
    for transformer, file in transformers:
        transformer.text_fragments.clear()

def build():
    launch_data = {}
    with open(os.path.join(arg_root, '.vscode', 'launch.json'), 'r') as f:
        content = f.read()
        lines = content.split('\n')
        lines = [ l for l in lines if not l.strip().startswith('//') ]
        launch_data = json.loads('\n'.join(lines))
    configs = launch_data['configurations']

    for transformer, file in transformers:
        clear() # on every run of 'main', the transformers are loaded again, so we need to clear the data
        config = [c for c in configs if c['program'].endswith('/' + transformer.__name__ + '.py')]
        if len(config) == 0:
            print('no config for ' + transformer.__name__ + ' found, skipping')
            continue
        config = config[0]
        args = [ a.replace('${workspaceFolder}', arg_root) for a in config['args']  ]
        transformer.ONLY_MISSING = True
        transformer.main(*args)


def main(key):
    load_data()
    delete(key)
    save()
    build()
    print ('done!')

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print('please provide a key to delete')
        exit(1)
    key = sys.argv[1]
    main(key)