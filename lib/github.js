const Octokit = require('@octokit/rest')
const Configstore = require('configstore')
const pkg = require('../package.json')
const _ = require('lodash')
const CLI = require('clui')
const Spinner = CLI.Spinner
const chalk = require('chalk')

const inquirer = require('./inquirer')
const conf = new Configstore(pkg.name)
let octokit

exports.getInstance = () => {
  return octokit
}

exports.getGithubToken = () => {
  return conf.get('github.token')
}

exports.setGithubCredentials = async () => {
  const credentials = await inquirer.getGithubCredentials()
  octokit = new Octokit({
    auth: credentials
  })
  return octokit
}

exports.registerNewToken = async () => {
  const status = new Spinner('Authenticating you, please wait...')
  status.start()

  try {
    const response = await octokit.oauthAuthorizations.createAuthorization({
      scopes: ['user', 'public_repo', 'repo', 'repo:status'],
      note: 'gitstart, the command-line tool for initializing Git repos'
    })

    const token = response.data.token

    if (token) {
      conf.set('github.token', token)
      return token
    } else {
      throw new Error('Missing Token', 'Github token not found in the response')
    }
  } catch (err) {
    throw err
  } finally {
    status.stop()
  }
}

exports.githubAuth = token => {
  octokit = new Octokit({
    auth: token
  })
}
