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
* [Usage](#usage)
* [Commands](#commands)
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
# Commands
<!-- commands -->
* [`xps hello [FILE]`](#xps-hello-file)
* [`xps help [COMMAND]`](#xps-help-command)

## `xps hello [FILE]`

describe the command here

```
USAGE
  $ xps hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ xps hello
  hello world from ./src/hello.ts!
```

_See code: [src\commands\hello.ts](https://github.com/teamxps/xps/blob/v0.0.0/src\commands\hello.ts)_

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
<!-- commandsstop -->
