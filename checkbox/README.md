# @doctes/checkbox

## Installation

You can install @doctes/checkbox from npm:

```bash
# install globally
npm i -g @doctes/checkbox

# install as a dependency
npm i -D @doctes/checkbox
```

## Usage

```bash
$ cbx
```

Using @doctes/checkbox requires at least Node.js v18.

## Commands

- `--json`
  - If passed, this outputs parsable JSON rather than human-friendly text. 
- `--dir <path>`
  - If passed and a directory path is passed along with it, all markdown files that exist within the directory will be checked recursively.
- `--file <path to file>`
  - If passwed and a file path is passed along with it, the markdown file at that file path will be checked.
- `--silent`
  - If passed, the command line will only emit a passing or failing exit code. No other output will be emitted.