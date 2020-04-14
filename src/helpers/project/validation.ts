import {lookup} from '../general/fs-helper'
import * as Constants from './constants'

// check if a project exists, if so return it's path, else null
export function projectExists(startDir: string = process.cwd()) {
  return lookup(Constants.XPS_PROJECT_DIR, startDir)
}
