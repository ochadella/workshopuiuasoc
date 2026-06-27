/* ================================================
   NOVELCRAFT — USER PANEL JS
   Shared logic untuk semua halaman user
================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // AUTH GUARD — user role
  // ============================================
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole   = localStorage.getItem('userRole') || '';
  const isUserPage = window.location.pathname.includes('/user/');

  if (isUserPage && isLoggedIn && userRole === 'mentor') {
    window.location.href = '../mentor/dashboard-mentor.html';
  }

  // Inject nama ke topbar
  const profileNameEl = document.querySelector('.admin-profile strong');
  const profileRoleEl = document.querySelector('.admin-profile p');
  const userName = localStorage.getItem('userName') || 'Penulis';
  if (profileNameEl) profileNameEl.textContent = userName;
  if (profileRoleEl) profileRoleEl.textContent  = 'Member';

  document.querySelectorAll('.admin-avatar').forEach(el => {
    el.textContent = userName.charAt(0).toUpperCase();
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
  const sidebar   = document.getElementById('userSidebar');
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
  if ('IntersectionObserver' in window && statEls.length) {
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
  // ANIMATE PROGRESS BARS
  // ============================================
  const bars = document.querySelectorAll('.progress-fill[data-progress]');
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
  // CARD MOUSE GLOW
  // ============================================
  document.querySelectorAll('.dashboard-card, .stats-card, .novel-progress-card, .sesi-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
      const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(212,168,71,.06), var(--bg-card, #1a1a2e) 55%)`;
    });
    card.addEventListener('mouseleave', () => { card.style.background = ''; });
  });

  // ============================================
  // BUTTON RIPPLE
  // ============================================
  document.querySelectorAll('.btn-primary, .btn-ghost, .btn-teal').forEach(btn => {
    if (btn._ripple) return;
    btn._ripple = true;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.addEventListener('click', function (e) {
      const r    = this.getBoundingClientRect();
      const rpl  = document.createElement('span');
      const size = Math.max(r.width, r.height);
      rpl.className = 'ripple';
      rpl.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-r.left-size/2}px;top:${e.clientY-r.top-size/2}px`;
      this.appendChild(rpl);
      setTimeout(() => rpl.remove(), 600);
    });
  });

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
  // FILTER TABS (generic)
  // ============================================
  document.querySelectorAll('[data-filter-group]').forEach(group => {
    const target = group.dataset.filterGroup;
    group.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll(`[data-filter-target="${target}"]`).forEach(item => {
          item.style.display = (filter === 'all' || item.dataset.status === filter) ? '' : 'none';
        });
      });
    });
  });

  // ============================================
  // LOGOUT
  // ============================================
  document.querySelectorAll('[data-logout]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userRole');
      window.location.href = '../index.html';
    });
  });

});