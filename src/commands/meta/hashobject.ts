import {Command, flags} from '@oclif/command'
import XPSProject from '../../helpers/project/adapter'

export default class MetaHashobject extends Command {
  static description = 'Gives the file content for a corresponding hashobject'

  static aliases = ['meta:hashobj', 'meta:hashobject']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [{name: 'hash'}]

  async run() {
    const {args} = this.parse(MetaHashobject)
    // create new project adapter
    const project = new XPSProject()

    // get reference
    await project.init()

    // get value
    const content = await project.getObj(args.hash)
    this.log(content)
  }
}
