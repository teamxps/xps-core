import {Command, flags} from '@oclif/command'
import XPSProject from '../../helpers/project/adapter'

export default class RemoteAdd extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({char: 'h'}),
    fetch: flags.boolean({char: 'f'}),
    push: flags.boolean({char: 'p'}),
    all: flags.boolean({char: 'a', default: true, exclusive: ['push', 'fetch']}),
  }

  static args = [{name: 'name', required: true}, {name: 'path', required: true}]

  async run() {
    const {args, flags} = this.parse(RemoteAdd)

    // create new project adapter
    const project = new XPSProject()

    // get reference
    await project.init()

    // set remotes
    if (flags.fetch || flags.all) {
      await project.setRemotes(args.name, args.path, 'fetch')
      this.log(`${args.name}  ${args.path}  (fetch)`)
    }

    if (flags.push || flags.all) {
      await project.setRemotes(args.name, args.path, 'pull')
      this.log(`${args.name}  ${args.path}  (fetch)`)
    }
  }
}
