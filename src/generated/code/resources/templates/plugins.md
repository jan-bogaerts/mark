# plugin title
- description.
- used for?
- name: 'name as shown in editor'
- dependencies: ['name_of_other_plugin']
- isJson: false/true
- build-message(text-fragment):
  - result (json array):
    - role: system, content:
      
     > text to use as system content. {{replaceMe}}.
     
     replace:
      - {{replaceMe}}: `with something`

    - role: user, content: `await deps.constants.getResult(text-fragment)`.
  - return result, [ text-fragment.key ]