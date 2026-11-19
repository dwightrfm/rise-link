/* Team RISE family cartoons.
   One stick figure family (dad, mom, boy, girl) drawn in SVG and animated with CSS.
   Everyone shares one soft mint color, so the family reads as no one race.
   The face carries the feeling: each clip starts in one mood and turns to the pain.
   CART.clip(i, L) gives the 8 pain point clips (4 income, 4 savings), each about 4 seconds.
   CART.splash() is the family waving on the tap screen. CART.hope() is the happy ending. */
(function(){
const K = {skin:'#B5ECE6', ink:'#0E2340', hair:'#7a5236', dad:'#3aa3d8', mom:'#ffc46b', boy:'#7bd88f', girl:'#ff7aa8', wood:'#8a6a4a'};

/* ---------- style ---------- */
const css = document.createElement('style');
css.textContent = `
.cart{display:block;width:100%;height:100%;animation:cartIn .55s cubic-bezier(.16,1,.3,1) both;transition:opacity .25s}
.cart.out{opacity:0}
@keyframes cartIn{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:none}}
.cart .lb{stroke:${K.skin};stroke-width:6;stroke-linecap:round;fill:none}
.cart .fc{stroke:${K.ink};stroke-width:1.8;fill:none;stroke-linecap:round;stroke-linejoin:round}
.cart .fc circle,.cart .fc .fill{fill:${K.ink};stroke:none}
.cart .fc .blush{fill:rgba(255,110,150,.45);stroke:none}
.cart .f2{opacity:0}
.cart .f1.sw{animation:cartFo .3s ease var(--sw) both}
.cart .f2{animation:cartFi .3s ease var(--sw) both}
@keyframes cartFo{to{opacity:0}}
@keyframes cartFi{to{opacity:1}}
.cart text{font-family:Inter,Arial,sans-serif}
@media (prefers-reduced-motion:reduce){.cart *{animation-delay:0s!important;animation-duration:.001s!important;animation-iteration-count:1!important}}
`;
document.head.appendChild(css);

/* keyframes are made on the fly, one per unique motion, so no CSS variables are needed inside keyframes */
const kfs = document.createElement('style'); document.head.appendChild(kfs);
const KF = new Map();
const kf = body => { let n = KF.get(body); if(!n){ n = 'ck' + KF.size; KF.set(body, n); kfs.textContent += `@keyframes ${n}{${body}}\n`; } return n; };
const R = (x, y) => kf(`from{transform:rotate(${x}deg)}to{transform:rotate(${y}deg)}`);
const T = (x0, y0, x1, y1) => kf(`from{transform:translate(${x0}px,${y0}px)}to{transform:translate(${x1}px,${y1}px)}`);
const A = (...p) => 'animation:' + p.join(',') + ';';
const a = (name, dur, delay = 0, rest = 'both', ease = 'ease') => `${name} ${dur}s ${ease} ${delay}s ${rest}`;
const FADEIN = kf('from{opacity:0}to{opacity:1}');
const FADEOUT = kf('to{opacity:0}');
const POP = kf('0%{transform:scale(0)}70%{transform:scale(1.15)}100%{transform:scale(1)}');
const HOP = kf('to{transform:translateY(-6px)}');
const walkL = (d, n) => A(a(R(18, -18), .3, d, n + ' alternate', 'ease-in-out'));
const walkR = (d, n) => A(a(R(-18, 18), .3, d, n + ' alternate', 'ease-in-out'));

/* ---------- the family ---------- */
const CAP = 'M-15 -16 Q-16 -34 0 -33 Q16 -34 15 -16 Q12 -26 0 -26 Q-12 -26 -15 -16Z';
const SHIRT = 'M-13 -87 Q0 -91 13 -87 L12 -46 Q0 -43 -12 -46Z';
const DRESS = 'M-11 -87 Q0 -91 11 -87 L18 -40 Q0 -36 -18 -40Z';
const SHAPE = {
  dad: {t:SHIRT, hip:-46, hair:CAP},
  mom: {t:DRESS, hip:-40, back:'<path d="M-18 -2 Q-22 -37 0 -36 Q22 -37 18 -2 Q9 2 0 0 Q-9 2 -18 -2Z"/>', hair:'M-15 -14 Q-17 -34 0 -33 Q17 -34 15 -14 Q10 -25 -2 -24 Q-10 -24 -15 -14Z'},
  boy: {t:SHIRT, hip:-46, hair:'M-15 -17 Q-15 -33 0 -33 Q15 -33 15 -17 Q10 -27 0 -26 Q-10 -27 -15 -17Z M-4 -32 L0 -39 L4 -32Z'},
  girl:{t:DRESS, hip:-40, back:'<circle cx="-17" cy="-21" r="6"/><circle cx="17" cy="-21" r="6"/>', hair:CAP}
};
const EY = '<circle cx="-5" cy="-17" r="2"/><circle cx="5" cy="-17" r="2"/>';
const SADB = '<path d="M-9.5 -21.5 L-3.5 -24.5 M9.5 -21.5 L3.5 -24.5"/>';
const FACE = {
  happy: EY + '<path d="M-5.5 -10 Q0 -5 5.5 -10"/>',
  joy: '<path d="M-7.5 -16 Q-5 -20 -2.5 -16 M2.5 -16 Q5 -20 7.5 -16"/><path class="fill" d="M-6 -10.5 Q0 -1.5 6 -10.5Z"/><circle class="blush" cx="-9.5" cy="-10" r="2.6"/><circle class="blush" cx="9.5" cy="-10" r="2.6"/>',
  sad: EY + SADB + '<path d="M-5 -6.5 Q0 -11.5 5 -6.5"/>',
  worried: EY + SADB + '<path d="M-6 -8 q3 -2.6 6 0 t6 0"/>',
  tired: '<path d="M-7.5 -16.5 Q-5 -14.5 -2.5 -16.5 M2.5 -16.5 Q5 -14.5 7.5 -16.5"/>' + SADB + '<path d="M-4.5 -7 Q0 -10 4.5 -7"/>',
  strain: '<path d="M-8 -19 L-3 -16.5 L-8 -14 M8 -19 L3 -16.5 L8 -14"/><path d="M-9 -24 L-3.5 -21.5 M9 -24 L3.5 -21.5"/><path d="M-5.5 -8.5 L5.5 -8.5"/>',
  confused: EY + '<path d="M-9 -23.5 L-3.5 -25.5 M3.5 -22 L9 -22.5"/><path d="M-5 -8.5 Q-2 -11 1 -8.5 T6 -9"/>'
};

/* o: k (dad|mom|boy|girl), x, y (feet), m (mood), m2 (mood it turns into), sw (seconds when it turns),
   aL aR (arm angles), lL lR (leg angles), tilt (head), hL hR (things in hands), st (extra style per part) */
function person(o){
  const sh = SHAPE[o.k], kid = o.k === 'boy' || o.k === 'girl', s = o.s || (kid ? .66 : 1), st = o.st || {};
  const limb = (cls, x, y, len, rest, extra = '') =>
    `<g transform="translate(${x} ${y})"><g class="${cls}" style="transform:rotate(${rest}deg);${st[cls] || ''}"><line class="lb" x1="0" y1="0" x2="0" y2="${len}"/>${extra}</g></g>`;
  const sw = o.sw || 2;
  const face = o.m2
    ? `<g class="fc f1 sw" style="--sw:${sw}s">${FACE[o.m || 'happy']}</g><g class="fc f2" style="--sw:${sw}s">${FACE[o.m2]}</g>`
    : `<g class="fc">${FACE[o.m || 'happy']}</g>`;
  const hair = `class="hair" style="${st.hair || ''}"`;
  return `<g transform="translate(${o.x} ${o.y})"><g class="mv" style="${st.mv || ''}"><g transform="scale(${s} ${s})"><g class="bod" style="${st.bod || ''}">`
    + limb('legL', -5, sh.hip, -sh.hip - 1, o.lL ?? 6) + limb('legR', 5, sh.hip, -sh.hip - 1, o.lR ?? -6)
    + `<path d="${sh.t}" fill="${K[o.k]}"/>`
    + limb('armL', -11, -84, 36, o.aL ?? 14, o.hL || '') + limb('armR', 11, -84, 36, o.aR ?? -14, o.hR || '')
    + `<line class="lb" x1="0" y1="-86" x2="0" y2="-91"/>`
    + `<g transform="translate(0 -90)${kid ? ' scale(1.22)' : ''}"><g class="hd" style="transform:rotate(${o.tilt || 0}deg);${st.hd || ''}">`
    + (sh.back ? `<g fill="${K.hair}" ${hair}>${sh.back}</g>` : '')
    + `<circle cy="-16" r="15" fill="${K.skin}"/>`
    + `<path d="${sh.hair}" fill="${K.hair}" ${hair}/>`
    + face + `</g></g></g></g></g></g>`;
}

/* ---------- props ---------- */
const svg = (cls, inner, vb = '0 0 360 260') => `<svg class="cart ${cls}" viewBox="${vb}" aria-hidden="true">${inner}</svg>`;
const ground = (y = 226, h = 260) => `<rect x="0" y="${y}" width="360" height="${h - y}" fill="rgba(255,255,255,.05)"/><line x1="0" y1="${y}" x2="360" y2="${y}" stroke="rgba(255,255,255,.22)" stroke-width="2"/>`;
const coin = (r = 7) => `<circle r="${r}" fill="#ffc46b" stroke="#c98a2a" stroke-width="1.5"/><text y="${r * .45}" text-anchor="middle" font-size="${r * 1.3}" font-weight="800" fill="#8a5a12">$</text>`;
const bill = (angry) => `<rect x="-20" y="-14" width="40" height="28" rx="3" fill="#fff" stroke="#E8332A" stroke-width="2"/><text x="-9" y="6" text-anchor="middle" font-size="16" font-weight="800" fill="#E8332A">$</text>`
  + (angry ? `<path d="M3 -9 L9 -6 M17 -9 L11 -6" stroke="${K.ink}" stroke-width="1.6" stroke-linecap="round"/><circle cx="7" cy="-2" r="1.8" fill="${K.ink}"/><circle cx="13" cy="-2" r="1.8" fill="${K.ink}"/><path d="M5 8 Q10 4 15 8" stroke="${K.ink}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
           : `<path d="M2 -6 H14 M2 0 H14 M2 6 H10" stroke="#E8332A" stroke-width="1.6" stroke-linecap="round" opacity=".6"/>`);
const at = (x, y, style, inner) => `<g transform="translate(${x} ${y})"><g style="${style}">${inner}</g></g>`;

/* ---------- 1. Income that stops when you stop ---------- */
function c1(){
  const fly = kf('0%{transform:translate(98px,148px) scale(.4);opacity:0}12%{transform:translate(126px,104px) scale(1);opacity:1}50%{transform:translate(205px,62px) scale(1)}85%{transform:translate(290px,112px) scale(.9);opacity:1}100%{transform:translate(311px,146px) scale(.5);opacity:0}');
  const drop = kf('0%{transform:translate(98px,148px) scale(.4) rotate(0deg);opacity:0}15%{transform:translate(112px,122px) scale(1) rotate(0deg);opacity:1}60%{transform:translate(140px,200px) scale(1) rotate(180deg)}78%{transform:translate(147px,212px) scale(1) rotate(250deg)}100%{transform:translate(152px,219px) scale(1) rotate(300deg);opacity:1}');
  const coins = [.1, .45, .8, 1.15, 1.5].map(d => `<g style="${A(a(fly, 1.1, d, 'both', 'linear'))}">${coin()}</g>`).join('');
  return svg('c1', ground()
    + `<rect x="276" y="152" width="70" height="74" rx="3" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.35)" stroke-width="2"/>`
    + `<path d="M266 156 L311 116 L356 156" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`
    + `<rect x="316" y="166" width="20" height="18" rx="2" fill="#ffc46b" style="${A(a(kf('to{opacity:.55}'), .3, 1.1, '5 alternate'), a(kf('to{fill:#24303d;opacity:1}'), .6, 2.6, 'forwards'))}"/>`
    + person({k:'dad', x:52, y:226, m:'happy', m2:'tired', sw:2, aL:-30, aR:-40, st:{
        armR: A(a(R(-40, -50), .18, 0, '10 alternate', 'ease-in-out'), a(R(-40, -4), .6, 2, 'forwards')),
        armL: A(a(R(-30, -20), .18, .09, '10 alternate', 'ease-in-out'), a(R(-30, 10), .6, 2, 'forwards')),
        hd: A(a(R(0, 14), .7, 2.05, 'forwards'))}})
    + `<rect x="30" y="181" width="110" height="7" rx="2" fill="${K.wood}"/><line x1="38" y1="188" x2="38" y2="226" stroke="${K.wood}" stroke-width="5"/><line x1="132" y1="188" x2="132" y2="226" stroke="${K.wood}" stroke-width="5"/>`
    + `<rect x="66" y="176" width="46" height="5" rx="2" fill="#a9bccf"/><rect x="70" y="149" width="38" height="28" rx="3" fill="#62788f"/>`
    + `<circle cx="89" cy="163" r="4" fill="#46d9d2" style="${A(a(kf('to{opacity:.12}'), .5, 2, 'forwards'))}"/>`
    + person({k:'boy', x:214, y:226, m:'happy', m2:'sad', sw:2.9, st:{bod:A(a(HOP, .3, .3, '6 alternate', 'ease-in-out'))}})
    + person({k:'mom', x:246, y:226, m:'happy', m2:'worried', sw:2.6, st:{
        hd: A(a(R(0, -10), .5, 2.6, 'forwards')),
        armR: A(a(R(-14, -40), .6, 2.8, 'forwards'))}})
    + person({k:'girl', x:282, y:226, m:'happy', m2:'sad', sw:2.9, st:{bod:A(a(HOP, .3, .45, '6 alternate', 'ease-in-out'))}})
    + coins
    + `<g style="${A(a(drop, 1, 1.9, 'both', 'ease-in'))}">${coin()}</g>`);
}

