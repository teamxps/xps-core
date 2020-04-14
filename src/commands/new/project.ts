import {Command, flags} from '@oclif/command'
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
    // check for project exists
    const projExists = await projectExists({startDir: args.dirname, current: true})
    if (projExists) {
      this.error('an xps project already exists in this directory')
    }

    // setup main json file
    await initJSON(path.resolve(args.dirname, XPS_PROJECT_DIR))

    this.log('successfully created a new xps project')
  }
}
