/* ================================================
   MENTOR.JS — NovelCraft Mentor Panel Scripts
   Merged with dashboard.js shared logic
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // AUTH GUARD — mentor role
  // ============================================
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole   = localStorage.getItem('userRole') || '';

  const isMentorPage = window.location.pathname.includes('/mentor/');
  if (isMentorPage && isLoggedIn && userRole !== 'mentor') {
    window.location.href = '../auth/login.html';
  }

  // inject nama ke topbar
  const profileNameEl = document.querySelector('.admin-profile strong');
  const profileRoleEl = document.querySelector('.admin-profile p');
  if (profileNameEl) profileNameEl.textContent = localStorage.getItem('userName') || 'Mentor';
  if (profileRoleEl) profileRoleEl.textContent = 'Mentor';

  document.querySelectorAll('.admin-avatar').forEach(el => {
    el.textContent = (localStorage.getItem('userName') || 'M').charAt(0).toUpperCase();
  });

  // ============================================
  // SIDEBAR ACTIVE LINK
  // ============================================
  const currentFile = window.location.pathname.split('/').pop();

  document.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentFile) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ============================================
  // SIDEBAR MOBILE TOGGLE
  // ============================================
  const sidebar   = document.getElementById('mentorSidebar');
  const toggleBtn = document.getElementById('sidebarToggle');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => sidebar.classList.toggle('show'));
    document.addEventListener('click', (e) => {
      if (sidebar && !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        sidebar.classList.remove('show');
      }
    });
  }

  // ============================================
  // LIVE CLOCK
  // ============================================
  function updateClock() {
    const el = document.getElementById('liveClock');
    if (!el) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    el.textContent = h + ':' + m;
  }
  updateClock();
  setInterval(updateClock, 1000);

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
  document.querySelectorAll('.dashboard-card, .stats-card, .jadwal-card, .mentee-card, .request-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
      const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(212,168,71,.07), var(--bg-card, #1a1a2e) 55%)`;
    });
    card.addEventListener('mouseleave', () => { card.style.background = ''; });
  });

  // ============================================
  // BUTTON RIPPLE
  // ============================================
  function attachRipple(scope) {
    const root = scope || document;
    root.querySelectorAll('.btn-primary, .btn-ghost, .btn-table, .btn-accept, .btn-decline, .btn-mentee').forEach(btn => {
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

  // CRUD modal references
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
  // FILTER CHIPS (generic)
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
  // ANIMATE PROGRESS BARS
  // ============================================
  const bars = document.querySelectorAll('.mentee-progress-fill');
  if (bars.length && 'IntersectionObserver' in window) {
    const barObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el  = entry.target;
          const pct = el.dataset.progress ?? '0';
          el.style.width = pct + '%';
          barObs.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(bar => { bar.style.width = '0%'; barObs.observe(bar); });
  }

  // ============================================
  // PAGE DETECTION
  // ============================================
  const page = currentFile;

  // ============================================
  // ██  JADWAL MENTOR
  // ============================================
  if (page === 'jadwal-mentor.html') {
    const modalTambah = document.getElementById('modalTambahJadwal');

    document.getElementById('btnTambahJadwal')?.addEventListener('click', () => window.openModal('modalTambahJadwal'));
    document.getElementById('modalCloseTambah')?.addEventListener('click', () => window.closeModal('modalTambahJadwal'));
    document.getElementById('modalCancelTambah')?.addEventListener('click', () => window.closeModal('modalTambahJadwal'));
    modalTambah?.addEventListener('click', e => { if (e.target === modalTambah) window.closeModal('modalTambahJadwal'); });

    document.getElementById('btnSubmitTambah')?.addEventListener('click', () => {
      const judul  = document.getElementById('tambahJudul').value.trim();
      const tipe   = document.getElementById('tambahTipe').value;
      const tgl    = document.getElementById('tambahTgl').value;
      const jam    = document.getElementById('tambahJam').value;

      if (!judul || !tgl || !jam) { showToast('Semua field wajib diisi', 'error'); return; }

      const card = document.createElement('div');
      card.className = 'jadwal-card';
      card.innerHTML = `
        <div class="jadwal-tag">${tipe}</div>
        <h3>${judul}</h3>
        <div class="jadwal-time">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ${tgl} · ${jam}
        </div>
        <div class="jadwal-meta">
          <div class="jadwal-mentees">
            <div class="jadwal-dot-group"><span class="jadwal-dot"></span></div>
            0 mentee
          </div>
          <span class="jadwal-status upcoming">Akan Datang</span>
        </div>
      `;
      card.style.opacity = '0';
      const grid = document.getElementById('jadwalGrid');
      grid?.prepend(card);
      requestAnimationFrame(() => { card.style.transition = '.35s ease'; card.style.opacity = '1'; });
      document.getElementById('tambahJudul').value = '';
      document.getElementById('tambahTgl').value   = '';
      document.getElementById('tambahJam').value   = '';
      window.closeModal('modalTambahJadwal');
      showToast('Jadwal berhasil ditambahkan', 'success');
      attachRipple(card);
    });

    // Edit/Hapus jadwal
    document.getElementById('jadwalGrid')?.addEventListener('click', (e) => {
      const btn = e.target.closest('button'); if (!btn) return;
      const card = btn.closest('.jadwal-card'); if (!card) return;
      const judul = card.querySelector('h3')?.textContent || '';

      if (btn.classList.contains('btn-edit-jadwal')) {
        const judulEl = card.querySelector('h3');
        _crudOpen('Edit Jadwal', 'Perbarui sesi.', `
          <div class="form-group"><label>Judul Sesi</label><input type="text" id="eJudul" value="${judulEl?.textContent || ''}"></div>
          <div class="form-group"><label>Tipe</label>
            <select id="eTipe"><option>Workshop</option><option>Intensif</option><option>1-on-1</option></select>
          </div>
        `, true);
        crudSave.onclick = () => {
          const nJ = document.getElementById('eJudul').value.trim();
          const nT = document.getElementById('eTipe').value;
          if (!nJ) { showToast('Judul wajib diisi', 'error'); return; }
          if (judulEl) judulEl.textContent = nJ;
          const tagEl = card.querySelector('.jadwal-tag');
          if (tagEl) tagEl.textContent = nT;
          window.closeModal('crudModal');
          showToast('Jadwal berhasil diupdate', 'success');
        };
      }

      if (btn.classList.contains('btn-hapus-jadwal')) {
        _crudOpenDelete('Hapus Jadwal', `Yakin hapus sesi <strong style="color:var(--white);">${judul}</strong>?`, null, card, 'scale(.95)');
      }
    });
  }

  // ============================================
  // ██  MENTEE LIST
  // ============================================
  if (page === 'mentee-list.html' || page === 'daftar-mentee.html') {
    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.filter;
        document.querySelectorAll('.mentee-card').forEach(card => {
          card.style.display = (filter === 'all' || card.dataset.status === filter) ? '' : 'none';
        });
      });
    });

    // Search
    document.getElementById('menteeSearch')?.addEventListener('input', function () {
      const q = this.value.toLowerCase();
      document.querySelectorAll('.mentee-card').forEach(card => {
        const name = card.querySelector('strong')?.textContent.toLowerCase() ?? '';
        card.style.display = name.includes(q) ? '' : 'none';
      });
    });

    // Detail mentee button
    document.getElementById('menteeCards')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-mentee'); if (!btn) return;
      const card = btn.closest('.mentee-card'); if (!card) return;
      const nama = card.querySelector('strong')?.textContent || '';
      const pct  = card.querySelector('.mentee-progress-fill')?.dataset.progress || '0';

      if (btn.textContent.trim() === 'Detail') {
        _crudOpen('Detail Mentee', `Progres mentoring ${nama}.`, `
          <div class="form-group"><label>Nama</label><input type="text" value="${nama}" readonly style="opacity:.6;cursor:default;"></div>
          <div class="form-group"><label>Progres</label><input type="text" value="${pct}%" readonly style="opacity:.6;cursor:default;"></div>
        `, false);
      }

      if (btn.textContent.trim() === 'Kirim Pesan') {
        _crudOpen('Kirim Pesan', `Pesan ke ${nama}`, `
          <div class="form-group"><label>Pesan</label><textarea id="msgText" rows="4" placeholder="Tulis pesan..."></textarea></div>
        `, true);
        crudSave.textContent = 'Kirim';
        crudSave.onclick = () => {
          const msg = document.getElementById('msgText').value.trim();
          if (!msg) { showToast('Pesan tidak boleh kosong', 'error'); return; }
          window.closeModal('crudModal');
          showToast(`Pesan terkirim ke ${nama} ✦`, 'success');
        };
      }
    });
  }

  // ============================================
  // ██  REQUEST MENTOR
  // ============================================
  if (page === 'request-mentor.html' || page === 'permintaan.html') {
    document.querySelectorAll('.btn-accept').forEach(btn => {
      btn.addEventListener('click', function () {
        const card = this.closest('.request-card'); if (!card) return;
        const name = card.querySelector('strong')?.textContent ?? 'Mentee';
        showToast(`Permintaan dari ${name} diterima ✦`, 'success');
        card.style.transition = '.35s ease';
        card.style.opacity    = '0';
        card.style.transform  = 'translateX(20px)';
        setTimeout(() => card.remove(), 350);
      });
    });

    document.querySelectorAll('.btn-decline').forEach(btn => {
      btn.addEventListener('click', function () {
        const card = this.closest('.request-card'); if (!card) return;
        const name = card.querySelector('strong')?.textContent ?? 'Mentee';
        _crudOpenDelete(
          'Tolak Permintaan',
          `Yakin ingin menolak permintaan dari <strong style="color:var(--white);">${name}</strong>?`,
          null, card, 'translateX(-20px)'
        );
      });
    });
  }

  // ============================================
  // ██  PROFILE MENTOR
  // ============================================
  if (page === 'profile-mentor.html' || page === 'profil-mentor.html') {
    const profileForm = document.getElementById('profileMentorForm');
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
          showToast('Profil berhasil disimpan ✦', 'success');
        }, 1000);
      });
    }
  }

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
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

  function _crudOpenDelete(title, bodyHTML, rowEl, cardEl, scaleOut) {
    if (!crudModal) return;
    crudTitle.textContent    = title;
    crudSubtitle.textContent = 'Tindakan ini tidak bisa dibatalkan.';
    crudContent.innerHTML    = `<p style="color:rgba(255,255,255,.6);line-height:1.6;">${bodyHTML}</p>`;
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