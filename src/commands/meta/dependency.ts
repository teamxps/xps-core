import {Command, flags} from '@oclif/command'
import {getDependencies} from '../../helpers/general/dependency'

export default class MetaDependency extends Command {
  static description = 'describe the command here'

  static aliases = ['meta:dep']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [{name: 'file', required: true}]

  async run() {
    const {args, flags} = this.parse(MetaDependency)

    const dependencies = await getDependencies(args.file).then(d => JSON.stringify(d))
    this.log(dependencies)
  }
}
