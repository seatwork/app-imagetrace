/**
 * --------------------------------------------------------
 * Renderer Process
 * Author: Aichen
 * Copyright (c) 2019 Cloudseat.net
 * --------------------------------------------------------
 */

const fs = require('fs')
const potrace = require('potrace')
const { dialog } = require('electron').remote

const openBtn = $('button.open')
const exportBtn = $('button.export')
const image = $('img')
const result = $('.right')
const params = {}

/* --------------------------------------------------------
 * Button Events
 * ----------------------------------------------------- */

openBtn.onclick = function() {
  const filePaths = dialog.showOpenDialogSync({
    properties: ['openFile'],
    filters: [
      { name: 'Image', extensions: ['png', 'jpg', 'jpeg', 'bmp']},
      { name: 'All Files', extensions: ['*'] }
    ]
  })
  if (filePaths && filePaths.length == 1) {
    image.src = image.path = filePaths[0]
    vectorize(params)
  }
}

exportBtn.onclick = function() {
  const filePath = dialog.showSaveDialogSync({
    filters: [{ name: 'SVG Image', extensions: ['svg']}]
  })
  if (filePath) {
    fs.writeFileSync(filePath, image.svg)
  }
}

/* --------------------------------------------------------
 * Parameter Events
 * ----------------------------------------------------- */

$('#turnPolicy').onchange = function() {
  const value = this.options[this.selectedIndex].value
  params[this.id] = value.toLowerCase()
  vectorize(params)
}

$('#optCurve').onchange = $('#blackOnWhite').onchange = function() {
  const value = this.options[this.selectedIndex].value
  params[this.id] = value === 'TRUE' ? true : false
  vectorize(params)
}

$('#optTolerance').oninput = function() {
  if (this.value) {
    if (!isFinite(this.value) || this.value < 0 || this.value > 1) {
      alert('Must be a number in range 0..1')
      return
    }
    params[this.id] = parseFloat(this.value)
  } else {
    delete params[this.id]
  }
  vectorize(params)
}

$('#threshold').oninput = function() {
  if (this.value) {
    if (!/^\d+$/.test(this.value) || this.value < 0 || this.value > 255) {
      alert('Must be a number in range 0..255')
      return
    }
    params[this.id] = parseInt(this.value)
  } else {
    delete params[this.id]
  }
  vectorize(params)
}

$('#turdSize').oninput = $('#alphaMax').oninput = function() {
  if (this.value) {
    if (!/^\d+$/.test(this.value)) {
      alert('Must be an integer value')
      return
    }
    params[this.id] = parseInt(this.value)
  } else {
    delete params[this.id]
  }
  vectorize(params)
}

$('#color').oninput = $('#background').oninput = function() {
  if (this.value) {
    if (!/^#?([0-9A-F]{6}|[0-9A-F]{3})$/i.test(this.value)) {
      alert('Must be a hex color value')
      return
    }
    params[this.id] = this.value.startsWith('#') ? this.value : '#' + this.value
  } else {
    delete params[this.id]
  }
  vectorize(params)
}

/* --------------------------------------------------------
 * Private Methods
 * ----------------------------------------------------- */

function vectorize(params) {
  console.log('params:', params)
  if (!image.path) return

  potrace.trace(image.path, params, function(err, svg) {
    if (err) {
      alert(err)
      exportBtn.disabled = true
    } else {
      result.innerHTML = image.svg = svg
      exportBtn.disabled = false
    }
  })
}
