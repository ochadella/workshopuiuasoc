/* ============================================
   NOVELCRAFT — script.js
   ============================================ */

// ============================================
// NAVBAR LOADER
// ============================================

function getRootPrefix() {
  // pathname contoh: /workshopuiuasoc/katalog/katalog.html
  // → parts: ['workshopuiuasoc', 'katalog', 'katalog.html']
  const parts    = window.location.pathname.split('/').filter(Boolean);
  const repoName = 'workshopuiuasoc'; // ← nama repo GitHub Pages kamu
  const repoIdx  = parts.indexOf(repoName);

  if (repoIdx === -1) {
    // Fallback: hitung dari semua parts (user-site tanpa subfolder repo)
    const depth = parts.length - 1;
    return depth <= 0 ? './' : '../'.repeat(depth);
  }

  // Hitung folder setelah repo hingga sebelum filename
  // contoh: ['workshopuiuasoc', 'katalog', 'katalog.html']
  //          repoIdx=0, parts.length=3 → depth = 3 - 0 - 2 = 1 → '../'
  // contoh: ['workshopuiuasoc', 'index.html']
  //          repoIdx=0, parts.length=2 → depth = 2 - 0 - 2 = 0 → './'
  const depth = parts.length - repoIdx - 2;
  return depth <= 0 ? './' : '../'.repeat(depth);
}

function initNavbar(root) {
  // ---- Isi semua href dari data-nav-root ----
  document.querySelectorAll('[data-nav-root]').forEach(el => {
    el.href = root + el.getAttribute('data-nav-root');
  });

  // ---- Scroll effect ----
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // ---- Hamburger ----
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.contains('open');
      hamburger.classList.toggle('open', !open);

      if (!open) {
        navLinks.style.display       = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position      = 'absolute';
        navLinks.style.top           = '60px';
        navLinks.style.left          = '0';
        navLinks.style.right         = '0';
        navLinks.style.background    = 'rgba(10,6,8,.97)';
        navLinks.style.padding       = '1rem 4vw 1.5rem';
        navLinks.style.borderBottom  = '1px solid rgba(212,168,71,.15)';
        navLinks.style.zIndex        = '999';
      } else {
        navLinks.removeAttribute('style');
      }
    });
  }

  // ---- Login state ----
  const isLoggedIn   = localStorage.getItem('isLoggedIn') === 'true';
  const userName     = localStorage.getItem('userName') || 'C';
  const guestActions = document.getElementById('guestActions');
  const profileMenu  = document.getElementById('profileMenu');
  const profileBtn   = document.getElementById('profileBtn');

  if (guestActions && profileMenu) {
    if (isLoggedIn) {
      guestActions.style.display = 'none';
      profileMenu.style.display  = 'flex';
      if (profileBtn) profileBtn.textContent = userName.charAt(0).toUpperCase();
    } else {
      guestActions.style.display = 'flex';
      profileMenu.style.display  = 'none';
    }
  }

  // ---- Profile dropdown ----
  if (profileBtn) {
    profileBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      document.getElementById('profileDropdown')?.classList.toggle('show');
    });
  }

  document.addEventListener('click', function (e) {
    const menu = document.getElementById('profileMenu');
    if (menu && !menu.contains(e.target)) {
      document.getElementById('profileDropdown')?.classList.remove('show');
    }
  });

  // ---- Logout ----
  document.getElementById('logoutBtn')?.addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    window.location.href = root + 'auth/login.html';
  });

  // ---- Active link ----
  const currentHref = window.location.href;
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.href && link.href === currentHref) link.classList.add('active');
  });
}

// Fetch navbar lalu init
(function loadNavbar() {
  const placeholder = document.getElementById('navbar-placeholder');
  if (!placeholder) return;

  const root       = getRootPrefix();
  const navbarPath = root + 'components/navbar.html';

  fetch(navbarPath)
    .then(r => {
      if (!r.ok) throw new Error(`Navbar fetch gagal: ${r.status} — ${navbarPath}`);
      return r.text();
    })
    .then(html => {
      placeholder.innerHTML = html;
      initNavbar(root);
    })
    .catch(err => console.warn('Navbar gagal dimuat:', err));
})();

