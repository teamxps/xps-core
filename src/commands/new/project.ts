import {Command, flags} from '@oclif/command'

export default class NewProject extends Command {
  static description = 'describe the command here'

  static aliases = ['new:proj']

  static flags = {
    help: flags.help({char: 'h'}),
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'dirname'}]

  async run() {
    const {args, flags} = this.parse(NewProject)
    if (args.dirname) {

    }
  }
}
