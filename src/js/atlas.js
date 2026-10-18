import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const $ = s => document.querySelector(s);
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const IC = {
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
  heart: 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6',
  cart: 'M3 4h3l2.5 11h9L20 7H7M10 20h.01M17 20h.01',
  cube: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5',
  ruler: 'M3 17L17 3l4 4L7 21zM8 12l2 2M11 9l2 2M14 6l2 2',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  ar: 'M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M12 8l4 2.5v4L12 17l-4-2.5v-4z',
  drop: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2',
  clock: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 8v4l3 2',
  soil: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
  cal: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
};
const ico = n => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${IC[n]}"/></svg>`;
document.querySelectorAll('[data-i]').forEach(e => e.insertAdjacentHTML('afterbegin', ico(e.dataset.i)));

// Bilgiler sagfidancilik.com ürün sayfalarından alınmıştır. h = yaklaşık yetişkin boy (metre).
const PLANTS = [
  { id: 'portakal', name: 'Washington Portakal Fidanı', latin: 'Citrus sinensis', tax: 'Rutaceae', type: 'Portakal', h: 5,
    tags: ['Çekirdeksiz', 'Sofralık', 'Orta erkenci'],
    desc: 'Tatlı, aromalı ve çekirdeksiz meyveleriyle iç piyasada ve ihracatta en çok aranan sofralık portakallardan. Orta güçlü ağaçları yuvarlak taç yapar.',
    traits: [['cal', 'Olgunlaşma', 'Kasım'], ['clock', 'Hasat', 'Aralık'], ['sun', 'Meyve', '200–250 g'], ['drop', 'Su oranı', '≈ %33'], ['soil', 'Anavatan', 'Brezilya']],
    habitat: 'Ilık, don riski düşük turunçgil bölgeleri; Akdeniz kıyı ovaları.',
    close: 'Koyu turuncu, düzgün yuvarlak meyve; gevrek et ve ete sıkı bağlı kabuk. Çapı 75–80 mm.',
    quote: 'Kış sofrasının en tatlı portakalı.',
    leaf: '#3f6b34', blobs: 8, crown: .3, spread: .42, lift: .22, fruit: 7, fruitC: '#f28c28', seed: 11 },
  { id: 'limon', name: 'Kütdiken Limon Fidanı', latin: 'Citrus limon', tax: 'Rutaceae', type: 'Limon', h: 4,
    tags: ['Yediveren', 'Kirece dayanıklı', 'Uzun ömürlü'],
    desc: 'Kolay çoğalan, dış etkenlere dayanıklı ve uzun ömürlü bir limon çeşidi. Kazık kök oluşturmaya uygundur.',
    traits: [['cal', 'Olgunlaşma', 'Kasım'], ['clock', 'Hasat', 'Kasım–Şubat'], ['sun', 'Meyve', '120–125 g'], ['drop', 'Su oranı', '≈ %33'], ['soil', 'Toprak', 'Kirece dayanıklı']],
    habitat: 'Ilık kıyı iklimleri; kireçli topraklara iyi uyum sağlar.',
    close: 'Açık yeşil-sarı, düzgün ve parlak kabuk; elipse yakın meyve, ortalama 10 çekirdek.',
    quote: 'Kasımda başlar, şubata kadar verir.',
    leaf: '#4f7a3a', blobs: 7, crown: .28, spread: .36, lift: .2, fruit: 6, fruitC: '#f0d23c', seed: 23 },
  { id: 'zeytin', name: 'Gemlik Zeytin Fidanı', latin: 'Olea europaea', tax: 'Oleaceae', type: 'Zeytin', h: 7,
    tags: ['Sofralık', 'Yağlık', 'Dayanıklı'],
    desc: 'Hem sofralık hem yağlık değerlendirilen, siyah kabuklu bir Anadolu çeşidi. Orta güçte büyür ve dayanıklıdır.',
    traits: [['clock', 'Hasat', 'Kasım–Ocak'], ['drop', 'Yağ oranı', '≈ %30'], ['sun', 'Meyve', 'Orta boy, siyah'], ['cal', 'Kullanım', 'Sofralık / yağlık'], ['soil', 'Anavatan', 'Anadolu']],
    habitat: 'Akdeniz ve Ege ikliminin güneşli yamaçları.',
    close: 'Yuvarlaktan silindiriğe uzanan siyah meyveler; çekirdekler orta irilikte.',
    quote: 'Zeytin acele etmez, ama hiçbir şeyi unutmaz.',
    leaf: '#7f9a6e', blobs: 8, crown: .2, spread: .32, lift: .3, fruit: 6, fruitC: '#3b2f3a', seed: 37 },
  { id: 'nar', name: 'Katırbaşı Nar Fidanı', latin: 'Punica granatum', tax: 'Lythraceae', type: 'Nar', h: 2.5,
    tags: ['Küçük boylu', 'Sofralık', 'Taşımaya dayanıklı'],
    desc: 'Doğal olarak küçük boylu kalır; birim alana daha çok fidan dikilir, hasat ve ilaçlama kolaylaşır. Dikimden kısa süre sonra meyve verir.',
    traits: [['sun', 'Ağaç', 'Küçük boylu'], ['drop', 'Tane', 'Kırmızı / pembe'], ['clock', 'İlk ürün', 'Erken'], ['cal', 'Kullanım', 'Sofralık'], ['soil', 'Dayanıklılık', 'Taşıma, depolama']],
    habitat: 'Sıcak ve güneşli bölgeler; küçük boyu sayesinde sık dikime uygun.',
    close: 'Sarı zemin üzerinde kırmızı noktalı, orta sert kabuk; iri ve lezzetli meyveler.',
    quote: 'Küçük ağaç, iri meyve.',
    leaf: '#5b8a3e', blobs: 7, crown: .26, spread: .4, lift: .2, fruit: 5, fruitC: '#b3262f', seed: 53 },
];

