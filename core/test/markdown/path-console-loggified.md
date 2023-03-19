# Path

<!--introduced_in=v0.10.0-->

> Stability: 2 - Stable

<!-- source_link=lib/path.js -->

The `node:path` module provides utilities for working with file and directory
paths. It can be accessed using:

```js
const path = require('node:path');
```

## Windows vs. POSIX

The default operation of the `node:path` module varies based on the operating
system on which a Node.js application is running. Specifically, when running on
a Windows operating system, the `node:path` module will assume that
Windows-style paths are being used.

So using `path.basename()` might yield different results on POSIX and Windows:

On POSIX:

```js
const path = require('node:path');

const directory = path.basename('C:\\temp\\myfile.html');
console.log(directory);
// Logs: 'C:\\temp\\myfile.html'
```

On Windows:

```js
const path = require('node:path');

const directory = path.basename('C:\\temp\\myfile.html');
console.log(directory);
// Logs: 'myfile.html'
```

To achieve consistent results when working with Windows file paths on any
operating system, use [`path.win32`][]:

On POSIX and Windows:

```js
const path = require('node:path');

const directory = path.win32.basename('C:\\temp\\myfile.html');
console.log(directory);
// Logs: 'myfile.html'
```

To achieve consistent results when working with POSIX file paths on any
operating system, use [`path.posix`][]:

On POSIX and Windows:

```js
const path = require('node:path');

const directory = path.posix.basename('/tmp/myfile.html');
console.log(directory);
// Logs: 'myfile.html'
```

On Windows Node.js follows the concept of per-drive working directory.
This behavior can be observed when using a drive path without a backslash. For
example, `path.resolve('C:\\')` can potentially return a different result than
`path.resolve('C:')`. For more information, see
[this MSDN page][MSDN-Rel-Path].

## `path.basename(path[, suffix])`

<!-- YAML
added: v0.1.25
changes:
  - version: v6.0.0
    pr-url: https://github.com/nodejs/node/pull/5348
    description: Passing a non-string as the `path` argument will throw now.
-->

* `path` {string}
* `suffix` {string} An optional suffix to remove
* Returns: {string}

The `path.basename()` method returns the last portion of a `path`, similar to
the Unix `basename` command. Trailing [directory separators][`path.sep`] are
ignored.

```js
const path = require('node:path');

const directory = path.basename('/foo/bar/baz/asdf/quux.html');
console.log(directory);
// Logs: 'quux.html'

const secondDirectory = path.basename('/foo/bar/baz/asdf/quux.html', '.html');
console.log(secondDirectory);
// Logs: 'quux'
```

Although Windows usually treats file names, including file extensions, in a
case-insensitive manner, this function does not. For example, `C:\\foo.html` and
`C:\\foo.HTML` refer to the same file, but `basename` treats the extension as a
case-sensitive string:

```js
const path = require('node:path');

const directory = path.win32.basename('C:\\foo.html', '.html');
console.log(directory);
// Logs: 'foo'

const secondDirectory = path.win32.basename('C:\\foo.HTML', '.html');
console.log(secondDirectory);
// Logs: 'foo.HTML'
```

A [`TypeError`][] is thrown if `path` is not a string or if `suffix` is given
and is not a string.

## `path.delimiter`

<!-- YAML
added: v0.9.3
-->

* {string}

Provides the platform-specific path delimiter:

* `;` for Windows
* `:` for POSIX

For example, on POSIX:

```js
const path = require('node:path');

console.log(process.env.PATH);
// Prints: '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

const splitPath = process.env.PATH.split(path.delimiter);
console.log(splitPath);
// Prints: ['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin']
```

On Windows:

```js
const path = require('node:path');

console.log(process.env.PATH);
// Prints: 'C:\Windows\system32;C:\Windows;C:\Program Files\node\'

const splitPath = process.env.PATH.split(path.delimiter);
console.log(splitPath);
// Prints ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\node\\']
```

## `path.dirname(path)`

<!-- YAML
added: v0.1.16
changes:
  - version: v6.0.0
    pr-url: https://github.com/nodejs/node/pull/5348
    description: Passing a non-string as the `path` argument will throw now.
-->

* `path` {string}
* Returns: {string}

