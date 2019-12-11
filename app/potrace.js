/**
 * --------------------------------------------------------
 * Imagemagick convert and Potrace class
 *
 * Author: Aichen
 * Copyright (c) 2019 Cloudseat.net
 *
 * References:
 * http://www.imagemagick.org/script/convert.php
 * http://potrace.sourceforge.net/README
 * http://potrace.sourceforge.net/potrace.html
 * --------------------------------------------------------
 */

const { execFile, execFileSync } = require('child_process')
const path = require('path')
const convert = path.join(__dirname, 'assets/convert.exe')
const potrace = path.join(__dirname, 'assets/potrace.exe')

module.exports = class {

  loadImage(src) {
    try {
      // Convert image to portable pixmap
      this.pixmap = execFileSync(convert, [src, '-alpha', 'Remove', 'pgm:-'], { encoding: 'binary' })
    } catch (e) {
      alert('Convert to portable image failed')
    }
  }

  toSvg(options, callback) {
    if (!this.pixmap) return
    if (callback === undefined) {
      callback = options
      options = undefined
    }

    try {
      const args = this._parseArgs(options)
      console.log(args)
      const process = execFile(potrace, ['-', ...args, '-s', '-o', '-'], callback)
      process.stdin.write(this.pixmap, 'binary')
    } catch (err) {
      alert(err)
    }
  }

  _parseArgs(options) {
    let args = []
    options && Object.keys(options).forEach(key => {
      let value = (options[key]).trim()
      if (value && value.toUpperCase() !== 'FALSE') {
        if (value === true || value.toUpperCase() === 'TRUE') {
          args.push('--' + key)
        } else {
          this._verifyArgs(key, value)
          args.push('--' + key, value)
        }
      }
    })
    return args
  }

  _verifyArgs(key, value) {
    switch (key) {
      case 'color':
      case 'fillcolor':
        if (!/^#[0-9A-F]{6}$/i.test(value))
        throw 'Option "' + key + '" must be a hex color value'
        break

      case 'blacklevel':
        if (!isFinite(value) || value < 0 || value > 1)
        throw 'Option "' + key + '" must be a number in range 0..1'
        break

      case 'alphamax':
      case 'turdsize':
      case 'unit':
      case 'opttolerance':
        if (!isFinite(value) || value < 0)
        throw 'Option "' + key + '" must be a positive number'
        break

      default: break
    }
  }

}
