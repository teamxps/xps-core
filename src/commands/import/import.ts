import {Command, flags} from '@oclif/command'
import XPSProject from '../../helpers/project/adapter'
const {MultiSelect} = require('enquirer')

export default class Import extends Command {
  static description = 'Add a remote to the project'

  static aliases = ['import']

  static flags = {
    help: flags.help({char: 'h'}),
    interactive: flags.boolean({char: 'i', default: true}),
  }

  // static args = []

  async run() {
    const {args, flags} = this.parse(Import)

    // create new project adapter
    const project = new XPSProject()

    // get reference
    await project.init()

    // interactive select
    if (flags.interactive) {
      // get remotes with fetch
      const remotes = await project.getRemotes()
      const keys = Object.keys(remotes)

      for (let i = 0; i < keys.length; i++) {
        if (remotes[keys[i]].fetch) {
          const remoteProj = new XPSProject()
          // eslint-disable-next-line no-await-in-loop
          await remoteProj.init(remotes[keys[i]].fetch)
        }
      }

      console.log(remotes)
    }
  }
}