// ============================================
// PAGE SCRIPTS
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- STATS COUNTER ----
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (statNums.length > 0) {
    const countUp = (el) => {
      const target   = parseInt(el.dataset.target, 10);
      const duration = 1500;
      const step     = target / (duration / 16);
      let current    = 0;
      const timer    = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current).toLocaleString('id-ID');
      }, 16);
    };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { countUp(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => obs.observe(el));
  }

  // ---- FILTER KATALOG ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const novelCards = document.querySelectorAll('.novel-card');
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        novelCards.forEach(card => {
          if (filter === 'all' || card.dataset.genre === filter) {
            card.style.display   = '';
            card.style.opacity   = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.transition = 'all .35s ease';
              card.style.opacity    = '1';
              card.style.transform  = 'translateY(0)';
            }, 10);
          } else {
            card.style.opacity   = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => { card.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }

  // ---- EVENT CAROUSEL DOTS ----
  const dots = document.querySelectorAll('.dot');
  if (dots.length > 0) {
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
      });
    });
  }

  // ---- FORM SUBMIT TOAST ----
  const showToast = (msg) => {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  };

  document.getElementById('submit-form')?.addEventListener('click', () => {
    showToast('✦ Pendaftaran berhasil dikirim! Kami akan menghubungi kamu segera.');
  });

  document.getElementById('submit-revisi')?.addEventListener('click', () => {
    showToast('✦ Permintaan revisi terkirim! Tim kami akan merespons dalam 24 jam.');
  });

  // ---- SCROLL REVEAL ----
  const revealEls = document.querySelectorAll(
    '.layanan-card, .novel-card, .testi-card, .package-card, ' +
    '.kt-item, .proses-step, .mentor-card, .team-card, ' +
    '.card, .lesson, .cl-item, .tl-item, .faq-item'
  );
  if (revealEls.length > 0 && 'IntersectionObserver' in window) {
    const revObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
          revObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach((el, i) => {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(30px)';
      el.style.transition = `opacity .5s ease ${i * 0.06}s, transform .5s ease ${i * 0.06}s`;
      revObs.observe(el);
    });
  }

  // ---- READING PROGRESS BAR ----
  const bar = document.getElementById('reading-bar');
  if (bar) {
    window.addEventListener('scroll', () => {
      const doc = document.documentElement;
      const pct = doc.scrollTop / (doc.scrollHeight - doc.clientHeight);
      bar.style.transform = `scaleX(${pct})`;

      const fill   = document.getElementById('ps-fill');
      const psText = document.getElementById('ps-text');
      if (fill) fill.style.width = (pct * 100) + '%';
      if (psText) {
        if (pct > 0.05 && pct < 0.99) {
          psText.textContent = `${Math.round(pct * 100)}% terbaca`;
        } else if (pct >= 0.99) {
          psText.textContent = '🎉 Selesai dibaca!';
        }
      }
    });
  }

  // ---- FADE IN ON SCROLL ----
  const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => fadeObs.observe(el));

  // ---- BTN HOVER ----
  document.querySelectorAll('.btn-novel, .btn-primary, .btn-ghost').forEach(btn => {
    btn.addEventListener('mouseenter', function () {
      this.style.transition = 'all .25s cubic-bezier(.4,0,.2,1)';
    });
  });

});

// ============================================
// GLOBAL FUNCTIONS — panduan
// ============================================

function toggleLesson(header) {
  const lesson  = header.closest('.lesson');
  const wasOpen = lesson.classList.contains('open');
  document.querySelectorAll('.lesson.open').forEach(l => l.classList.remove('open'));
  if (!wasOpen) lesson.classList.add('open');
}

function toggleFaq(item) {
  item.classList.toggle('open');
}

function toggleCheck(item) {
  item.classList.toggle('checked');
  item.querySelector('.cl-box').textContent = item.classList.contains('checked') ? '✓' : '';
  const total  = document.querySelectorAll('.cl-item').length;
  const done   = document.querySelectorAll('.cl-item.checked').length;
  const psText = document.getElementById('ps-text');
  if (done > 0 && psText) psText.textContent = `${done}/${total} checklist ✓`;
}