The `path.dirname()` method returns the directory name of a `path`, similar to
the Unix `dirname` command. Trailing directory separators are ignored, see
[`path.sep`][].

```js
const path = require('node:path');

const dirname = path.dirname('/foo/bar/baz/asdf/quux');
console.log(dirname)
// Prints: '/foo/bar/baz/asdf'
```

A [`TypeError`][] is thrown if `path` is not a string.

## `path.extname(path)`

<!-- YAML
added: v0.1.25
changes:
  - version: v6.0.0
    pr-url: https://github.com/nodejs/node/pull/5348
    description: Passing a non-string as the `path` argument will throw now.
-->

* `path` {string}
* Returns: {string}

The `path.extname()` method returns the extension of the `path`, from the last
occurrence of the `.` (period) character to end of string in the last portion of
the `path`. If there is no `.` in the last portion of the `path`, or if
there are no `.` characters other than the first character of
the basename of `path` (see `path.basename()`) , an empty string is returned.

```js
const path = require('node:path');

console.log(path.extname('index.html'));
// Prints: '.html'

console.log(path.extname('index.coffee.md'));
// Prints: '.md'

console.log(path.extname('index.'));
// Prints: '.'

console.log(path.extname('index'));
// Prints: ''

console.log(path.extname('.index'));
// Prints: ''

console.log(path.extname('.index.md'));
// Prints: '.md'
```

A [`TypeError`][] is thrown if `path` is not a string.

## `path.format(pathObject)`

<!-- YAML
added: v0.11.15
changes:
  - version: v19.0.0
    pr-url: https://github.com/nodejs/node/pull/44349
    description: The dot will be added if it is not specified in `ext`.
-->

* `pathObject` {Object} Any JavaScript object having the following properties:
  * `dir` {string}
  * `root` {string}
  * `base` {string}
  * `name` {string}
  * `ext` {string}
* Returns: {string}

The `path.format()` method returns a path string from an object. This is the
opposite of [`path.parse()`][].

When providing properties to the `pathObject` remember that there are
combinations where one property has priority over another:

* `pathObject.root` is ignored if `pathObject.dir` is provided
* `pathObject.ext` and `pathObject.name` are ignored if `pathObject.base` exists

For example, on POSIX:

```js
const path = require('node:path');

// If `dir`, `root` and `base` are provided,
// `${dir}${path.sep}${base}`
// will be returned. `root` is ignored.
const formatted = path.format({
  root: '/ignored',
  dir: '/home/user/dir',
  base: 'file.txt',
});
console.log(formatted);
// Prints: '/home/user/dir/file.txt'

// `root` will be used if `dir` is not specified.
// If only `root` is provided or `dir` is equal to `root` then the
// platform separator will not be included. `ext` will be ignored.
const secondFormatted = path.format({
  root: '/',
  base: 'file.txt',
  ext: 'ignored',
});
console.log(secondFormatted);
// Prints: '/file.txt'

// `name` + `ext` will be used if `base` is not specified.
const thirdFormatted = path.format({
  root: '/',
  name: 'file',
  ext: '.txt',
});
console.log(thirdFormatted);
// Prints: '/file.txt'

// The dot will be added if it is not specified in `ext`.
const fourthFormatted = path.format({
  root: '/',
  name: 'file',
  ext: 'txt',
});
console.log(fourthFormatted);
// Prints: '/file.txt'
```

On Windows:

```js
const path = require('node:path');

const windowsFormatted = path.format({
  dir: 'C:\\path\\dir',
  base: 'file.txt',
});
console.log(windowsFormatted);
// Prints: 'C:\\path\\dir\\file.txt'
```

## `path.isAbsolute(path)`

<!-- YAML
added: v0.11.2
-->

* `path` {string}
* Returns: {boolean}

The `path.isAbsolute()` method determines if `path` is an absolute path.

If the given `path` is a zero-length string, `false` will be returned.

For example, on POSIX:

```js
const path = require('node:path');

console.log(path.isAbsolute('/foo/bar')); // Prints: true
console.log(path.isAbsolute('/baz/..'));  // Prints: true
console.log(path.isAbsolute('qux/'));     // Prints: false
console.log(path.isAbsolute('.'));        // Prints: false
```

