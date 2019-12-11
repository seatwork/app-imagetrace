/**
 * --------------------------------------------------------
 * Renderer Process
 * Author: Aichen
 * Copyright (c) 2019 Cloudseat.net
 * --------------------------------------------------------
 */

const fs = require('fs')
const Potrace = require('./potrace')
const { dialog } = require('electron').remote

const openBtn = $('button.open')
const exportBtn = $('button.export')
const resetBtn = $('button.reset')
const image = $('img')
const result = $('.right')

const options = {}
const potrace = new Potrace()

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
    image.src = filePaths[0]
    potrace.loadImage(filePaths[0])
    resetBtn.onclick()
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

resetBtn.onclick = function() {
  resetElements()
  Object.keys(options).forEach(key => delete options[key])
  vectorize()
}

/* --------------------------------------------------------
 * Element Events
 * ----------------------------------------------------- */

const form = document.querySelectorAll('input, select')
form.forEach(element => {
  let key = element.id, value

  if (element.tagName == 'SELECT') {
    element.onchange = function() {
      options[key] = this.options[this.selectedIndex].value
      vectorize()
    }
  } else {
    element.onblur = function() {
      options[key] = this.value
      vectorize()
    }
  }
})

function resetElements() {
  form.forEach(element => {
    let defValue = element.dataset.value
    if (element.tagName == 'SELECT') {
      element[defValue].selected = true
    } else {
      element.value = defValue || ''
    }
  })
}

/* --------------------------------------------------------
 * Private Methods
 * ----------------------------------------------------- */

function vectorize() {
  potrace.toSvg(options, function(err, svg) {
    if (err) {
      alert(err)
      exportBtn.disabled = true
    } else {
      // remove 'pt' units with width and height
      svg = svg.replace(/"([\d\.]+)pt"/g, '"$1"')
      result.innerHTML = image.svg = svg
      exportBtn.disabled = false
    }
  })
}
