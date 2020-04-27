# @teamxps/xps
### Build and distribute reusuable exposed modules

## Thinking of Contributing?
### Read the [contributions guide](docs/CONTRIBUTIONS.md) first!
============


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@teamxps/xps.svg)](https://npmjs.org/package/@teamxps/xps)
[![Downloads/week](https://img.shields.io/npm/dw/@teamxps/xps.svg)](https://npmjs.org/package/@teamxps/xps)
[![License](https://img.shields.io/npm/l/@teamxps/xps.svg)](https://github.com/teamxps/xps/blob/master/package.json)

<!-- toc -->
* [@teamxps/xps](#teamxpsxps)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
<!-- tocstop -->

# Usage
<!-- usage -->
```sh-session
$ npm install -g @teamxps/xps
$ xps COMMAND
running command...
$ xps (-v|--version|version)
@teamxps/xps/0.0.0 win32-x64 node-v12.13.0
$ xps --help [COMMAND]
USAGE
  $ xps COMMAND
...
```
<!-- usagestop -->
<!-- usagestop -->
# Commands
<!-- commands -->
* [`xps help [COMMAND]`](#xps-help-command)
* [`xps meta:dependency FILE`](#xps-metadependency-file)
* [`xps new:package [DIRNAME]`](#xps-newpackage-dirname)
* [`xps new:project [DIRNAME]`](#xps-newproject-dirname)
* [`xps snapshot:all [PKGNAME]`](#xps-snapshotall-pkgname)
* [`xps snapshot:status PKGNAME`](#xps-snapshotstatus-pkgname)

## `xps help [COMMAND]`

display help for xps

```
USAGE
  $ xps help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src\commands\help.ts)_

## `xps meta:dependency FILE`

List the dependencies for an entry file

```
USAGE
  $ xps meta:dependency FILE

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ xps meta:dep
```

_See code: [src\commands\meta\dependency.ts](https://github.com/teamxps/xps/blob/v0.0.0/src\commands\meta\dependency.ts)_

## `xps new:package [DIRNAME]`

Create a new xps pkg tracker

```
USAGE
  $ xps new:package [DIRNAME]

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ xps new:pkg
  $ xps new:mod
  $ xps new:module
```

_See code: [src\commands\new\package.ts](https://github.com/teamxps/xps/blob/v0.0.0/src\commands\new\package.ts)_

## `xps new:project [DIRNAME]`

Create a new xps project

```
USAGE
  $ xps new:project [DIRNAME]

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ xps new:proj
  $ xps new:project
```

_See code: [src\commands\new\project.ts](https://github.com/teamxps/xps/blob/v0.0.0/src\commands\new\project.ts)_

## `xps snapshot:all [PKGNAME]`

Create a package snapshot of all file changes

```
USAGE
  $ xps snapshot:all [PKGNAME]

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ xps snap:all
```

_See code: [src\commands\snapshot\all.ts](https://github.com/teamxps/xps/blob/v0.0.0/src\commands\snapshot\all.ts)_

## `xps snapshot:status PKGNAME`

Show the status of snapshot changes

```
USAGE
  $ xps snapshot:status PKGNAME

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ xps snap:all
```

_See code: [src\commands\snapshot\status.ts](https://github.com/teamxps/xps/blob/v0.0.0/src\commands\snapshot\status.ts)_
<!-- commandsstop -->
<!-- commandsstop -->
