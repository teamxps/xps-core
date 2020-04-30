import {Command, flags} from '@oclif/command'
import XPSProject from '../../helpers/project/adapter'

export default class RemoteAdd extends Command {
  static description = 'Add a remote to the project'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [
    {name: 'name', required: true},
    {name: 'path', required: true},
    {name: 'type', required: true, default: 'all', options: ['fetch', 'push', 'all']},
  ]

  async run() {
    const {args} = this.parse(RemoteAdd)

    // create new project adapter
    const project = new XPSProject()

    // get reference
    await project.init()

    // set remotes
    if (args.type === 'fetch' || args.type === 'all') {
      await project.setRemotes(args.name, args.path, 'fetch')
      this.log(`${args.name}  ${args.path}  (fetch)`)
    }

    if (args.type === 'push' || args.type === 'all') {
      await project.setRemotes(args.name, args.path, 'push')
      this.log(`${args.name}  ${args.path}  (push)`)
    }
  }
}
