import * as crypto from 'crypto'
import * as fs from 'fs-extra'
import * as zlib from 'zlib'
import * as Stream from 'stream'
import * as util from 'util'

// eslint-disable-next-line node/no-unsupported-features/node-builtins
const pipeline = util.promisify(Stream.pipeline)

// return sha256 hash of a string
export function hashContent(content: string) {
  return crypto.createHash('sha256').update(content).digest('hex')
}

// compress a file and export it to a given outputdir
export async function createHashedFile(originalFile: string, outputDir: string) {
  const content = await fs.readFile(originalFile)
  const hash = hashContent(content.toString())
  await fs.ensureFile(`${outputDir}/${hash}`)

  await pipeline(fs.createReadStream(originalFile), zlib.createGzip(), fs.createWriteStream(`${outputDir}/${hash}`))
  return hash
}

// compress a file and export it to a given outputdir
export async function createHashedContent(content: string, outputDir: string) {
  const hash = hashContent(content)
  // create stream and push content
  const input = new Stream.Readable()
  input.push(content)
  input.push(null)

  await pipeline(input, zlib.createGzip(), fs.createWriteStream(`${outputDir}/${hash}`))
  return hash
}

// read a .gz compressed file
export async function readGzip(filepath: string) {
  const content = await fs.readFile(filepath)
  return util.promisify(zlib.gunzip)(content).then(b => b.toString())
}
