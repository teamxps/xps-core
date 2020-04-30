import {Command, flags} from '@oclif/command'
import XPSProject from '../../helpers/project/adapter'

export default class RemoteGet extends Command {
  static description = 'Output remote information'

  static aliases = ['remote:get', 'remote']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    this.parse(RemoteGet)

    // create new project adapter
    const project = new XPSProject()

    // get reference
    await project.init()

    const remotes = await project.getRemotes()
    Object.keys(remotes).forEach(remote => {
      this.log()
      if (remotes[remote].fetch) {
        this.log(`${remote}  ${remotes[remote].fetch}  (fetch)`)
      }

      if (remotes[remote].push) {
        this.log(`${remote}  ${remotes[remote].push}  (push)`)
      }
    })
  }
}

