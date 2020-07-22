/* eslint-disable no-await-in-loop */
import {projectExists} from './validation'
import {initDatabase} from './setup'
import * as low from 'lowdb'
import * as FileAsync from 'lowdb/adapters/FileAsync'
import * as path from 'path'
import * as fs from 'fs-extra'
import * as Constants from './constants'
import {initJSON} from './setup'
import XPSPackage from '../package/adapter'
import {readGzip, createContent} from '../general/object'
import {any} from 'bluebird'

interface XPSProjectOpts{
    projectDir?: string; // the location of .xps folder
}

interface XPSPackageOptions {
  name: string;
  description?: string;
  entry: string;
  from: string;
}

class XPSProjectError extends Error {}

export default class XPSProject {
    projectLocation = ''; // absolute location of .xps folder

    private xpsDBRef: any; // ref to db

    isInit = false; // track whether or not adapter is init

    // init the adapter
    async init(opts: XPSProjectOpts = {}) {
      this.projectLocation = (opts.projectDir) ? await projectExists({startDir: opts.projectDir}) : await projectExists()
      if (!this.projectLocation) {
        throw new XPSProjectError('could not find an .xps project in this or any parent folders')
      }
      this.xpsDBRef =  await low(new FileAsync(path.resolve(this.projectLocation, 'xps.json')))

      this.isInit = true
    }

    // move components from another project to this one
    async transplantComponents(sourceProject: XPSProject, components: Array<string>, remoteName: string) {
      for (let i = 0; i < components.length; i++) {
        const sourceComponent = await sourceProject.getDB().get(`components.${components[i]}`).value()

        console.log(`IMPORTING ${sourceComponent.name}`)

        // hardcoded rn fix later
        let entry = sourceComponent.entry
        entry = entry.substring(entry.indexOf('\\') + 1, entry.length)
        // create component
        const component = await this.addPkg({
          name: sourceComponent.name,
          description: sourceComponent.description,
          entry: entry,
          from: remoteName,
        })

        // import history
        for (let h = 0; h < sourceComponent.history.length; h++) {
          // copy over
          await fs.copy(path.join(sourceProject.projectLocation,
            Constants.XPS_OBJECTS_DIR, sourceComponent.history[h]),
          path.join(this.projectLocation,
            Constants.XPS_OBJECTS_DIR, sourceComponent.history[h]))

          // apply snapshot change
          const snap = await this.getObj(path.join(this.projectLocation,
            Constants.XPS_OBJECTS_DIR, sourceComponent.history[0])).then(s => JSON.parse(s))

          // copy entry
          // await fs.copy(path.join(sourceProject.projectLocation, snap.entry), path.join(this.projectLocation, snap.entry))

          // copy over filedependencies
          const fileKeys = Object.keys(snap.dependencies.fileDependencies)
          for (let f = 0; f < fileKeys.length; f++) {
            // copy over hashed object
            fs.copy(path.join(sourceProject.projectLocation,
              Constants.XPS_OBJECTS_DIR, snap.dependencies.fileDependencies[fileKeys[f]]),
            path.join(this.projectLocation,
              Constants.XPS_OBJECTS_DIR, snap.dependencies.fileDependencies[fileKeys[f]]))

            // last snapshot
            if (h === sourceComponent.history.length - 1) {
              const hashedContent = await readGzip(path.join(this.projectLocation,
                Constants.XPS_OBJECTS_DIR, snap.dependencies.fileDependencies[fileKeys[f]]))

              await fs.writeFile(path.join(this.projectLocation, path.dirname(snap.entry), fileKeys[f]), hashedContent)
              console.log(`WRITING ${fileKeys[f]} at ${path.join(path.dirname(snap.entry), fileKeys[f])}`)
            }
          }

          // write to history
          const val = await this.getDB().get(`components.${sourceComponent.name}.history`).value()
          if (!val)
            await this.getDB().set(`components.${sourceComponent.name}.history`, []).write()
          await this.getDB().get(`components.${components[i]}.history`).push(sourceComponent.history[h]).write()
        }
      }
    }

    // set project remotes
    async setRemotes(remoteName: string, remotePath: string, remoteType: 'fetch' | 'push') {
      await this.getDB().set(`remotes.${remoteName}.${remoteType}`, remotePath).write()
    }

    async getRemote(remoteName: string) {
      return this.getDB().get(`remotes.${remoteName}`).value()
    }

    getRemotes() {
      return this.getDB().get('remotes').value()
    }

    async getRemotesRef() {
      return this.getDB().get('remotes')
    }

    // set the project scope
    async setScope(scope: Array<string> | string, all = false) {
      if (all) {
        const components = await this.getDB().get('components').value()
        await this.getDB().set('scope', Object.keys(components)).write()
        return Object.keys(components)
      }
      await this.getDB().set('scope', scope).write()
      return scope
    }

    // get the project scope
    async getScope() {
      return this.getDB().get('scope').value()
    }

    // get a list of components
    async getComponentNames() {
      const components = await this.getDB().get('components').value()
      return Object.keys(components)
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
      const pkgExists = await this.getDB().get('components').get(name).value()
      if (!pkgExists) {
        throw new XPSProjectError('no such package with name')
      }

      // generate new pkg ref
      const pkg = new XPSPackage({
        name: name,
        projectLocation: this.projectLocation,
        packageLocation: path.resolve(this.projectLocation), // , name),
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

      console.log(path.relative(this.projectLocation, pkgOptions.entry))

      const obj =  {
        name: pkgOptions.name,
        description: pkgOptions.description,
        version: '0.0.0',
        entry: path.relative(this.projectLocation, pkgOptions.entry),
        from: pkgOptions.from || 'this',
      }

      // write component into projDB
      await this.getDB().set(`components.${pkgOptions.name}`, obj).write()

      // create database dirs
      await initDatabase(this.projectLocation)// , pkgOptions.name)

      return obj
    }

    // get object content
    async getObj(hash: string) {
      return readGzip(path.resolve(this.projectLocation, Constants.XPS_OBJECTS_DIR, hash))
    }
}
