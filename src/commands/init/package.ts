import {Command, flags} from '@oclif/command'
import {prompt} from 'enquirer'
import XPSProject from '../../helpers/project/adapter'

interface PackageXPSJson {
  name: string;
  description?: string;
  entry: string;
}

export default class InitPackage extends Command {
  static description = 'Create a new xps package'

  static aliases = ['init:pkg', 'init:package']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    this.parse(InitPackage)

    // create new project adapter
    const project = new XPSProject()

    // get reference
    await project.init()

    // interactive prompt
    const response: PackageXPSJson = await prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is the module name?',
        validate: async function (value): Promise<any> { // check so name is unique
          const val = await project.getDB().get('components').get(value).value()
          if (val) {
            return 'module name not unique'
          }
          return true
        },
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

    // attempt to add package to project ref
    await project.addPkg(response)
    this.log('successfully created new xps module')
  }
}