/* ---------- 2. Too little family time ---------- */
function c2(){
  const ball = kf('0%{transform:translate(0,0) rotate(0deg)}30%{transform:translate(2px,44px) rotate(40deg)}45%{transform:translate(8px,30px) rotate(80deg)}60%{transform:translate(14px,44px) rotate(120deg)}100%{transform:translate(34px,44px) rotate(260deg)}');
  const brief = `<rect x="-9" y="35" width="18" height="13" rx="2" fill="#7a5a3a"/><path d="M-4 35 v-3 h8 v3" stroke="#7a5a3a" stroke-width="2" fill="none"/>`;
  return svg('c2',
      at(64, 62, A(a(kf('to{transform:translate(0px,110px);opacity:0}'), 2.4, 1, 'both', 'ease-in')), `<circle r="16" fill="#ffc46b"/><circle r="24" fill="#ffc46b" opacity=".18"/>`)
    + `<rect width="360" height="226" fill="#020812" style="opacity:0;${A(a(kf('to{opacity:.5}'), 2.2, 1.2, 'forwards'))}"/>`
    + at(292, 50, 'opacity:0;' + A(a(FADEIN, .8, 2.6, 'forwards')), `<path d="M4 -14 A14 14 0 1 0 4 14 A20 20 0 0 1 4 -14Z" fill="#eef3ff"/>`)
    + `<g transform="translate(180 54)"><circle r="22" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.7)" stroke-width="3"/>`
    + `<path d="M0 -18 V-15 M18 0 H15 M0 18 V15 M-18 0 H-15" stroke="rgba(255,255,255,.7)" stroke-width="2" stroke-linecap="round"/>`
    + `<g style="${A(a(R(0, 120), 4.2, 0, 'both', 'linear'))}"><line y2="-11" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>`
    + `<g style="${A(a(R(0, 1440), 4.2, 0, 'both', 'linear'))}"><line y2="-17" stroke="#ffc46b" stroke-width="2" stroke-linecap="round"/></g><circle r="2.5" fill="#fff"/></g>`
    + ground()
    + `<rect x="318" y="126" width="32" height="100" rx="3" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.4)" stroke-width="2"/><circle cx="324" cy="178" r="2.5" fill="#ffc46b"/>`
    + person({k:'dad', x:192, y:226, m:'sad', tilt:-6, aL:18, aR:-6, hR:brief, st:{
        mv: A(a(T(0, 0, 120, 0), 2.1, .5, 'both', 'ease-in-out'), a(FADEOUT, .4, 2.4, 'forwards')),
        bod: A(a(kf('to{transform:translateY(-3px)}'), .15, .5, '14 alternate')),
        legL: walkL(.5, 7), legR: walkR(.5, 7),
        armL: A(a(R(18, -8), .3, .5, '7 alternate', 'ease-in-out'))}})
    + person({k:'boy', x:84, y:226, m:'happy', m2:'sad', sw:2.4, aR:-150, st:{
        armR: A(a(R(-150, -122), .22, .5, '7 alternate', 'ease-in-out'), a(R(-150, -10), .5, 2.3, 'forwards'))}})
    + person({k:'girl', x:120, y:226, m:'happy', m2:'sad', sw:2.5, aR:-70, st:{
        armR: A(a(R(-70, -8), .4, 2.6, 'forwards')),
        hd: A(a(R(0, 10), .5, 2.7, 'forwards'))}})
    + at(152, 175, A(a(ball, 1.3, 2.6, 'both', 'ease-in')), `<circle r="7" fill="#ff8a5b"/><path d="M-7 0 Q0 -3 7 0 M0 -7 Q-3 0 0 7" stroke="#c4552c" stroke-width="1.3" fill="none"/>`));
}

