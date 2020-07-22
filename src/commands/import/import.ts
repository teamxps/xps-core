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

   static args = [{
     name: 'remoteName',
     default: 'origin',
   }]

   async run() {
     const {args, flags} = this.parse(Import)

     // create new project adapter
     const project = new XPSProject()

     // get reference
     await project.init()

     // interactive select
     if (flags.interactive) {
       // get remotes with fetch
       const remote = await project.getRemote(args.remoteName)

       const remoteProj = new XPSProject()
       await remoteProj.init({projectDir: remote.fetch})

       this.log('FOUND REMOTE! FETCHING>>>>')

       // get components
       const choices = await remoteProj.getComponentNames()
       if (choices) {
         const prompt = new MultiSelect({
           name: 'value',
           message: 'Select components to import\nPress space to toggle components, Press enter to submit',
           choices: choices.map(c => ({name: c, value: c})),
         })
         const imported = await prompt.run()
         await project.transplantComponents(remoteProj, imported, args.remoteName)
       }
     }
   }
}
