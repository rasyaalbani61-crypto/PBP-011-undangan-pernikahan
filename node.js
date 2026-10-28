const $ = (id) => document.getElementById(id);
const TANGGAL_ACARA = new Date('2026-11-20T09:00:00+07:00');

/* nama tamu dari link */
const kpd = new URLSearchParams(location.search).get('kpd');
if (kpd) $('namaTamu').textContent = kpd;

/* toast */
let tt;
function toast(t){ const e=$('toast'); e.textContent=t; e.classList.add('on'); clearTimeout(tt); tt=setTimeout(()=>e.classList.remove('on'),1600); }


/* kelopak cover */
(function(){
  let seed = 7;
  const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const c = $('cover');
  for (let i = 0; i < 14; i++) {
    const k = document.createElement('i'); k.className = 'kelopak';
    k.style.left = (rnd()*100) + '%'; k.style.animationDuration = (8 + rnd()*8) + 's'; k.style.animationDelay = (-rnd()*12) + 's';
    k.style.transform = `scale(${.7 + rnd()*.7})`;
    c.appendChild(k);
  }
})();

/* musik */
const musik = $('musik');
function setMusik(nyala){
  if(nyala){ musik.play().then(()=>{ $('btnMusik').classList.add('on'); }).catch(()=>toast('File musik belum tersedia')); }
  else { musik.pause(); $('btnMusik').classList.remove('on'); }
}
$('btnMusik').addEventListener('click', () => { const m = musik.paused; setMusik(m); toast(m ? 'Musik menyala' : 'Musik dimatikan'); });

/* buka sampul */
$('btnBuka').addEventListener('click', () => {
  $('cover').classList.add('buka');
  document.body.classList.remove('terkunci');
  $('menu').classList.add('muncul');
  window.scrollTo(0,0);
  setMusik(true); /* butuh klik dulu */
  setTimeout(()=>$('cover').style.display='none',2100);
});

/* auto scroll */
let auto = null;
function stopAuto(){ if(auto){ clearInterval(auto); auto=null; $('btnScroll').classList.remove('on'); } }
$('btnScroll').addEventListener('click', () => {
  if(auto){ stopAuto(); toast('Auto Scroll Off'); return; }
  $('btnScroll').classList.add('on'); toast('Auto Scroll Active');
  auto = setInterval(() => {
    window.scrollBy(0,3);
    if (innerHeight + scrollY >= document.body.scrollHeight - 2) stopAuto();
  }, 22);
});
['wheel','touchstart'].forEach(ev => addEventListener(ev, stopAuto, {passive:true}));

/* hitung mundur */
function hitung(){
  const s = Math.max(0, Math.floor((TANGGAL_ACARA - new Date())/1000));
  $('h').textContent = Math.floor(s/86400);
  $('j').textContent = Math.floor(s%86400/3600);
  $('m').textContent = Math.floor(s%3600/60);
  $('d').textContent = s%60;
}
hitung(); setInterval(hitung,1000);

/* animasi scroll & menu aktif */
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('tampil')), {threshold:.12});
document.querySelectorAll('.fade').forEach(el => io.observe(el));
const links = document.querySelectorAll('nav a');
const io2 = new IntersectionObserver(es => es.forEach(e => {
  if(e.isIntersecting) links.forEach(a => a.classList.toggle('aktif', a.getAttribute('href') === '#'+e.target.id));
}), {threshold:.4});
document.querySelectorAll('main section').forEach(s => io2.observe(s));

