// Registry of transmissions. Each entry lives in /transmissions/<id>/ with an
// index.html (the page) and a card.html (the card shown on the main page).
// openAt is an ISO 8601 timestamp WITH a UTC offset; the card and the page
// stay hidden until then. Newest first is not required, order is by openAt.
// marquee is the text added to the main page's ticker once it is open.
window.TRANSMISSIONS = [
  {
    id: '1013',
    openAt: '2026-10-13T22:13:00+02:00', // 22:13 Stockholm (CEST) = 20:13 UTC
    marquee: 'TRANSMISSION 1013 — NEW ANNOUNCEMENTS'
  }
]
