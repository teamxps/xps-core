import {Command, flags} from '@oclif/command'
import XPSProject from '../../helpers/project/adapter'

export default class SnapshotStatus extends Command {
  static description = 'Show the status of snapshot changes'

  static aliases = ['snap:status', 'snapshot:status', 'status']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [{name: 'pkgName', required: false}]

  async run() {
    const {args, flags} = this.parse(SnapshotStatus)

    // create new project adapter
    const project = new XPSProject()

    // get reference
    await project.init()

    // explicit pkgname
    if (args.pkgName) {
      const pkg = await project.getPkgRef(args.pkgName)

      // show file diffs
      const diffs = await pkg.genChanges()
      return this.log(pkg.displayChangesObj(diffs))
    }

    // get pkgRef for each component in scope
    const scope = await project.getScope()
    for (let i = 0; i < scope.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      const pkg = await project.getPkgRef(scope[i])

      // show file diffs
      // eslint-disable-next-line no-await-in-loop
      const diffs = await pkg.genChanges()
      this.log(`Component ID: ${scope[i]}`)
      this.log(pkg.displayChangesObj(diffs))
    }
  }
}
