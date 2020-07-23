import {getDependencies} from '../general/dependency'
import {createHashedContent, readGzip} from '../general/object'
import * as Constants from '../project/constants'
import * as path from 'path'
import * as os from 'os'
import * as fs from 'fs-extra'
import _ = require('lodash')

interface XPSPackageOptions {
    projectLocation: string; // absolute location of project
    entryLocation: string; // absolute location of entry file
    packageLocation: string; // absolute location of package dir
    name: string; // pkg name
    xpsDBRef: any; // db ref
  }

export default class XPSPackage {
    projectLocation = ''

    packageLocation = ''

    entryLocation = ''

    name = ''

    xpsDBRef: any;

    // create a new XPSPackage
    constructor(opts: XPSPackageOptions) {
      this.name = opts.name
      this.projectLocation = opts.projectLocation
      this.packageLocation = opts.packageLocation
      this.entryLocation = opts.entryLocation
      this.xpsDBRef = opts.xpsDBRef
    }

    // get an object from this pkg by hash
    async getObj(hash: string) {
      return readGzip(path.resolve(this.packageLocation, Constants.XPS_OBJECTS_DIR, hash))
    }

    // compare diffs between 2 packages
    async compareChanges(otherXPSPackage: XPSPackage) {
      const db = await otherXPSPackage.xpsDBRef.get(`components.${this.name}`)
      const history = await db.get('history').value()
      const currentDependencies = await getDependencies(this.entryLocation)
      if (history) { // check if there was even a previous snapshot
        const recentDependencies = await otherXPSPackage.getObj(history[0]).then(str => JSON.parse(str).dependencies)
        // console.log(recentDependencies)
        // console.log(currentDependencies)
        // compare npm dependencies
        const npmDiffs = {
          additions: _.difference(currentDependencies.npmDependencies, recentDependencies.npmDependencies),
          removals: _.difference(recentDependencies.npmDependencies, currentDependencies.npmDependencies),
        }
        // compare file diffs
        const fileDiffs = {
          additions: _.difference(Object.keys(currentDependencies.fileDependencies), Object.keys(recentDependencies.fileDependencies)),
          removals: _.difference(Object.keys(recentDependencies.fileDependencies), Object.keys(currentDependencies.fileDependencies)),
          modifications: _.intersection(Object.keys(currentDependencies.fileDependencies), Object.keys(recentDependencies.fileDependencies))
          .filter(k => {
            // console.log(`${currentDependencies.fileDependencies[k]}\n${recentDependencies.fileDependencies[k]}`)
            return currentDependencies.fileDependencies[k] !== recentDependencies.fileDependencies[k]
          }
          ),
        }
        return {fileChanges: fileDiffs, npmChanges: npmDiffs, hash: history[0]}
      }
      return {
        fileChanges: {additions: currentDependencies.fileDependencies, removals: [] as string[], modifications: [] as string[]},
        npmChanges: {additions: currentDependencies.npmDependencies, removals: [] as string[]},
        hash: (history) ? history[0] : null,
      }
    }

    // show changes from last snapshot
    async genChanges() {
      const db = await this.xpsDBRef.get(`components.${this.name}`)
      const history = await db.get('history').value()
      const currentDependencies = await getDependencies(this.entryLocation)
      if (history) { // check if there was even a previous snapshot
        const recentDependencies = await this.getObj(history[0]).then(str => JSON.parse(str).dependencies)
        // compare npm dependencies
        const npmDiffs = {
          additions: _.difference(currentDependencies.npmDependencies, recentDependencies.npmDependencies),
          removals: _.difference(recentDependencies.npmDependencies, currentDependencies.npmDependencies),
        }
        // compare file diffs
        const fileDiffs = {
          additions: _.difference(Object.keys(currentDependencies.fileDependencies), Object.keys(recentDependencies.fileDependencies)),
          removals: _.difference(Object.keys(recentDependencies.fileDependencies), Object.keys(currentDependencies.fileDependencies)),
          modifications: _.intersection(Object.keys(currentDependencies.fileDependencies), Object.keys(recentDependencies.fileDependencies))
          .filter(k => {
            // console.log(`${currentDependencies.fileDependencies[k]}\n${recentDependencies.fileDependencies[k]}`)
            return currentDependencies.fileDependencies[k] !== recentDependencies.fileDependencies[k]
          }

          ),
        }
        return {fileChanges: fileDiffs, npmChanges: npmDiffs, hash: history[0]}
      }
      return {
        fileChanges: {additions: currentDependencies.fileDependencies, removals: [] as string[], modifications: [] as string[]},
        npmChanges: {additions: currentDependencies.npmDependencies},
        hash: (history) ? history[0] : null,
      }
    }

