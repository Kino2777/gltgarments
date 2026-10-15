/* G.L.T. GARMENTS - shared code: layout, helpers, ordering, tracking */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const get = (k, d) => JSON.parse(localStorage.getItem(k) || 'null') || d;
const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const peso = n => '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 });
const prod = id => PRODUCTS.find(p => p.id === id);
const toast = m => { const t = document.createElement('div'); t.className = 'toast'; t.textContent = m; document.body.append(t); setTimeout(() => t.remove(), 2500); };

/* Sample picture (SVG shirt) used when a real photo is missing */
function ph(p) {
  return 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect width="300" height="300" fill="${p.color}22"/><path d="M95 50l-55 40 25 35 30-20v135h110V105l30 20 25-35-55-40q-20 25-55 25t-55-25z" fill="${p.color}"/><text x="150" y="288" font-size="19" text-anchor="middle" fill="#0B1F3A" font-family="Arial">${p.name}</text></svg>`);
}
const pimg = p => `<img src="images/products/${p.id}.jpg" alt="${p.name}" onerror="this.onerror=null;this.src=ph(prod('${p.id}'))">`;

/* Demo orders so the admin side looks alive on first load */
function seed() {
  if (get('glt_orders', null)) return;
  const names = ['Maria Santos', 'Juan Dela Cruz', 'Ana Reyes', 'Pedro Garcia', 'Liza Mendoza', 'Carlo Bautista'];
  const st = ['Pending', 'In Production', 'Ready for Pickup', 'Completed'], ps = ['Unpaid', 'Waiting for Verification', 'Partially Paid', 'Paid'], pm = ['GCash', 'PayPal', 'Cash on pickup', 'Bank transfer'];
  set('glt_orders', names.map((n, i) => { const p = PRODUCTS[i], q = 6 + i * 6, t = p.price * q;
    return { id: 'GLT-2026-000' + (i + 1), name: n, phone: '0917123456' + i, type: 'School', items: [{ pid: p.id, size: 'Small-Medium', qty: q, extra: 'none' }],
      total: t, pay: pm[i % 4], payStatus: ps[i % 4], paid: i % 4 == 3 ? t : 0, balance: i % 4 == 3 ? 0 : t, status: st[i % 4], date: new Date(Date.now() - i * 5 * 864e5).toISOString().slice(0, 10) }; }));
}
seed();

/* Navbar + footer (customer pages) */
if ($('#nav')) {
  const pg = location.pathname.split('/').pop() || 'index.html';
  $('#nav').innerHTML = `<nav><div class="wrap"><b><i class="bi bi-scissors"></i> G.L.T. GARMENTS</b><button id="burger" aria-label="Menu"><i class="bi bi-list"></i></button><ul id="menu">` +
    [['index', 'Home', 'house'], ['products', 'Shop & Pre-Order', 'bag'], ['my-orders', 'My Orders', 'truck'], ['about', 'About', 'info-circle'], ['contact', 'Contact', 'telephone']]
      .map(l => `<li><a class="${pg == l[0] + '.html' ? 'on' : ''}" href="${l[0]}.html"><i class="bi bi-${l[2]}"></i> ${l[1]}</a></li>`).join('') + `</ul></div></nav>`;
  $('#burger').onclick = () => $('#menu').classList.toggle('open');
  $('#foot').innerHTML = `<footer>© 2026 G.L.T. GARMENTS - Quality Garments, Made Just for You.<br><a href="contact.html">Contact</a> · <a href="admin/login.html">Admin</a></footer>`;
}

/* Scroll reveal + animated counters */
const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; e.target.classList.add('in'); io.unobserve(e.target);
  if (e.target.dataset.count) { let n = 0, end = +e.target.dataset.count; const t = setInterval(() => { n += Math.ceil(end / 40); if (n >= end) { n = end; clearInterval(t); } e.target.textContent = n + '+'; }, 30); } }), { threshold: .2 });
function watch() { $$('.reveal,[data-count]').forEach(e => io.observe(e)); }

/* Home: product cards */
if ($('#featured')) $('#featured').innerHTML = PRODUCTS.map(p => `<div class="card hv reveal" style="--c:${p.color}">${pimg(p)}<span class="tag">${p.cat}</span><h3>${p.name}</h3><p class="price">Starting at ${peso(p.price)}</p><a class="btn sm" href="products.html?p=${p.id}"><i class="bi bi-cart-plus"></i> Pre-Order</a></div>`).join('');
watch();

/* Shop page: filter + search */
if ($('#catalog')) {
  let cat = 'All';
  const cats = ['All', ...new Set(PRODUCTS.map(p => p.cat))];
  $('#chips').innerHTML = cats.map(c => `<button class="chip ${c == 'All' ? 'on' : ''}">${c}</button>`).join('');
  const draw = () => { const q = $('#q').value.toLowerCase();
    $('#catalog').innerHTML = PRODUCTS.filter(p => (cat == 'All' || p.cat == cat) && p.name.toLowerCase().includes(q)).map(p => `<div class="card hv" style="--c:${p.color}">${pimg(p)}<span class="tag">${p.cat}</span><h3>${p.name}</h3><p>${p.desc}</p><p class="price">From ${peso(p.price)}</p><button class="btn sm" onclick="pick('${p.id}')"><i class="bi bi-cart-plus"></i> Pre-Order</button></div>`).join('') || '<p>No products found. Try another search.</p>'; };
  $$('.chip').forEach(b => b.onclick = () => { $$('.chip').forEach(x => x.classList.remove('on')); b.classList.add('on'); cat = b.textContent; draw(); });
  $('#q').oninput = draw; draw();
  window.pick = id => { $('#fp').value = id; $('#order').scrollIntoView({ behavior: 'smooth' }); toast('Product selected'); };
  $('#fp').innerHTML = PRODUCTS.map(p => `<option value="${p.id}">${p.name} (${peso(p.price)})</option>`).join('');
  $('#fs').innerHTML = Object.keys(SIZES).map(s => `<option>${s}</option>`).join('');
  $('#fe').innerHTML = Object.entries(EXTRAS).map(([k, v]) => `<option value="${k}">${v[0]} (+${peso(v[1])})</option>`).join('');
  const qp = new URLSearchParams(location.search).get('p'); if (qp && prod(qp)) $('#fp').value = qp;
  $('#pickup').min = new Date().toISOString().slice(0, 10);

  /* Order builder with live total */
  let items = [];
  const calc = () => {
    const pcs = items.reduce((a, i) => a + i.qty, 0);
    const sub = items.reduce((a, i) => a + (prod(i.pid).price + SIZES[i.size] + EXTRAS[i.extra][1]) * i.qty, 0);
    const pct = (DISCOUNTS.find(d => pcs >= d[0]) || [0, 0])[1], disc = sub * pct / 100, total = sub - disc;
    const half = $('input[name=mode]:checked').value == 'half', now = half ? total / 2 : total;
    return { pcs, sub, pct, disc, total, now, bal: total - now };
  };
  const show = () => { const c = calc();
    $('#list').innerHTML = items.map((i, n) => `<div class="item"><span>${i.qty} × ${prod(i.pid).name} (${i.size}, ${EXTRAS[i.extra][0]})</span><button type="button" onclick="items_rm(${n})" aria-label="Remove"><i class="bi bi-trash"></i></button></div>`).join('') || '<p>No items yet. Add one above.</p>';
    $('#sum').innerHTML = `<div><span>Subtotal (${c.pcs} pcs)</span><span>${peso(c.sub)}</span></div><div><span>Bulk discount (${c.pct}%)</span><span>-${peso(c.disc)}</span></div><div class="tot"><span>TOTAL</span><span>${peso(c.total)}</span></div><div><span>Pay now</span><span>${peso(c.now)}</span></div><div><span>Balance on pick-up</span><span>${peso(c.bal)}</span></div>`; };
  window.items_rm = n => { items.splice(n, 1); show(); };
  $('#add').onclick = () => { const q = +$('#fq').value; if (!(q >= 1)) { $('#e-fq').textContent = 'Quantity must be at least 1.'; return; } $('#e-fq').textContent = '';
    items.push({ pid: $('#fp').value, size: $('#fs').value, qty: q, extra: $('#fe').value }); show(); toast('Item added'); };
  $$('input[name=mode]').forEach(r => r.onchange = show);

  /* Payment details shown for the chosen method */
  const info = { 'GCash': `Send to GCash ${GLT.gcash.num} (${GLT.gcash.name}). Enter the 13-digit reference below.`, 'PayPal': `<a class="btn sm alt" target="_blank" href="${GLT.paypal}"><i class="bi bi-paypal"></i> Pay with PayPal</a> (opens PayPal.me, type your amount).`,
    'Maya': `Send to Maya ${GLT.maya.num} (${GLT.maya.name}). Enter your reference below.`, 'Bank transfer': `Deposit to ${GLT.bank}. Enter your transaction number below.`, 'Cash on pickup': 'Pay in cash when you pick up your order.' };
  $$('input[name=pay]').forEach(r => r.onchange = () => { $('#payinfo').innerHTML = info[r.value]; $('#refbox').style.display = r.value == 'Cash on pickup' ? 'none' : 'block'; });

  /* Validation + save */
  $('#form').onsubmit = async e => { e.preventDefault(); let ok = true;
    const bad = (id, m) => { $('#e-' + id).textContent = m; if (m) ok = false; };
    const v = id => $('#' + id).value.trim(), pay = $('input[name=pay]:checked').value, today = new Date().toISOString().slice(0, 10);
    bad('name', /^[A-Za-zñÑ .'-]{2,}$/.test(v('name')) ? '' : 'Enter your name (letters only).');
    bad('phone', /^09\d{9}$/.test(v('phone')) ? '' : 'Use the format 09XXXXXXXXX.');
    bad('email', !v('email') || /^\S+@\S+\.\S+$/.test(v('email')) ? '' : 'Enter a valid email.');
    bad('addr', v('addr') ? '' : 'Enter your address or school/company.');
    bad('pickup', v('pickup') >= today && v('pickup') ? '' : 'Pick a date today or later.');
    bad('items', items.length ? '' : 'Add at least one item.');
    bad('ref', pay == 'Cash on pickup' || pay == 'PayPal' ? '' : (pay == 'GCash' ? /^\d{13}$/.test(v('ref')) : v('ref').length >= 6) ? '' : pay == 'GCash' ? 'GCash reference must be 13 digits.' : 'Enter your reference number.');
    if (!ok) return;
    let proof = ''; const f = $('#proof').files[0];
    if (f) proof = await new Promise(r => { const im = new Image(); im.onload = () => { const c = document.createElement('canvas'), s = Math.min(1, 500 / im.width); c.width = im.width * s; c.height = im.height * s; c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); r(c.toDataURL('image/jpeg', .6)); }; im.src = URL.createObjectURL(f); });
    const c = calc(), orders = get('glt_orders', []), id = 'GLT-2026-' + String(orders.length + 1).padStart(4, '0');
    const unpaid = pay == 'Cash on pickup';
    orders.unshift({ id, name: v('name'), phone: v('phone'), email: v('email'), addr: v('addr'), type: $('#otype').value, items, total: c.total, pay, ref: v('ref'), proof, pickup: v('pickup'), notes: v('notes'),
      payStatus: unpaid ? 'Unpaid' : 'Waiting for Verification', paid: 0, balance: c.total, due: c.now, status: 'Pending', date: today });
    set('glt_orders', orders);
    $('#mid').textContent = id; $('#mtot').textContent = peso(c.total); $('#mnow').textContent = peso(c.now); $('#modal').classList.add('show'); items = []; e.target.reset(); show(); };
  show();
}

/* My orders: find by phone or order ID */
if ($('#track')) $('#track').onsubmit = e => { e.preventDefault(); const q = $('#tq').value.trim().toUpperCase();
  const r = get('glt_orders', []).filter(o => q && (o.id.toUpperCase() == q || o.phone == q));
  $('#tres').innerHTML = r.map(o => `<div class="card" style="margin-bottom:14px"><b>${o.id}</b> <span class="bdg">${o.status}</span> <span class="bdg" style="background:var(--teal)">${o.payStatus}</span><p>${o.items.map(i => i.qty + '× ' + prod(i.pid).name).join(', ')}</p><p class="price">Total ${peso(o.total)} · Paid ${peso(o.paid)} · Balance ${peso(o.balance)}</p><button class="btn sm alt" onclick="window.print()"><i class="bi bi-printer"></i> Print receipt</button></div>`).join('') || '<p>No order found. Check your order ID or phone number.</p>'; };

/* Contact form */
if ($('#cform')) $('#cform').onsubmit = e => { e.preventDefault(); let ok = true; const bad = (id, m) => { $('#e-' + id).textContent = m; if (m) ok = false; };
  bad('cn', /^[A-Za-zñÑ .'-]{2,}$/.test($('#cn').value.trim()) ? '' : 'Enter your name (letters only).');
  bad('ce', /^\S+@\S+\.\S+$/.test($('#ce').value.trim()) ? '' : 'Enter a valid email.');
 bad('cm', $('#cm').value.trim().length >= 10 ? '' : 'Message must be at least 10 characters.');
  if (ok) { $('#ok').style.display = 'block'; e.target.reset(); } };


  document.addEventListener("DOMContentLoaded", () => {
  const loginTab = document.getElementById("login-tab");
  const signupTab = document.getElementById("signup-tab");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  if (loginTab && signupTab) {
    loginTab.addEventListener("click", () => {
      loginTab.classList.add("active");
      signupTab.classList.remove("active");
      loginForm.classList.add("active");
      signupForm.classList.remove("active");
    });

    signupTab.addEventListener("click", () => {
      signupTab.classList.add("active");
      loginTab.classList.remove("active");
      signupForm.classList.add("active");
      loginForm.classList.remove("active");
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      alert(`Successfully logged in as ${email}`);
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("signup-name").value;
      alert(`Account successfully created for ${name}!`);
    });
  }
});