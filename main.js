/* ============================================================
   StatioMart — JavaScript
   File: main.js
   ============================================================ */

/* ========== DATA ========== */
let products = [
  { id:1, name:'Pilot Metropolitan', cat:'Pena', icon:'✒️', price:185000, origPrice:220000, stock:25, avail:true, desc:'Pena fountain premium dengan nib medium smooth. Ideal untuk menulis sehari-hari maupun koleksi.', badge:'sale', featured:true },
  { id:2, name:'Faber-Castell 9000 Set', cat:'Pensil', icon:'✏️', price:142000, origPrice:null, stock:40, avail:true, desc:'Set 12 pensil graphit berkualitas tinggi dari 2H hingga 8B. Pilihan utama seniman profesional.', badge:'new', featured:true },
  { id:3, name:'Leuchtturm1917 A5', cat:'Notebook', icon:'📓', price:195000, origPrice:null, stock:0, avail:false, desc:'Notebook hardcover ikonik dengan halaman bernomor, dua penanda buku, dan saku belakang.', badge:'out', featured:true },
  { id:4, name:'Copic Sketch 12 Warna', cat:'Marker', icon:'🖊️', price:520000, origPrice:580000, stock:12, avail:true, desc:'Marker alkohol dual-tip legendaris dari Jepang. Digunakan oleh illustrator dan desainer dunia.', badge:'sale', featured:true },
  { id:5, name:'Moleskine Classic Ruled', cat:'Notebook', icon:'📒', price:165000, origPrice:null, stock:30, avail:true, desc:'Notebook ikon dengan cover hardcover, kertas berkualitas tinggi, dan elastic band closure.', badge:null, featured:false },
  { id:6, name:'Staedtler Triplus Fineliner', cat:'Pena', icon:'🖋️', price:98000, origPrice:null, stock:55, avail:true, desc:'Set 10 pena fineliner dengan ujung 0.3mm. Tinta berbasis air, cocok untuk bullet journaling.', badge:'new', featured:false },
  { id:7, name:'Winsor & Newton Brushpen', cat:'Marker', icon:'🎨', price:45000, origPrice:null, stock:80, avail:true, desc:'Brushpen berkualitas tinggi dengan ujung fleksibel untuk hand lettering dan ilustrasi.', badge:null, featured:false },
  { id:8, name:'Pentel GraphGear 1000', cat:'Pensil', icon:'✏️', price:210000, origPrice:null, stock:18, avail:true, desc:'Mekanik pensil premium 0.5mm dengan desain ergonomis dan sistem recoil otomatis.', badge:'new', featured:false },
  { id:9, name:"Midori Traveler's Notebook", cat:'Notebook', icon:'📔', price:350000, origPrice:null, stock:8, avail:true, desc:'Notebook kulit vintage dengan sistem refill yang fleksibel. Kompas perjalanan sejati.', badge:null, featured:false },
  { id:10, name:'Stabilo Boss Highlighter Set', cat:'Marker', icon:'🖊️', price:65000, origPrice:null, stock:100, avail:true, desc:'Set 8 highlighter warna-warni dengan tinta neon yang tidak merusak teks cetak.', badge:null, featured:false },
];
let nextId = 11;
let cart = [];
let wishlist = [3, 5, 9];
let currentUser = null;
let editingProductId = null;

/* ========== NAVIGATION ========== */
function showSection(section) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  if (section === 'shop') {
    document.getElementById('view-shop').classList.add('active');
    renderShop(products);
  } else if (section === 'about') {
    document.getElementById('view-about').classList.add('active');
  } else if (section === 'contact') {
    document.getElementById('view-contact').classList.add('active');
  }
  window.scrollTo(0, 0);
}

function goHome() {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-home').classList.add('active');
  renderFeatured();
  window.scrollTo(0, 0);
  initReveal();
}

function showUserDash() {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-user-dash').classList.add('active');
  renderWishlist();
  window.scrollTo(0, 0);
}

function showAdminDash() {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-admin').classList.add('active');
  renderAdminTable(products);
  window.scrollTo(0, 0);
}

