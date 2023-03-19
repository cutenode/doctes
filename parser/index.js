export async function parser (executedCommand, node) {
  // useful node entries:
  //   - node.position.start.line: the line number of the code block in the source markdown being logged
  //   - node.value:               the contents of the code block being logged

  const result = {
    line: node.position.start.line,
    exitCode: node.value
  }

  const data = new Promise((resolve, reject) => {
    if(executedCommand === '') { // when we pass in no command, exit successfully
      resolve(result)
    }
    executedCommand.stdout.on('data', (data) => {
      if(Buffer.isBuffer(data)) data = data.toString()
      result.stdout = data
    })
    
    executedCommand.stderr.on('data', (data) => {
      if(Buffer.isBuffer(data)) data = data.toString()
      result.stderr = data
    })

    executedCommand.on('close', (code) => {
      result.exitCode = code
      resolve(result)
    })
  })

  return data
}
