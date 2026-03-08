/* ─────────────────────────────────────────
   GSAP Registration
───────────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────── */
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.08 });
});

// Smooth follower
(function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    gsap.set(follower, { x: followerX, y: followerY });
    requestAnimationFrame(animateFollower);
})();

/* ─────────────────────────────────────────
   LOADER  0% → 100%
───────────────────────────────────────── */
const loaderEl   = document.getElementById('loader');
const loaderNum  = document.getElementById('loader-num');
const loaderFill = document.getElementById('loader-fill');

const bootMessages = [
    "Initializing secure kernel…",
    "Decrypting payloads…",
    "Loading threat models…",
    "Bypassing firewalls…",
    "Mapping attack surface…",
    "Boot sequence complete."
];

let progress  = 0;
let msgIndex  = 0;
const loaderInterval = setInterval(() => {
    progress += Math.random() * 14;
    if (progress >= 100) {
        progress = 100;
        clearInterval(loaderInterval);

        // Brief pause then dismiss loader
        setTimeout(() => {
            loaderEl.classList.add('out');
            setTimeout(() => loaderEl.remove(), 700);

            // Animate hero elements in after loader disappears
            gsap.from('.hero-name', { y: 60, opacity: 0, duration: 1.2, ease: 'power4.out', delay: 0.2 });
            gsap.from('.badge', { y: 40, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.4 });
            gsap.from('.hero-portrait-wrap', { scale: 0.9, opacity: 0, duration: 1.4, ease: 'power3.out', delay: 0.1 });

            // Refresh ScrollTrigger after DOM settles
            setTimeout(() => ScrollTrigger.refresh(), 500);
        }, 400);
    }

    loaderNum.textContent  = Math.floor(progress);
    loaderFill.style.width = progress + '%';

    // Cycle boot messages
    const msgStep = Math.floor(progress / (100 / bootMessages.length));
    if (msgStep > msgIndex && msgIndex < bootMessages.length) {
        msgIndex = msgStep;
    }
}, 110);

/* ─────────────────────────────────────────
   HAMBURGER / NAV OVERLAY
───────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const navOverlay = document.getElementById('nav-overlay');
const navLinks   = document.querySelectorAll('.nav-link-item');

hamburger.addEventListener('click', () => {
    const isOpen = navOverlay.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    navOverlay.setAttribute('aria-hidden', !isOpen);
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navOverlay.classList.remove('open');
        hamburger.classList.remove('active');
    });
});

/* ─────────────────────────────────────────
   SPIDER-MAN MASK REVEAL  (clip-path circle)
───────────────────────────────────────── */
const portraitWrap = document.getElementById('portrait-wrap');
const maskLayer    = document.getElementById('mask-layer');

if (portraitWrap && maskLayer) {
    portraitWrap.addEventListener('mousemove', e => {
        const { left, top } = portraitWrap.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        // Iron Man gold tint: warm amber-gold overlay
        const radius = 130;
        gsap.to(maskLayer, {
            clipPath: `circle(${radius}px at ${x}px ${y}px)`,
            duration: 0.55,
            ease: 'power3.out'
        });
    });

    portraitWrap.addEventListener('mouseleave', () => {
        gsap.to(maskLayer, {
            clipPath: 'circle(0px at 50% 50%)',
            duration: 0.9,
            ease: 'power3.out'
        });
    });
}

/* ─────────────────────────────────────────
   FLOATING KEYWORD PARALLAX (scroll-based)
───────────────────────────────────────── */
const floaters = document.querySelectorAll('.float-cloud span');
floaters.forEach((el, i) => {
    const depth = (i % 3) + 1;
    gsap.to(el, {
        y: `-=${depth * 80}`,
        ease: 'none',
        scrollTrigger: {
            trigger: '.intro-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: depth * 0.8
        }
    });
});

/* ─────────────────────────────────────────
   SCROLL REVEAL  (data-reveal via GSAP)
───────────────────────────────────────── */
gsap.utils.toArray('[data-reveal]').forEach((el, i) => {
    gsap.fromTo(el,
        { opacity: 0, y: 60 },
        {
            opacity: 1, y: 0,
            duration: 1,
            delay: (i % 3) * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none'
            }
        }
    );
});

/* ─────────────────────────────────────────
   PROJECT HOVER IMAGE PREVIEW
───────────────────────────────────────── */
const projectRows    = document.querySelectorAll('.project-row');
const imgPreview     = document.getElementById('project-img-preview');
let previewRAF;

projectRows.forEach(row => {
    const imgUrl = row.getAttribute('data-img');

    row.addEventListener('mouseenter', () => {
        if (!imgUrl) return;
        imgPreview.style.backgroundImage = `url(${imgUrl})`;
        imgPreview.classList.add('shown');
    });

    row.addEventListener('mouseleave', () => {
        imgPreview.classList.remove('shown');
    });

    row.addEventListener('mousemove', e => {
        cancelAnimationFrame(previewRAF);
        previewRAF = requestAnimationFrame(() => {
            gsap.to(imgPreview, {
                x: e.clientX + 30,
                y: e.clientY - 125,
                duration: 0.6,
                ease: 'power2.out'
            });
        });
    });
});

