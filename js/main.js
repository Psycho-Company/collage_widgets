// Widget loader — fetch all component files into #widgets
const widgetFiles = [
  '01-vinyl', '02-cassette', '03-soundwave', '04-equalizer', '07-sleeve',
  '09-polaroid', '10-filmstrip', '11-magazine', '12-lightbox', '13-sticker',
  '14-photobooth', '15-pinned', '16-glass', '17-crttv', '18-clapperboard',
  '19-ticket', '23-sticky', '24-typewriter', '25-neon', '26-newspaper',
  '27-chat', '28-graffiti', '29-passport'
];

Promise.all(widgetFiles.map(f => fetch('widgets/' + f + '.html').then(r => r.text())))
  .then(htmls => {
    document.getElementById('widgets').innerHTML = htmls.join('\n');
    init();
  });

// Nav scrolling
function go(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  event.target.classList.add('active');
}

// Runs after all widgets are loaded
function init() {
  // Generate barcode for receipt typewriter
  const bc = document.getElementById('tw-barcode');
  if (bc) {
    for (let i = 0; i < 28; i++) {
      const b = document.createElement('div');
      b.className = 'tw-bar';
      b.style.height = (8 + Math.random() * 16) + 'px';
      bc.appendChild(b);
    }
  }

  // Generate sound wave bars
  document.querySelectorAll('.sw-gen').forEach(el => {
    for (let i = 0; i < 30; i++) {
      const b = document.createElement('div');
      b.className = 'swb-bar';
      b.style.cssText = `height:${3 + Math.random() * 18}px;animation:barB ${0.4 + Math.random() * 0.6}s ${Math.random() * 0.8}s ease-in-out infinite alternate`;
      el.appendChild(b);
    }
  });

  // Generate EQ bars
  document.querySelectorAll('.eq-gen').forEach(el => {
    for (let i = 0; i < 7; i++) {
      const b = document.createElement('div');
      b.className = 'eq-bar';
      b.style.cssText = `width:10px;height:${8 + Math.random() * 40}px;animation:barB ${0.4 + Math.random() * 0.5}s ${i * 0.1}s ease-in-out infinite alternate`;
      el.appendChild(b);
    }
  });

  // Scroll spy
  const sections = document.querySelectorAll('.widget-section');
  const pills = document.querySelectorAll('.pill');
  const cats = [['s1', 's8'], ['s9', 's16'], ['s17', 's22'], ['s23', 's28'], ['s29', 's30']];
  window.addEventListener('scroll', () => {
    const y = window.scrollY + 250;
    sections.forEach(s => {
      if (s.offsetTop <= y && s.offsetTop + s.offsetHeight > y) {
        const id = s.id;
        let pi = 0;
        cats.forEach((c, ci) => {
          const n = parseInt(id.replace('s', ''));
          const lo = parseInt(c[0].replace('s', ''));
          const hi = parseInt(c[1].replace('s', ''));
          if (n >= lo && n <= hi) pi = ci;
        });
        pills.forEach(p => p.classList.remove('active'));
        pills[pi]?.classList.add('active');
      }
    });
  });

  // Click-to-play for video widgets
  const videoSrc = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
  let activeVid = null;
  ['s17', 's18', 's19'].forEach(id => {
    const sec = document.getElementById(id);
    if (!sec) return;
    sec.querySelectorAll('.vcard').forEach(card => {
      // Find the screen area to put the video in
      const screen = card.querySelector('.crt-sc, .ch-screen, .clap-th, .tkt-th, .th-img');
      if (!screen) return;
      const vid = document.createElement('video');
      vid.className = 'widget-video';
      vid.src = videoSrc;
      vid.loop = true;
      vid.muted = true;
      vid.playsInline = true;
      vid.preload = 'none';
      screen.style.position = 'relative';
      screen.appendChild(vid);
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        if (activeVid === card) {
          vid.pause();
          card.classList.remove('vid-playing');
          activeVid = null;
        } else {
          if (activeVid) {
            const prevVid = activeVid.querySelector('.widget-video');
            if (prevVid) prevVid.pause();
            activeVid.classList.remove('vid-playing');
          }
          card.classList.add('vid-playing');
          vid.currentTime = 0;
          vid.play().catch(() => {});
          activeVid = card;
        }
      });
    });
  });

  // Click-to-play for sound widgets
  const audio = new Audio('music.mp3');
  audio.loop = true;
  audio.volume = 0.5;
  let active = null;
  ['s1', 's2', 's3', 's4', 's7'].forEach(id => {
    const sec = document.getElementById(id);
    if (!sec) return;
    sec.querySelectorAll('.vcard').forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        if (active === card) {
          card.classList.remove('playing');
          audio.pause();
          active = null;
        } else {
          if (active) active.classList.remove('playing');
          card.classList.add('playing');
          audio.currentTime = 0;
          audio.play().catch(() => {});
          active = card;
        }
      });
    });
  });
}
