import {projectExists} from './validation'
import * as low from 'lowdb'
import * as FileAsync from 'lowdb/adapters/FileAsync'
import * as path from 'path'
import * as fs from 'fs-extra'
import * as Constants from './constants'
import {initJSON} from './setup'

interface XPSProjectOpts{
    projectDir?: string; // the location of .xps folder
}

interface XPSProjectInterface {
    projectLocation: string;
    xpsDBRef?: low.lowdb;
}

class XPSProjectError extends Error {}

export default class XPSProject {
    projectLocation = ''; // location of .xps folder

    xpsDBRef: any; // ref to db

    isInit = false; // track whether or not adapter is init

    // init the adapter
    async init(opts: XPSProjectOpts) {
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

    // return ref to local xps.json db
    async getXPSDB() {
      if (!this.isInit)
        throw new XPSProjectError('xps project adapter not initialized')
      return this.xpsDBRef
    }
}
