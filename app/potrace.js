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
const fs = require('fs')
const path = require('path')
const convert = path.join(__dirname, 'assets/convert.exe')
const potrace = path.join(__dirname, 'assets/potrace.exe')

const imageSign = {
  'BMP': [ 0x42, 0x4d ],
  'PNG': [ 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a ],
  'JPG': [ 0xff, 0xd8, 0xff ],
  'GIF': [ 0x47, 0x49, 0x46, 0x38, [0x37, 0x39], 0x61 ],
  'TGA': [ 0x00, 0x00, [0x02, 0x10], 0x00, 0x00 ],
  'PCX': [ 0x0A ],
  'ICO': [ 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x20, 0x20 ],
  'CUR': [ 0x00, 0x00, 0x02, 0x00, 0x01, 0x00, 0x20, 0x20 ],
  'IFF': [ 0x46, 0x4f, 0x52, 0x4d ],
  'ANI': [ 0x52, 0x49, 0x46, 0x46 ],
  'TIF': [ 0x49, 0x49 ],
  'TIFF': [ 0x4d, 0x4d ],
}

module.exports = class {

  // Convert image to portable pixmap
  loadImage(src) {
    try {
      this.src = src
      this.pixmap = execFileSync(convert, [src, '-alpha', 'Remove', 'pgm:-'], { encoding: 'binary' })
    } catch (e) {
      this.onerror && this.onerror('Unsupported image file')
      this.pixmap = null
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

  /**
   * Gets real image format
   * Reference: https://github.com/NorgannasAddOns/node-imageinfo
   */
  getFormat() {
    const data = fs.readFileSync(this.src)
    for (let format in imageSign) {
      if (this._checkSign(data, 0, imageSign[format])) return format
    }

    let extname = this.src.substring(this.src.lastIndexOf('.') + 1)
    extname = extname ? extname.toUpperCase() : null
    return extname || 'UNKOWN'
  }

  _checkSign(buffer, offset, sig) {
    const len = sig.length
    for (let i = 0; i < len; i++) {
      let b = buffer[i + offset], s = sig[i], m = false

      if ('number' == typeof s) {
        m = s === b
      } else {
        for (let k in s) {
          let o = s[k]
          if (o === b) m = true
        }
      }
      if (!m) return false
    }
    return true
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

      case 'unit':
        if (!isFinite(value) || value <= 0)
        throw 'Option "' + key + '" must be a positive number'
        break

      case 'alphamax':
      case 'turdsize':
      case 'opttolerance':
        if (!isFinite(value) || value < 0)
        throw 'Option "' + key + '" must be greater than 0'
        break

      default: break
    }
  }

}