/* ---------- 3. Dreams put on hold ---------- */
function c3(someday){
  const bub = kf('0%{transform:translate(0px,0px) scale(0)}18%{transform:translate(0px,0px) scale(1.08)}24%{transform:translate(0px,0px) scale(1)}62%{transform:translate(0px,0px) scale(1);opacity:1}92%{transform:translate(18px,122px) scale(.12);opacity:1}100%{transform:translate(18px,126px) scale(.06);opacity:0}');
  const cloud = `<g fill="#f4f8fb"><circle cx="-48" cy="-2" r="28"/><circle cx="-20" cy="-22" r="30"/><circle cx="18" cy="-24" r="30"/><circle cx="48" cy="-4" r="28"/><circle cx="22" cy="16" r="28"/><circle cx="-20" cy="16" r="28"/></g>`
    + `<circle cx="32" cy="-22" r="9" fill="#ffc46b"/>`
    + `<path d="M-52 14 Q-40 8 -28 14 T-4 14 T20 14 T44 14 L46 30 Q0 36 -50 30Z" fill="#46b3e6"/>`
    + `<path d="M-56 26 Q0 18 56 26 L50 36 Q0 42 -50 36Z" fill="#f3d08a"/>`
    + `<path d="M-30 26 Q-32 2 -22 -18" stroke="${K.wood}" stroke-width="4" fill="none" stroke-linecap="round"/>`
    + `<path d="M-22 -18 Q-36 -26 -44 -14 M-22 -18 Q-12 -30 0 -22 M-22 -18 Q-30 -34 -40 -30 M-22 -18 Q-10 -16 -6 -6" stroke="#3fae6a" stroke-width="4" fill="none" stroke-linecap="round"/>`
    + `<rect x="4" y="-2" width="22" height="16" fill="#ff8a5b"/><path d="M1 -2 L15 -14 L29 -2Z" fill="#b8413b"/><rect x="12" y="5" width="6" height="9" fill="#7a3a22"/>`;
  const fam = (k, x, sw) => person({k, x, y:226, m:'happy', m2:'sad', sw, tilt:8, aR:k === 'dad' ? -30 : -14, st:{hd:A(a(R(8, -3), .5, sw + .1, 'forwards'))}});
  return svg('c3', ground()
    + fam('boy', 60, 2.5) + fam('dad', 98, 2.4) + fam('mom', 140, 2.4) + fam('girl', 178, 2.5)
    + `<g style="${A(a(FADEOUT, .3, 2.1, 'forwards'))}">` + at(194, 126, A(a(POP, .3, .15)), `<circle r="4" fill="#f4f8fb"/>`) + at(210, 108, A(a(POP, .3, .3)), `<circle r="6" fill="#f4f8fb"/>`) + `</g>`
    + at(258, 74, A(a(bub, 2.9, .35, 'both', 'ease-in-out')), cloud)
    + at(276, 196, A(a(T(120, 0, 0, 0), .6, 1.4, 'both', 'cubic-bezier(.2,.9,.3,1.15)')),
        `<rect x="-32" y="0" width="64" height="30" rx="2" fill="#d3a46a" stroke="#a77a45" stroke-width="2"/>`
      + `<text y="20" text-anchor="middle" font-size="${someday.length > 8 ? 7.5 : 9}" font-weight="800" letter-spacing="1" fill="#5a3d1e">${someday}</text>`
      + at(-32, 0, `transform:rotate(-135deg);` + A(a(R(-135, 0), .35, 3.15, 'forwards')), `<rect y="-2" width="32" height="4" rx="1" fill="#c08f55"/>`)
      + at(32, 0, `transform:rotate(135deg);` + A(a(R(135, 0), .35, 3.15, 'forwards')), `<rect x="-32" y="-2" width="32" height="4" rx="1" fill="#c08f55"/>`)
      + `<rect x="-6" y="-2" width="12" height="14" fill="#efe2c4" style="opacity:0;${A(a(FADEIN, .2, 3.5, 'forwards'))}"/>`));
}

