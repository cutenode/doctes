# doctes

doctes is a tool for testing JavaScript examples in your documentation.

## Components:

- [`@doctes/core`](./core/) - the core library.
- [`@doctes/checkbox`](./checkbox/) - the slim CLI for CI and automated systems.
- [`@doctes/parser`](./parser/) - internal tool used for parsing executed scripts.

Additionally:

- [`./markdown`](./markdown/) is a directory of markdown that we can test various components of the tool against.

## Context

For a long time I've wanted to be able to test code examples in documentation. There's a few different solutions, but none of them have quite been what I've wanted. I'm working on this project as a free time because-I-want-it project with the hopes of solving a few of the problems I personally have, providing some nifty tools, and maybe giving other people some nice ideas to expand upon - both in the ecosystem and at work.

There's a number of things I'd like to add to this project, but generally I find that when I list things out I... don't do them. I'll probably poke at it once every few months, but feel free to open issues or PRs if you have ideas or want to actually use anything here.