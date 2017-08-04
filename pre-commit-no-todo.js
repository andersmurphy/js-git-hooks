#!/usr/local/bin/node

// Imports
const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

// Functional Helpers
const comp = (...fns) => seed => fns.reduceRight((acc, fn) => fn(acc), seed)
const map = fn => coll => coll.map(fn)
const some = pred => coll => coll.filter(pred).length > 0

// Script
const fileHasTodo = filePath =>
  fs.readFileSync(path.join(__dirname, filePath), 'utf8')
    .includes('TODO:')

const logIfFileHasTodo = filePath => {
  if(fileHasTodo('../../' + filePath.trim())) {
    console.log('File has TODO: ' + filePath)
    return true
  } else {
    return false
  }
}

const exitIfTrue = pred => {
  if(pred) process.exit(1)
}

exec('git diff --name-only --cached',
  (error, stdout, stderr) => comp(
    exitIfTrue,
    some(e => e === true),
    map(logIfFileHasTodo),
    s => s.split("\n"),
    s => s.trim())
  (stdout))