/* ---------- 4. Heavy debt ---------- */
function c4(){
  const yAt = x => 236 - x / 3;
  const push = kf('0%{transform:translate(0px,0px)}38%{transform:translate(27px,-9px)}50%{transform:translate(28px,-9.3px)}56%{transform:translate(25px,-8.3px)}72%{transform:translate(-9px,3px)}100%{transform:translate(-5px,1.7px)}');
  const roll = kf('0%{transform:rotate(0deg) scale(1)}38%{transform:rotate(52deg) scale(1)}56%{transform:rotate(47deg) scale(1)}72%{transform:rotate(-16deg) scale(1.14)}100%{transform:rotate(-10deg) scale(1.14)}');
  const sweat = kf('0%{opacity:1;transform:translate(0px,0px)}100%{opacity:0;transform:translate(-8px,18px)}');
  const fall = kf('0%{transform:translate(-10px,-100px) rotate(-30deg);opacity:0}20%{opacity:1}100%{transform:translate(0px,0px) rotate(12deg);opacity:1}');
  const pusher = (k, x, m2) => person({k, x, y:yAt(x), m:'strain', m2, sw:2.6, aL:-100, aR:-106, lL:16, lR:-8, st:{
    bod:'transform:rotate(15deg)',
    legL: A(a(R(16, 4), .35, 0, '10 alternate', 'ease-in-out')),
    legR: A(a(R(-8, 6), .35, .17, '10 alternate', 'ease-in-out'))}});
  const drop = (x, y, d) => at(x, y, 'opacity:0;' + A(a(sweat, .7, d, 'both', 'ease-in')), `<path d="M0 -5 Q4 1 0 4 Q-4 1 0 -5Z" fill="#9fd9ff"/>`);
  return svg('c4',
      `<path d="M0 236 L360 116 L360 260 L0 260Z" fill="rgba(255,255,255,.06)"/><path d="M0 236 L360 116" stroke="rgba(255,255,255,.25)" stroke-width="2"/>`
    + person({k:'boy', x:26, y:yAt(26), m:'worried', tilt:8, aR:-40})
    + person({k:'girl', x:54, y:yAt(54), m:'happy', m2:'sad', sw:2.6, tilt:8, aL:30, hd:'', st:{hd:A(a(R(8, -2), .5, 2.7, 'forwards'))}})
    + `<g style="${A(a(push, 4.2, 0, 'both', 'ease-in-out'))}">`
    + pusher('mom', 106, 'sad') + pusher('dad', 140, 'sad')
    + at(238, 121, A(a(roll, 4.2, 0, 'both', 'ease-in-out')),
        `<circle r="34" fill="#b8413b" stroke="#7d2421" stroke-width="3"/><path d="M-20 -18 L-10 -8 L-14 2 M14 16 L22 8 L28 12" stroke="#7d2421" stroke-width="2" fill="none" stroke-linecap="round"/><text y="11" text-anchor="middle" font-size="30" font-weight="900" fill="#fff">$</text>`)
    + at(226, 82, A(a(fall, .5, 2.2, 'both', 'ease-in'), a(FADEOUT, .3, 3, 'forwards')), `<g transform="scale(.6)">${bill()}</g>`)
    + at(250, 86, A(a(fall, .5, 2.4, 'both', 'ease-in'), a(FADEOUT, .3, 3.05, 'forwards')), `<g transform="scale(.6)">${bill()}</g>`)
    + drop(160, 84, .7) + drop(160, 84, 1.5) + drop(162, 86, 2.9) + drop(126, 98, 1.1) + drop(126, 98, 3.2)
    + `</g>`);
}

