import {Command, flags} from '@oclif/command'
import XPSProject from '../../helpers/project/adapter'

export default class InitProject extends Command {
  static description = 'Create a new xps project'

  static aliases = ['init', 'init:proj', 'init:project']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [{name: 'dirname'}]

  async run() {
    const {args} = this.parse(InitProject)

    // create new project from adapter
    const project = new XPSProject()
    // init xps.json and dir
    await project.createNewProject(args.dirname)
    await project.init()
    await project.setScope('all', true)

    this.log('successfully created a new xps project')
  }
}
