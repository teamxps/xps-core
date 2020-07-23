import {Command, flags} from '@oclif/command'
import XPSProject from '../../helpers/project/adapter'

export default class SnapshotAll extends Command {
  static description = 'Create a package snapshot of all file changes'

  static aliases = ['snapshot', 'snap']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [{name: 'pkgName'}]

  async run() {
    const {args} = this.parse(SnapshotAll)

    // create new project adapter
    const project = new XPSProject()

    // get reference
    await project.init()

    // explicit pkgname
    if (args.pkgName) {
      const pkg = await project.getPkgRef(args.pkgName)

      // create full snapshot
      const diffs = await pkg.genChanges()
      if (diffs.fileChanges.additions.length > 0 || diffs.fileChanges.removals.length > 0 || diffs.fileChanges.modifications.length > 0 ||
        diffs.npmChanges.additions.length > 0 || diffs.npmChanges.removals.length > 0) {
        this.log(`Diffs in Component ID: ${args.pkgName}, generating snapshot`)
        const snapshot = await pkg.createFullSnapshot()
        return this.log(pkg.displaySnapshotObj(snapshot))
      }
      return this.log(`No diffs in Component ID: ${args.pkgName}`)
    }

    // get pkgRef for each component in scope
    const scope = await project.getScope()
    for (let i = 0; i < scope.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      const pkg = await project.getPkgRef(scope[i])

      // show file diffs
      // eslint-disable-next-line no-await-in-loop
      const diffs = await pkg.genChanges()
      if (diffs.fileChanges.additions.length > 0 || diffs.fileChanges.removals.length > 0 || diffs.fileChanges.modifications.length > 0 ||
        diffs.npmChanges.additions.length > 0 || diffs.npmChanges.removals.length > 0) {
        this.log(`Diffs in Component ID: ${scope[i]}, generating snapshot`)
        const snapshot = await pkg.createFullSnapshot()
        this.log(pkg.displaySnapshotObj(snapshot))
      } else {
        this.log(`No diffs in Component ID: ${scope[i]}`)
      }
    }
  }
}
