const path = require('path')

const { merge } = require('webpack-merge')
const config = require('./webpack.config')
const jsfiles = await glob('**/*.js', { ignore: 'node_modules/**' })

module.exports = merge(config, {
  mode: 'production',

  output: {
    path: path.join(__dirname, 'public')
  }
})
