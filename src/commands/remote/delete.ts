import {Command, flags} from '@oclif/command'
import XPSProject from '../../helpers/project/adapter'

export default class RemoteDelete extends Command {
  static description = 'Delete a remote or its properties'

  static aliases = ['remote:delete', 'remote:del']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [
    {name: 'name', required: true},
    {name: 'type', options: ['fetch', 'push', 'all'], required: true, default: 'all'},
  ]

  async run() {
    const {args} = this.parse(RemoteDelete)

    // create new project adapter
    const project = new XPSProject()

    // get reference
    await project.init()

    const ref = await project.getDB()

    // if all delete the whole remote
    if (args.type === 'all') {
      await ref.unset(`remotes.${args.name}`).write()
    }

    // delete fetch
    if (args.type === 'fetch') {
      await ref.unset(`remotes.${args.name}.fetch`).write()
    }

    // delete pull
    if (args.type === 'push') {
      await ref.unset(`remotes.${args.name}.push`).write()
    }
  }
}
