// Transmissions engine. Reads the registry in /transmissions/transmissions.js.
//  - Transmission pages (<html data-tx-id="...">) show a lock screen until
//    their openAt time, then reveal themselves.
//  - The main page injects the card of every open transmission into
//    #tx-list, newest first, and adds the newest to the marquee.
// Nothing is shown before its time. The current time comes from the web
// server's Date header, so a wrong device clock can't open anything early; if
// that request fails we fall back to the device clock.
// Preview before release with ?preview=<id> (or ?preview=all).
;(function () {
  var list = window.TRANSMISSIONS || []
  var root = document.documentElement
  var offset = 0 // server time minus device time, in ms
  var preview = (location.search.match(/[?&]preview=([\w-]+)/) || [])[1]

  function now() { return Date.now() + offset }
  function openAt(t) { return Date.parse(t.openAt) }
  function isOpen(t) { return preview === 'all' || preview === t.id || openAt(t) <= now() }

  // Fires cb at the earliest future openAt among the given entries.
  var timer
  function scheduleNext(entries, cb) {
    clearTimeout(timer)
    var future = entries.filter(function (t) { return !isOpen(t) }).map(openAt).sort(function (a, b) { return a - b })
    if (!future.length) return
    timer = setTimeout(cb, Math.min(future[0] - now() + 250, 2147483647))
  }

  function rebuildMarquee() {
    var track = document.querySelector('.marquee-track')
    var original = track && track.querySelector('.marquee-inner')
    if (!original) return
    track.querySelectorAll('[aria-hidden="true"]').forEach(function (n) { n.remove() })
    track.style.width = ''
    var clone = original.cloneNode(true)
    clone.setAttribute('aria-hidden', 'true')
    track.appendChild(clone)
    track.style.width = original.offsetWidth * 2 + 'px'
  }

  // ── Transmission page ──
  var pageId = root.getAttribute('data-tx-id')
  var pageEntry = pageId && list.filter(function (t) { return t.id === pageId })[0]
  window.txGate = { now: now, openAt: pageEntry ? openAt(pageEntry) : 0 }

  function runPage() {
    if (!pageEntry || isOpen(pageEntry)) {
      root.classList.add('tx-open')
      requestAnimationFrame(rebuildMarquee)
      return
    }
    scheduleNext([pageEntry], runPage)
  }

  // ── Main page ──
  var cardCache = {}
  function fetchCard(t) {
    if (cardCache[t.id]) return cardCache[t.id]
    cardCache[t.id] = fetch('/transmissions/' + t.id + '/card.html', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text() })
      .catch(function () { delete cardCache[t.id]; return '' })
    return cardCache[t.id]
  }

  function runIndex() {
    var open = list.filter(isOpen).sort(function (a, b) { return openAt(b) - openAt(a) })
    Promise.all(open.map(fetchCard)).then(function (cards) {
      var box = document.getElementById('tx-list')
      var more = document.getElementById('tx-more')
      box.querySelectorAll('.tx-item').forEach(function (n) { n.remove() })
      var shown = 0
      cards.forEach(function (html) {
        if (!html) return
        more.insertAdjacentHTML('beforebegin', html)
        shown++
      })
      document.getElementById('tx-empty').hidden = !!shown
      more.hidden = !shown
      var st = document.getElementById('tx-status')
      st.textContent = shown ? '● RECEIVING' : '● STANDBY'
      st.classList.toggle('on', !!shown)

      var m = document.getElementById('tx-marquee')
      var newest = open[0]
      if (m) {
        m.innerHTML = ''
        if (newest && newest.marquee) {
          var a = document.createElement('a')
          a.href = '#transmissions'
          a.style.color = 'inherit'
          a.textContent = newest.marquee
          m.append('📡 ', a)
        }
        rebuildMarquee()
      }
    })
    scheduleNext(list, runIndex)
  }

  // ── Start once we know the time ──
  var started = false
  function start() {
    if (started) return
    started = true
    var go = function () {
      if (document.getElementById('tx-list')) runIndex()
      else runPage()
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go)
    else go()
  }
  setTimeout(start, 2500)
  try {
    var t0 = Date.now()
    fetch(location.pathname, { method: 'HEAD', cache: 'no-store' })
      .then(function (r) {
        var d = Date.parse(r.headers.get('Date') || '')
        if (!isNaN(d)) offset = d + (Date.now() - t0) / 2 - Date.now()
        start()
      })
      .catch(start)
  } catch (e) { start() }
})()
