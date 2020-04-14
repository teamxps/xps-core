import {lookup} from '../general/fs-helper'
import * as Constants from './constants'
import * as low from 'lowdb'
import * as FileAsync from 'lowdb/adapters/FileAsync'

interface ProjectExistsOptions {
  startDir?: string;
  current?: boolean; // only look in current directory
}

// check if a project exists, if so return it's path, else null
export function projectExists(opts: ProjectExistsOptions = {}) {
  return lookup(Constants.XPS_PROJECT_DIR, (opts.startDir) ? opts.startDir : process.cwd(), (opts.current) ? 1 : undefined)
}
