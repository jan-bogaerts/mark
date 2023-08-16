# MarkdownCode

MarkdownCode is an ideation and software building tool driven by machine learning. It allows users to enter text in markdown of any length, which is automatically analyzed for various parameters and which can automatically be converted into various stages of software code.

## The problem(s) it's trying to solve
- Large language models have a limited size: you can't just throw any large text to it and have it render any possible code size, they have limits. Some models can handle more tokens than others, but no matter the size of the model, there is a hard limit that determines how much can go in and out in 1 go.
To solve this, the prompt engine splits up the markdown text into smaller chunks and perform the conversions on each of these chunks (text fragment).
- translating an application description to code takes a bit of time and requires a lot of calls to the llm. Some models are cheaper and faster but less accurate. Some prompts and text fragments are simple and can be handled by a simpler, faster model. Others need the big guns. In order to optimize speed and cost, you want to be able to determine which model is used by each prompt, and even for each text fragment.
- not all applications or environments have the same structure (backend web servers usually don't have much use of UI components), so not all application descriptions can be processed with the same prompts, flexibility in the translation process is needed.
- I am a software developer, so I want some control and debug ability over the entire conversion process. This is why the output of every step can be examined and manually overwritten.

## Supported Languages

MarkdownCode is currently tested on JavaScript, but it should work with most other programming languages as well, especially with custom prompt pipeline configurations.

## Prerequisites

The bootstrap version of MarkdownCode is running on Python 3. The specific package dependencies can be found in the `requirements.txt` file. You will also need an API key from OpenAI to run MarkdownCode. The application that it produces for its own code is a stand-alone Electron application that doesn't have any further requirements.

## Markdown File Syntax

- The top title in the markdown file is presumed to be the name of the application.
- The second paragraph is expected to be about the development stack. We recommend using this as the title for the paragraph. 
- A title and its text forms a single block. Each block is processed individually. 
- Titles (with subsections) 'services' and 'components' are expected.

## Code Conversion Customization

You can overwrite results to influence the build process if certain features are not extracted correctly from the source text.

## Installation and Usage

For the bootstrap version, use pip to install everything in `requirements.txt`. There is a `launch.json` file to run each step using Visual Studio Code.

The Electron version of MarkdownCode can be installed using the provided installer.

## Known Limitations or Issues

As this is an active project, new limitations or issues may be discovered. We appreciate your patience and feedback.

## Contribution Guidelines

Contributions are welcome! If you'd like to contribute to the MarkdownCode project, please make a Pull Request (PR) and send it for review.

