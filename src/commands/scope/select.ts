import {Command, flags} from '@oclif/command'
import XPSProject from '../../helpers/project/adapter'
import * as _ from 'lodash'

export default class ScopeSelect extends Command {
  static strict = false

  static description = 'Select the project tracking scope'

  static aliases = ['scope']

  static flags = {
    help: flags.help({char: 'h'}),
    interactive: flags.boolean({
      char: 'i',
      default: true,
    }),
    all: flags.boolean({
      char: 'a',
      default: false,
    }),
  }

  async run() {
    const {flags} = this.parse(ScopeSelect)
    // create new project adapter
    const project = new XPSProject()

    // get reference
    await project.init()

    if (flags.all) {
      const scope = await project.setScope('all', true)
      return this.log(`Scope set to all components: ${scope}`)
    }

    // if null print out scope
    if (this.argv.length <= 0) {
      const scope = await project.getScope()
      return this.log(`Scope set to the following components: ${scope}`)
    }

    // get value
    // validate scope objects
    let valid = true
    for (let i = 0; i < this.argv.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      const ref = await project.getPkgRef(this.argv[i])
      if (!ref) {
        valid = false
      }
    }
    if (valid) {
      const scope = await project.setScope(_.uniq(this.argv))
      this.log(`Successfully set scope to ${scope}`)
    }
  }
}

