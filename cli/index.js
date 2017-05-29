#! /usr/bin/env node

'use strict'

const generators = require('./generators')
const meow = require('meow')
const cli = meow(`
Usage
  $ hello <name>
  $ hello new <name>
  $ hello new <app|controller|model|view|migration|scaffold|user> <name>
  $ hello migrate <up|down>

Options
  --empty, -e  Generate the controller/model/migration without any contents

Examples
  $ hello blog
  $ hello new scaffold BlogPosts
  $ hello migrate
`)

// If no arguments are passed, show help
if (cli.input.length === 0) {
  cli.showHelp(0)
}

console.log('👋')
run(cli.input[0], cli.input[1], cli.input[2], cli.flags)

/**
 * Handle the cli input
 *
 * @param {String} action - The action to perform (new, generate)
 * @param {String} command - The command to pass to the generator or migrator
 * @param {String} name - The name of the item to create, if any
 * @param {Object} flags - The flags/options passed to the command line
 */
function run (action, command, name, flags) {
  switch (action) {
    case 'new':
    case 'generate':
    case 'g':
      generate(command, name, flags)
      break
    case 'migrate':
      migrate(command || 'up')
      break
    case 'up':
      migrate('up')
      break
    case 'down':
    case 'rollback':
      migrate('down')
      break
    default:
      run('new', 'app', action, flags)
  }
}

/**
 * Run a given generator
 *
 * @param {String} generatorName - The name of the generator to run
 * @param {String} name - The name of the generated item
 * @param {Object} flags - The flags passed to the generator
 */
function generate (generatorName, name, flags) {
  let generator

  switch (generatorName) {
    case 'app':
      generator = new generators.App(name)
      break
    case 'controller':
      generator = new generators.Controller(name, flags)
      break
    case 'model':
      generator = new generators.Model(name, flags)
      break
    case 'view':
      console.log(`generating view ${name}`)
      break
    case 'migration':
      generator = new generators.Migration(name, flags)
      break
    case 'scaffold':
      console.log(`generating scaffold ${name}`)
      break
    case 'user':
      console.log(`generating user ${name}`)
      break
    default:
      if (!name) {
        return generate('app', generator)
      }
  }

  if (!generator) {
    return cli.showHelp(0)
  }

  return generator.run()
}

/**
 * Run the migrations in a given direction.
 *
 * @param {String} direction - The direcation to run, can be 'up' or 'down'
 */
function migrate (direction) {
  if (direction !== 'up' || direction !== 'down') {
    return cli.showHelp(0)
  }

  console.log(`running migration ${direction}`)
}