/* pasang ornamen */
(function(){
  const hias = (kelas, id, vb) => `<svg class="hias ${kelas}" viewBox="${vb}" aria-hidden="true"><use href="#${id}"/></svg>`;
  document.querySelectorAll('main section').forEach(s => {
    if (s.id === 'pembuka') return;
    s.insertAdjacentHTML('afterbegin',
      hias('sudut kiri','sulur-sudut','0 0 160 160') + hias('sudut kanan','sulur-sudut','0 0 160 160') +
      hias('awan-hias a1','awan-jawa','0 0 200 100') + hias('awan-hias a2','awan-jawa','0 0 200 100'));
  });
  const gun = hias('gunungan','gunungan','0 0 60 84');
  document.querySelectorAll('main section h2').forEach(h => h.insertAdjacentHTML('beforebegin', gun));
  $('beranda').querySelector('.kecil').insertAdjacentHTML('beforebegin', gun);
  $('mempelai').querySelector('.orang').insertAdjacentHTML('beforebegin', gun);

  /* posisi wayang */
  const WAYANG = [
    /* sisi, atas%, lebar, putar, cermin, jarak */
    [['kiri', 10, 56, -14, 0], ['kanan', 70, 60, 12, 1],
     ['dkiri', 52, 55, -10, 0, 235], ['dkanan', 36, 60, 14, 1, 245]],

    [['kanan', 8, 64, 16, 1], ['kiri', 58, 52, -10, 0],
     ['dkanan', 30, 52, 12, 0, 260], ['dkiri', 70, 56, -16, 1, 250]],

    [['kiri', 30, 72, -6, 1], ['kanan', 72, 56, 20, 0],
     ['dkiri', 40, 50, -12, 0, 140], ['dkanan', 62, 54, 10, 1, 150]],

    [['kanan', 22, 54, -18, 0], ['kiri', 64, 68, 9, 1],
     ['dkiri', 25, 52, -8, 1, 300], ['dkanan', 55, 56, 16, 0, 310]],
  ];
  document.querySelectorAll('main section').forEach((s, i) => {
    if (s.id === 'pembuka') return;
    WAYANG[i % WAYANG.length].forEach(([sisi, atas, lebar, putar, cermin, jarak], n) => {
      s.insertAdjacentHTML('afterbegin',
        `<img src="wayang.png" alt="" aria-hidden="true" class="wayang ${sisi}"` +
        ` style="top:${atas}%;--w:${lebar}px;--r:${putar}deg;--m:${cermin ? -1 : 1};` +
        `--g:${jarak || 0}px;animation-delay:${-(i * 2 + n * 3)}s">`);
    });
  });

  /* daun jatuh */
  const lay = document.createElement('div'); lay.className = 'daun-layer'; lay.setAttribute('aria-hidden','true');
  for (let i = 0; i < 9; i++) {
    const d = document.createElement('i');
    d.style.left = (Math.random()*100) + '%';
    d.style.animationDuration = (16 + Math.random()*14) + 's';
    d.style.animationDelay = (-Math.random()*24) + 's';
    lay.appendChild(d);
  }
  document.body.appendChild(lay);
})();

/* animasi pembuka */
const ioP = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('tampil'); ioP.unobserve(e.target); }
}), {threshold:.35});
ioP.observe($('pembuka'));

/* lightbox */
const lb = $('lightbox');
document.querySelectorAll('#galeriGrid button').forEach(b => b.addEventListener('click', () => {
  lb.firstElementChild.style.backgroundImage = b.style.backgroundImage; lb.classList.add('on');
}));
lb.addEventListener('click', () => lb.classList.remove('on'));
addEventListener('keydown', e => e.key==='Escape' && lb.classList.remove('on'));

/* salin rekening */
document.querySelectorAll('.salin').forEach(b => b.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(b.dataset.no); toast('Nomor rekening disalin'); }
  catch { toast('Salin manual: ' + b.dataset.no); }
}));

/* RSVP (Google Sheets) */
const URL_SHEET = 'https://script.google.com/macros/s/AKfycbxgLXaLhS9SnxEYKiLz0vN_61jZ7wl6FKE4eXPpfbfrBSftL4Vw8hiyJYrtisdShTaDoQ/exec';

/* escape HTML */
const esc = (t) => String(t).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* tampilkan ucapan */
async function tampil(){
  let d = [];
  try { d = await (await fetch(URL_SHEET)).json(); } catch {}
  $('daftar').innerHTML = d.length
    ? d.map(u => `<div class="ucap"><b>${esc(u.nama)}</b><em>${esc(u.status)}</em><p>${esc(u.pesan)}</p></div>`).join('')
    : '<p class="kosong">Belum ada ucapan. Jadilah yang pertama.</p>';
}

