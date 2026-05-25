/* ============================================
   NOVELCRAFT — script.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- NAVBAR SCROLL ----
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // ---- HAMBURGER MENU ----
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.style.display === 'flex';
      navLinks.style.display = open ? 'none' : 'flex';
      navLinks.style.flexDirection = open ? '' : 'column';
      navLinks.style.position = open ? '' : 'absolute';
      navLinks.style.top = open ? '' : '60px';
      navLinks.style.left = open ? '' : '0';
      navLinks.style.right = open ? '' : '0';
      navLinks.style.background = open ? '' : 'rgba(10,6,8,.97)';
      navLinks.style.padding = open ? '' : '1rem 4vw 1.5rem';
      navLinks.style.borderBottom = open ? '' : '1px solid rgba(212,168,71,.15)';
    });
  }

  // ---- STATS COUNTER ----
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (statNums.length > 0) {
    const countUp = (el) => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 1500;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current).toLocaleString('id-ID');
      }, 16);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(el => observer.observe(el));
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
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.transition = 'all .35s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 10);
          } else {
            card.style.opacity = '0';
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
    dots.forEach((dot, i) => {
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

  const submitForm = document.getElementById('submit-form');
  if (submitForm) {
    submitForm.addEventListener('click', () => {
      showToast('✦ Pendaftaran berhasil dikirim! Kami akan menghubungi kamu segera.');
    });
  }

  const submitRevisi = document.getElementById('submit-revisi');
  if (submitRevisi) {
    submitRevisi.addEventListener('click', () => {
      showToast('✦ Permintaan revisi terkirim! Tim kami akan merespons dalam 24 jam.');
    });
  }

  // ---- SCROLL REVEAL ----
  const revealEls = document.querySelectorAll('.layanan-card, .novel-card, .testi-card, .package-card, .kt-item, .proses-step, .mentor-card, .team-card, .tl-item');
  if (revealEls.length > 0 && 'IntersectionObserver' in window) {
    const revObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = entry.target.style.transform.replace('translateY(30px)', 'translateY(0)');
          revObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity .5s ease ${i * 0.07}s, transform .5s ease ${i * 0.07}s`;
      revObs.observe(el);
    });
  }

  // ---- BTN NOVEL hover ring ----
  document.querySelectorAll('.btn-novel, .btn-primary, .btn-ghost').forEach(btn => {
    btn.addEventListener('mouseenter', function(e) {
      this.style.transition = 'all .25s cubic-bezier(.4,0,.2,1)';
    });
  });

});