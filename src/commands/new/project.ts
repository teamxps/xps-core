import {Command, flags} from '@oclif/command'
import {projectExists} from '../../helpers/project/validation'
import {initJSON} from '../../helpers/project/setup'

export default class NewProject extends Command {
  static description = 'describe the command here'

  static aliases = ['new:proj', 'new:project']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [{name: 'dirname'}]

  async run() {
    const {args, flags} = this.parse(NewProject)
    // check for project exists
    const projExists = await projectExists({current: true})
    if (projExists) {
      this.error('an xps project already exists in this directory')
    }

    // setup main json file
    await initJSON()

    this.log('successfully created a new xps project')
  }
}