/* ─────────────────────────────────────────
   GSAP HERO TEXT  (glitch flicker on load)
───────────────────────────────────────── */
function glitchHero() {
    const heroName = document.querySelector('.hero-name');
    if (!heroName) return;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 4 });
    tl.to(heroName, { x: -4, duration: 0.05, ease: 'steps(1)' })
      .to(heroName, { x: 4, duration: 0.05, ease: 'steps(1)' })
      .to(heroName, { x: 0, duration: 0.05, ease: 'steps(1)' })
      .to(heroName, { x: -2, duration: 0.03, ease: 'steps(1)', delay: 0.1 })
      .to(heroName, { x: 0, duration: 0.03, ease: 'steps(1)' });
}
setTimeout(glitchHero, 3000);

/* ═════════════════════════════════════════
   ██  HACKER EXTRAS JS  ██
═════════════════════════════════════════ */

/* ── LIVE CLOCK in hero corner ── */
const heroClock = document.getElementById('hero-clock');
function updateClock() {
    if (!heroClock) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2,'0');
    const mm = String(now.getMinutes()).padStart(2,'0');
    const ss = String(now.getSeconds()).padStart(2,'0');
    heroClock.textContent = `${hh}:${mm}:${ss}`;
}
setInterval(updateClock, 1000);
updateClock();

/* ── LIVE HEX TICKER in header ── */
const hexTickerEl = document.getElementById('hex-ticker');
const hexMessages = [
    'SYS_OK', 'CONN_SECURE', 'THREAT::NONE', 'AUTH_OK',
    'SCAN_ACTIVE', 'FW_ENABLED', 'PKT_SNIFF::OFF', 'ZERO_TRUST::ON'
];
let hexMsgIdx = 0;
function updateHexTicker() {
    if (!hexTickerEl) return;
    const hex = '0x' + Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4,'0');
    hexTickerEl.textContent = `${hex} :: ${hexMessages[hexMsgIdx % hexMessages.length]}`;
    hexMsgIdx++;
}
setInterval(updateHexTicker, 2000);

/* ── BOOT LOG during loader ── */
const bootLog = document.getElementById('loader-boot-log');
const loaderHex = document.getElementById('loader-hex');
const hackerBootLines = [
    { text: '> AUTH MODULE LOADED', cls: 'ok' },
    { text: '> KERNEL v2.5.1 INITIALIZED', cls: 'ok' },
    { text: '> LOADING THREAT DATABASE...', cls: '' },
    { text: '> CVE SCAN: 0 CRITICAL', cls: 'ok' },
    { text: '> FIREWALL ENABLED', cls: 'ok' },
    { text: '> DECRYPTING PAYLOAD...', cls: '' },
    { text: '> ZERO-TRUST: ACTIVE', cls: 'ok' },
    { text: '> ALL SYSTEMS NOMINAL', cls: 'ok' },
];
let bootLineIdx = 0;
const bootLogInterval = setInterval(() => {
    if (!bootLog || bootLineIdx >= hackerBootLines.length) {
        clearInterval(bootLogInterval);
        return;
    }
    const line = hackerBootLines[bootLineIdx];
    const span = document.createElement('span');
    span.textContent = line.text;
    if (line.cls) span.classList.add(line.cls);
    bootLog.appendChild(span);
    bootLineIdx++;

    // Also update hex display
    if (loaderHex) {
        loaderHex.textContent = '0x' + Math.floor(Math.random() * 0xFFFF)
            .toString(16).toUpperCase().padStart(4,'0');
    }
}, 600);

/* ── RANDOM GLITCH BAR that flickers across screen ── */
const glitchBar = document.getElementById('glitch-bar');
function triggerGlitchBar() {
    if (!glitchBar) return;
    const y = Math.random() * window.innerHeight;
    glitchBar.style.top = y + 'px';
    glitchBar.style.opacity = '1';
    glitchBar.style.height = (Math.random() * 4 + 1) + 'px';
    setTimeout(() => {
        glitchBar.style.opacity = '0';
    }, 80 + Math.random() * 80);
}
setInterval(triggerGlitchBar, 3000 + Math.random() * 5000);
// Random extra flash
setInterval(() => {
    if (Math.random() > 0.6) triggerGlitchBar();
}, 7000);

/* ── BINARY STRIP — randomize content periodically ── */
const binaryStripEl = document.getElementById('binary-strip');
function randomByte() {
    return Math.floor(Math.random() * 256).toString(2).padStart(8, '0');
}
function refreshBinaryStrip() {
    if (!binaryStripEl) return;
    const bytes = Array.from({ length: 20 }, randomByte).join(' ');
    binaryStripEl.textContent = bytes;
}
setInterval(refreshBinaryStrip, 3000);

