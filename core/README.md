# @doctes/core

Doctes' core functionality: collecting and executing code blocks from markdown.

## Installation

You can install @doctes/core from npm:

```bash
npm install @doctes/core
```

## Usage
  
```js
// collect code blocks from a markdown file
const { collectBlocks } = require('@doctes/core')

const blocks = await collectBlocks('./docs/examples.md') // example file path, replace it with a relevant md file

// execute the collected code blocks in a mdast markdown tree 

const { executeBlocks } = require('@doctes/core')

const execute = await executeBlocks(blocks) // in this case, we run the collected blocks. Could pass down any mdast tree instead.
```

## API

- `collectBlocks(path)` - Collects code blocks from a markdown file at the given path.
  - `path`: a string representing the path to a markdown file.
  - Returns an mdast markdown tree.
- `executeBlocks(tree)` - Executes the code blocks in a mdast markdown tree.
  - `tree`: a mdast markdown tree.
  - Returns a promise that resolves an Array of code block execution results.