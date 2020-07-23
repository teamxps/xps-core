/* eslint-disable no-await-in-loop */
import {Command, flags} from '@oclif/command'
import XPSProject from '../../helpers/project/adapter'

export default class Fetch extends Command {
  static description = 'describe the command here'

  static aliases = ['fetch']

  static flags = {
    help: flags.help({char: 'h'}),
    interactive: flags.boolean({char: 'i', default: true}),
  }

   static args = [{
     name: 'remoteName',
     default: 'origin',
   }]

   async run() {
     const {args, flags} = this.parse(Fetch)

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
       const components = await remoteProj.getComponentNames()

       for (let i = 0; i < components.length; i++) {
         this.log(`COMPONENT ID: ${components[i]}`)
         // get current ref
         const localRef = await project.getPkgRef(components[i])
         // get remote ref
         const remoteRef = await remoteProj.getPkgRef(components[i])
         // gen diff
         const diffs = await localRef.compareChanges(remoteRef)
         if (diffs.fileChanges.additions.length > 0 || diffs.fileChanges.removals.length > 0 || diffs.fileChanges.modifications.length > 0 ||
          diffs.npmChanges.additions.length > 0 || (diffs.npmChanges as any).removals.length > 0) {
           this.log(`NEW CHANGES FROM ${args.remoteName}`)
           this.log(localRef.displayChangesObj(diffs) + '\n')
         } else {
           this.log('NO CHANGES \n')
         }
       }
     }
   }
}
