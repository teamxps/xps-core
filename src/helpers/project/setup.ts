import * as fs from 'fs-extra'
import * as path from 'path'
import * as Constants from './constants'
import * as low from 'lowdb'
import * as FileAsync from 'lowdb/adapters/FileAsync'

// setup package .xps database folders with a prefix - assume setupDir is the xps folder at proj root
export async function initDatabase(setupDir: string = path.resolve(process.cwd(), Constants.XPS_PROJECT_DIR), prefix = 'temp') {
  const projectDir = path.resolve(setupDir, prefix)
  const objectsDir = path.resolve(projectDir, Constants.XPS_OBJECTS_DIR)
  await fs.ensureDir(projectDir) // .xps/prefix dir
  await fs.ensureDir(objectsDir) // .xps/prefix/objects dir
  Constants.XPS_DATABASES.forEach(async dbname => { // .xps/prefix/objects/$databaseName dir
    await fs.ensureDir(path.resolve(objectsDir, dbname))
  })
}

// write an xps.json for xps project
export async function initJSON(setupDir: string = path.resolve(process.cwd(), Constants.XPS_PROJECT_DIR)) {
  await fs.ensureDir(setupDir)
  const xpsDB = await low(new FileAsync(path.resolve(setupDir, 'xps.json')))
  await xpsDB.defaults({
    components: {},
    remotes: {},
  }).write()
}
