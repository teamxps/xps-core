/* eslint-disable no-await-in-loop */
import * as fs from 'fs-extra'
import * as path from 'path'
import {hashContent} from './object'
import {Promise, AggregateError} from 'bluebird'

const IMPORT_PRESENT = /(import .+ from .+|require\(.*\))/g // es6 support
const JS_MODULE = /('[.\\/]+.*')|("[.\\/]+.*")|(`[.\\/]+.*`)/g // non-npm
const IMPORT_SRC = /('.*')|(".*")|(`.*`)/g
const SUPPORTED_EXTENSIONS = ['.ts', '.js', '.jsx']

// wrapper for file existence return the path if true
async function pathExists(path: string) {
  return new Promise((res, rej) => {
    fs.pathExists(path).then(val => {
      if (val)
        res(path)
      rej()
    })
  })
}

// get a list of all dependencies for an entry
export async function getDependencies(entry: string) {
  entry = path.resolve(entry)
  const fileContent = await (await fs.readFile(entry)).toString()
  const npmDependencies: string[] = []
  const dependencies: any = {}// flattened list of dependencies
  const visited = [entry] // keep track of visited paths
  const stack: string[] = [] // keep track of srcs to visit

  // put itself as a dependency
  dependencies[path.basename(entry)] = hashContent(fileContent)

  fileContent.match(IMPORT_PRESENT)?.forEach(p => {
    let src = p.match(IMPORT_SRC)[0]
    src = src.substring(1, src.length - 1)
    if (p.match(JS_MODULE)) {// if npm module just add it but dont find it's dependencies
      stack.push(path.resolve(path.dirname(entry), src)) // put the src to the stack
    } else if (!visited.includes(src)) {
      npmDependencies.push(src)
      visited.push(src)
    }
  })

  while (stack.length > 0) {
    try {
      const poppedEntry: string = stack.pop()
      if (visited.includes(poppedEntry)) // break if we already visited
        continue

      // check if file exists
      const fileExists: any = await Promise.any([
        pathExists(poppedEntry),
        ...SUPPORTED_EXTENSIONS.map(ext => pathExists(poppedEntry + ext)),
      ])
      if (!fileExists) // if file does not exist
        continue

      const visitContent = await (await fs.readFile(fileExists)).toString()
      // hashcontent use that as key
      const hash = hashContent(visitContent)
      dependencies[path.relative(path.dirname(entry), fileExists)] = hash// store relative position

        visitContent.match(IMPORT_PRESENT)?.forEach(p => {
          let src = p.match(IMPORT_SRC)[0]
          src = src.substring(1, src.length - 1)
          if (p.match(JS_MODULE)) {// if npm module just add it but dont find it's dependencies
            stack.push(path.resolve(path.dirname(entry), src)) // put the src to the stack
          } else if (!visited.includes(src)) {
            npmDependencies.push(src)
            visited.push(src)
          }
        })
    } catch (err) {
      if (!(err instanceof AggregateError))
        // eslint-disable-next-line no-console
        console.error(err)
    }
  }
  return {npmDependencies: npmDependencies, fileDependencies: dependencies}
}
