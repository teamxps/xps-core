import {projectExists} from './validation'
import {initDatabase} from './setup'
import * as low from 'lowdb'
import * as FileAsync from 'lowdb/adapters/FileAsync'
import * as path from 'path'
import * as fs from 'fs-extra'
import * as Constants from './constants'
import {initJSON} from './setup'
import XPSPackage from '../package/adapter'

interface XPSProjectOpts{
    projectDir?: string; // the location of .xps folder
}

interface XPSPackageOptions {
  name: string;
  description?: string;
  entry: string;
}

class XPSProjectError extends Error {}

export default class XPSProject {
    projectLocation = ''; // absolute location of .xps folder

    private xpsDBRef: any; // ref to db

    isInit = false; // track whether or not adapter is init

    // init the adapter
    async init(opts: XPSProjectOpts = {}) {
      this.projectLocation = (opts.projectDir) ? opts.projectDir : await projectExists()
      if (!this.projectLocation) {
        throw new XPSProjectError('could not find an .xps project in this or any parent folders')
      }
      this.xpsDBRef =  await low(new FileAsync(path.resolve(this.projectLocation, 'xps.json')))

      this.isInit = true
    }

    // setup and create a new project
    async createNewProject(setupDir = '') {
      const projExists = await projectExists({startDir: setupDir, current: true})
      if (projExists) {
        throw new XPSProjectError('an xps project already exists in this directory')
      }
      await initJSON(path.resolve(setupDir, Constants.XPS_PROJECT_DIR))
    }

    // safe way to return ref to local xps.json db
    getDB() {
      if (!this.isInit)
        throw new XPSProjectError('xps project adapter not initialized')
      return this.xpsDBRef
    }

    // get a ref to a pkg object given string
    async getPkgRef(name: string) {
      // check if pkg with name exists
      const pkgExists = await this.getDB().get(`components.${name}`).value()
      if (!pkgExists) {
        throw new XPSProjectError('no such package with name')
      }

      // generate new pkg ref
      const pkg = new XPSPackage({
        name: name,
        projectLocation: this.projectLocation,
        packageLocation: path.resolve(this.projectLocation, name),
        entryLocation: path.resolve(this.projectLocation, pkgExists.entry),
        xpsDBRef: this.getDB(),
      })

      return pkg
    }

    // add a new package to this project
    async addPkg(pkgOptions: XPSPackageOptions) {
      if (!this.isInit)
        throw new XPSProjectError('xps project adapter not initialized')

      // check for unique name
      const nameExists = await this.getDB().find(`components.${pkgOptions.name}`).value()
      if (nameExists) {
        throw new XPSProjectError('package name is not unique')
      }

      // check if entry exists
      const entryExists = await fs.pathExists(pkgOptions.entry)
      // if not create it
      if (!entryExists) {
        await fs.ensureFile(pkgOptions.entry)
      }

      const obj =  {
        name: pkgOptions.name,
        description: pkgOptions.description,
        version: '0.0.0',
        entry: path.relative(this.projectLocation, pkgOptions.entry),
      }

      // write component into projDB
      await this.getDB().set(`components.${pkgOptions.name}`, obj).write()

      // create database dirs
      await initDatabase(this.projectLocation, pkgOptions.name)

      return obj
    }
}
