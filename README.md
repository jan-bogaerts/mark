# MarkdownCode

MarkdownCode is an ideation and software building tool driven by machine learning. It allows users to enter text in markdown which is automatically analyzed for various parameters and which can automatically be converted into various stages of software code.

## Supported Languages

MarkdownCode is currently tested on JavaScript, but it should work with most other programming languages as well.

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