On Windows:

```js
const path = require('node:path');

console.log(path.isAbsolute('//server'));    // Prints: true
console.log(path.isAbsolute('\\\\server'));  // Prints: true
console.log(path.isAbsolute('C:/foo/..'));   // Prints: true
console.log(path.isAbsolute('C:\\foo\\..')); // Prints: true
console.log(path.isAbsolute('bar\\baz'));    // Prints: false
console.log(path.isAbsolute('bar/baz'));     // Prints: false
console.log(path.isAbsolute('.'));           // Prints: false
```

A [`TypeError`][] is thrown if `path` is not a string.

## `path.join([...paths])`

<!-- YAML
added: v0.1.16
-->

* `...paths` {string} A sequence of path segments
* Returns: {string}

The `path.join()` method joins all given `path` segments together using the
platform-specific separator as a delimiter, then normalizes the resulting path.

Zero-length `path` segments are ignored. If the joined path string is a
zero-length string then `'.'` will be returned, representing the current
working directory.

```js
const path = require('node:path');

const joined = path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// Returns: '/foo/bar/baz/asdf'
```

A [`TypeError`][] is thrown if any of the path segments is not a string.

## `path.normalize(path)`

<!-- YAML
added: v0.1.23
-->

* `path` {string}
* Returns: {string}

The `path.normalize()` method normalizes the given `path`, resolving `'..'` and
`'.'` segments.

