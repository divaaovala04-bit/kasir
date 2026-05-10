// Sistem Kasir: Dashboard + Inventory + Kasir + Laporan (client-side)
// Data utama: products & stock, transaksi: sales, semua pakai localStorage

(() => {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const LS_PRODUCTS = 'kasir_products_v1';
  const LS_SALES = 'kasir_sales_v1';

  const money = (n) => {
    const v = Number(n || 0);
    return 'Rp ' + v.toLocaleString('id-ID');
  };

  const parseMoneyInput = (raw) => {
    const s = String(raw ?? '').trim().toLowerCase();
    if (!s) return 0;
    const cleaned = s.replace(/rp\.?\s*/g, '')
      .replace(/\s/g, '')
      .replace(/\./g, '')
      .replace(/,/g, '');
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : 0;
  };

  const pad2 = (x) => String(x).padStart(2, '0');
  const fmtDateTime = (d) => `${pad2(d.getDate())}/${pad2(d.getMonth()+1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

  const escapeHtml = (s) => String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '<')
    .replaceAll('>', '>')
    .replaceAll('"', '"')
    .replaceAll("'", '&#039;');

  const initialProducts = () => {
    // 50 item contoh + stok awal random ringan
    const base = [
      { id: 'P001', barcode: '8991234567890', name: 'Air Mineral 600ml', price: 5000 },
      { id: 'P002', barcode: '8991112223334', name: 'Kopi Botol 250ml', price: 15000 },
      { id: 'P003', barcode: '8995556667778', name: 'Mie Instan Goreng', price: 3500 },
      { id: 'P004', barcode: '8999990001112', name: 'Biskuit Coklat 200g', price: 18000 },
      { id: 'P005', barcode: '8992223334445', name: 'Susu UHT 1L', price: 45000 },
      { id: 'P006', barcode: '8993334445556', name: 'Teh Botol 350ml', price: 12000 },
      { id: 'P007', barcode: '8997778889990', name: 'Sarden Kaleng', price: 25000 },
      { id: 'P008', barcode: '8991011121314', name: 'Gula Pasir 1kg', price: 17000 },
      { id: 'P009', barcode: '8991415161718', name: 'Beras 5kg', price: 65000 },
      { id: 'P010', barcode: '8991819202122', name: 'Minyak Goreng 2L', price: 42000 },
      { id: 'P011', barcode: '8992324252627', name: 'Telur Ayam 1 Tray', price: 30000 },
      { id: 'P012', barcode: '8992829303132', name: 'Roti Tawar 8 Lembar', price: 22000 },
      { id: 'P013', barcode: '8993435363738', name: 'Saus Tomat 250g', price: 13000 },
      { id: 'P014', barcode: '8993940414243', name: 'Mayonaise 250g', price: 28000 },
      { id: 'P015', barcode: '8994445464748', name: 'Kerupuk Udang 100g', price: 9000 },

      { id: 'P016', barcode: '8995000010001', name: 'Shampoo 180ml', price: 24000 },
      { id: 'P017', barcode: '8995000010002', name: 'Sabun Mandi 100g', price: 8000 },
      { id: 'P018', barcode: '8995000010003', name: 'Sikat Gigi', price: 12000 },
      { id: 'P019', barcode: '8995000010004', name: 'Pasta Gigi 130g', price: 25000 },
      { id: 'P020', barcode: '8995000010005', name: 'Beras 1kg', price: 13500 },
      { id: 'P021', barcode: '8995000010006', name: 'Garam Halus 500g', price: 7000 },
      { id: 'P022', barcode: '8995000010007', name: 'Kecap Manis 620ml', price: 16000 },
      { id: 'P023', barcode: '8995000010008', name: 'Bumbu Nasi Goreng', price: 11000 },
      { id: 'P024', barcode: '8995000010009', name: 'Bumbu Rendang', price: 12000 },
      { id: 'P025', barcode: '8995000010010', name: 'Kaldu Ayam', price: 10000 },

      { id: 'P026', barcode: '8996000010011', name: 'Minuman Isotonik 500ml', price: 16000 },
      { id: 'P027', barcode: '8996000010012', name: 'Air Minum 1.5L', price: 15000 },
      { id: 'P028', barcode: '8996000010013', name: 'Teh Kotak 250ml', price: 9000 },
      { id: 'P029', barcode: '8996000010014', name: 'Kopi Sachet', price: 5000 },
      { id: 'P030', barcode: '8996000010015', name: 'Coklat Bubuk 100g', price: 17000 },
      { id: 'P031', barcode: '8996000010016', name: 'Keripik Kentang 70g', price: 12000 },
      { id: 'P032', barcode: '8996000010017', name: 'Keripik Singkong 70g', price: 13000 },
      { id: 'P033', barcode: '8996000010018', name: 'Roti Sobek 6pcs', price: 18000 },
      { id: 'P034', barcode: '8996000010019', name: 'Biskuit Marie 180g', price: 22000 },
      { id: 'P035', barcode: '8996000010020', name: 'Biskuit Sus 170g', price: 21000 },

      { id: 'P036', barcode: '8997000010021', name: 'Kembang Gula 1pcs', price: 2000 },
      { id: 'P037', barcode: '8997000010022', name: 'Permen 50g', price: 5000 },
      { id: 'P038', barcode: '8997000010023', name: 'Coklat Batang 45g', price: 8000 },
      { id: 'P039', barcode: '8997000010024', name: 'Chiki 12g', price: 3000 },
      { id: 'P040', barcode: '8997000010025', name: 'Wafer 35g', price: 6000 },
      { id: 'P041', barcode: '8997000010026', name: 'Sereal Sarapan 250g', price: 28000 },
      { id: 'P042', barcode: '8997000010027', name: 'Tepung Terigu 1kg', price: 14000 },
      { id: 'P043', barcode: '8997000010028', name: 'Tepung Maizena 500g', price: 26000 },
      { id: 'P044', barcode: '8997000010029', name: 'Baking Powder 100g', price: 15000 },
      { id: 'P045', barcode: '8997000010030', name: 'Ragi Instan 10g', price: 12000 },

      { id: 'P046', barcode: '8998000010031', name: 'Sabun Cuci 500g', price: 17000 },
      { id: 'P047', barcode: '8998000010032', name: 'Pewangi Pakaian 250ml', price: 20000 },
      { id: 'P048', barcode: '8998000010033', name: 'Tisu Gulung', price: 9000 },
      { id: 'P049', barcode: '8998000010034', name: 'Pasta Gigi 90g', price: 18000 },
      { id: 'P050', barcode: '8998000010035', name: 'Skincare Facial Foam', price: 45000 },
    ];

    // stok awal
    return base.map((p, idx) => ({
      ...p,
      stock: 10 + (idx % 20) // 10..29
    }));
  };

  const loadProducts = () => {
    try {
      const raw = localStorage.getItem(LS_PRODUCTS);
      if (raw) return JSON.parse(raw);
    } catch {}
    const p = initialProducts();
    localStorage.setItem(LS_PRODUCTS, JSON.stringify(p));
    return p;
  };

  const saveProducts = (products) => {
    localStorage.setItem(LS_PRODUCTS, JSON.stringify(products));
  };

  const loadSales = () => {
    try {
      const raw = localStorage.getItem(LS_SALES);
      if (raw) return JSON.parse(raw);
    } catch {}
    const empty = [];
    localStorage.setItem(LS_SALES, JSON.stringify(empty));
    return empty;
  };

  const saveSales = (sales) => localStorage.setItem(LS_SALES, JSON.stringify(sales));

  const findProduct = (products, query) => {
    const q = String(query ?? '').trim();
    if (!q) return null;
    return products.find((p) => p.barcode === q || p.id === q || p.name.toLowerCase() === q.toLowerCase()) || null;
  };

  // App state
  const products = loadProducts();
  const sales = loadSales();
  const cart = new Map(); // productId -> qty

  // Tab navigation
  const setupTabs = () => {
    const tabs = $$('.tab');
    const views = $$('.view');

    const go = (tabName) => {
      tabs.forEach((t) => t.classList.toggle('is-active', t.dataset.tab === tabName));
      views.forEach((v) => v.classList.toggle('is-active', v.dataset.view === tabName));
      if (tabName === 'kasir') {
        setTimeout(() => {
          $('#barcodeInput')?.focus();
        }, 0);
      }
    };

    tabs.forEach((t) => {
      t.addEventListener('click', () => go(t.dataset.tab));
    });

    $$('[data-go]').forEach((b) => {
      b.addEventListener('click', () => go(b.dataset.go));
    });
  };

  // Dashboard
  const renderDashboard = () => {
    const totalProducts = products.length;
    const soldQty = sales.reduce((acc, s) => acc + (s.totalQty || 0), 0);
    const revenue = sales.reduce((acc, s) => acc + (s.totalAmount || 0), 0);

    $('#statTotalProducts').textContent = String(totalProducts);
    $('#statSoldQty').textContent = String(soldQty);
    $('#statRevenue').textContent = money(revenue);

    // top products
    const qtyById = new Map();
    sales.forEach((s) => {
      (s.items || []).forEach((it) => {
        qtyById.set(it.productId, (qtyById.get(it.productId) || 0) + (it.qty || 0));
      });
    });

    const top = [...qtyById.entries()]
      .sort((a,b) => b[1]-a[1])
      .slice(0,5);

    const topEl = $('#topProducts');
    topEl.innerHTML = '';
    if (!top.length) {
      topEl.innerHTML = `<div class="top-row"><span class="muted">Belum ada transaksi</span><span class="muted">-</span></div>`;
      return;
    }

    top.forEach(([pid, qty]) => {
      const p = products.find((x) => x.id === pid);
      topEl.innerHTML += `
        <div class="top-row">
          <span style="font-weight:1000">${escapeHtml(p?.name || pid)}</span>
          <span class="muted">${qty} item</span>
        </div>
      `;
    });
  };

  // Inventory
  const renderInventory = (filter = '') => {
    const q = String(filter ?? '').trim().toLowerCase();
    const list = products.filter((p) => {
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || String(p.barcode).includes(q) || String(p.id).toLowerCase().includes(q);
    });

    const body = $('#invBody');
    body.innerHTML = list.map((p) => {
      return `
        <tr>
          <td>${escapeHtml(p.name)}<div class="muted" style="font-weight:800;font-size:12px;margin-top:2px">${escapeHtml(p.id)}</div></td>
          <td>${escapeHtml(p.barcode)}</td>
          <td class="right">${money(p.price)}</td>
          <td class="right">${p.stock}</td>
          <td class="right">
            <div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap">
              <button class="btn btn-ghost" type="button" data-stock="-5" data-id="${p.id}">-5</button>
              <button class="btn btn-ghost" type="button" data-stock="+5" data-id="${p.id}">+5</button>
              <button class="btn btn-danger" type="button" data-stock="-1" data-id="${p.id}">-1</button>
              <button class="btn btn-success" type="button" data-stock="+1" data-id="${p.id}">+1</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // bind
    $$('[data-stock]').forEach((btn) => {
      if (btn.dataset.bound === '1') return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const delta = Number(btn.dataset.stock);
        const idx = products.findIndex((p) => p.id === id);
        if (idx < 0) return;
        products[idx].stock = Math.max(0, (products[idx].stock || 0) + delta);
        saveProducts(products);
        renderInventory($('#invSearch').value);
        renderDashboard();
        renderKasirProductList();
      });
    });
  };

  const addProductFromForm = () => {
    const name = $('#invNewName').value.trim();
    const barcode = $('#invNewBarcode').value.trim();
    const price = parseMoneyInput($('#invNewPrice').value);
    const stock = parseMoneyInput($('#invNewStock').value);

    if (!name || !barcode || !price || !stock) return alert('Isi nama, barcode, harga, dan stok.');

    if (products.some((p) => p.barcode === barcode || p.id === barcode)) {
      return alert('Barcode / id sudah ada.');
    }

    // buat id baru: P###
    const maxN = products
      .map((p) => Number(String(p.id).replace(/\D/g,'')) || 0)
      .reduce((a,b) => Math.max(a,b), 0);
    const id = 'P' + String(maxN + 1).padStart(3, '0');

    products.push({ id, barcode, name, price, stock });
    saveProducts(products);

    $('#invNewName').value = '';
    $('#invNewBarcode').value = '';
    $('#invNewPrice').value = '';
    $('#invNewStock').value = '';

    renderInventory($('#invSearch').value);
    renderKasirProductList();
    renderDashboard();
  };

  // Kasir
  const renderKasirProductList = (filter = '') => {
    const q = String(filter ?? '').trim().toLowerCase();
    const list = products
      .filter((p) => {
        if (!q) return true;
        return p.name.toLowerCase().includes(q) || String(p.barcode).includes(q) || String(p.id).toLowerCase().includes(q);
      })
      .slice(0, 60);

    const listEl = $('#productList');
    listEl.innerHTML = list.map((p) => {
      const stockLabel = p.stock <= 0 ? 'Habis' : `Stok: ${p.stock}`;
      return `
        <div class="item" role="button" tabindex="0" data-id="${p.id}" aria-label="Tambah ${escapeHtml(p.name)}">
          <div class="item-meta">
            <div class="item-name">${escapeHtml(p.name)}</div>
            <div class="item-price">${money(p.price)} • ${escapeHtml(p.barcode)} • <span class="muted">${escapeHtml(stockLabel)}</span></div>
          </div>
          <button class="btn btn-secondary" type="button" data-add="${p.id}" ${p.stock<=0?'disabled':''}>Tambah</button>
        </div>
      `;
    }).join('');

    // bind (delegation sederhana)
    $$('#productList [data-add]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.dataset.add;
        const p = products.find((x) => x.id === id);
        if (!p) return;
        if (p.stock <= 0) return alert('Stok habis untuk produk ini.');
        addToCart(p.id);
      });
    });

    $$('#productList [data-id]').forEach((row) => {
      row.addEventListener('click', () => {
        const id = row.dataset.id;
        const p = products.find((x) => x.id === id);
        if (p && p.stock > 0) addToCart(p.id);
      });
      row.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') row.click();
      });
    });
  };

  const renderCart = () => {
    const body = $('#cartBody');
    const rows = [];

    for (const [pid, qty] of cart.entries()) {
      const p = products.find((x) => x.id === pid);
      if (!p) continue;
      const subtotal = p.price * qty;
      rows.push(`
        <tr>
          <td>
            <div style="display:flex;flex-direction:column;gap:2px">
              <div style="font-weight:1000">${escapeHtml(p.name)}</div>
              <div class="muted" style="font-weight:850;font-size:12px">${escapeHtml(p.barcode)}</div>
            </div>
          </td>
          <td class="right">${money(p.price)}</td>
          <td class="right">
            <div class="qty-wrap">
              <button class="qty-btn" type="button" data-act="dec" data-pid="${p.id}">-</button>
              <input class="qty-input" type="text" inputmode="numeric" value="${qty}" data-qty="${p.id}" aria-label="Qty" />
              <button class="qty-btn" type="button" data-act="inc" data-pid="${p.id}">+</button>
            </div>
          </td>
          <td class="right"><strong>${money(subtotal)}</strong></td>
          <td class="right">
            <button class="btn btn-danger" type="button" data-remove="${p.id}">Hapus</button>
          </td>
        </tr>
      `);
    }

    body.innerHTML = rows.length ? rows.join('') : `
      <tr><td colspan="5" style="text-align:center;color:var(--muted);padding:16px;font-weight:900">Keranjang masih kosong.</td></tr>
    `;

    // bind qty inc/dec/remove
    $$('[data-remove]').forEach((b) => {
      if (b.dataset.bound === '1') return;
      b.dataset.bound = '1';
      b.addEventListener('click', () => {
        const pid = b.dataset.remove;
        cart.delete(pid);
        renderCart();
        renderTotals();
        $('#status').textContent = '';
      });
    });

    $$('[data-act]').forEach((b) => {
      if (b.dataset.bound === '1') return;
      b.dataset.bound = '1';
      b.addEventListener('click', () => {
        const pid = b.dataset.pid;
        const p = products.find((x) => x.id === pid);
        if (!p) return;
        const current = cart.get(pid) || 0;
        const next = b.dataset.act === 'inc' ? current + 1 : current - 1;
        if (next <= 0) cart.delete(pid);
        else {
          // cek stok
          const alreadyInCart = current;
          const allowed = p.stock;
          if (next > allowed) return alert('Stok tidak cukup.');
          cart.set(pid, next);
        }
        renderCart();
        renderTotals();
      });
    });

    $$('[data-qty]').forEach((inp) => {
      // avoid rebinding by not setting bound, but we can still add listeners multiple; keep simple
      inp.addEventListener('change', () => {
        const pid = inp.dataset.qty;
        const p = products.find((x) => x.id === pid);
        if (!p) return;
        const v = Math.max(0, Math.floor(parseMoneyInput(inp.value)));
        if (v <= 0) cart.delete(pid);
        else {
          if (v > p.stock) return alert('Stok tidak cukup.');
          cart.set(pid, v);
        }
        renderCart();
        renderTotals();
      });
    });
  };

  const renderTotals = () => {
    let totalQty = 0;
    let total = 0;
    for (const [pid, qty] of cart.entries()) {
      const p = products.find((x) => x.id === pid);
      if (!p) continue;
      totalQty += qty;
      total += p.price * qty;
    }

    $('#totalQty').textContent = String(totalQty);
    $('#grandTotal').textContent = money(total);

    const cash = parseMoneyInput($('#cashInput').value);
    const change = cash - total;
    $('#changeAmount').textContent = money(change);
    $('#changeAmount').style.color = change >= 0 && cash > 0 ? '#16a34a' : '#ef4444';
  };

  const addToCart = (pid) => {
    const p = products.find((x) => x.id === pid);
    if (!p) return;
    if (p.stock <= 0) return alert('Stok habis.');

    const current = cart.get(pid) || 0;
    const next = current + 1;
    if (next > p.stock) return alert('Stok tidak cukup.');

    cart.set(pid, next);
    renderCart();
    renderTotals();
    $('#status').textContent = '';
  };

  const clearCart = () => {
    cart.clear();
    $('#cashInput').value = '';
    $('#status').textContent = '';
    renderCart();
    renderTotals();
    $('#barcodeInput')?.focus();
  };

  const makeReceiptNo = () => {
    const d = new Date();
    return `INV-${d.getFullYear()}${pad2(d.getMonth()+1)}${pad2(d.getDate())}-${pad2(d.getHours())}${pad2(d.getMinutes())}${pad2(d.getSeconds())}`;
  };

  const buildReceiptItemsHtml = () => {
    const parts = [];
    for (const [pid, qty] of cart.entries()) {
      const p = products.find((x) => x.id === pid);
      if (!p) continue;
      const subtotal = p.price * qty;
      parts.push(`
        <div style="display:flex;justify-content:space-between;gap:10px;">
          <div style="flex:1;">
            <div style="font-weight:1000">${escapeHtml(p.name)}</div>
            <div style="font-size:10px;color:#555;">Qty: ${qty}</div>
          </div>
          <div style="text-align:right">${money(subtotal)}</div>
        </div>
      `);
    }
    return parts.join('');
  };

  const buildReceipt = (invoiceNo, paidCash) => {
    const d = new Date();
    let total = 0;
    let totalQty = 0;
    for (const [pid, qty] of cart.entries()) {
      const p = products.find((x) => x.id === pid);
      if (!p) continue;
      total += p.price * qty;
      totalQty += qty;
    }

    const change = paidCash - total;

    $('#receiptMeta').textContent = `${invoiceNo} • ${fmtDateTime(d)} • Total ${totalQty} item`;
    $('#receiptItems').innerHTML = buildReceiptItemsHtml();
    $('#receiptTotal').textContent = money(total);
    $('#receiptCash').textContent = money(paidCash);
    $('#receiptChange').textContent = money(change);
    $('#receiptPrintedAt').textContent = fmtDateTime(d);
  };

  const doPay = () => {
    if (cart.size === 0) return $('#status').textContent = 'Keranjang masih kosong.';

    // hitung total & validasi stok
    let total = 0;
    for (const [pid, qty] of cart.entries()) {
      const p = products.find((x) => x.id === pid);
      if (!p) return;
      if (qty > p.stock) return $('#status').textContent = `Stok tidak cukup untuk ${p.name}`;
      total += p.price * qty;
    }

    const cash = parseMoneyInput($('#cashInput').value);
    if (cash < total) return $('#status').textContent = 'Uang masuk kurang.';

    // kurangi stok
    const items = [];
    for (const [pid, qty] of cart.entries()) {
      const p = products.find((x) => x.id === pid);
      if (!p) continue;
      p.stock = Math.max(0, (p.stock || 0) - qty);
      items.push({ productId: pid, qty, unit_price: p.price, subtotal: p.price * qty });
    }
    saveProducts(products);

    // simpan transaksi
    const invoiceNo = makeReceiptNo();
    const totalQty = items.reduce((a, it) => a + it.qty, 0);
    const change = cash - total;

    sales.unshift({
      invoiceNo,
      createdAt: Date.now(),
      items,
      totalQty,
      totalAmount: total,
      cashPaid: cash,
      changeAmount: change,
    });
    saveSales(sales);

    // render
    $('#status').textContent = 'Pembayaran berhasil. Menyiapkan struk...';
    buildReceipt(invoiceNo, cash);
    renderDashboard();
    renderInventory($('#invSearch').value);
    renderSales();
    renderCart();
    renderTotals();

    // cetak
    setTimeout(() => window.print(), 150);

    // reset cart setelah cetak
    cart.clear();
    $('#cashInput').value = '';
    renderCart();
    renderTotals();
  };

  const refundReset = () => {
    // reset struk saja tidak mengubah penjualan (belum bayar)
    clearCart();
    $('#status').textContent = '';
  };

  // Laporan
  const renderSales = () => {
    const body = $('#salesBody');
    if (!body) return;

    body.innerHTML = (sales || []).map((s) => {
      const d = new Date(s.createdAt);
      return `
        <tr>
          <td>${escapeHtml(s.invoiceNo)}</td>
          <td class="right">${escapeHtml(fmtDateTime(d))}</td>
          <td class="right">${s.totalQty || 0}</td>
          <td class="right">${money(s.totalAmount || 0)}</td>
          <td class="right">${money(s.cashPaid || 0)}</td>
          <td class="right">${money(s.changeAmount || 0)}</td>
        </tr>
      `;
    }).join('');
  };

  // Init wiring
  const init = () => {
    setupTabs();

    // seed inventory button
    $('#btnSeedInventory')?.addEventListener('click', () => {
      const seeded = initialProducts();
      saveProducts(seeded);
      // refresh in-memory references
      products.splice(0, products.length, ...seeded);
      renderInventory($('#invSearch').value);
      renderKasirProductList('');
      renderDashboard();
      renderSales();
      clearCart();
      $('#status').textContent = '';
    });

    // inventory bindings
    $('#invSearch')?.addEventListener('input', () => renderInventory($('#invSearch').value));
    $('#btnAddProduct')?.addEventListener('click', addProductFromForm);

    $('#btnClearSales')?.addEventListener('click', () => {
      saveSales([]);
      sales.splice(0, sales.length);
      renderDashboard();
      renderSales();
    });

    // kasir bindings
    $('#btnAddManual')?.addEventListener('click', () => {
      const val = $('#barcodeInput').value.trim();
      const p = findProduct(products, val);
      if (!p) return $('#status').textContent = `Produk tidak ditemukan: ${val}`;
      if (p.stock <= 0) return $('#status').textContent = `Stok habis: ${p.name}`;
      addToCart(p.id);
      $('#barcodeInput').value = '';
      $('#barcodeInput').focus();
    });

    $('#barcodeInput')?.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        $('#btnAddManual').click();
      }
    });

    $('#searchInput')?.addEventListener('input', () => {
      renderKasirProductList($('#searchInput').value);
    });

    $('#cashInput')?.addEventListener('input', renderTotals);

    $('#btnPay')?.addEventListener('click', doPay);
    $('#btnRefund')?.addEventListener('click', refundReset);

    $('#btnClear')?.addEventListener('click', clearCart);

    $('#btnPrint')?.addEventListener('click', () => {
      if (cart.size === 0) return $('#status').textContent = 'Keranjang masih kosong.';
      // print tanpa bayar: pakai uang masuk saat ini (bisa saja 0)
      const total = [...cart.entries()].reduce((acc, [pid, qty]) => {
        const p = products.find((x) => x.id === pid);
        return acc + (p?.price || 0) * qty;
      }, 0);
      const cash = parseMoneyInput($('#cashInput').value);
      const invoiceNo = makeReceiptNo();
      buildReceipt(invoiceNo, cash);
      window.print();
    });

    // initial renders
    renderDashboard();
    renderInventory('');
    renderKasirProductList('');
    renderCart();
    renderTotals();
    renderSales();

    // focus
    $('#barcodeInput')?.focus();
  };

  init();
})();