/* ---------- 5. Hard to stay consistent ---------- */
function c5(){
  const coinIn = kf('0%{transform:translate(0px,0px) scale(1);opacity:1}25%{transform:translate(0px,-4px) scale(1)}65%{transform:translate(36px,-16px) scale(1)}88%{transform:translate(51px,50px) scale(.9);opacity:1}100%{transform:translate(51px,58px) scale(.6);opacity:0}');
  const squish = kf('0%,100%{transform:scale(1,1)}40%{transform:scale(1.1,.9)}70%{transform:scale(.96,1.05)}');
  const shake = kf('0%,100%{transform:rotate(0deg)}20%{transform:rotate(-9deg)}40%{transform:rotate(8deg)}60%{transform:rotate(-6deg)}80%{transform:rotate(4deg)}');
  const billFly = kf('0%{transform:translate(130px,-100px) rotate(35deg);opacity:0}12%{opacity:1}27%{transform:translate(0px,0px) rotate(-8deg)}36%{transform:translate(0px,-5px) rotate(7deg)}45%{transform:translate(0px,0px) rotate(-3deg)}64%{transform:translate(0px,0px) rotate(0deg)}100%{transform:translate(170px,-120px) rotate(30deg);opacity:1}');
  const coinOut = kf('0%{transform:translate(0px,0px) scale(.6);opacity:0}10%{opacity:1}45%{transform:translate(40px,-60px) scale(1)}55%{transform:translate(58px,-50px) scale(.9);opacity:1}100%{transform:translate(229px,-170px) scale(.9);opacity:1}');
  const pig = `<ellipse rx="34" ry="24" fill="#ff9ec4"/><path d="M-20 -18 L-14 -32 L-6 -21Z" fill="#ff7aa8"/>`
    + `<rect x="-24" y="16" width="8" height="12" rx="2" fill="#ff7aa8"/><rect x="-8" y="18" width="8" height="10" rx="2" fill="#ff7aa8"/><rect x="8" y="18" width="8" height="10" rx="2" fill="#ff7aa8"/><rect x="20" y="16" width="8" height="12" rx="2" fill="#ff7aa8"/>`
    + `<ellipse cx="-34" cy="2" rx="7" ry="8" fill="#ff7aa8"/><circle cx="-36" cy="0" r="1.4" fill="${K.ink}"/><circle cx="-32" cy="4" r="1.4" fill="${K.ink}"/>`
    + `<circle cx="-18" cy="-6" r="2.2" fill="${K.ink}"/><path d="M33 -4 q8 -4 4 -10" stroke="#ff7aa8" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
    + `<path d="M-6 -23 L8 -23" stroke="${K.ink}" stroke-width="3" stroke-linecap="round"/>`;
  return svg('c5', ground()
    + person({k:'boy', x:62, y:226, m:'happy', m2:'sad', sw:2.6, st:{
        armR: A(a(R(-14, -150), .3, 1.05, 'forwards'), a(R(-150, -10), .4, 2.3, 'forwards'))}})
    + person({k:'mom', x:104, y:226, m:'happy', m2:'sad', sw:2.45, aR:-125, st:{
        armR: A(a(R(-125, -45), .4, 1.05, 'forwards'), a(R(-45, -8), .4, 2.4, 'forwards')),
        hd: A(a(R(0, 10), .5, 2.6, 'forwards'))}})
    + at(196, 194, A(a(squish, .4, 1, '1'), a(shake, .5, 2.05, '1')), pig)
    + at(197, 158, 'opacity:0;' + A(a(kf('0%{opacity:0;transform:scale(.3)}40%{opacity:1;transform:scale(1.2)}100%{opacity:0;transform:scale(1)}'), .5, 1.05, 'both')),
        `<path d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2Z" fill="#ffe9a8"/>`)
    + at(146, 116, A(a(coinIn, 1.05, .1, 'both', 'ease-in-out')), coin())
    + at(197, 168, A(a(coinOut, 1.35, 2.15, 'both', 'ease-in-out')), coin())
    + at(256, 118, A(a(billFly, 2.2, 1.3, 'both', 'ease-in-out')), bill(true)));
}