/* ---------- Panel, sekmeler, noktalar ---------- */
const ring = $('#ring'), fade = $('#fade'), sizeTag = $('#size');
$('#tabs').innerHTML = PLANTS.map((p, i) => `<button class="tab" data-i="${i}" role="tab" aria-selected="false"><span class="dot"></span><span><b>${p.name.replace(' Fidanı', '')}</b><small>${p.type}</small></span></button>`).join('');
$('#dots').innerHTML = PLANTS.map((p, i) => `<button data-i="${i}" aria-label="${p.name}"></button>`).join('');

function paint(p) {
  $('#tax').textContent = p.tax; $('#name').textContent = p.name; $('#latin').textContent = p.latin;
  $('#tags').innerHTML = p.tags.map(t => `<span class="pill">${t}</span>`).join('');
  $('#desc').textContent = p.desc;
  $('#traits').innerHTML = p.traits.map(([i, l, v]) => `<div class="row">${ico(i)}<span class="lbl">${l}</span><b>${v}</b></div>`).join('');
  $('#habitat').textContent = p.habitat; $('#close').textContent = p.close;
  $('#quote').textContent = p.quote; sizeTag.textContent = `Yetişkin boy ≈ ${p.h} m`;
}
function mark(i) {
  document.querySelectorAll('.tab').forEach((t, k) => t.setAttribute('aria-selected', k === i));
  document.querySelectorAll('.dots button').forEach((d, k) => d.toggleAttribute('aria-current', k === i));
}

/* ---------- 3D görüntüleyici ---------- */
const cv = $('#gl');
const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(35, 1, .1, 50);
scene.add(new THREE.HemisphereLight(0xffffff, 0x9db497, 1.1));
const sun = new THREE.DirectionalLight(0xffffff, 1.6); sun.position.set(3, 6, 4); scene.add(sun);
const ctl = new OrbitControls(cam, cv);
Object.assign(ctl, { enableDamping: true, enablePan: false, minDistance: 4, maxDistance: 14, autoRotate: !REDUCED, autoRotateSpeed: 1.2 });
const home = () => { cam.position.set(0, 2.4, 9); ctl.target.set(0, 1.5, 0); ctl.update(); };
home();
new ResizeObserver(() => {
  const w = cv.clientWidth, h = cv.clientHeight;
  renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
}).observe(cv);
renderer.setAnimationLoop(() => {
  ctl.update();
  ring.style.setProperty('--rot', ctl.getAzimuthalAngle() + 'rad');
  renderer.render(scene, cam);
});

