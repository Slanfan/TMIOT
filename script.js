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
    var pool = trigger.getAttribute('data-tooltip-pool')
    if (pool) {
      var options = pool.split('||')
      tip.innerHTML = options[Math.floor(Math.random() * options.length)]
    } else {
      tip.innerHTML = trigger.getAttribute('data-tooltip')
    }
    var hasLinks = trigger.hasAttribute('data-tooltip-allow-links')
    tip.classList.toggle('has-links', hasLinks)
    tip.classList.toggle('agent-bubble', trigger.classList.contains('agent-trigger'))
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

// ── Country name → ISO 3166-1 alpha-2 code (matches Tolaria's CountryService list) ──
var COUNTRY_CODES = {
    'Afghanistan': 'AF',
    'Albania': 'AL',
    'Algeria': 'DZ',
    'American Samoa': 'AS',
    'Andorra': 'AD',
    'Angola': 'AO',
    'Anguilla': 'AI',
    'Antarctica': 'AQ',
    'Antigua and Barbuda': 'AG',
    'Argentina': 'AR',
    'Armenia': 'AM',
    'Aruba': 'AW',
    'Australia': 'AU',
    'Austria': 'AT',
    'Azerbaijan': 'AZ',
    'Bahamas': 'BS',
    'Bahrain': 'BH',
    'Bangladesh': 'BD',
    'Barbados': 'BB',
    'Belarus': 'BY',
    'Belgium': 'BE',
    'Belize': 'BZ',
    'Benin': 'BJ',
    'Bermuda': 'BM',
    'Bhutan': 'BT',
    'Bolivia (Plurinational State of)': 'BO',
    'Bonaire, Sint Eustatius and Saba': 'BQ',
    'Bosnia and Herzegovina': 'BA',
    'Botswana': 'BW',
    'Bouvet Island': 'BV',
    'Brazil': 'BR',
    'British Indian Ocean Territory': 'IO',
    'Brunei Darussalam': 'BN',
    'Bulgaria': 'BG',
    'Burkina Faso': 'BF',
    'Burundi': 'BI',
    'Cabo Verde': 'CV',
    'Cambodia': 'KH',
    'Cameroon': 'CM',
    'Canada': 'CA',
    'Cayman Islands': 'KY',
    'Central African Republic': 'CF',
    'Chad': 'TD',
    'Chile': 'CL',
    'China': 'CN',
    'Christmas Island': 'CX',
    'Cocos (Keeling) Islands': 'CC',
    'Colombia': 'CO',
    'Comoros': 'KM',
    'Congo': 'CG',
    'Congo (Democratic Republic of the)': 'CD',
    'Cook Islands': 'CK',
    'Costa Rica': 'CR',
    'Croatia': 'HR',
    'Cuba': 'CU',
    'Curaçao': 'CW',
    'Cyprus': 'CY',
    'Czech Republic': 'CZ',
    'Côte d\'Ivoire': 'CI',
    'Denmark': 'DK',
    'Djibouti': 'DJ',
    'Dominica': 'DM',
    'Dominican Republic': 'DO',
    'Ecuador': 'EC',
    'Egypt': 'EG',
    'El Salvador': 'SV',
    'Equatorial Guinea': 'GQ',
    'Eritrea': 'ER',
    'Estonia': 'EE',
    'Ethiopia': 'ET',
    'Falkland Islands (Malvinas)': 'FK',
    'Faroe Islands': 'FO',
    'Fiji': 'FJ',
    'Finland': 'FI',
    'France': 'FR',
    'French Guiana': 'GF',
    'French Polynesia': 'PF',
    'French Southern Territories': 'TF',
    'Gabon': 'GA',
    'Gambia': 'GM',
    'Georgia': 'GE',
    'Germany': 'DE',
    'Ghana': 'GH',
    'Gibraltar': 'GI',
    'Greece': 'GR',
    'Greenland': 'GL',
    'Grenada': 'GD',
    'Guadeloupe': 'GP',
    'Guam': 'GU',
    'Guatemala': 'GT',
    'Guernsey': 'GG',
    'Guinea': 'GN',
    'Guinea-Bissau': 'GW',
    'Guyana': 'GY',
    'Haiti': 'HT',
    'Heard Island and McDonald Islands': 'HM',
    'Holy See': 'VA',
    'Honduras': 'HN',
    'Hong Kong': 'HK',
    'Hungary': 'HU',
    'Iceland': 'IS',
    'India': 'IN',
    'Indonesia': 'ID',
    'Iran (Islamic Republic of)': 'IR',
    'Iraq': 'IQ',
    'Ireland': 'IE',
    'Isle of Man': 'IM',
    'Israel': 'IL',
    'Italy': 'IT',
    'Jamaica': 'JM',
    'Japan': 'JP',
    'Jersey': 'JE',
    'Jordan': 'JO',
    'Kazakhstan': 'KZ',
    'Kenya': 'KE',
    'Kiribati': 'KI',
    'Korea (Democratic People\'s Republic of)': 'KP',
    'Korea (Republic of)': 'KR',
    'Kuwait': 'KW',
    'Kyrgyzstan': 'KG',
    'Lao People\'s Democratic Republic': 'LA',
    'Latvia': 'LV',
    'Lebanon': 'LB',
    'Lesotho': 'LS',
    'Liberia': 'LR',
    'Libya': 'LY',
    'Liechtenstein': 'LI',
    'Lithuania': 'LT',
    'Luxembourg': 'LU',
    'Macao': 'MO',
    'Macedonia (the former Yugoslav Republic of)': 'MK',
    'Madagascar': 'MG',
    'Malawi': 'MW',
    'Malaysia': 'MY',
    'Maldives': 'MV',
    'Mali': 'ML',
    'Malta': 'MT',
    'Marshall Islands': 'MH',
    'Martinique': 'MQ',
    'Mauritania': 'MR',
    'Mauritius': 'MU',
    'Mayotte': 'YT',
    'Mexico': 'MX',
    'Micronesia (Federated States of)': 'FM',
    'Moldova (Republic of)': 'MD',
    'Monaco': 'MC',
    'Mongolia': 'MN',
    'Montenegro': 'ME',
    'Montserrat': 'MS',
    'Morocco': 'MA',
    'Mozambique': 'MZ',
    'Myanmar': 'MM',
    'Namibia': 'NA',
    'Nauru': 'NR',
    'Nepal': 'NP',
    'Netherlands': 'NL',
    'New Caledonia': 'NC',
    'New Zealand': 'NZ',
    'Nicaragua': 'NI',
    'Niger': 'NE',
    'Nigeria': 'NG',
    'Niue': 'NU',
    'Norfolk Island': 'NF',
    'Northern Mariana Islands': 'MP',
    'Norway': 'NO',
    'Oman': 'OM',
    'Pakistan': 'PK',
    'Palau': 'PW',
    'Palestine, State of': 'PS',
    'Panama': 'PA',
    'Papua New Guinea': 'PG',
    'Paraguay': 'PY',
    'Peru': 'PE',
    'Philippines': 'PH',
    'Pitcairn': 'PN',
    'Poland': 'PL',
    'Portugal': 'PT',
    'Puerto Rico': 'PR',
    'Qatar': 'QA',
    'Republic of Kosovo': 'XK',
    'Romania': 'RO',
    'Russian Federation': 'RU',
    'Rwanda': 'RW',
    'Réunion': 'RE',
    'Saint Barthélemy': 'BL',
    'Saint Helena, Ascension and Tristan da Cunha': 'SH',
    'Saint Kitts and Nevis': 'KN',
    'Saint Lucia': 'LC',
    'Saint Martin (French part)': 'MF',
    'Saint Pierre and Miquelon': 'PM',
    'Saint Vincent and the Grenadines': 'VC',
    'Samoa': 'WS',
    'San Marino': 'SM',
    'Sao Tome and Principe': 'ST',
    'Saudi Arabia': 'SA',
    'Senegal': 'SN',
    'Serbia': 'RS',
    'Seychelles': 'SC',
    'Sierra Leone': 'SL',
    'Singapore': 'SG',
    'Sint Maarten (Dutch part)': 'SX',
    'Slovakia': 'SK',
    'Slovenia': 'SI',
    'Solomon Islands': 'SB',
    'Somalia': 'SO',
    'South Africa': 'ZA',
    'South Georgia and the South Sandwich Islands': 'GS',
    'South Sudan': 'SS',
    'Spain': 'ES',
    'Sri Lanka': 'LK',
    'Sudan': 'SD',
    'Suriname': 'SR',
    'Svalbard and Jan Mayen': 'SJ',
    'Swaziland': 'SZ',
    'Sweden': 'SE',
    'Switzerland': 'CH',
    'Syrian Arab Republic': 'SY',
    'Taiwan': 'TW',
    'Tajikistan': 'TJ',
    'Tanzania, United Republic of': 'TZ',
    'Thailand': 'TH',
    'Timor-Leste': 'TL',
    'Togo': 'TG',
    'Tokelau': 'TK',
    'Tonga': 'TO',
    'Trinidad and Tobago': 'TT',
    'Tunisia': 'TN',
    'Turkey': 'TR',
    'Turkmenistan': 'TM',
    'Turks and Caicos Islands': 'TC',
    'Tuvalu': 'TV',
    'Uganda': 'UG',
    'Ukraine': 'UA',
    'United Arab Emirates': 'AE',
    'United Kingdom of Great Britain and Northern Ireland': 'GB',
    'United States Minor Outlying Islands': 'UM',
    'United States of America': 'US',
    'Uruguay': 'UY',
    'Uzbekistan': 'UZ',
    'Vanuatu': 'VU',
    'Venezuela (Bolivarian Republic of)': 'VE',
    'Viet Nam': 'VN',
    'Virgin Islands (British)': 'VG',
    'Virgin Islands (U.S.)': 'VI',
    'Wallis and Futuna': 'WF',
    'Western Sahara': 'EH',
    'Yemen': 'YE',
    'Zambia': 'ZM',
    'Zimbabwe': 'ZW',
    'Åland Islands': 'AX'
}

