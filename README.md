# Mark

Mark is an ideation and corpus building/manipulation tool driven by machine learning. It allows users to enter text in markdown of any length, which can be transformed (and reverted) into something else. This is done using transformers that are completely customizable.

Some use cases:
- convert specs to code and keep the specs in sync with the code.
- convert an angular application into a react version.
- render test cases and UI driven tests based on specs and rendered code
- extract and regroup feature definitions (find common features spread out over many code files)
- ...


## The problem(s) it's trying to solve
- Large language models have a limited size: even though models are getting bigger and bigger, you can't just throw any large text to it and have it render any possible code size, for the time being, they still have limits. Some models can handle more tokens than others, but no matter the size of the model, there is a hard limit that determines how much can go in and out in 1 go.
To solve this, the prompt engine splits up the markdown text into smaller chunks and perform the conversions on each of these chunks (text fragment).
- You don't always want to regenerate the entire result / code base, but instead only a couple of features at a time, which is an other great reason to split up the input prompt and use tools to track which parts have become out of date and for which prompts.
- When you are chaining transformers (use the output of a prompt as the input of another prompt), it happens that at some point in the chain, the output of the transformers no longer changes cause the input hasn't changed. In order to prevent unneeded calls to the llm, some more advanced caching and prompt generation is needed. 
- Transforming large corpora (like the full specs of an app) takes a bit of time and requires a lot of calls to the llm. Some models are cheaper and faster but less accurate. Some prompts and text fragments are simple and can be handled by a simpler, faster model. Others need the big guns. In order to optimize speed and cost, you want to be able to determine which model is used by each prompt, and even for each text fragment.
- not all input has the same structure (backend web servers usually don't have much use of UI components), so flexibility in the translation process is needed and you should be able to declare your own prompts.
- For the same reason, some feedback is also useful for tracking what is up-to-date, out-of-date, currently being built or paused for inspection.
- In any large conversion project, errors will occur, so some control and debug ability over the entire conversion process is needed. This is why the output of every step can be examined and manually overwritten and there is full access to the chrome debugger for the custom transformers.

## how it works
When a project is loaded, the markdown is first split up into text fragments. A fragment basically is a header and the text below that header. If the project contains any custom transformers, these are also loaded, otherwise only the default/built-in set of transformers is available.
Next, you select a transformer to be run and the scope (only the currently selected fragment or the entire project). 
Transformers are (shortish) javascript modules that usually call upon an LLM to somehow transform the input. This input can consist out of 1 or more of these fragments, and or the results of other transformers and or any other external data source you can think of.
A transformer will only update it's result if the input it uses to calculate the result, has changed. To accomplish this, each transformer stores all of it's results in a database and monitors changes in the project and all the other transformers it depends on.
Because transformers are just javascript modules, they can do lots of other stuff like writing results to a file, monitor file changes, integrate with selenium or write back to the markdown file. The coolest thing about transformers though, is that they can build themselves. That's why the only built-in transformers, are used to generate transformers. Everything else, is loaded as a plugin.
![diagram](./colored_filled_diagram.svg)

## transformer libraries
This is a list of transformer-sets that you can use in your own projects as-is or as a starting point for your own libraries:
- [built-in](./src/mark/src/mark.md#transformers-1): this is the set of transformers that is built into the application and which are used when you open the plugin window to edit your own transformers. The main purpose of this set is to create transformer plugins that can be used for other projects.
- [web-client](./src/web_client/web_client.md): a set of transformers that can be used for creating/maintaining javascript based front-end apps. This can be for the web or electron. Currently tested for react apps, though I suspect other libraries might also work, except for angular which will probably need some more.

## transformer details
A transformer is a javascript module which should export an object containing the following fields:
- getDescription(): (required) a function that returns a json object containing the fields:
  - name: (required) name of the transformer
  - dependencies: (required)list of names of other transformers
  - isJson: (required)boolean, true if the transformer produces json data.
  - description: (optional) a string that describes what the transformer does
- buildMessage(fragment): (required) a function that builds and returns the prompt that should be used for the transformer and text-fragment. Note: if there is an iterator function, the argument list may be different and must match the argument list of the callback parameter of the iterator.
- renderResult(fragment): (optional) a function that renders the result for the specified fragment.
- renderResults(fragments): (optional) a function that renders a result which requires all the fragments in the project.
- calculateMaxTokens(inputTokenCount, modelOptions): (optional) a function that calculates and returns the expected maximum token count used for the transformer's prompt
- iterator(fragment, callback, resultSetter) (optional): a function that iterates over 1 or more values and calls the callback function for each set of values that needs to be processed. The parameters of the callback function are passed on to the buildMessage function. If the result can be calculated without an LLM, use the function `resultSetter(value, key=null)`
- cleanResponse(response) (optional): cleans or modifies the response that was produced by the llm before saving it. All parameters passed to callback are also passed into the cleanResponse function (ex: pass in a file name).

### examples
- **the compress service**: an example of a transformer definition that can be converted into a plugin by the application:
  - The compress service takes a text fragment and makes it shorter.
  - Useful to check if the system understands the fragment and can be used as input for other processes.
  - name: 'compress'
  - dependencies: ['constants']
  - isJson: false
  - calculateMaxTokens(inputTokenCount): return inputTokenCount.total
  - build-message(text-fragment):
    - result (json array):
      - role: system, content:
        
       > Act as an ai software analyst. You are reviewing the feature description of an application. It is your job to shorten the following text as much as possible and rephrase it in your own words, without loosing any meaning.
       > compress the following text:

      - role: user, content: 
        ```python 
          content: await deps.constants.getResult(fragment)
        ```
    - return result, [ ]
- an example transformer module (normally generated):
    ```javascript
        const resources = require('./resources.json');
        const services = {}; // must always be present
        const deps = {}; // must always be present
        {{sharedImport}}
        function getDescription() {
        return {name: 'test', dependencies: ['constants'], isJson: true};
        }
        async function buildMessage(fragment) {
        var result = [
            {
                role: 'system',
                content: resources.mark_services_transformers_compress_service_0,
            },
            {
                role: 'user',
                content: await deps.constants.getResult(fragment),
            },
            ];

            return [result, [ ]];
        }
        function calculateMaxTokens(inputTokenCount) {
        return inputTokenCount.total + 1;
        }
        module.exports = { getDescription, buildMessage, calculateMaxTokens, services, deps };
    ```
- **mark**: the [definition of the editor & compiler](https://github.com/jan-bogaerts/mark/blob/main/src/mark.md) itself. A beefy thing, showing some more 'intense' usage.

## Supported Languages

Mark is currently tested on JavaScript, but it should work with most other programming languages as well, especially with custom prompt pipeline configurations.

## Prerequisites

For windows, the application can be installed from the installer in the release section.
To run from code (javascript/electron/react):
 - go to the folder 'src\generated\code'. There should be a file `package.json`
 - run `npm install` to install all the required packages
 - to start the app, use the npm script `electron:start`

## Markdown File Syntax
There isn't that much structural requirements. The main idea is that the parser will split the text on titles. So a text fragment contains 1 title and all the text below it until another title is found.
That said, in general it is presumed:

- The top title in the markdown file is presumed to be the name of the application.
- The second paragraph is expected to be about the development stack. It is recommended to use this as the title for the paragraph. This is not a requirement of the parser, but is instead used by some transformers. This can be changed in your custom transformers.
- The current set of transformers expects the titles (with subsections) 'services' and 'components' for building applications
- Plugin definitions rely on the constant-extractor transformer, which uses the > sign at the beginning of the line to find constants, ex:

    > this is a constant

## Installation and Usage

- run the installer
- go to the tab `preferences` and click on the button with a key icon (first one)
- enter your open-ai key
- select a global default model to use
- type some text
- select one of the transformer tabs at the bottom
- go to the transformers menu section and click on the `play` button, which will start the selected transformer for the currently selected text fragment

## Known Limitations or Issues

As this is an active project, new limitations or issues may be discovered. We appreciate your patience and feedback.

## Contribution Guidelines

Contributions are welcome! If you'd like to contribute to the Mark project, please make a Pull Request (PR) and send it for review.

