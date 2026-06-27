/* ============================================
   NOVELCRAFT — dashboard.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // AUTH GUARD
  // ============================================
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole   = localStorage.getItem('userRole') || '';

  const isAdminPage = window.location.pathname.includes('/admin/');
  if (isAdminPage && isLoggedIn && userRole !== 'admin' && userRole !== 'superadmin') {
    window.location.href = '../auth/login.html';
  }

  // inject nama ke topbar
  const adminNameEl = document.querySelector('.admin-profile strong');
  const adminRoleEl = document.querySelector('.admin-profile p');
  if (adminNameEl) adminNameEl.textContent = localStorage.getItem('userName') || 'Admin';
  if (adminRoleEl) adminRoleEl.textContent = userRole === 'superadmin' ? 'Super Admin' : 'Admin';

  // inject inisial avatar
  document.querySelectorAll('.admin-avatar').forEach(el => {
    el.textContent = (localStorage.getItem('userName') || 'A').charAt(0).toUpperCase();
  });

  // ============================================
  // SIDEBAR ACTIVE LINK
  // ============================================
  const currentFile = window.location.pathname.split('/').pop();

  document.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentFile) {
      link.classList.add('active');
      link.querySelector('.sl-icon')?.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ============================================
  // SIDEBAR MOBILE TOGGLE
  // ============================================
  const sidebar   = document.querySelector('.admin-sidebar');
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'sidebar-toggle';
  toggleBtn.setAttribute('aria-label', 'Toggle sidebar');
  toggleBtn.innerHTML = '<span></span><span></span><span></span>';
  document.body.appendChild(toggleBtn);

  toggleBtn.addEventListener('click', () => sidebar?.classList.toggle('show'));
  document.addEventListener('click', (e) => {
    if (sidebar && !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
      sidebar.classList.remove('show');
    }
  });

  // ============================================
  // STATS COUNTER ANIMATION
  // ============================================
  const statEls = document.querySelectorAll('.stats-number');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el      = entry.target;
        const raw     = el.textContent.trim();
        const numeric = parseFloat(raw.replace(/[^0-9.]/g, ''));
        if (isNaN(numeric)) return;
        const suffix    = raw.replace(/[0-9.,]/g, '').trim();
        const isDecimal = raw.includes('.');
        const duration  = 1200;
        const startTime = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const ease     = 1 - Math.pow(1 - progress, 3);
          const current  = ease * numeric;
          el.textContent = isDecimal
            ? current.toFixed(1) + suffix
            : Math.floor(current).toLocaleString('id-ID') + (suffix || '');
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = raw;
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });
    statEls.forEach(el => obs.observe(el));
  }

  // ============================================
  // TABLE ROW FADE IN
  // ============================================
  document.querySelectorAll('.admin-table tbody tr').forEach((row, i) => {
    row.style.opacity   = '0';
    row.style.transform = 'translateY(10px)';
    setTimeout(() => {
      row.style.transition = '.3s ease';
      row.style.opacity    = '1';
      row.style.transform  = 'translateY(0)';
    }, 60 + i * 60);
  });

  // ============================================
  // CARD MOUSE GLOW
  // ============================================
  document.querySelectorAll('.dashboard-card, .stats-card, .mentor-admin-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
      const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(212,168,71,.07), var(--bg-card) 55%)`;
    });
    card.addEventListener('mouseleave', () => { card.style.background = ''; });
  });

  // ============================================
  // BUTTON RIPPLE
  // ============================================
  function attachRipple(scope) {
    const root = scope || document;
    root.querySelectorAll('.btn-primary, .btn-ghost, .btn-table').forEach(btn => {
      if (btn._ripple) return;
      btn._ripple = true;
      btn.addEventListener('click', function (e) {
        const r    = this.getBoundingClientRect();
        const rpl  = document.createElement('span');
        const size = Math.max(r.width, r.height);
        rpl.className  = 'ripple';
        rpl.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-r.left-size/2}px;top:${e.clientY-r.top-size/2}px`;
        this.appendChild(rpl);
        setTimeout(() => rpl.remove(), 600);
      });
    });
  }
  attachRipple();

  // ============================================
  // LIVE CLOCK
  // ============================================
  const topbar = document.querySelector('.admin-topbar');
  if (topbar) {
    const clock  = document.createElement('div');
    clock.className = 'live-clock';
    clock.innerHTML = '<span class="live-clock-dot"></span><span class="live-clock-time"></span>';
    topbar.appendChild(clock);
    const timeEl = clock.querySelector('.live-clock-time');
    const tickClock = () => {
      timeEl.textContent = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };
    tickClock();
    setInterval(tickClock, 1000);
  }

  // ============================================
  // TOAST NOTIFICATION
  // ============================================
  function showToast(msg, type = 'default') {
    const existing = document.querySelector('.admin-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'admin-toast';
    toast.innerHTML = `<span class="admin-toast-dot"></span><span>${msg}</span>`;
    if (type === 'success') toast.style.borderColor = 'rgba(43,191,168,.3)';
    if (type === 'error')   toast.style.borderColor = 'rgba(192,41,58,.3)';
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  // expose globally
  window.showToast = showToast;

  setTimeout(() => showToast('Data berhasil dimuat'), 600);

  // ============================================
  // MODAL HELPER
  // ============================================
  window.openModal = (id) => {
    document.getElementById(id)?.classList.add('show');
    document.body.style.overflow = 'hidden';
  };
  window.closeModal = (id) => {
    document.getElementById(id)?.classList.remove('show');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.admin-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('show');
        document.body.style.overflow = '';
      }
    });
  });
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.admin-modal-overlay')?.classList.remove('show');
      document.body.style.overflow = '';
    });
  });

  // ============================================
  // FILTER CHIPS
  // ============================================
  document.querySelectorAll('.filter-group').forEach(group => {
    group.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        group.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });
  });

  // ============================================
  // PROFILE FORM SAVE
  // ============================================
  const profileForm = document.querySelector('.profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = profileForm.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Menyimpan...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled    = false;
        showToast('Profil berhasil disimpan', 'success');
      }, 1000);
    });
  }

  // ============================================
  // CRUD MODAL — shared element references
  // ============================================
  const crudModal    = document.getElementById('crudModal');
  const crudTitle    = document.getElementById('crudTitle');
  const crudSubtitle = document.getElementById('crudSubtitle');
  const crudContent  = document.getElementById('crudContent');
  const crudSave     = document.getElementById('crudSave');
  const crudCancel   = document.getElementById('crudCancel');

  if (crudModal) {
    document.getElementById('crudClose')?.addEventListener('click', () => window.closeModal('crudModal'));
    crudCancel?.addEventListener('click', () => window.closeModal('crudModal'));
    crudModal.addEventListener('click', e => { if (e.target === crudModal) window.closeModal('crudModal'); });
  }

  // ============================================
  // PAGE DETECTION
  // ============================================
  const page = currentFile;

  // ============================================
  // ██  KELOLA USER
  // ============================================
  if (page === 'kelola-user.html') {

    const modalTambah = document.getElementById('modalTambahUser');

    document.getElementById('btnTambahUser')?.addEventListener('click', () => window.openModal('modalTambahUser'));
    document.getElementById('modalCloseTambah')?.addEventListener('click', () => window.closeModal('modalTambahUser'));
    document.getElementById('modalCancelTambah')?.addEventListener('click', () => window.closeModal('modalTambahUser'));
    modalTambah?.addEventListener('click', e => { if (e.target === modalTambah) window.closeModal('modalTambahUser'); });

    document.getElementById('btnSubmitTambah')?.addEventListener('click', () => {
      const nama     = document.getElementById('tambahNama').value.trim();
      const email    = document.getElementById('tambahEmail').value.trim();
      const role     = document.getElementById('tambahRole').value;
      const password = document.getElementById('tambahPassword').value.trim();

      if (!nama || !email || !password) { showToast('Semua form wajib diisi', 'error'); return; }

      const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      let roleClass = '';
      if (role === 'Mentor') roleClass = 'mentor';
      if (role === 'Admin')  roleClass = 'admin';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="table-user">
            <div class="user-avatar">${nama.charAt(0).toUpperCase()}</div>
            <div><strong>${nama}</strong><p>${role}</p></div>
          </div>
        </td>
        <td>${email}</td>
        <td><span class="role-badge ${roleClass}">${role}</span></td>
        <td>${today}</td>
        <td>
          <div class="table-actions">
            <button class="btn-table view">Detail</button>
            <button class="btn-table edit">Edit</button>
            <button class="btn-table delete">Hapus</button>
          </div>
        </td>
      `;
      _prependRow(tr);
      ['tambahNama','tambahEmail','tambahPassword'].forEach(id => document.getElementById(id).value = '');
      document.getElementById('tambahRole').value = 'Member';
      window.closeModal('modalTambahUser');
      showToast('User berhasil ditambahkan', 'success');
    });

    // Table CRUD delegation
    document.querySelector('.admin-table tbody')?.addEventListener('click', (e) => {
      const btn = e.target.closest('button'); if (!btn) return;
      const row = btn.closest('tr');          if (!row) return;

      const namaEl   = row.querySelector('strong');
      const roleEl   = row.querySelector('.table-user p');
      const emailEl  = row.children[1];

      const nama  = namaEl?.textContent  || '';
      const role  = roleEl?.textContent  || '';
      const email = emailEl?.textContent || '';

      if (btn.classList.contains('view')) {
        _crudOpen('Detail User', 'Informasi lengkap pengguna.', `
          <div class="form-group"><label>Nama</label><input type="text" value="${nama}" readonly style="opacity:.6;cursor:default;"></div>
          <div class="form-group"><label>Role</label><input type="text" value="${role}" readonly style="opacity:.6;cursor:default;"></div>
          <div class="form-group"><label>Email</label><input type="email" value="${email}" readonly style="opacity:.6;cursor:default;"></div>
        `, false);
      }

      if (btn.classList.contains('edit')) {
        _crudOpen('Edit User', 'Perbarui data pengguna.', `
          <div class="form-group"><label>Nama</label><input type="text" id="eNama" value="${nama}"></div>
          <div class="form-group"><label>Role</label><input type="text" id="eRole" value="${role}"></div>
          <div class="form-group"><label>Email</label><input type="email" id="eEmail" value="${email}"></div>
        `, true);
        crudSave.onclick = () => {
          const n = document.getElementById('eNama').value.trim();
          const r = document.getElementById('eRole').value.trim();
          const em = document.getElementById('eEmail').value.trim();
          if (!n || !em) { showToast('Nama & email wajib diisi', 'error'); return; }
          namaEl.textContent  = n;
          roleEl.textContent  = r;
          emailEl.textContent = em;
          window.closeModal('crudModal');
          showToast('User berhasil diupdate', 'success');
        };
      }

      if (btn.classList.contains('delete')) {
        _crudOpenDelete('Hapus User', `Yakin ingin menghapus <strong style="color:var(--white);">${nama}</strong>? Data akan dihapus permanen.`, row);
      }
    });
  }

  // ============================================
  // ██  KELOLA PRODUK
  // ============================================
  if (page === 'kelola-produk.html') {

    const modalTambah = document.getElementById('modalTambahProduk');

    document.getElementById('btnTambahProduk')?.addEventListener('click', () => window.openModal('modalTambahProduk'));
    document.getElementById('modalCloseTambah')?.addEventListener('click', () => window.closeModal('modalTambahProduk'));
    document.getElementById('modalCancelTambah')?.addEventListener('click', () => window.closeModal('modalTambahProduk'));
    modalTambah?.addEventListener('click', e => { if (e.target === modalTambah) window.closeModal('modalTambahProduk'); });

    document.getElementById('btnSubmitTambah')?.addEventListener('click', () => {
      const judul   = document.getElementById('tambahJudul').value.trim();
      const genre   = document.getElementById('tambahGenre').value;
      const penulis = document.getElementById('tambahPenulis').value.trim();
      const harga   = document.getElementById('tambahHarga').value.trim();
      const status  = document.getElementById('tambahStatus').value;

      if (!judul || !penulis || !harga) { showToast('Judul, penulis & harga wajib diisi', 'error'); return; }

      const hargaFmt = 'Rp ' + Math.round(Number(harga) / 1000) + 'K';
      const stClass  = _statusClass(status);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="table-user">
            <div class="user-avatar">${judul.charAt(0).toUpperCase()}</div>
            <div><strong>${judul}</strong><p>Novel ${genre}</p></div>
          </div>
        </td>
        <td><span class="role-badge">${genre}</span></td>
        <td>${penulis}</td>
        <td style="color:var(--white);font-weight:500;">${hargaFmt}</td>
        <td><span class="status ${stClass}">${status}</span></td>
        <td>
          <div class="table-actions">
            <button class="btn-table view">Detail</button>
            <button class="btn-table edit">Edit</button>
            <button class="btn-table delete">Hapus</button>
          </div>
        </td>
      `;
      _prependRow(tr);
      ['tambahJudul','tambahPenulis','tambahHarga','tambahDesk'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
      });
      document.getElementById('tambahGenre').value  = 'Romance';
      document.getElementById('tambahStatus').value = 'Publish';
      window.closeModal('modalTambahProduk');
      showToast('Produk berhasil ditambahkan', 'success');
    });

    document.querySelector('.admin-table tbody')?.addEventListener('click', (e) => {
      const btn = e.target.closest('button'); if (!btn) return;
      const row = btn.closest('tr');          if (!row) return;

      const judulEl   = row.querySelector('strong');
      const genreEl   = row.querySelector('.role-badge');
      const penulisEl = row.children[2];
      const hargaEl   = row.children[3];
      const statusEl  = row.querySelector('.status');

      const judul   = judulEl?.textContent   || '';
      const genre   = genreEl?.textContent   || '';
      const penulis = penulisEl?.textContent || '';
      const harga   = hargaEl?.textContent   || '';
      const status  = statusEl?.textContent  || '';

      if (btn.classList.contains('view')) {
        _crudOpen('Detail Produk', 'Informasi lengkap produk.', `
          <div class="form-group"><label>Judul</label><input type="text" value="${judul}" readonly style="opacity:.6;cursor:default;"></div>
          <div class="form-group"><label>Genre</label><input type="text" value="${genre}" readonly style="opacity:.6;cursor:default;"></div>
          <div class="form-group"><label>Penulis</label><input type="text" value="${penulis}" readonly style="opacity:.6;cursor:default;"></div>
          <div class="form-group"><label>Harga</label><input type="text" value="${harga}" readonly style="opacity:.6;cursor:default;"></div>
          <div class="form-group"><label>Status</label><input type="text" value="${status}" readonly style="opacity:.6;cursor:default;"></div>
        `, false);
      }

      if (btn.classList.contains('edit')) {
        _crudOpen('Edit Produk', 'Perbarui data produk.', `
          <div class="form-group"><label>Judul</label><input type="text" id="eJudul" value="${judul}"></div>
          <div class="form-group"><label>Genre</label>
            <select id="eGenre">${['Romance','Fantasi','Misteri','Thriller','Sastra','Horor'].map(g =>
              `<option${g===genre?' selected':''}>${g}</option>`).join('')}</select>
          </div>
          <div class="form-group"><label>Penulis</label><input type="text" id="ePenulis" value="${penulis}"></div>
          <div class="form-group"><label>Harga</label><input type="text" id="eHarga" value="${harga}"></div>
          <div class="form-group"><label>Status</label>
            <select id="eStatus">${['Publish','Draft','Arsip'].map(s =>
              `<option${s===status?' selected':''}>${s}</option>`).join('')}</select>
          </div>
        `, true);
        crudSave.onclick = () => {
          const nJ = document.getElementById('eJudul').value.trim();
          const nG = document.getElementById('eGenre').value;
          const nP = document.getElementById('ePenulis').value.trim();
          const nH = document.getElementById('eHarga').value.trim();
          const nS = document.getElementById('eStatus').value;
          if (!nJ || !nP) { showToast('Judul & penulis wajib diisi', 'error'); return; }
          judulEl.textContent   = nJ;
          genreEl.textContent   = nG;
          penulisEl.textContent = nP;
          hargaEl.textContent   = nH;
          statusEl.textContent  = nS;
          statusEl.className    = 'status ' + _statusClass(nS);
          window.closeModal('crudModal');
          showToast('Produk berhasil diupdate', 'success');
        };
      }

      if (btn.classList.contains('delete')) {
        _crudOpenDelete('Hapus Produk', `Yakin ingin menghapus <strong style="color:var(--white);">${judul}</strong>? Data akan dihapus permanen.`, row);
      }
    });
  }

  // ============================================
  // ██  KELOLA ARTIKEL
  // ============================================
  if (page === 'kelola-artikel.html') {

    const modalTulis = document.getElementById('modalTulisArtikel');

    document.getElementById('btnTulisArtikel')?.addEventListener('click', () => window.openModal('modalTulisArtikel'));
    document.getElementById('modalCloseTulis')?.addEventListener('click', () => window.closeModal('modalTulisArtikel'));
    document.getElementById('modalCancelTulis')?.addEventListener('click', () => window.closeModal('modalTulisArtikel'));
    modalTulis?.addEventListener('click', e => { if (e.target === modalTulis) window.closeModal('modalTulisArtikel'); });

    document.getElementById('btnSubmitTulis')?.addEventListener('click', () => {
      const judul    = document.getElementById('tulisJudul').value.trim();
      const kategori = document.getElementById('tulisKategori').value;
      const penulis  = document.getElementById('tulisPenulis').value.trim();
      const status   = document.getElementById('tulisStatus').value;

      if (!judul || !penulis) { showToast('Judul & penulis wajib diisi', 'error'); return; }

      const today   = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      const stClass = _statusClass(status);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="table-user">
            <div class="user-avatar">${judul.charAt(0).toUpperCase()}</div>
            <div><strong>${judul}</strong><p>${status === 'Publish' ? 'Dipublish ' + today : 'Draft terbaru'}</p></div>
          </div>
        </td>
        <td><span class="role-badge">${kategori}</span></td>
        <td>${penulis}</td>
        <td style="color:var(--white-muted);">—</td>
        <td><span class="status ${stClass}">${status}</span></td>
        <td>
          <div class="table-actions">
            <button class="btn-table view">Detail</button>
            <button class="btn-table edit">Edit</button>
            <button class="btn-table delete">Hapus</button>
          </div>
        </td>
      `;
      _prependRow(tr);
      ['tulisJudul','tulisPenulis','tulisDesk'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
      document.getElementById('tulisKategori').value = 'Tips Menulis';
      document.getElementById('tulisStatus').value   = 'Draft';
      window.closeModal('modalTulisArtikel');
      showToast('Artikel berhasil disimpan', 'success');
    });

    document.querySelector('.admin-table tbody')?.addEventListener('click', (e) => {
      const btn = e.target.closest('button'); if (!btn) return;
      const row = btn.closest('tr');          if (!row) return;

      const judulEl    = row.querySelector('strong');
      const kategoriEl = row.querySelector('.role-badge');
      const penulisEl  = row.children[2];
      const viewsEl    = row.children[3];
      const statusEl   = row.querySelector('.status');

      const judul    = judulEl?.textContent    || '';
      const kategori = kategoriEl?.textContent || '';
      const penulis  = penulisEl?.textContent  || '';
      const views    = viewsEl?.textContent    || '—';
      const status   = statusEl?.textContent   || '';

      if (btn.classList.contains('view')) {
        _crudOpen('Detail Artikel', 'Informasi lengkap artikel.', `
          <div class="form-group"><label>Judul</label><input type="text" value="${judul}" readonly style="opacity:.6;cursor:default;"></div>
          <div class="form-group"><label>Kategori</label><input type="text" value="${kategori}" readonly style="opacity:.6;cursor:default;"></div>
          <div class="form-group"><label>Penulis</label><input type="text" value="${penulis}" readonly style="opacity:.6;cursor:default;"></div>
          <div class="form-group"><label>Views</label><input type="text" value="${views}" readonly style="opacity:.6;cursor:default;"></div>
          <div class="form-group"><label>Status</label><input type="text" value="${status}" readonly style="opacity:.6;cursor:default;"></div>
        `, false);
      }

      if (btn.classList.contains('edit')) {
        _crudOpen('Edit Artikel', 'Perbarui data artikel. Views tidak dapat diubah.', `
          <div class="form-group"><label>Judul</label><input type="text" id="eJudul" value="${judul}"></div>
          <div class="form-group"><label>Kategori</label>
            <select id="eKategori">${['Tips Menulis','Storytelling','Character Development','World Building','Publishing'].map(k =>
              `<option${k===kategori?' selected':''}>${k}</option>`).join('')}</select>
          </div>
          <div class="form-group"><label>Penulis</label><input type="text" id="ePenulis" value="${penulis}"></div>
          <div class="form-group"><label>Views</label><input type="text" value="${views}" readonly style="opacity:.5;cursor:not-allowed;"></div>
          <div class="form-group"><label>Status</label>
            <select id="eStatus">${['Publish','Draft','Trending'].map(s =>
              `<option${s===status?' selected':''}>${s}</option>`).join('')}</select>
          </div>
        `, true);
        crudSave.onclick = () => {
          const nJ = document.getElementById('eJudul').value.trim();
          const nK = document.getElementById('eKategori').value;
          const nP = document.getElementById('ePenulis').value.trim();
          const nS = document.getElementById('eStatus').value;
          if (!nJ || !nP) { showToast('Judul & penulis wajib diisi', 'error'); return; }
          judulEl.textContent    = nJ;
          kategoriEl.textContent = nK;
          penulisEl.textContent  = nP;
          statusEl.textContent   = nS;
          statusEl.className     = 'status ' + _statusClass(nS);
          window.closeModal('crudModal');
          showToast('Artikel berhasil diupdate', 'success');
        };
      }

      if (btn.classList.contains('delete')) {
        _crudOpenDelete('Hapus Artikel', `Yakin ingin menghapus <strong style="color:var(--white);">${judul}</strong>? Artikel akan dihapus permanen.`, row);
      }
    });
  }

  // ============================================
  // ██  KELOLA MENTOR
  // ============================================
  if (page === 'kelola-mentor.html') {

    const modalTambah = document.getElementById('modalTambahMentor');

    document.getElementById('btnTambahMentor')?.addEventListener('click', () => window.openModal('modalTambahMentor'));
    document.getElementById('modalCloseTambah')?.addEventListener('click', () => window.closeModal('modalTambahMentor'));
    document.getElementById('modalCancelTambah')?.addEventListener('click', () => window.closeModal('modalTambahMentor'));
    modalTambah?.addEventListener('click', e => { if (e.target === modalTambah) window.closeModal('modalTambahMentor'); });

    document.getElementById('btnSubmitTambah')?.addEventListener('click', () => {
      const nama      = document.getElementById('tambahNama').value.trim();
      const email     = document.getElementById('tambahEmail').value.trim();
      const role      = document.getElementById('tambahRole').value.trim();
      const spesialis = document.getElementById('tambahSpesialis').value;
      const status    = document.getElementById('tambahStatus').value;
      const bio       = document.getElementById('tambahBio').value.trim();

      if (!nama || !email) { showToast('Nama & email wajib diisi', 'error'); return; }

      const initials = nama.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
      const stClass  = _mentorStatusClass(status);

      const card = document.createElement('div');
      card.className = 'mentor-admin-card mc-teal';
      card.innerHTML = `
        <div class="mentor-admin-top">
          <div class="mentor-avatar ma-teal">${initials}</div>
          <span class="mentor-status ${stClass}">${status}</span>
        </div>
        <h3>${nama}</h3>
        <p class="mentor-role">${role || spesialis + ' Mentor'}</p>
        <p class="mentor-desc">${bio || 'Spesialis ' + spesialis + '.'}</p>
        <div class="mentor-meta">
          <span class="mentor-meta-item">
            <svg viewBox="0 0 24 24"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>
            0 mentee
          </span>
          <span class="mentor-meta-item">
            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            —
          </span>
        </div>
        <div class="mentor-actions">
          <button class="btn-table view">Detail</button>
          <button class="btn-table edit">Edit</button>
          <button class="btn-table delete">Hapus</button>
        </div>
      `;
      card.style.opacity = '0';
      const grid = document.getElementById('mentorGrid');
      grid.prepend(card);
      requestAnimationFrame(() => { card.style.transition = '.35s ease'; card.style.opacity = '1'; });

      ['tambahNama','tambahEmail','tambahRole','tambahBio'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
      });
      document.getElementById('tambahStatus').value = 'Active';
      window.closeModal('modalTambahMentor');
      showToast('Mentor berhasil ditambahkan', 'success');
      attachRipple(card);
    });

    document.getElementById('mentorGrid')?.addEventListener('click', (e) => {
      const btn = e.target.closest('button'); if (!btn) return;
      const card = btn.closest('.mentor-admin-card'); if (!card) return;

      const namaEl   = card.querySelector('h3');
      const roleEl   = card.querySelector('.mentor-role');
      const descEl   = card.querySelector('.mentor-desc');
      const statusEl = card.querySelector('.mentor-status');
      const metaEls  = card.querySelectorAll('.mentor-meta-item');

      const nama   = namaEl?.textContent.trim()   || '';
      const role   = roleEl?.textContent.trim()   || '';
      const desc   = descEl?.textContent.trim()   || '';
      const status = statusEl?.textContent.trim() || '';
      const mentee = metaEls[0]?.textContent.trim() || '';
      const rating = metaEls[1]?.textContent.trim() || '';

      if (btn.classList.contains('view')) {
        _crudOpen('Detail Mentor', 'Informasi lengkap mentor.', `
          <div class="form-group"><label>Nama</label><input type="text" value="${nama}" readonly style="opacity:.6;cursor:default;"></div>
          <div class="form-group"><label>Role / Jabatan</label><input type="text" value="${role}" readonly style="opacity:.6;cursor:default;"></div>
          <div class="form-group"><label>Bio</label><textarea rows="3" readonly style="opacity:.6;cursor:default;">${desc}</textarea></div>
          <div class="form-group"><label>Mentee</label><input type="text" value="${mentee}" readonly style="opacity:.6;cursor:default;"></div>
          <div class="form-group"><label>Rating</label><input type="text" value="${rating}" readonly style="opacity:.6;cursor:default;"></div>
          <div class="form-group"><label>Status</label><input type="text" value="${status}" readonly style="opacity:.6;cursor:default;"></div>
        `, false);
      }

      if (btn.classList.contains('edit')) {
        _crudOpen('Edit Mentor', 'Perbarui data mentor.', `
          <div class="form-group"><label>Nama</label><input type="text" id="eNama" value="${nama}"></div>
          <div class="form-group"><label>Role / Jabatan</label><input type="text" id="eRole" value="${role}"></div>
          <div class="form-group"><label>Bio</label><textarea id="eDesc" rows="3">${desc}</textarea></div>
          <div class="form-group"><label>Status</label>
            <select id="eStatus">${['Active','On Leave','Pending'].map(s =>
              `<option${s===status?' selected':''}>${s}</option>`).join('')}</select>
          </div>
        `, true);
        crudSave.onclick = () => {
          const nN = document.getElementById('eNama').value.trim();
          const nR = document.getElementById('eRole').value.trim();
          const nD = document.getElementById('eDesc').value.trim();
          const nS = document.getElementById('eStatus').value;
          if (!nN) { showToast('Nama wajib diisi', 'error'); return; }
          namaEl.textContent   = nN;
          roleEl.textContent   = nR;
          descEl.textContent   = nD;
          statusEl.textContent = nS;
          statusEl.className   = 'mentor-status ' + _mentorStatusClass(nS);
          window.closeModal('crudModal');
          showToast('Mentor berhasil diupdate', 'success');
        };
      }

      if (btn.classList.contains('delete')) {
        _crudOpenDelete(
          'Hapus Mentor',
          `Yakin ingin menghapus mentor <strong style="color:var(--white);">${nama}</strong>? Data akan dihapus permanen.`,
          null,
          card,
          'scale(.95)'
        );
      }
    });
  }

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  /** Prepend a <tr> to the first tbody with fade-in */
  function _prependRow(tr) {
    const tbody = document.querySelector('.admin-table tbody');
    if (!tbody) return;
    tr.style.opacity = '0';
    tbody.prepend(tr);
    requestAnimationFrame(() => { tr.style.transition = '.35s ease'; tr.style.opacity = '1'; });
    attachRipple(tr);
  }

  /** Status CSS class for table rows */
  function _statusClass(val) {
    if (val === 'Publish' || val === 'Active' || val === 'Trending') return 'success';
    if (val === 'Draft'   || val === 'Pending') return 'pending';
    if (val === 'Arsip'   || val === 'Banned')  return 'failed';
    return 'pending';
  }

  /** Status CSS class for mentor badges */
  function _mentorStatusClass(val) {
    if (val === 'Active')   return 'active';
    if (val === 'On Leave') return 'pending';
    if (val === 'Pending')  return 'pending';
    return 'pending';
  }

  /**
   * Open CRUD modal
   * @param {string}  title
   * @param {string}  subtitle
   * @param {string}  html       - inner HTML for crudContent
   * @param {boolean} showSave   - whether to show Save button
   */
  function _crudOpen(title, subtitle, html, showSave) {
    if (!crudModal) return;
    crudTitle.textContent    = title;
    crudSubtitle.textContent = subtitle;
    crudContent.innerHTML    = html;
    crudSave.style.display   = showSave ? 'inline-flex' : 'none';
    crudSave.style.background = '';
    crudSave.textContent     = 'Simpan';
    crudCancel.textContent   = showSave ? 'Batal' : 'Tutup';
    window.openModal('crudModal');
  }

  /**
   * Open delete confirmation modal, removes element on confirm
   * @param {string}      title
   * @param {string}      bodyHTML
   * @param {HTMLElement} rowEl      - <tr> to remove (pass null if card)
   * @param {HTMLElement} cardEl     - card to remove (pass null if row)
   * @param {string}      scaleOut   - transform for card animation
   */
  function _crudOpenDelete(title, bodyHTML, rowEl, cardEl, scaleOut) {
    if (!crudModal) return;
    crudTitle.textContent    = title;
    crudSubtitle.textContent = 'Tindakan ini tidak bisa dibatalkan.';
    crudContent.innerHTML    = `<p style="color:var(--white-muted);line-height:1.6;">${bodyHTML}</p>`;
    crudSave.style.display   = 'inline-flex';
    crudSave.textContent     = 'Ya, Hapus';
    crudSave.style.background = 'rgba(192,41,58,.8)';
    crudCancel.textContent   = 'Batal';
    window.openModal('crudModal');

    crudSave.onclick = () => {
      const target = rowEl || cardEl;
      if (target) {
        target.style.transition = '.3s ease';
        target.style.opacity    = '0';
        target.style.transform  = scaleOut || 'translateX(40px)';
        setTimeout(() => target.remove(), 300);
      }
      crudSave.style.background = '';
      window.closeModal('crudModal');
      showToast('Data berhasil dihapus', 'success');
    };
  }

});