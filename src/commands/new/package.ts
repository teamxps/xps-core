import {Command, flags} from '@oclif/command'
import {prompt} from 'enquirer'
import {projectExists} from '../../helpers/project/validation'
import * as low from 'lowdb'
import * as FileAsync from 'lowdb/adapters/FileAsync'
import * as path from 'path'
import * as fs from 'fs-extra'
import {initDatabase} from '../../helpers/project/setup'

interface PackageXPSJson {
  name: string;
  description?: string;
  entry: string;
}

export default class NewPackage extends Command {
  static description = 'Create a new xps pkg tracker'

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

    // get projDB
    const projDB = await low(new FileAsync(path.resolve(projExists, 'xps.json')))

    // interactive prompt
    const response: PackageXPSJson = await prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is the module name?',
        validate: async function (value) { // check so name is unique
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

    // init xps pkg DB
    await initDatabase(projExists, response.name)

    // check if entry exists
    const entryExists = await fs.pathExists(response.entry)
    // if not create it
    if (!entryExists) {
      await fs.ensureFile(response.entry)
    }

    // write component into projDB
    await projDB.set(`components.${response.name}`,
      {
        name: response.name,
        description: response.description,
        version: '0.0.0',
        entry: path.relative(projExists, response.entry),
      }).write()
    this.log('successfully created new xps module')
  }
}
