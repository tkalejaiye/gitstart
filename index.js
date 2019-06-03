#!/usr/bin/env node

const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const Configstore = require('configstore')
const conf = new Configstore('gitstart')

const files = require('./lib/files')
const inquirer = require('./lib/inquirer')
const github = require('./lib/github')
const repo = require('./lib/repo')

clear()
console.log(
  chalk.yellow(figlet.textSync('Gitstart', { horizontalLayout: 'full' }))
)

// Check if git repo already exists
if (files.directoryExists('.git')) {
  console.log(chalk.red('Already a git repository!'))
  process.exit()
}

const getGithubToken = async () => {
  // Fetch token from store
  let token = github.getGithubToken()

  if (token) {
    return token
  }

  await github.setGithubCredentials()

  token = await github.registerNewToken()
  return token
}

// If no git repo, get user's git credentials
const run = async () => {
  try {
    // Retrieve & Set Auth Token
    const token = await getGithubToken()
    github.githubAuth(token)

    // Create remote repo
    const url = await repo.createRemoteRepo()

    // Create gitignore
    await repo.createGitignore()

    // Set up local repo & push to remote
    const done = await repo.setupRepo(url)

    if (done) {
      console.log(
        chalk.green('Local & remote repositories successfully initialized!')
      )
    }
  } catch (err) {
    if (err) {
      switch (err.status) {
        case 401:
          console.log(
            chalk.red(
              "Couldn't log you in. Please provide correct credentials/token"
            )
          )
          break
        case 422:
          console.log(
            chalk.red('There already exists a remote repository with that name')
          )
          break
        default:
          console.log(err)
      }
    }
  }
}

run()
