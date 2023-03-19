import { readFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { resolve } from 'node:path'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { visit } from 'unist-util-visit'
import { parser } from '@doctes/parser'

export async function collectBlocks (file) {
  const filePath = resolve(process.cwd(), file)
  const markdownSource = await readFile(filePath, { encoding: 'utf8' })
  const tree = fromMarkdown(markdownSource)

  return tree
}

export async function executeBlocks (tree) {
    let placeholder = []
    const result = new Promise((resolve, reject) => {
      visit(tree, async function (node, index, parent) {
        if (node.type === 'code' && (node.lang === 'js' || node.lang === 'javascript' || node.lang === 'cjs' || node.lang === 'mjs')) {
          const executed = spawn('node', ['--eval', `${node.value}`])
          const parsed = await parser(executed, node)
          placeholder.push(parsed)
          if(index === parent.children.findLastIndex(finalCodeBlock => finalCodeBlock.type === 'code')) {
            resolve(placeholder)
          }
        }
      })
    })

    return result
}