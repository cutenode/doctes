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
        // handle the situation where there are no code blocks at all
        if(node.type === 'root') {
          if(node.children.findLastIndex(child => child.type === 'code') === -1) {
            const mockParsed = await parser('', node)
            placeholder.push(mockParsed)
            resolve(placeholder)
          }

          // method we use to check if there are any code blocks that are useful.
          const usefulLanguageBlocks = (node) => node.lang === 'js' || node.lang === 'javascript' || node.lang === 'cjs'
          if(node.children.some(usefulLanguageBlocks) === false) {
            const mockParsed = await parser('', node)
            placeholder.push(mockParsed)
            resolve(placeholder)
          }
        }
        
        if (node.type === 'code' && (node.lang === 'js' || node.lang === 'javascript' || node.lang === 'cjs')) {

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