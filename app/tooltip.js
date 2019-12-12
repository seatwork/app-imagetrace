/**
 * --------------------------------------------------------
 * Autoload Tooltips
 * Author: Aichen
 * Copyright (c) 2019 Cloudseat.net
 * --------------------------------------------------------
 */

window.addEventListener('DOMContentLoaded', function() {
  const tooltip = $('<div class="tooltip"></div>')
  document.body.appendChild(tooltip)

  const targets = document.querySelectorAll('[title]')
  if (!targets) return

  targets.forEach(target => {
    const title = target.getAttribute('title')
    target.removeAttribute('title')

    target.onmouseover = function(e) {
      this.timer = setTimeout(() => {
        tooltip.innerHTML = title
        tooltip.style.top = (this.offsetTop + 35) + 'px'
        tooltip.style.display = 'block'
      }, 300)
    }
    target.onmouseout = function() {
      clearTimeout(this.timer)
      tooltip.innerHTML = ''
      tooltip.style.display = 'none'
    }
  })

})
