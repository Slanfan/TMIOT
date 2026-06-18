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
  var key = 'tmiot_v2_cnt'
  var n = parseInt(localStorage.getItem(key) || '41337', 10) + 1
  localStorage.setItem(key, n)
  document.getElementById('counter').textContent = String(n).padStart(6, '0')

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
