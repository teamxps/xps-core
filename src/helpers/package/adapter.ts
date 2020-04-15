import {getDependencies} from '../general/dependency'
import {createHashedContent} from '../general/object'
import * as Constants from '../project/constants'
import * as path from 'path'
import * as os from 'os'

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

    // show changes from last snapshot
    async genChanges() {

    }

    // string representation of snapshot from object
    displaySnapshotObj(obj: any) {
      console.log(obj)
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