let wire = false;
const applyWire = () => scene.traverse(o => { if (o.material) o.material.wireframe = wire; });

// Her modeli 1 birim boya normalle, sonra gerçek boya oranla ölçekle (göreli boyut korunur).
function norm(o) {
  const b = new THREE.Box3().setFromObject(o), c = b.getCenter(new THREE.Vector3());
  o.position.set(-c.x, -b.min.y, -c.z);
  const w = new THREE.Group(); w.add(o); w.scale.setScalar(1 / (b.max.y - b.min.y));
  const g = new THREE.Group(); g.add(w); return g;
}
function procedural(p) {
  const g = new THREE.Group(), mat = c => new THREE.MeshStandardMaterial({ color: c, flatShading: true, roughness: .9 });
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(.11, .08, .12, 10), mat('#b5764e')); pot.position.y = .06; g.add(pot);
  const tr = new THREE.Mesh(new THREE.CylinderGeometry(.018, .03, .5, 6), mat('#6b4b32')); tr.position.y = .37; g.add(tr);
  let r = p.seed; const rnd = () => (r = r * 16807 % 2147483647) / 2147483647;
  for (let i = 0; i < p.blobs; i++) {
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(p.crown * (.6 + rnd() * .4), 1), mat(p.leaf));
    m.position.set((rnd() - .5) * p.spread, .62 + rnd() * p.lift, (rnd() - .5) * p.spread); g.add(m);
  }
  for (let i = 0; i < p.fruit; i++) {
    const f = new THREE.Mesh(new THREE.SphereGeometry(.03, 8, 6), mat(p.fruitC));
    f.position.set((rnd() - .5) * p.spread * 1.3, .6 + rnd() * p.lift, (rnd() - .5) * p.spread * 1.3); g.add(f);
  }
  return g;
}
// /models/<id>.glb varsa onu yükler, yoksa yukarıdaki basit modele döner.
const cache = {};
const template = p => cache[p.id] ??= new Promise(res =>
  new GLTFLoader().load(`/models/${p.id}.glb`, g => res(norm(g.scene)), undefined, () => res(norm(procedural(p)))));

const ease = { in: t => t * t * t, out: t => 1 - (1 - t) ** 3 };
const tween = (ms, fn, ef) => new Promise(done => {
  const t0 = performance.now();
  (function step(n) { const t = Math.min(1, (n - t0) / Math.max(ms, 1)); fn(ef(t)); t < 1 ? requestAnimationFrame(step) : done(); })(t0);
});
const D = REDUCED ? 0 : 280;
const worldH = p => Math.max(.9, 3.2 * p.h / 12);

let cur = -1, token = 0, shown = null;
async function select(i) {
  if (i === cur) return;
  const mine = ++token, first = cur < 0, p = PLANTS[i];
  cur = i; mark(i);                                   // sekme durumu hemen güncellenir

  if (first) paint(p);
  else { fade.classList.add('swap'); setTimeout(() => { paint(p); fade.classList.remove('swap'); }, 150); }

  const old = shown;
  if (old) tween(D, t => { old.g.position.x = 5 * t; old.g.scale.setScalar(old.s * (1 - .2 * t)); }, ease.in).then(() => scene.remove(old.g));

  const g = (await template(p)).clone(), s = worldH(p);
  if (mine !== token) return;
  g.position.x = -5; g.scale.setScalar(s * .8); scene.add(g); shown = { g, s }; applyWire();
  await tween(D, t => { g.position.x = -5 * (1 - t); g.scale.setScalar(s * (.8 + .2 * t)); }, ease.out);
}

/* ---------- Etkileşimler ---------- */
document.querySelectorAll('.tab,.dots button').forEach(b => b.addEventListener('click', () => select(+b.dataset.i)));
$('#r3d').addEventListener('click', home);
$('#rsize').addEventListener('click', () => sizeTag.classList.toggle('on'));
$('#rview').addEventListener('click', e => { wire = !wire; e.currentTarget.setAttribute('aria-pressed', wire); applyWire(); });
$('#q').addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const q = e.target.value.toLocaleLowerCase('tr').trim();
  const k = PLANTS.findIndex(p => p.name.toLocaleLowerCase('tr').includes(q) || p.latin.toLowerCase().includes(q));
  if (k >= 0) select(k);
});
select(0);
