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
* [`xps import:import`](#xps-importimport)
* [`xps init:package`](#xps-initpackage)
* [`xps init:project [DIRNAME]`](#xps-initproject-dirname)
* [`xps meta:dependency FILE`](#xps-metadependency-file)
* [`xps meta:hashobject [HASH]`](#xps-metahashobject-hash)
* [`xps remote:add NAME PATH TYPE`](#xps-remoteadd-name-path-type)
* [`xps remote:delete NAME TYPE`](#xps-remotedelete-name-type)
* [`xps remote:get`](#xps-remoteget)
* [`xps scope:select`](#xps-scopeselect)
* [`xps snapshot:all [PKGNAME]`](#xps-snapshotall-pkgname)
* [`xps snapshot:status [PKGNAME]`](#xps-snapshotstatus-pkgname)

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

## `xps import:import`

Add a remote to the project

```
USAGE
  $ xps import:import

OPTIONS
  -h, --help         show CLI help
  -i, --interactive

ALIASES
  $ xps import
```

_See code: [src\commands\import\import.ts](https://github.com/teamxps/xps/blob/v0.0.0/src\commands\import\import.ts)_

## `xps init:package`

Create a new xps package

```
USAGE
  $ xps init:package

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ xps init:pkg
  $ xps init:package
```

_See code: [src\commands\init\package.ts](https://github.com/teamxps/xps/blob/v0.0.0/src\commands\init\package.ts)_

## `xps init:project [DIRNAME]`

Create a new xps project

```
USAGE
  $ xps init:project [DIRNAME]

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ xps init
  $ xps init:proj
  $ xps init:project
```

_See code: [src\commands\init\project.ts](https://github.com/teamxps/xps/blob/v0.0.0/src\commands\init\project.ts)_

## `xps meta:dependency FILE`

List the dependencies for an entry file

```
USAGE
  $ xps meta:dependency FILE

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ xps meta:dep
  $ xps meta:dependency
```

_See code: [src\commands\meta\dependency.ts](https://github.com/teamxps/xps/blob/v0.0.0/src\commands\meta\dependency.ts)_

## `xps meta:hashobject [HASH]`

Gives the file content for a corresponding hashobject

```
USAGE
  $ xps meta:hashobject [HASH]

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ xps meta:hashobj
  $ xps meta:hashobject
```

_See code: [src\commands\meta\hashobject.ts](https://github.com/teamxps/xps/blob/v0.0.0/src\commands\meta\hashobject.ts)_

## `xps remote:add NAME PATH TYPE`

Add a remote to the project

```
USAGE
  $ xps remote:add NAME PATH TYPE

OPTIONS
  -h, --help  show CLI help
```

_See code: [src\commands\remote\add.ts](https://github.com/teamxps/xps/blob/v0.0.0/src\commands\remote\add.ts)_

## `xps remote:delete NAME TYPE`

Delete a remote or its properties

```
USAGE
  $ xps remote:delete NAME TYPE

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ xps remote:delete
  $ xps remote:del
```

_See code: [src\commands\remote\delete.ts](https://github.com/teamxps/xps/blob/v0.0.0/src\commands\remote\delete.ts)_

## `xps remote:get`

Output remote information

```
USAGE
  $ xps remote:get

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ xps remote:get
  $ xps remote
```

_See code: [src\commands\remote\get.ts](https://github.com/teamxps/xps/blob/v0.0.0/src\commands\remote\get.ts)_

## `xps scope:select`

Select the project tracking scope

```
USAGE
  $ xps scope:select

OPTIONS
  -a, --all
  -h, --help         show CLI help
  -i, --interactive

ALIASES
  $ xps scope
```

_See code: [src\commands\scope\select.ts](https://github.com/teamxps/xps/blob/v0.0.0/src\commands\scope\select.ts)_

## `xps snapshot:all [PKGNAME]`

Create a package snapshot of all file changes

```
USAGE
  $ xps snapshot:all [PKGNAME]

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ xps snapshot
  $ xps snap
```

_See code: [src\commands\snapshot\all.ts](https://github.com/teamxps/xps/blob/v0.0.0/src\commands\snapshot\all.ts)_

## `xps snapshot:status [PKGNAME]`

Show the status of snapshot changes

```
USAGE
  $ xps snapshot:status [PKGNAME]

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ xps snap:status
  $ xps snapshot:status
  $ xps status
```

_See code: [src\commands\snapshot\status.ts](https://github.com/teamxps/xps/blob/v0.0.0/src\commands\snapshot\status.ts)_
<!-- commandsstop -->
<!-- commandsstop -->
