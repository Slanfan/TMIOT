// ── Global tooltip ──
;(function () {
  var tip = document.getElementById('g-tooltip')
  var active = null

  function position(trigger) {
    var r = trigger.getBoundingClientRect()
    var pad = 8
    var tipW = tip.offsetWidth
    var tipH = tip.offsetHeight
    var left = r.left + r.width / 2 - tipW / 2
    var top  = r.top - tipH - 10
    if (top < pad) top = r.bottom + 10
    left = Math.max(pad, Math.min(left, window.innerWidth - tipW - pad))
    tip.style.left = left + 'px'
    tip.style.top  = top  + 'px'
  }

  var hideTimer = null

  function show(trigger) {
    clearTimeout(hideTimer)
    tip.innerHTML = trigger.getAttribute('data-tooltip')
    var hasLinks = trigger.hasAttribute('data-tooltip-allow-links')
    tip.classList.toggle('has-links', hasLinks)
    tip.style.display = 'block'
    position(trigger)
    active = trigger
  }

  function hide() {
    tip.style.display = 'none'
    active = null
  }

  function scheduleHide() {
    hideTimer = setTimeout(hide, 120)
  }

  document.querySelectorAll('.tooltip-trigger').forEach(function (el) {
    el.addEventListener('mouseenter', function () { show(el) })
    el.addEventListener('mouseleave', scheduleHide)
    el.addEventListener('click', function (e) {
      e.stopPropagation()
      active === el ? hide() : show(el)
    })
  })

  tip.addEventListener('mouseenter', function () { clearTimeout(hideTimer) })
  tip.addEventListener('mouseleave', scheduleHide)
  document.addEventListener('click', function () { hide() })
  window.addEventListener('scroll', function () { if (active) position(active) }, { passive: true })
})()

// ── Seamless marquee ──
;(function () {
  var track = document.querySelector('.marquee-track')
  var original = track && track.querySelector('.marquee-inner')
  if (!original) return
  var clone = original.cloneNode(true)
  clone.setAttribute('aria-hidden', 'true')
  track.appendChild(clone)
  var totalW = original.offsetWidth * 2
  track.style.width = totalW + 'px'
})()

// ── Countdown timer ──
function updateCountdown() {
  var target = new Date('2027-05-07T10:00:00+02:00').getTime()
  var diff = Math.max(0, target - Date.now())
  var days  = Math.floor(diff / 86400000)
  var hours = Math.floor((diff % 86400000) / 3600000)
  var mins  = Math.floor((diff % 3600000) / 60000)
  var secs  = Math.floor((diff % 60000) / 1000)
  document.getElementById('cd-days').textContent  = String(days).padStart(3, '0')
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0')
  document.getElementById('cd-mins').textContent  = String(mins).padStart(2, '0')
  document.getElementById('cd-secs').textContent  = String(secs).padStart(2, '0')
}
updateCountdown()
setInterval(updateCountdown, 1000)

// ── Visitor counter ──
fetch('https://api.counterapi.dev/v2/slanfans-team-4542/tmiot-site-visits/up')
  .then(function(r) { return r.json() })
  .then(function(d) {
    var count = (d.data && d.data.up_count) || 0
    document.getElementById('counter').textContent = String(count).padStart(6, '0')
  })
  .catch(function() {})

  // ── Floating stars ──
  var sf = document.getElementById('starfield')
  var cols = ['#3ecfbd','#f0c040','#ffffff','#3ecfbd','#ffffff','#ffffff']
  for (var i = 0; i < 55; i++) {
    var s = document.createElement('div')
    s.className = 'star'
    var sz = Math.random() < 0.15 ? 3 : Math.random() < 0.4 ? 2 : 1
    var dur = 12 + Math.random() * 22
    var delay = -(Math.random() * dur)
    var col = cols[Math.floor(Math.random() * cols.length)]
    s.style.cssText = [
      'width:' + sz + 'px',
      'height:' + sz + 'px',
      'left:' + (Math.random() * 100) + '%',
      'bottom:' + (Math.random() * -20) + 'vh',
      'background:' + col,
      'animation-duration:' + dur + 's',
      'animation-delay:' + delay + 's',
      'opacity:0'
    ].join(';')
    sf.appendChild(s)
  }
