import {Command, flags} from '@oclif/command'
import XPSProject from '../../helpers/project/adapter'
import {projectExists} from '../../helpers/project/validation'
import {initJSON} from '../../helpers/project/setup'
import * as path from 'path'
import {XPS_PROJECT_DIR} from '../../helpers/project/constants'

export default class NewProject extends Command {
  static description = 'Create a new xps project'

  static aliases = ['new:proj', 'new:project']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [{name: 'dirname'}]

  async run() {
    const {args, flags} = this.parse(NewProject)

    // create new project from adapter
    const project = new XPSProject()
    // init xps.json and dir
    await project.createNewProject(args.dirname)

    this.log('successfully created a new xps project')
  }
}