/* posisi teks di kartu */
const POS = {
  nama:   { x: .10, y: .405 },
  ucapan: { x: .10, y: [.505, .548], lebar: .80 },
  hadir:  { x: .137, y: .658 },
  tidak:  { x: .463, y: .658 },
  jumlah: { x: .47,  y: .738 }
};

/* bungkus teks */
function bungkus(x, teks, maxW, maxBaris){
  const baris = []; let cur = '';
  for (const k of teks.split(/\s+/)) {
    const t = cur ? cur + ' ' + k : k;
    if (x.measureText(t).width > maxW && cur) { baris.push(cur); cur = k; } else cur = t;
  }
  if (cur) baris.push(cur);
  if (baris.length > maxBaris) {
    baris.length = maxBaris;
    let l = baris[maxBaris - 1];
    while (x.measureText(l + '…').width > maxW) l = l.slice(0, -1);
    baris[maxBaris - 1] = l + '…';
  }
  return baris;
}

/* buat kartu kehadiran */
async function kartuKehadiran(d){
  try { await document.fonts.load('600 20px Nunito'); } catch {}
  const img = new Image();
  await new Promise((ok, gagal) => { img.onload = ok; img.onerror = gagal; img.src = 'kartu_hadir.png'; })
    .catch(() => toast('File kartu_hadir.png tidak ditemukan'));
  if (!img.naturalWidth) return;

  const W = img.naturalWidth, H = img.naturalHeight;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  x.drawImage(img, 0, 0);
  x.fillStyle = '#2c3e6b';
  x.font = `600 ${W * .042}px Nunito, sans-serif`;

  x.fillText(d.nama, POS.nama.x * W, POS.nama.y * H);

  x.font = `400 ${W * .037}px Nunito, sans-serif`;
  bungkus(x, d.pesan, POS.ucapan.lebar * W, 2)
    .forEach((b, i) => x.fillText(b, POS.ucapan.x * W, POS.ucapan.y[i] * H));

  /* centang */
  const p = d.status === 'Hadir' ? POS.hadir : POS.tidak, s = W * .03;
  x.strokeStyle = '#c0392b'; x.lineWidth = W * .009; x.lineCap = x.lineJoin = 'round';
  x.beginPath();
  x.moveTo(p.x * W - s, p.y * H);
  x.lineTo(p.x * W - s * .3, p.y * H + s * .7);
  x.lineTo(p.x * W + s, p.y * H - s * .8);
  x.stroke();

  if (d.status === 'Hadir') {
    x.textAlign = 'center'; x.font = `700 ${W * .045}px Nunito, sans-serif`;
    x.fillText(parseInt(d.jumlah), POS.jumlah.x * W, POS.jumlah.y * H);
  }

  const a = document.createElement('a');
  a.href = c.toDataURL('image/png');
  a.download = 'Kartu-Kehadiran-' + d.nama.replace(/[^\w\- ]/g, '') + '.png';
  a.click();
}

/* submit form */
$('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target, tombol = form.querySelectorAll('button');
  const data = {
    nama: $('fNama').value.trim(), pesan: $('fPesan').value.trim(),
    status: e.submitter ? e.submitter.dataset.s : 'Hadir', jumlah: $('fJumlah').value
  };
  tombol.forEach(b => b.disabled = true);
  $('status').textContent = 'Mengirim...';
  try {
    await fetch(URL_SHEET, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(data) });
    $('status').textContent = 'Terima kasih, konfirmasi Anda sudah tercatat. Kartu kehadiran sedang diunduh.';
    await kartuKehadiran(data);
    form.reset();
    setTimeout(tampil, 1500);
  } catch {
    $('status').textContent = 'Gagal mengirim. Periksa koneksi lalu coba lagi.';
  }
  tombol.forEach(b => b.disabled = false);
});
tampil();