/* ========== PRODUCTS ========== */
function fmtPrice(n) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function renderCard(p, container) {
  const badgeHtml = p.badge === 'new' ? '<div class="badge-new">Baru</div>'
    : p.badge === 'sale' ? '<div class="badge-sale">Sale</div>'
    : p.badge === 'out' ? '<div class="badge-out">Habis</div>' : '';
  const origHtml = p.origPrice ? `<span class="orig">${fmtPrice(p.origPrice)}</span>` : '';
  const stockBadge = p.avail && p.stock > 0
    ? `<span class="stock-badge in-stock">Tersedia</span>`
    : `<span class="stock-badge out-stock">Habis</span>`;
  const div = document.createElement('div');
  div.className = 'product-card';
  div.innerHTML = `
    <div class="product-img">
      <span style="font-size:4rem">${p.icon}</span>
      ${badgeHtml}
      <div class="card-overlay">
        ${p.avail && p.stock > 0
          ? `<button class="quick-add" onclick="addToCart(${p.id})">+ Keranjang</button>`
          : '<span style="color:#fff;font-size:0.85rem;font-weight:600">Stok Habis</span>'}
      </div>
    </div>
    <div class="product-info">
      <div class="product-cat">${p.cat}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-desc">${p.desc}</div>
      <div class="product-footer">
        <div class="product-price">${origHtml}${fmtPrice(p.price)}</div>
        ${stockBadge}
      </div>
    </div>`;
  container.appendChild(div);
}

function renderFeatured() {
  const grid = document.getElementById('featured-grid');
  grid.innerHTML = '';
  products.filter(p => p.featured).forEach(p => renderCard(p, grid));
}

function renderShop(list) {
  const grid = document.getElementById('shop-grid');
  grid.innerHTML = '';
  if (!list.length) {
    grid.innerHTML = '<p style="color:var(--text3);padding:2rem">Tidak ada produk ditemukan.</p>';
    return;
  }
  list.forEach(p => renderCard(p, grid));
}

function renderWishlist() {
  const grid = document.getElementById('wishlist-grid');
  grid.innerHTML = '';
  const wl = products.filter(p => wishlist.includes(p.id));
  if (!wl.length) {
    grid.innerHTML = '<p style="color:var(--text3)">Belum ada produk di wishlist.</p>';
    return;
  }
  wl.forEach(p => renderCard(p, grid));
}

function filterProducts() {
  const q = document.getElementById('search-input').value.toLowerCase();
  const cat = document.getElementById('cat-filter').value;
  const list = products.filter(p => {
    const matchQ = p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
    const matchCat = !cat || p.cat === cat;
    return matchQ && matchCat;
  });
  renderShop(list);
}

