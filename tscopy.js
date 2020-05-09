#!/usr/bin/env node
/* eslint-disable no-console */

// Script by https://gist.github.com/dchambers!

const process = require('process')
const { readFileSync, existsSync, lstatSync } = require('fs')
const { join } = require('path')
const cpy = require('cpy')

const exit = msg => {
  console.error(msg)
  process.exit(1)
}

const isDirectory = path => existsSync(path) && lstatSync(path).isDirectory()

const parentDir = path => path.replace(/\/[^/]*$/, '')

const tsConfigPath = path => {
  const absolutePath = join(process.cwd(), path)

  return isDirectory(absolutePath)
    ? join(absolutePath, 'tsconfig.json')
    : absolutePath
}

const readJson = path => {
  if (!existsSync(path)) {
    exit(`Error: File not found '${path}'.`)
  }

  try {
    return JSON.parse(readFileSync(path).toString())
  } catch (error) {
    return exit(`Error: Unable to parse '${path}'\n\n${error}`)
  }
}

const tsCopy = async () => {
  const configPath = tsConfigPath(process.argv[2] || '.')
  const isVerbose = process.argv[3] === '-v' || process.argv[3] === '--verbose'
  const tsConfig = readJson(configPath)

  if (!tsConfig.references) {
    exit(`Error: No project references in '${configPath}'.`)
  }

  if (isVerbose) {
    console.log('Copying ancillary TypeScript project files:')
  }

  const projects = tsConfig.references.map(r => r.path)

  await Promise.all(
    projects.map(async project => {
      const projectConfigPath = join(parentDir(configPath), project)
      const tsProjectConfig = readJson(projectConfigPath)
      const srcDir = join(parentDir(configPath), project, '../src')
      const outDir = join('..', tsProjectConfig.compilerOptions.outDir, 'src')

      try {
        if (isVerbose) {
          console.log(`- ${srcDir} -> ${outDir}`)
        }

        await cpy(['**/*', '!**/*.{ts,tsx,js,jsx}'], outDir, {
          cwd: srcDir,
          parents: true,
        })
      } catch (e) {
        // NOTE: it throws if there's nothing to copy, so this is normally harmless
        if (isVerbose) {
          console.error(`Error: ${e.message}`)
        }
      }
    })
  )
}

tsCopy()
