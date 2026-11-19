/**
 * Team RISE journey booking (Google Apps Script web app on dwight.rfm).
 *
 * GET  ?action=slots   -> { ok, tz, minutes, slots: [ISO start, ...] }   open times only
 * POST {start, name, phone, email, mode, path, yes, total, partner, code, lang}
 *                      -> { ok, start, end, location } or { ok:false, code, error }
 *
 * Deploy: Deploy > New deployment > Web app > Execute as: Me > Who has access: Anyone.
 * Paste the /exec URL into BOOKING_URL at the top of journey.html.
 */

const CFG = {
  TZ: 'America/New_York',
  CALENDAR_ID: 'primary',
  MINUTES: 45,          // length of the chat
  STEP: 30,             // a new start time every 30 minutes
  BUFFER: 15,           // keep this many minutes clear around other events
  LEAD_HOURS: 12,       // nobody can book sooner than this
  DAYS_AHEAD: 10,
  MAX_PER_DAY: 4,       // stop offering a day once this many journey chats are on it
  // Open windows by weekday (0 = Sunday). Times are Eastern. Change these to your real hours.
  HOURS: {
    0: [],
    1: [['12:00', '20:30']],
    2: [['17:30', '20:30']],
    3: [['12:00', '20:30']],
    4: [['17:30', '20:30']],
    5: [['12:00', '20:30']],
    6: [['10:00', '14:00']]
  },
  // Your personal Zoom room link. Leave blank and the invite says the link comes by text.
  ZOOM_LINK: '',
  TAG: 'rise-journey'
};

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'slots';
    if (action === 'slots') return json({ ok: true, tz: CFG.TZ, minutes: CFG.MINUTES, slots: openSlots().map(d => d.toISOString()) });
    if (action === 'ping') return json({ ok: true });
    return json({ ok: false, code: 'bad_action', error: 'Unknown action.' });
  } catch (err) {
    return json({ ok: false, code: 'server', error: String(err) });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const b = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const name = clean(b.name, 80), phone = clean(b.phone, 30), email = clean(b.email, 120);
    const partner = clean(b.partner, 80), code = clean(b.code, 20), path = clean(b.path, 40), mode = b.mode === 'person' ? 'person' : 'zoom';
    if (!name || phone.replace(/\D/g, '').length < 7) return json({ ok: false, code: 'missing', error: 'Name and phone are required.' });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ ok: false, code: 'email', error: 'That email does not look right.' });

    const start = new Date(b.start);
    if (isNaN(start)) return json({ ok: false, code: 'bad_time', error: 'Invalid time.' });

    // one booking per phone every 10 minutes
    const cache = CacheService.getScriptCache();
    const key = 'p' + phone.replace(/\D/g, '');
    if (cache.get(key)) return json({ ok: false, code: 'too_fast', error: 'You just booked. Check your texts or email.' });

    lock.waitLock(15000);
    const still = openSlots().some(d => d.getTime() === start.getTime());
    if (!still) return json({ ok: false, code: 'slot_taken', error: 'That time was just taken. Pick another one.' });

    const end = new Date(start.getTime() + CFG.MINUTES * 60000);
    const yes = Number(b.yes) || 0, total = Number(b.total) || 0;
    const location = mode === 'person' ? 'In person (address by text)' : (CFG.ZOOM_LINK || 'Zoom (link by text)');
    const desc = [
      'Booked through the Team RISE journey link.',
      '',
      'Prospect: ' + name,
      'Phone: ' + phone,
      email ? 'Email: ' + email : '',
      'Path: ' + path,
      'Yes answers: ' + yes + ' of ' + total,
      'How: ' + (mode === 'person' ? 'In person' : 'Zoom'),
      partner ? 'Partner: ' + partner + (code ? ' (' + code + ')' : '') : '',
      mode === 'zoom' && CFG.ZOOM_LINK ? '\nJoin Zoom: ' + CFG.ZOOM_LINK : ''
    ].filter(Boolean).join('\n');

    const cal = CalendarApp.getCalendarById(CFG.CALENDAR_ID) || CalendarApp.getDefaultCalendar();
    const title = 'Team RISE chat: ' + name + (partner ? ' (with ' + partner.split(/\s+/)[0] + ')' : '');
    const opts = { description: desc, location: location };
    if (email) { opts.guests = email; opts.sendInvites = true; }
    const ev = cal.createEvent(title, start, end, opts);
    ev.setTag(CFG.TAG, '1');
    ev.addPopupReminder(30);

    cache.put(key, '1', 600);
    return json({ ok: true, start: start.toISOString(), end: end.toISOString(), location: location, zoom: mode === 'zoom' ? CFG.ZOOM_LINK : '' });
  } catch (err) {
    return json({ ok: false, code: 'server', error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

/* ---------- open times ---------- */
function openSlots() {
  const cal = CalendarApp.getCalendarById(CFG.CALENDAR_ID) || CalendarApp.getDefaultCalendar();
  const now = new Date();
  const earliest = new Date(now.getTime() + CFG.LEAD_HOURS * 3600000);
  const rangeEnd = new Date(now.getTime() + (CFG.DAYS_AHEAD + 1) * 86400000);

  const busy = [], perDay = {};
  cal.getEvents(now, rangeEnd).forEach(ev => {
    if (ev.isAllDayEvent()) return;
    try { if (ev.getMyStatus && ev.getMyStatus() === CalendarApp.GuestStatus.NO) return; } catch (x) {}
    busy.push([ev.getStartTime().getTime() - CFG.BUFFER * 60000, ev.getEndTime().getTime() + CFG.BUFFER * 60000]);
    if (ev.getTag(CFG.TAG)) {
      const d = Utilities.formatDate(ev.getStartTime(), CFG.TZ, 'yyyy-MM-dd');
      perDay[d] = (perDay[d] || 0) + 1;
    }
  });

  const out = [];
  for (let k = 0; k <= CFG.DAYS_AHEAD; k++) {
    const day = new Date(now.getTime() + k * 86400000);
    const ymd = Utilities.formatDate(day, CFG.TZ, 'yyyy-MM-dd');
    if ((perDay[ymd] || 0) >= CFG.MAX_PER_DAY) continue;
    const dow = Number(Utilities.formatDate(day, CFG.TZ, 'u')) % 7; // u: 1 = Monday ... 7 = Sunday
    (CFG.HOURS[dow] || []).forEach(([a, b]) => {
      let t = easternToDate(ymd, a);
      const stop = easternToDate(ymd, b);
      while (t.getTime() + CFG.MINUTES * 60000 <= stop.getTime()) {
        const s = t.getTime(), e = s + CFG.MINUTES * 60000;
        if (t >= earliest && !busy.some(([bs, be]) => s < be && e > bs)) out.push(new Date(s));
        t = new Date(s + CFG.STEP * 60000);
      }
    });
  }
  return out;
}

/* "2026-11-20" + "17:30" in CFG.TZ -> Date */
function easternToDate(ymd, hm) {
  const probe = new Date(ymd + 'T12:00:00Z');
  const off = Utilities.formatDate(probe, CFG.TZ, 'XXX'); // like -05:00
  return new Date(ymd + 'T' + hm + ':00' + off);
}

function clean(v, n) { return String(v == null ? '' : v).replace(/[\u0000-\u001f<>]/g, ' ').trim().slice(0, n); }
function json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

/* Run this once from the editor to grant calendar access, and to see the next open times in the log. */
function testSlots() { Logger.log(openSlots().slice(0, 10).map(d => Utilities.formatDate(d, CFG.TZ, 'EEE MMM d h:mm a')).join('\n')); }
