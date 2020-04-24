import {Command, flags} from '@oclif/command'
import XPSProject from '../../helpers/project/adapter'

export default class SnapshotStatus extends Command {
  static description = 'Show the status of snapshot changes'

  static aliases = ['snap:all']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [{name: 'pkgName', required: true}]

  async run() {
    const {args, flags} = this.parse(SnapshotStatus)

    // create new project adapter
    const project = new XPSProject()

    // get reference
    await project.init()

    // get pkgRef
    const pkg = await project.getPkgRef(args.pkgName)

    // create full snapshot
    // show diffs
    const diffs = await pkg.genChanges()
    console.log(diffs)
  }
}
