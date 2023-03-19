import { collectBlocks, executeBlocks } from '@doctes/core'
import { parseArgs } from 'node:util'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'


// mostly inspired by this article: https://coderrocketfuel.com/article/recursively-list-all-the-files-in-a-directory-using-node-js
async function getAllFiles (dirPath, arrayOfFiles) {
  const files = readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function (file) {
    if(statSync(`${dirPath}/${file}`).isDirectory()) {
      arrayOfFiles = getAllFiles(`${dirPath}/${file}`, arrayOfFiles)
    } else {
      arrayOfFiles.push(fileURLToPath(new URL(`${dirPath}/${file}`, import.meta.url)))
    }
  })

  return arrayOfFiles
}

const options = {
  json: {
    type: 'boolean'
  },
  dir: {
    type: 'string',
  },
  file: {
    type: 'string',
  },
  silent: {
    type: 'boolean'
  }
}

if(!process.argv.includes('--dir') && !process.argv.includes('--file')) {
  process.argv.push('--dir=./')
}

const { values, positionals } = parseArgs({ options })

async function parsePath () {
  if(values.file && values.dir) {
    console.log('Please choose either a file or a directory, not both.')
    process.exitCode(1)
  }

  if(values.file && !values.dir) {
    const blocks = await collectBlocks(values.file)
    const executedBlocks = await executeBlocks(blocks)
    logCheck(executedBlocks, values.file, values)
  }

  if(values.dir && !values.file) {
    const normalizedDir = fileURLToPath(new URL(values.dir, import.meta.url))
    const files = await getAllFiles(normalizedDir)

    for(const file of files) {
      const blocks = await collectBlocks(file)
      const executedBlocks = await executeBlocks(blocks)
      logCheck(executedBlocks, file, values)
    }
  }
}

async function logCheck (executedBlocks, filename, values) {
  const results = {
    pass: [],
    fail: []
  }

  for (const result of executedBlocks) {
    if (result.exitCode === 0) {
      results.pass.push({line: result.line, filename: filename})
    } else {
      results.fail.push({line: result.line, filename: filename})
    }
  }

  if(values.json && values.silent) {
    throw new Error('You cannot use the --json and --silent flags together.')
  }

  if(values.json === true) { // output JSON if 
    console.log(JSON.stringify(results, null, 2))
  }

  if(values.silent !== true) {
    console.log(`\n${results.pass.length} passed, ${results.fail.length} failed\n`)
    if(results.fail.length !== 0) {
      console.log('Failed checks:')
      for(const fail of results.fail) {
        console.log(`- ${fail.filename}:${fail.line}`)
      }
    }
  }

  if(results.fail.length !== 0) {
    process.exitCode = 1 
  } else {
    process.exitCode = 0
  }
}

await parsePath()
