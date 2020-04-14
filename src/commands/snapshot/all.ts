import {Command, flags} from '@oclif/command'
import XPSProject from '../../helpers/project/adapter'

export default class SnapshotAll extends Command {
  static description = 'Create a package snapshot of all file changes'

  static aliases = ['snap:all']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [{name: 'pkgName'}]

  async run() {
    const {args, flags} = this.parse(SnapshotAll)

    // create new project adapter
    const project = new XPSProject()

    // get reference
    await project.init()
  }
}
