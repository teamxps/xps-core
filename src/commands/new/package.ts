import {Command, flags} from '@oclif/command'
import {prompt} from 'enquirer'
import {projectExists} from '../../helpers/project/validation'
import * as low from 'lowdb'
import * as FileAsync from 'lowdb/adapters/FileAsync'
import * as path from 'path'
import * as fs from 'fs-extra'
import {initDatabase} from '../../helpers/project/setup'
import XPSProject from '../../helpers/project/adapter'

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
