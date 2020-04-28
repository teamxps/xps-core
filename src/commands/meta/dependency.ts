import {Command, flags} from '@oclif/command'
import {getDependencies} from '../../helpers/general/dependency'

export default class MetaDependency extends Command {
  static description = 'List the dependencies for an entry file'

  static aliases = ['meta:dep', 'meta:dependency']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [{name: 'file', required: true}]

  async run() {
    const {args} = this.parse(MetaDependency)

    const dependencies = await getDependencies(args.file).then(d => JSON.stringify(d))
    this.log(dependencies)
  }
}
