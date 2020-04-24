import {getDependencies} from '../general/dependency'
import {createHashedContent, readGzip} from '../general/object'
import * as Constants from '../project/constants'
import * as path from 'path'
import * as os from 'os'
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
        const fileDiffs: any = {}
        Object.keys(currentDependencies.fileDependencies).forEach((d: string) => {
          if (recentDependencies.fileDependencies[d]) { // check for file changes
            if (recentDependencies.fileDependencies[d] !== currentDependencies.fileDependencies[d]) {
              fileDiffs[d] = currentDependencies.fileDependencies[d]
            }
          } else { // new file
            fileDiffs[d] = currentDependencies.fileDependencies[d]
          }
        })

        return {fileChanges: fileDiffs, npmChanges: npmDiffs}
      }
      return {
        fileChanges: currentDependencies.fileDependencies,
        npmChanges: {additions: currentDependencies.npmDependencies},
      }
    }

    // string representation of snapshots from diff obj
    displayChangesObj(obj: any) {
      let rep = ''
      rep += 'Changes not in snapshot:\n\n'
      rep += 'File Changes:\n'
      Object.keys(obj.fileChanges).forEach((f: string) => {
        rep += `modified:   ${f}\n`
      })
      rep += '\nnpm Changes:\n'
      obj.npmChanges.additions.forEach((n: string) => {
        rep += `Added:   ${n}\n`
      })
      obj.npmChanges.removals.forEach((n: string) => {
        rep += `Removed:   ${n}\n`
      })
      return rep
    }

    // string representation of snapshot from object
    displaySnapshotObj(obj: any) {
      let rep = ''
      rep += `author: ${obj.author}\n`
      rep += `date: ${obj.date}\n`
      rep += `dependencies: ${JSON.stringify(obj.dependencies, null, 2)}`

      return rep
    }

    // create a full snapshot of changes of entry dependencies, return snapshot obj
    async createFullSnapshot() {
      const db = await this.xpsDBRef.get(`components.${this.name}`)
      let history = await db.get('history').value()
      const dependencies = await getDependencies(this.entryLocation)
      const snapshot = {
        author: process.env.USER || os.userInfo().username,
        date: Date.now(),
        dependencies: dependencies,
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
