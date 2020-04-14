import {Command, flags} from '@oclif/command'
import {prompt} from 'enquirer'
import {projectExists} from '../../helpers/project/validation'
import * as low from 'lowdb'
import * as FileAsync from 'lowdb/adapters/FileAsync'
import * as path from 'path'
import {initDatabase} from '../../helpers/project/setup'

interface PackageXPSJson {
  name: string;
  description?: string;
  entry: string;
}

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
    const projExists = await projectExists()
    if (!projExists) {
      this.error('could not find an .xps project in this or any parent folders')
    }

    const xpsjson = path.resolve(projExists, 'xps.json')
    console.log(xpsjson)

    // get projDB
    const projDB = await low(new FileAsync(xpsjson))

    // interactive prompt
    const response: PackageXPSJson = await prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is the module name?',
        validate: async value => { // check so name is unique
          const val = await projDB.find(`components.${value}`).value()
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

    // create new packageDB
    const packageDB = await low(new FileAsync(`${response.name}.xps.json`))

    // defaults
    await packageDB.defaults({
      name: response.name,
      description: response.description,
      entry: response.entry,
      version: '0.0.0',
    }).write()

    // init xps pkg DB
    await initDatabase(projExists, response.name)

    // write component into projDB
    await projDB.set(`components.${response.name}`, {location: process.cwd()}).write()
    const state = await projDB.getState()
    console.log(state)
  }
}
