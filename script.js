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