/* ---------- 6. Nobody taught us money ---------- */
function c6(){
  const jig = kf('0%,100%{transform:rotate(0deg)}25%{transform:rotate(-4deg)}50%{transform:rotate(3deg)}75%{transform:rotate(-2deg)}');
  const float = kf('to{transform:translateY(-4px) rotate(8deg)}');
  const q = (x, y, size, d) => at(x, y, A(a(POP, .45, d, 'both', 'cubic-bezier(.34,1.56,.64,1)'), a(float, .7, d + .45, 'infinite alternate', 'ease-in-out')),
    `<text y="${size * .35}" text-anchor="middle" font-size="${size}" font-weight="900" fill="#ffc46b">?</text>`);
  return svg('c6', ground()
    + at(180, 80, A(a(jig, .6, 1.7, '1')),
        `<rect x="-52" y="-40" width="104" height="78" rx="6" fill="#f4f8fb"/>`
      + `<text x="-34" y="-12" text-anchor="middle" font-size="18" font-weight="900" fill="#3aa3d8">$</text>`
      + `<text x="34" y="-12" text-anchor="middle" font-size="16" font-weight="900" fill="#E8332A">%</text>`
      + `<path d="M-30 24 C -10 -20, 10 40, 20 0 S -20 -10, 0 20 S 30 30, 34 -4" stroke="${K.ink}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-dasharray="320" stroke-dashoffset="320" style="${A(a(kf('to{stroke-dashoffset:0}'), 1.4, .1, 'forwards', 'ease-in-out'))}"/>`)
    + person({k:'dad', x:80, y:226, m:'confused', m2:'worried', sw:2.6, tilt:-8, aR:-170, st:{
        armR: A(a(R(-168, -182), .16, .3, '14 alternate', 'ease-in-out'))}})
    + person({k:'boy', x:148, y:226, m:'confused', m2:'worried', sw:2.8, tilt:6})
    + person({k:'girl', x:214, y:226, m:'confused', m2:'worried', sw:2.8, tilt:-6})
    + person({k:'mom', x:282, y:226, m:'confused', m2:'worried', sw:2.6, tilt:8, st:{
        armL: A(a(R(14, 105), .4, .6, '4 alternate', 'ease-in-out')),
        armR: A(a(R(-14, -105), .4, .6, '4 alternate', 'ease-in-out')),
        bod: A(a(kf('to{transform:translateY(-4px)}'), .4, .6, '4 alternate', 'ease-in-out'))}})
    + q(50, 70, 30, .5) + q(310, 70, 30, 1.2) + q(250, 30, 22, 1.9));
}