    // string representation of snapshots from diff obj
    displayChangesObj(obj: any) {
      if (!obj.hash) {
        return 'No snapshot history\n'
      }
      let rep = `Latest snapshot: ${obj.hash}\n`
      // eslint-disable-next-line unicorn/explicit-length-check
      if (!obj.fileChanges.additions.length && !obj.fileChanges.removals.length && !obj.fileChanges.modifications.length && !obj.npmChanges.additions.length && !obj.npmChanges.removals.length) {
        return rep + 'No changes to snapshot\n'
      }

      rep += 'Changes not in snapshot:\n\n'

      // eslint-disable-next-line unicorn/explicit-length-check
      if (obj.fileChanges.additions && obj.fileChanges.removals && obj.fileChanges.modifications) {
        // file changes
        rep += 'File Changes:\n'
        if (obj.fileChanges.additions)
          obj.fileChanges.additions.forEach((f: string) => {
            rep += `additions:   ${f}\n`
          })
        if (obj.fileChanges.removals)
          obj.fileChanges.removals.forEach((f: string) => {
            rep += `removed:   ${f}\n`
          })
        if (obj.fileChanges.modifications)
          obj.fileChanges.modifications.forEach((f: string) => {
            rep += `modified:   ${f}\n`
          })
      }

      // eslint-disable-next-line unicorn/explicit-length-check
      if (obj.npmChanges.additions && obj.npmChanges.removals) {
        // npm changes
        rep += '\nnpm Changes:\n'
        if (obj.npmChanges.additions)
          obj.npmChanges.additions.forEach((n: string) => {
            rep += `added:   ${n}\n`
          })
        if (obj.npmChanges.removals)
          obj.npmChanges.removals.forEach((n: string) => {
            rep += `removed:   ${n}\n`
          })
      }

      return rep
    }

    // string representation of snapshot from object
    displaySnapshotObj(obj: any) {
      let rep = ''
      rep += `author: ${obj.author}\n`
      rep += `entry: ${obj.entry}\n`
      rep += `date: ${obj.date}\n`
      rep += `dependencies: ${JSON.stringify(obj.dependencies, null, 2)}`

      return rep
    }

    // create a full snapshot of changes of entry dependencies, return snapshot obj
    async createFullSnapshot() {
      const db = await this.xpsDBRef.get(`components.${this.name}`)
      let history = await db.get('history').value()
      const dependencies = await getDependencies(this.entryLocation)
      // write dependencies as objects
      const fileDependencies = Object.keys(dependencies.fileDependencies)
      for (let i = 0; i < fileDependencies.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const content = await fs.readFile(path.resolve(this.entryLocation, '../', fileDependencies[i])).then(b => b.toString())
        // eslint-disable-next-line no-await-in-loop
        await createHashedContent(content, path.resolve(this.packageLocation, Constants.XPS_OBJECTS_DIR))
      }

      const snapshot = {
        author: process.env.USER || os.userInfo().username,
        date: Date.now(),
        dependencies: dependencies,
        entry: path.relative(this.projectLocation, this.entryLocation),
      }
      // write snapshot to file
      const hash = await createHashedContent(JSON.stringify(snapshot, null, 2), path.resolve(this.packageLocation, Constants.XPS_OBJECTS_DIR))

      // if history exists
      if (history) {
        history.unshift(hash)
      } else {
        history = [hash]
      }
      // save to db
      await db.set('history', history).write()

      return snapshot
    }
}