function sortProducts() {
  const val = document.getElementById('sort-filter').value;
  let list = [...products];
  if (val === 'price-asc') list.sort((a, b) => a.price - b.price);
  else if (val === 'price-desc') list.sort((a, b) => b.price - a.price);
  else if (val === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
  renderShop(list);
}

function filterByCategory(cat) {
  showSection('shop');
  document.getElementById('cat-filter').value = cat;
  filterProducts();
}

/* ========== CART ========== */
function addToCart(id) {
  const prod = products.find(p => p.id === id);
  if (!prod || !prod.avail || prod.stock === 0) {
    showToast('⚠️ Produk ini sedang tidak tersedia');
    return;
  }
  const existing = cart.find(c => c.id === id);
  if (existing) existing.qty++;
  else cart.push({ id, qty: 1, ...prod });
  updateCartUI();
  showToast(`✅ ${prod.name} ditambahkan ke keranjang!`);
}

function updateCartUI() {
  const count = cart.reduce((s, c) => s + c.qty, 0);
  document.getElementById('cart-count').textContent = count;
  const list = document.getElementById('cart-items-list');
  const foot = document.getElementById('cart-foot');
  if (!cart.length) {
    list.innerHTML = `<div style="text-align:center;padding:3rem 1rem;color:var(--text3);">
      <div style="font-size:2.5rem;margin-bottom:0.75rem;">🛒</div>
      <p>Keranjang masih kosong</p></div>`;
    foot.style.display = 'none';
    return;
  }
  foot.style.display = 'block';
  list.innerHTML = '';
  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="cart-item-img">${item.icon}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${fmtPrice(item.price)}</div>
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <span class="remove-item" onclick="removeFromCart(${item.id})">✕</span>`;
    list.appendChild(div);
  });
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  document.getElementById('cart-total-val').textContent = fmtPrice(total);
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
}

function toggleCart() {
  document.getElementById('cart-panel').classList.toggle('open');
  document.getElementById('cart-overlay').classList.toggle('show');
}

function checkout() {
  if (!currentUser) { toggleCart(); showAuth(); return; }
  cart = [];
  updateCartUI();
  toggleCart();
  showToast('🎉 Pesanan berhasil dibuat! Terima kasih telah berbelanja.');
}

/* ========== AUTH ========== */
function showAuth() { document.getElementById('auth-modal').classList.add('show'); }
function closeAuth() { document.getElementById('auth-modal').classList.remove('show'); }

function switchTab(tab) {
  document.getElementById('form-login').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('form-register').style.display = tab === 'register' ? 'block' : 'none';
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-register').classList.toggle('active', tab === 'register');
}

function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-pass').value;
  if (!email || !pass) { showToast('⚠️ Isi email dan password terlebih dahulu'); return; }
  const isAdmin = email === 'admin@stationmart.id';
  currentUser = {
    name: isAdmin ? 'Admin' : email.split('@')[0].replace(/\b\w/g, c => c.toUpperCase()),
    email,
    role: isAdmin ? 'admin' : 'user'
  };
  closeAuth();
  updateAuthUI();
  showToast(`✅ Selamat datang, ${currentUser.name}!`);
}

function doRegister() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass = document.getElementById('reg-pass').value;
  if (!name || !email || !pass) { showToast('⚠️ Lengkapi semua field'); return; }
  if (pass.length < 8) { showToast('⚠️ Password minimal 8 karakter'); return; }
  currentUser = { name, email, role: 'user' };
  closeAuth();
  updateAuthUI();
  showToast(`🎉 Akun berhasil dibuat! Selamat datang, ${name}!`);
}

function logout() {
  currentUser = null;
  updateAuthUI();
  goHome();
  showToast('👋 Sampai jumpa!');
}

function updateAuthUI() {
  const authBtn = document.getElementById('auth-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const dashLink = document.getElementById('nav-dashboard');
  const adminLink = document.getElementById('nav-admin');
  if (currentUser) {
    authBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
    if (currentUser.role === 'admin') {
      dashLink.style.display = 'none';
      adminLink.style.display = 'block';
    } else {
      dashLink.style.display = 'block';
      adminLink.style.display = 'none';
    }
    document.getElementById('user-initials').textContent =
      currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    document.getElementById('user-display-name').textContent = currentUser.name;
    document.getElementById('user-display-email').textContent = currentUser.email;
    document.getElementById('greet-name').textContent = currentUser.name.split(' ')[0];
    document.getElementById('profile-name').value = currentUser.name;
    document.getElementById('profile-email').value = currentUser.email;
  } else {
    authBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
    dashLink.style.display = 'none';
    adminLink.style.display = 'none';
  }
}

/* ========== DASHBOARD NAV ========== */
function switchDash(sec) {
  document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
  document.getElementById('dsec-' + sec).classList.add('active');
  document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));
  document.getElementById('dmenu-' + sec).classList.add('active');
}

function switchAdmin(sec) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.getElementById('asec-' + sec).classList.add('active');
  document.querySelectorAll('.admin-nav-item').forEach(a => a.classList.remove('active'));
  event.currentTarget.classList.add('active');
  if (sec === 'aproducts') renderAdminTable(products);
}

/* ========== ADMIN PRODUCTS ========== */
function renderAdminTable(list) {
  const tbody = document.getElementById('admin-product-tbody');
  tbody.innerHTML = '';
  list.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><div class="prod-thumb">${p.icon}</div></td>
      <td><b>${p.name}</b></td>
      <td>${p.cat}</td>
      <td>${fmtPrice(p.price)}</td>
      <td>${p.stock}</td>
      <td><button class="toggle-avail ${p.avail ? 'on' : ''}" onclick="toggleAvail(${p.id})"></button></td>
      <td style="display:flex;gap:0.5rem;flex-wrap:wrap;">
        <button class="action-btn" onclick="openEditProduct(${p.id})">✏️ Edit</button>
        <button class="action-btn del" onclick="deleteProduct(${p.id})">🗑️ Hapus</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

function toggleAvail(id) {
  const p = products.find(x => x.id === id);
  if (p) {
    p.avail = !p.avail;
    renderAdminTable(products);
    showToast(`✅ Status ${p.name} diubah ke ${p.avail ? 'Tersedia' : 'Tidak Tersedia'}`);
  }
}

function deleteProduct(id) {
  products = products.filter(p => p.id !== id);
  renderAdminTable(products);
  renderFeatured();
  showToast('🗑️ Produk dihapus');
}

function adminSearchProduct(q) {
  const list = products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
  renderAdminTable(list);
}

function adminFilterCat(cat) {
  const list = cat ? products.filter(p => p.cat === cat) : products;
  renderAdminTable(list);
}

function openAddProduct() {
  editingProductId = null;
  document.getElementById('edit-modal-title').textContent = 'Tambah Produk Baru';
  document.getElementById('ep-name').value = '';
  document.getElementById('ep-icon').value = '';
  document.getElementById('ep-price').value = '';
  document.getElementById('ep-stock').value = '';
  document.getElementById('ep-desc').value = '';
  document.getElementById('edit-modal').classList.add('show');
}

function openEditProduct(id) {
  editingProductId = id;
  const p = products.find(x => x.id === id);
  document.getElementById('edit-modal-title').textContent = 'Edit Produk';
  document.getElementById('ep-name').value = p.name;
  document.getElementById('ep-icon').value = p.icon;
  document.getElementById('ep-price').value = p.price;
  document.getElementById('ep-stock').value = p.stock;
  document.getElementById('ep-desc').value = p.desc;
  document.getElementById('ep-cat').value = p.cat;
  document.getElementById('edit-modal').classList.add('show');
}

function closeEditModal() {
  document.getElementById('edit-modal').classList.remove('show');
}

function saveProduct() {
  const name = document.getElementById('ep-name').value.trim();
  const icon = document.getElementById('ep-icon').value.trim() || '📦';
  const price = parseInt(document.getElementById('ep-price').value) || 0;
  const stock = parseInt(document.getElementById('ep-stock').value) || 0;
  const desc = document.getElementById('ep-desc').value.trim();
  const cat = document.getElementById('ep-cat').value;
  if (!name || !price) { showToast('⚠️ Nama dan harga wajib diisi'); return; }
  if (editingProductId) {
    const p = products.find(x => x.id === editingProductId);
    Object.assign(p, { name, icon, price, stock, desc, cat, avail: stock > 0 });
    showToast('✅ Produk berhasil diperbarui!');
  } else {
    products.push({ id: nextId++, name, icon, price, origPrice: null, stock, avail: stock > 0, desc, cat, badge: null, featured: false });
    showToast('✅ Produk baru berhasil ditambahkan!');
  }
  closeEditModal();
  renderAdminTable(products);
  renderFeatured();
}

/* ========== TOAST ========== */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ========== SCROLL REVEAL ========== */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ========== MOBILE MENU ========== */
function toggleMobileMenu() {
  const links = document.querySelector('.nav-links');
  if (!links.style.display || links.style.display === 'none') {
    links.style.cssText = 'display:flex;flex-direction:column;position:absolute;top:64px;left:0;right:0;background:var(--primary);padding:1rem;z-index:999;gap:0.25rem;';
  } else {
    links.style.display = 'none';
  }
}

/* ========== INIT ========== */
document.addEventListener('DOMContentLoaded', () => {
  renderFeatured();
  renderShop(products);
  updateCartUI();
  initReveal();
});