/* ---------- 7. An uncertain future ---------- */
function c7(){
  const walker = (k, x, aL, aR, m2, sw, extra = {}) => person({k, x, y:226, m:'happy', m2, sw, aL, aR, st:{legL:walkL(.1, 6), legR:walkR(.1, 6), ...extra}});
  return svg('c7',
      `<defs><filter id="cartFog" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="9"/></filter></defs>`
    + ground() + `<line x1="0" y1="238" x2="360" y2="238" stroke="rgba(255,255,255,.25)" stroke-width="3" stroke-dasharray="10 10"/>`
    + `<g style="${A(a(T(-10, 0, 56, 0), 2.1, .1, 'both', 'ease-out'))}">`
    + walker('girl', 20, 14, -73, 'worried', 2.5)
    + walker('mom', 66, 8, -8, 'worried', 2.3, {hd:A(a(R(0, 10), .5, 2.4, 'forwards'))})
    + walker('boy', 112, 73, -73, 'worried', 2.5)
    + walker('dad', 158, 8, -14, 'worried', 2.3, {armR:A(a(R(-14, -92), .4, 2.2, 'forwards'))})
    + `</g>`
    + `<g filter="url(#cartFog)" style="${A(a(kf('0%{transform:translateX(70px);opacity:.35}100%{transform:translateX(0px);opacity:.88}'), 4.2, 0, 'both', 'ease-out'))}">`
    + `<ellipse cx="300" cy="180" rx="90" ry="60" fill="#dfe8ef"/><ellipse cx="340" cy="110" rx="70" ry="60" fill="#dfe8ef"/><ellipse cx="262" cy="214" rx="70" ry="30" fill="#dfe8ef"/></g>`
    + `<g style="opacity:0;${A(a(kf('to{opacity:.8}'), .8, 1.3, 'forwards'))}"><line x1="318" y1="226" x2="318" y2="168" stroke="${K.wood}" stroke-width="5"/><rect x="294" y="150" width="48" height="24" rx="4" fill="${K.wood}"/><text x="318" y="168" text-anchor="middle" font-size="18" font-weight="900" fill="#ffc46b">?</text></g>`);
}