// ── Player roster ──
;(function () {
  var ROSTER_API_BASE = 'https://tolaria.app/api/v1/roster?tournamentId='
  var TOURNAMENTS = [
    { id: '65171083-3698-4e30-890c-b0d61195220a', label: 'Main Event' },
    { id: '93d8e9b2-25be-4eaf-95eb-15637d7ecbe0', label: '2HG' },
    { id: '201d8640-7f98-4300-b1ca-9731086ae9a7', label: 'Scryings' }
  ]

  var tbody  = document.getElementById('roster-tbody')
  var status = document.getElementById('roster-status')
  if (!tbody || !status) return

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    })
  }

  // Country doc only stores the full name (e.g. "Sweden"), not a code, so
  // look it up against Tolaria's own country list to get a flag + ISO code.
  function countryInfo(countryName) {
    if (!countryName) return { code: '', flag: '' }
    var code = COUNTRY_CODES[countryName]
    if (!code) return { code: '', flag: '' }
    var flag = ''
    for (var i = 0; i < 2; i++) {
      flag += String.fromCodePoint(127397 + code.charCodeAt(i))
    }
    return { code: code, flag: flag }
  }

  function fetchRoster(t) {
    return fetch(ROSTER_API_BASE + encodeURIComponent(t.id))
      .then(function (r) {
        // The API 404s when a tournament has no players yet — that's a
        // legitimate empty roster, not a failure worth flagging to the user.
        if (r.status === 404) return { players: [] }
        if (!r.ok) throw new Error('bad response')
        return r.json()
      })
      .then(function (data) {
        return { label: t.label, players: (data && data.players) || [] }
      })
  }

  Promise.allSettled(TOURNAMENTS.map(fetchRoster)).then(function (results) {
    var players  = {} // lowercased display name -> { name, country, entries: {} }
    var anyFailed = false

    results.forEach(function (result) {
      if (result.status !== 'fulfilled') {
        anyFailed = true
        return
      }
      var label = result.value.label
      result.value.players.forEach(function (p) {
        var name = ((p && p.name && p.name.display) || '').trim()
        var key  = name.toLowerCase()
        if (!key) return
        if (!players[key]) {
          players[key] = { name: name, country: p.country || null, entries: {} }
        }
        players[key].entries[label] = true
      })
    })

    var rows = Object.keys(players).map(function (k) { return players[k] })
    rows.sort(function (a, b) { return a.name.localeCompare(b.name) })

    if (rows.length === 0) {
      status.textContent = anyFailed
        ? 'Roster unavailable right now — check back soon.'
        : 'No one has signed up yet. Be the first!'
      status.style.display = ''
      return
    }

    tbody.innerHTML = rows.map(function (p) {
      var info = countryInfo(p.country)
      var countryTxt = info.code ? ' (' + info.code + ')' : (p.country ? ' (' + escapeHtml(p.country) + ')' : '')
      var cells = TOURNAMENTS.map(function (t) {
        return '<td>' + (p.entries[t.label]
          ? '<span class="roster-yes">✓</span>'
          : '<span class="roster-no">—</span>') + '</td>'
      }).join('')
      return '<tr><td class="roster-name">' +
        (info.flag ? info.flag + ' ' : '') + escapeHtml(p.name) + countryTxt +
        '</td>' + cells + '</tr>'
    }).join('')

    status.style.display = 'none'
    if (anyFailed) {
      status.textContent = 'Some tournaments could not be loaded — roster may be incomplete.'
      status.style.display = ''
    }
  }).catch(function () {
    status.textContent = 'Roster unavailable right now — check back soon.'
  })
})()

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
