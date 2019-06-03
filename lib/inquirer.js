const inquirer = require('inquirer')
const files = require('./files')

exports.getGithubCredentials = () => {
  const questions = [
    {
      name: 'username',
      type: 'input',
      message: 'Enter your Github username or email address:',
      validate: value => {
        if (value.length) {
          return true
        } else {
          return 'Please enter your username or email address'
        }
      }
    },
    {
      name: 'password',
      type: 'password',
      message: 'Enter your password:',
      validate: value => {
        if (value.length) {
          return true
        } else {
          return 'Please enter your password'
        }
      }
    }
  ]
  return inquirer.prompt(questions)
}

exports.getRepoDetails = () => {
  const argv = require('minimist')(process.argv.slice(2))

  const questions = [
    {
      type: 'input',
      name: 'name',
      message: 'Enter a name for the repository:',
      default: argv._[0] || files.getCurrentDirectory(),
      validate: value => {
        if (value.length) {
          return true
        } else {
          return 'Please enter a name for the repository'
        }
      }
    },
    {
      type: 'input',
      name: 'description',
      message: 'Enter a description for the repository:'
    },
    {
      type: 'list',
      name: 'visibility',
      message: 'Public or private?:',
      choices: ['public', 'private'],
      default: 'public'
    }
  ]
  return inquirer.prompt(questions)
}

exports.getFilesToIgnore = filelist => {
  const questions = [
    {
      type: 'checkbox',
      name: 'ignore',
      message: 'Select the files and/or folders you wish to ignore:',
      choices: filelist,
      default: ['node_modules', 'bower_components', '.env']
    }
  ]
  return inquirer.prompt(questions)
}
