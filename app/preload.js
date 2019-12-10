/**
 * --------------------------------------------------------
 * Preload and Enhancements
 *
 * All of the Node.js APIs are available in the preload process.
 * It has the same sandbox as a Chrome extension.
 *
 * Author: Aichen
 * Copyright (c) 2019 Cloudseat.net
 * --------------------------------------------------------
 */

window.addEventListener('DOMContentLoaded', () => {

  // Create elements for alert
  const message = $('<div class="message"><div></div></div>')
  message.content = message.$('div')
  document.body.appendChild(message)

  // Create elements for loading
  const loading = $('<div class="loading"><div class="loader"></div><div class="pointer"></div></div>')
  loading.pointer = loading.$('.pointer')
  document.body.appendChild(loading)

  // Integrate into window
  Object.assign(window, {
    alert(text) {
      message.content.innerHTML = text
      message.content.classList.add('visible')

      // Auto hide
      if (message.timer) clearTimeout(message.timer)
      message.timer = setTimeout(function() {
        message.content.classList.remove('visible')
      }, 3000)
    },

    loading(progress) {
      if (progress === false || progress === 100) {
        loading.style.display = 'none'
        loading.pointer.innerHTML = ''
      } else {
        loading.style.display = 'block'
        loading.pointer.innerHTML = Number.isInteger(progress) ? progress : ''
      }
    }
  })

})

/* --------------------------------------------------------
 * Window Enhancements
 * ----------------------------------------------------- */

Object.assign(window, {

  $(selector) {
    selector = selector.replace('/\n/mg', '').trim()
    if (selector.startsWith('<')) {
      return document.createRange().createContextualFragment(selector).firstChild
    }
    return document.querySelector(selector)
  },

})

/* --------------------------------------------------------
 * Element Enhancements
 * ----------------------------------------------------- */

Object.assign(Element.prototype, {
  $(selector) {
    return this.querySelector(selector)
  }
})