/* ---------- 8. Time slipping away ---------- */
function c8(){
  const Y = new Date().getFullYear();
  const SHOW = kf('from{opacity:1}to{opacity:1}');
  const years = [0, 1, 2, 3, 4, 5].map(i => `<text y="16" text-anchor="middle" font-size="16" font-weight="800" fill="${K.ink}" style="opacity:0;${A(a(SHOW, .62, .1 + i * .62, i < 5 ? '1' : 'forwards', 'linear'))}">${Y + i}</text>`).join('');
  const grow = A(a(kf('to{transform:scale(1.38)}'), 3.4, .4, 'forwards', 'ease-in-out'));
  const gray = A(a(kf('to{fill:#c3ccd6}'), 1.8, 1.8, 'forwards'));
  return svg('c8',
      `<defs><clipPath id="cartHgT"><path d="M-20 -61 Q-20 -22 -2 -1 L2 -1 Q20 -22 20 -61Z"/></clipPath><clipPath id="cartHgB"><path d="M-2 1 Q-20 22 -20 61 L20 61 Q20 22 2 1Z"/></clipPath></defs>`
    + ground()
    + `<g transform="translate(86 140)">`
    + `<path d="M-22 -63 Q-22 -20 -3 0 Q-22 20 -22 63 L22 63 Q22 20 3 0 Q22 -20 22 -63Z" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.7)" stroke-width="2.5"/>`
    + `<g clip-path="url(#cartHgT)"><rect x="-24" y="-44" width="48" height="46" fill="#ffc46b" style="${A(a(T(0, 0, 0, 44), 3.8, .2, 'both', 'linear'))}"/></g>`
    + `<g clip-path="url(#cartHgB)"><rect x="-24" y="16" width="48" height="50" fill="#ffc46b" style="${A(a(T(0, 44, 0, 0), 3.8, .2, 'both', 'linear'))}"/></g>`
    + `<line x1="0" y1="0" x2="0" y2="58" stroke="#ffc46b" stroke-width="2" stroke-dasharray="4 4" style="${A(a(kf('to{stroke-dashoffset:-16}'), .3, 0, '13', 'linear'), a(FADEOUT, .2, 3.9, 'forwards'))}"/>`
    + `<rect x="-28" y="-70" width="56" height="8" rx="3" fill="${K.wood}"/><rect x="-28" y="62" width="56" height="8" rx="3" fill="${K.wood}"/>`
    + `<path d="M-25 -62 V62 M25 -62 V62" stroke="${K.wood}" stroke-width="4"/></g>`
    + `<g transform="translate(176 58)"><rect x="-28" y="-26" width="56" height="52" rx="5" fill="#f4f8fb"/><rect x="-28" y="-26" width="56" height="14" rx="5" fill="#E8332A"/><rect x="-28" y="-18" width="56" height="6" fill="#E8332A"/><circle cx="-12" cy="-26" r="3" fill="${K.ink}"/><circle cx="12" cy="-26" r="3" fill="${K.ink}"/>${years}</g>`
    + person({k:'boy', x:206, y:226, m:'happy', st:{mv:grow}})
    + person({k:'dad', x:250, y:226, m:'happy', m2:'worried', sw:2.6, st:{hair:gray, hd:A(a(R(0, -8), .5, 2.6, 'forwards'))}})
    + person({k:'mom', x:298, y:226, m:'happy', m2:'worried', sw:2.6, st:{hair:gray, hd:A(a(R(0, -8), .5, 2.7, 'forwards'))}})
    + person({k:'girl', x:338, y:226, m:'happy', st:{mv:grow}}));
}

/* ---------- happy ending and splash ---------- */
function hope(){
  const cheer = (k, x, d) => person({k, x, y:226, m:'joy', aL:150, aR:-150, st:{
    bod: A(a(kf('to{transform:translateY(-9px)}'), .42, d, 'infinite alternate', 'ease-in-out')),
    armL: A(a(R(150, 132), .42, d, 'infinite alternate', 'ease-in-out')),
    armR: A(a(R(-150, -132), .42, d, 'infinite alternate', 'ease-in-out'))}});
  const spark = (x, y, d) => at(x, y, 'opacity:0;' + A(a(kf('0%{opacity:0;transform:scale(.2)}40%{opacity:1;transform:scale(1.1)}100%{opacity:0;transform:scale(.8)}'), 1.4, d, 'infinite')),
    `<path d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2Z" fill="#ffe9a8"/>`);
  return svg('c9',
      `<defs><radialGradient id="cartSun"><stop offset="0" stop-color="#ffe2a6"/><stop offset=".45" stop-color="#ffc46b" stop-opacity=".9"/><stop offset="1" stop-color="#ff8a5b" stop-opacity="0"/></radialGradient><clipPath id="cartSky"><rect width="360" height="226"/></clipPath></defs>`
    + `<g clip-path="url(#cartSky)">` + at(180, 226, A(a(T(0, 70, 0, 0), 2.4, 0, 'both', 'cubic-bezier(.16,1,.3,1)')), `<circle r="96" fill="url(#cartSun)"/>`) + `</g>`
    + ground()
    + cheer('boy', 112, 0) + cheer('dad', 152, .2) + cheer('mom', 204, .1) + cheer('girl', 246, .3)
    + spark(70, 70, .3) + spark(290, 60, .8) + spark(180, 34, 1.2) + spark(320, 140, 1.6) + spark(40, 150, 2));
}
function splash(){
  return svg('cs', `<line x1="60" y1="186" x2="300" y2="186" stroke="rgba(255,255,255,.22)" stroke-width="2" stroke-linecap="round"/>`
    + person({k:'boy', x:116, y:186, m:'happy', st:{bod:A(a(HOP, .5, .2, 'infinite alternate', 'ease-in-out'))}})
    + person({k:'dad', x:154, y:186, m:'happy', aR:-150, st:{armR:A(a(R(-150, -118), .4, 0, 'infinite alternate', 'ease-in-out'))}})
    + person({k:'mom', x:204, y:186, m:'happy', aL:20})
    + person({k:'girl', x:244, y:186, m:'joy', aL:150, st:{
        armL:A(a(R(150, 118), .4, .2, 'infinite alternate', 'ease-in-out')),
        bod:A(a(HOP, .5, 0, 'infinite alternate', 'ease-in-out'))}}), '0 0 360 200');
}

const CLIPS = [c1, c2, c3, c4, c5, c6, c7, c8];
window.CART = { clip:(i, L) => CLIPS[i](L.someday || 'SOMEDAY'), hope, splash, count:CLIPS.length };
})();
