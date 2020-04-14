const fs = require('fs-extra')
const path = require('path')

// looks for a path in the current and parent directories up to a given level
export async function lookup(objpath: string, startDir: string = process.cwd(), level = 100) {
  let currentPath = startDir
  let pathExists

  for (let i = 0; i < level; i++) {
    const currentExists = await fs.pathExists(currentPath)
    if (!currentExists || currentPath === path.resolve(currentPath, '../'))
      return

    pathExists = await fs.pathExists(path.resolve(currentPath, objpath))
    currentPath = path.resolve(currentPath, '../')

    if (pathExists)
      return path.resolve(currentPath, objpath)
  }
}