When multiple, sequential path segment separation characters are found (e.g.
`/` on POSIX and either `\` or `/` on Windows), they are replaced by a single
instance of the platform-specific path segment separator (`/` on POSIX and
`\` on Windows). Trailing separators are preserved.

If the `path` is a zero-length string, `'.'` is returned, representing the
current working directory.

For example, on POSIX:

```js
const path = require('node:path');

const normalized = path.normalize('/foo/bar//baz/asdf/quux/..');
console.log(normalized);
// Prints: '/foo/bar/baz/asdf'
```

On Windows:

```js
const path = require('node:path');

const normalizedWindows = path.normalize('C:\\temp\\\\foo\\bar\\..\\');
console.log(normalizedWindows);
// Returns: 'C:\\temp\\foo\\'
```

Since Windows recognizes multiple path separators, both separators will be
replaced by instances of the Windows preferred separator (`\`):

```js
const path = require('node:path');

const normalizedWindows = path.win32.normalize('C:////temp\\\\/\\/\\/foo/bar');
console.log(normalizedWindows);
// Returns: 'C:\\temp\\foo\\bar'
```

A [`TypeError`][] is thrown if `path` is not a string.

## `path.parse(path)`

<!-- YAML
added: v0.11.15
-->

* `path` {string}
* Returns: {Object}

The `path.parse()` method returns an object whose properties represent
significant elements of the `path`. Trailing directory separators are ignored,
see [`path.sep`][].

The returned object will have the following properties:

* `dir` {string}
* `root` {string}
* `base` {string}
* `name` {string}
* `ext` {string}

For example, on POSIX:

```js
const path = require('node:path');

const parsed = path.parse('/home/user/dir/file.txt');
console.log(parsed);
// Prints:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```

```text
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘
(All spaces in the "" line should be ignored. They are purely for formatting.)
```

On Windows:

```js
const path = require('node:path');

const parsed = path.parse('C:\\path\\dir\\file.txt');
console.log(parsed);
// Returns:
// { root: 'C:\\',
//   dir: 'C:\\path\\dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```

```text
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
" C:\      path\dir   \ file  .txt "
└──────┴──────────────┴──────┴─────┘
(All spaces in the "" line should be ignored. They are purely for formatting.)
```

A [`TypeError`][] is thrown if `path` is not a string.

## `path.posix`

<!-- YAML
added: v0.11.15
changes:
  - version: v15.3.0
    pr-url: https://github.com/nodejs/node/pull/34962
    description: Exposed as `require('path/posix')`.
-->

* {Object}

The `path.posix` property provides access to POSIX specific implementations
of the `path` methods.

The API is accessible via `require('node:path').posix` or `require('node:path/posix')`.

## `path.relative(from, to)`

<!-- YAML
added: v0.5.0
changes:
  - version: v6.8.0
    pr-url: https://github.com/nodejs/node/pull/8523
    description: On Windows, the leading slashes for UNC paths are now included
                 in the return value.
-->

* `from` {string}
* `to` {string}
* Returns: {string}

The `path.relative()` method returns the relative path from `from` to `to` based
on the current working directory. If `from` and `to` each resolve to the same
path (after calling `path.resolve()` on each), a zero-length string is returned.

If a zero-length string is passed as `from` or `to`, the current working
directory will be used instead of the zero-length strings.

For example, on POSIX:

```js
const path = require('node:path');

const relative = path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
console.log(relative);
// Prints: '../../impl/bbb'
```

On Windows:

```js
const path = require('node:path');

const relativeWindows = path.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb');
console.log(relativeWindows);
// Returns: '..\\..\\impl\\bbb'
```

A [`TypeError`][] is thrown if either `from` or `to` is not a string.

## `path.resolve([...paths])`

<!-- YAML
added: v0.3.4
-->

* `...paths` {string} A sequence of paths or path segments
* Returns: {string}

The `path.resolve()` method resolves a sequence of paths or path segments into
an absolute path.

The given sequence of paths is processed from right to left, with each
subsequent `path` prepended until an absolute path is constructed.
For instance, given the sequence of path segments: `/foo`, `/bar`, `baz`,
calling `path.resolve('/foo', '/bar', 'baz')` would return `/bar/baz`
because `'baz'` is not an absolute path but `'/bar' + '/' + 'baz'` is.

If, after processing all given `path` segments, an absolute path has not yet
been generated, the current working directory is used.

The resulting path is normalized and trailing slashes are removed unless the
path is resolved to the root directory.

Zero-length `path` segments are ignored.

If no `path` segments are passed, `path.resolve()` will return the absolute path
of the current working directory.

```js
const path = require('node:path');

const resolved = path.resolve('/foo/bar', './baz');
console.log(resolved);
// Prints: '/foo/bar/baz'

const secondResolved = path.resolve('/foo/bar', '/tmp/file/');
console.log(secondResolved);
// Prints: '/tmp/file'

const thirdResolved = path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
console.log(thirdResolved);
// If the current working directory is /home/myself/node,
// this prints '/home/myself/node/wwwroot/static_files/gif/image.gif'
```

A [`TypeError`][] is thrown if any of the arguments is not a string.

## `path.sep`

<!-- YAML
added: v0.7.9
-->

* {string}

Provides the platform-specific path segment separator:

* `\` on Windows
* `/` on POSIX

For example, on POSIX:

```js
const path = require('node:path');

console.log('foo/bar/baz'.split(path.sep));
// Prints: ['foo', 'bar', 'baz']
```

On Windows:

```js
const path = require('node:path');

console.log('foo\\bar\\baz'.split(path.sep));
// Returns: ['foo', 'bar', 'baz']
```

On Windows, both the forward slash (`/`) and backward slash (`\`) are accepted
as path segment separators; however, the `path` methods only add backward
slashes (`\`).

## `path.toNamespacedPath(path)`

<!-- YAML
added: v9.0.0
-->

* `path` {string}
* Returns: {string}

On Windows systems only, returns an equivalent [namespace-prefixed path][] for
the given `path`. If `path` is not a string, `path` will be returned without
modifications.

This method is meaningful only on Windows systems. On POSIX systems, the
method is non-operational and always returns `path` without modifications.

## `path.win32`

<!-- YAML
added: v0.11.15
changes:
  - version: v15.3.0
    pr-url: https://github.com/nodejs/node/pull/34962
    description: Exposed as `require('path/win32')`.
-->

* {Object}

The `path.win32` property provides access to Windows-specific implementations
of the `path` methods.

The API is accessible via `require('node:path').win32` or `require('node:path/win32')`.

[MSDN-Rel-Path]: https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#fully-qualified-vs-relative-paths
[`TypeError`]: errors.md#class-typeerror
[`path.parse()`]: #pathparsepath
[`path.posix`]: #pathposix
[`path.sep`]: #pathsep
[`path.win32`]: #pathwin32
[namespace-prefixed path]: https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#namespaces