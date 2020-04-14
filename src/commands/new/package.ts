import {Command, flags} from '@oclif/command'
import {prompt} from 'enquirer'

export default class NewPackage extends Command {
  static description = 'describe the command here'

  static aliases = ['new:pkg', 'new:mod', 'new:module']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [{name: 'dirname'}]

  async run() {
    const {args, flags} = this.parse(NewPackage)
    // check for project

    const response = await prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is the module name?',
      },
      {
        type: 'input',
        name: 'description',
        message: 'What is the module description?',
      },
      {
        type: 'input',
        name: 'entry',
        message: 'Entry file?',
        initial: 'index.js',
      },
    ])
  }
}
