/* ============================================
   NOVELCRAFT — auth.js
   ============================================ */

// ============================================
// DUMMY DATABASE USER
// ============================================

const users = [

  {
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin",
    name: "Admin NovelCraft"
  },

  {
    email: "mentor@gmail.com",
    password: "mentor123",
    role: "mentor",
    name: "Mentor NovelCraft"
  },

  {
    email: "user@gmail.com",
    password: "user123",
    role: "user",
    name: "Caca"
  }

];

// ============================================
// UTILS
// ============================================

function showAlert(id, msg, type = 'error') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = `auth-alert alert-${type} show`;
}

function hideAlert(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('show');
}

function setFieldError(inputEl, msg) {
  inputEl.classList.add('input-error');
  inputEl.classList.remove('input-success');

  const err =
    inputEl.parentElement.querySelector('.field-error');

  if (err) {
    err.textContent = msg;
    err.classList.add('show');
  }
}

function setFieldSuccess(inputEl) {
  inputEl.classList.remove('input-error');
  inputEl.classList.add('input-success');

  const err =
    inputEl.parentElement.querySelector('.field-error');

  if (err) err.classList.remove('show');
}

function clearField(inputEl) {
  inputEl.classList.remove(
    'input-error',
    'input-success'
  );

  const err =
    inputEl.parentElement.querySelector('.field-error');

  if (err) err.classList.remove('show');
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getPasswordStrength(pw) {

  let score = 0;

  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  return score;
}

// ============================================
// PASSWORD TOGGLE
// ============================================

document.querySelectorAll('.pw-toggle').forEach(btn => {

  btn.addEventListener('click', () => {

    const input = btn.previousElementSibling;

    if (!input) return;

    const isText = input.type === 'text';

    input.type = isText
      ? 'password'
      : 'text';

    btn.textContent = isText
      ? '👁'
      : '🙈';

  });

});

// ============================================
// PASSWORD STRENGTH
// ============================================

const pwInputs = document.querySelectorAll(
  'input[id="password"], input[id="newPassword"]'
);

pwInputs.forEach(input => {

  const strengthEl =
    input.closest('.form-group')
    ?.querySelector('.pw-strength');

  if (!strengthEl) return;

  input.addEventListener('input', () => {

    const val = input.value;

    if (!val) {
      strengthEl.classList.remove('show');
      return;
    }

    strengthEl.classList.add('show');

    const score = getPasswordStrength(val);

    const fill =
      strengthEl.querySelector('.pw-strength-fill');

    const text =
      strengthEl.querySelector('.pw-strength-text');

    const levels = [

      {
        w: '20%',
        bg: '#c0293a',
        label: 'Sangat Lemah'
      },

      {
        w: '40%',
        bg: '#e05030',
        label: 'Lemah'
      },

      {
        w: '60%',
        bg: '#d4a847',
        label: 'Cukup'
      },

      {
        w: '80%',
        bg: '#60b060',
        label: 'Kuat'
      },

      {
        w: '100%',
        bg: '#2bbfa8',
        label: 'Sangat Kuat'
      }

    ];

    const lvl = levels[Math.min(score, 4)];

    fill.style.width = lvl.w;
    fill.style.background = lvl.bg;

    text.textContent = lvl.label;
    text.style.color = lvl.bg;

  });

});

// ============================================
// LOGIN FORM
// ============================================

const loginForm =
  document.getElementById('loginForm');

if (loginForm) {

  const emailInput =
    document.getElementById('email');

  const passInput =
    document.getElementById('password');

  // VALIDASI REALTIME

  emailInput?.addEventListener('blur', () => {

    if (!emailInput.value) {
      clearField(emailInput);
      return;
    }

    if (!validateEmail(emailInput.value)) {

      setFieldError(
        emailInput,
        'Format email tidak valid.'
      );

    }

    else {

      setFieldSuccess(emailInput);

    }

  });

  passInput?.addEventListener('blur', () => {

    if (!passInput.value) {
      clearField(passInput);
      return;
    }

    if (passInput.value.length < 6) {

      setFieldError(
        passInput,
        'Password minimal 6 karakter.'
      );

    }

    else {

      setFieldSuccess(passInput);

    }

  });

  // SUBMIT LOGIN

  loginForm.addEventListener('submit', (e) => {

    e.preventDefault();

    hideAlert('loginAlert');

    const email =
      emailInput.value.trim();

    const password =
      passInput.value;

    const remember =
      loginForm.querySelector(
        'input[type="checkbox"]'
      )?.checked;

    let valid = true;

    if (!email || !validateEmail(email)) {

      setFieldError(
        emailInput,
        'Masukkan email yang valid.'
      );

      valid = false;
    }

    if (!password || password.length < 6) {

      setFieldError(
        passInput,
        'Password minimal 6 karakter.'
      );

      valid = false;
    }

    if (!valid) return;

    // ============================================
    // CEK USER DUMMY
    // ============================================

    const foundUser = users.find(user =>

      user.email === email &&
      user.password === password

    );

    // BUTTON LOADING

    const btn =
      loginForm.querySelector(
        'button[type="submit"]'
      );

    btn.textContent = 'Memproses...';
    btn.disabled = true;

    setTimeout(() => {

      // USER TIDAK DITEMUKAN

      if (!foundUser) {

        showAlert(
          'loginAlert',
          'Email atau password salah.',
          'error'
        );

        btn.textContent = 'Login ✦';
        btn.disabled = false;

        return;
      }

      // SIMPAN LOGIN

      localStorage.setItem(
        'isLoggedIn',
        'true'
      );

      localStorage.setItem(
        'userName',
        foundUser.name
      );

      localStorage.setItem(
        'userEmail',
        foundUser.email
      );

      localStorage.setItem(
        'userRole',
        foundUser.role
      );

      if (remember) {

        localStorage.setItem(
          'rememberedEmail',
          foundUser.email
        );

      }

      // ============================================
      // REDIRECT ROLE
      // ============================================

      if (foundUser.role === 'admin') {

        window.location.href =
          '../admin/dashboard-admin.html';

      }

      else if (foundUser.role === 'mentor') {

        window.location.href =
          '../mentor/dashboard-mentor.html';

      }

      else {

        window.location.href =
          '../user/dashboard-user.html';

      }

    }, 1200);

  });

}

// ============================================
// REGISTER FORM
// ============================================

const registerForm =
  document.getElementById('registerForm');

if (registerForm) {

  const nameInput =
    document.getElementById('fullName');

  const emailInput =
    document.getElementById('email');

  const passInput =
    document.getElementById('password');

  const confirmInput =
    document.getElementById('confirmPassword');

  const termsCheck =
    document.getElementById('termsCheck');

  nameInput?.addEventListener('blur', () => {

    if (!nameInput.value.trim()) {
      clearField(nameInput);
      return;
    }

    if (nameInput.value.trim().length < 3) {

      setFieldError(
        nameInput,
        'Nama minimal 3 karakter.'
      );

    }

    else {

      setFieldSuccess(nameInput);

    }

  });

  emailInput?.addEventListener('blur', () => {

    if (!emailInput.value) {
      clearField(emailInput);
      return;
    }

    if (!validateEmail(emailInput.value)) {

      setFieldError(
        emailInput,
        'Format email tidak valid.'
      );

    }

    else {

      setFieldSuccess(emailInput);

    }

  });

  confirmInput?.addEventListener('input', () => {

    if (!confirmInput.value) {
      clearField(confirmInput);
      return;
    }

    if (confirmInput.value !== passInput.value) {

      setFieldError(
        confirmInput,
        'Password tidak cocok.'
      );

    }

    else {

      setFieldSuccess(confirmInput);

    }

  });

  registerForm.addEventListener('submit', (e) => {

    e.preventDefault();

    hideAlert('registerAlert');

    const name =
      nameInput?.value.trim();

    const email =
      emailInput?.value.trim();

    const password =
      passInput?.value;

    const confirm =
      confirmInput?.value;

    const terms =
      termsCheck?.checked;

    let valid = true;

    if (!name || name.length < 3) {

      setFieldError(
        nameInput,
        'Nama minimal 3 karakter.'
      );

      valid = false;
    }

    if (!email || !validateEmail(email)) {

      setFieldError(
        emailInput,
        'Masukkan email yang valid.'
      );

      valid = false;
    }

    if (!password || password.length < 8) {

      setFieldError(
        passInput,
        'Password minimal 8 karakter.'
      );

      valid = false;
    }

    if (password !== confirm) {

      setFieldError(
        confirmInput,
        'Password tidak cocok.'
      );

      valid = false;
    }

    if (!terms) {

      showAlert(
        'registerAlert',
        'Kamu harus menyetujui syarat & ketentuan.',
        'error'
      );

      valid = false;
    }

    if (!valid) return;

    const btn =
      registerForm.querySelector(
        'button[type="submit"]'
      );

    btn.textContent = 'Membuat akun...';
    btn.disabled = true;

    setTimeout(() => {

      // Akun baru = mulai bersih. Hapus sisa data demo dari akun/sesi
      // sebelumnya di browser ini (project belum ada backend asli,
      // jadi semua data ini masih nebeng di localStorage yang sama).
      localStorage.removeItem('trxHistory');
      localStorage.removeItem('novelCart');
      localStorage.removeItem('checkoutData');
      localStorage.removeItem('savedAddress');

      localStorage.setItem(
        'isLoggedIn',
        'true'
      );

      localStorage.setItem(
        'userName',
        name
      );

      localStorage.setItem(
        'userEmail',
        email
      );

      localStorage.setItem(
        'userRole',
        'customer'
      );

      showAlert(
        'registerAlert',
        'Akun berhasil dibuat! Mengalihkan...',
        'success'
      );

      setTimeout(() => {

        window.location.href =
          '../customer/dashboard-customer.html';

      }, 1500);

    }, 1200);

  });

}

// ============================================
// FORGOT PASSWORD — MULTI STEP
// ============================================

const forgotForm =
  document.getElementById('forgotForm');

if (forgotForm) {

  let currentStep = 1;
  let storedOTP = '';

  function goToStep(n) {

    document
      .querySelectorAll('.auth-step')
      .forEach(s => s.classList.remove('active'));

    document
      .querySelector(`.auth-step[data-step="${n}"]`)
      ?.classList.add('active');

    document
      .querySelectorAll('.step-dot')
      .forEach((dot, i) => {

        dot.classList.remove('active', 'done');

        if (i + 1 < n)
          dot.classList.add('done');

        if (i + 1 === n)
          dot.classList.add('active');

      });

    currentStep = n;

  }

  document
    .getElementById('step1Btn')
    ?.addEventListener('click', () => {

      const email =
        document.getElementById('forgotEmail');

      if (!email.value || !validateEmail(email.value)) {

        setFieldError(
          email,
          'Masukkan email yang valid.'
        );

        return;
      }

      setFieldSuccess(email);

      storedOTP = '123456';

      console.log(
        'OTP (simulasi):',
        storedOTP
      );

      showAlert(
        'forgotAlert',
        `Kode OTP telah dikirim ke ${email.value}`,
        'success'
      );

      setTimeout(() => goToStep(2), 1000);

      startResendCountdown();

    });

  initOTPInputs();

  document
    .getElementById('step2Btn')
    ?.addEventListener('click', () => {

      const entered = getOTPValue();

      if (entered.length < 6) {

        showAlert(
          'otpAlert',
          'Masukkan 6 digit kode OTP.',
          'error'
        );

        return;
      }

      if (entered !== storedOTP) {

        showAlert(
          'otpAlert',
          'Kode OTP salah. Coba lagi.',
          'error'
        );

        return;
      }

      goToStep(3);

    });

  document
    .getElementById('step3Btn')
    ?.addEventListener('click', () => {

      const newPw =
        document.getElementById('newPassword');

      const confPw =
        document.getElementById('confirmNewPassword');

      let valid = true;

      if (!newPw.value || newPw.value.length < 8) {

        setFieldError(
          newPw,
          'Password minimal 8 karakter.'
        );

        valid = false;
      }

      if (newPw.value !== confPw.value) {

        setFieldError(
          confPw,
          'Password tidak cocok.'
        );

        valid = false;
      }

      if (!valid) return;

      const btn =
        document.getElementById('step3Btn');

      btn.textContent = 'Menyimpan...';
      btn.disabled = true;

      setTimeout(() => {

        goToStep(4);

      }, 1000);

    });

}

// ============================================
// OTP INPUT
// ============================================

function initOTPInputs() {

  const inputs =
    document.querySelectorAll('.otp-input');

  inputs.forEach((input, i) => {

    input.addEventListener('input', () => {

      input.value =
        input.value
        .replace(/\D/g, '')
        .slice(0, 1);

      if (
        input.value &&
        i < inputs.length - 1
      ) {

        inputs[i + 1].focus();

      }

    });

    input.addEventListener('keydown', (e) => {

      if (
        e.key === 'Backspace' &&
        !input.value &&
        i > 0
      ) {

        inputs[i - 1].focus();

      }

    });

    input.addEventListener('paste', (e) => {

      e.preventDefault();

      const text =
        e.clipboardData
          .getData('text')
          .replace(/\D/g, '')
          .slice(0, 6);

      inputs.forEach((inp, j) => {

        inp.value = text[j] || '';

      });

      if (inputs[text.length - 1]) {

        inputs[text.length - 1].focus();

      }

    });

  });

}

function getOTPValue() {

  return [
    ...document.querySelectorAll('.otp-input')
  ]
    .map(i => i.value)
    .join('');

}

function startResendCountdown() {

  const btn =
    document.getElementById('resendBtn');

  const timer =
    document.getElementById('resendTimer');

  if (!btn || !timer) return;

  let sec = 60;

  btn.disabled = true;

  timer.textContent = `(${sec}s)`;

  const interval = setInterval(() => {

    sec--;

    timer.textContent = `(${sec}s)`;

    if (sec <= 0) {

      clearInterval(interval);

      btn.disabled = false;

      timer.textContent = '';

    }

  }, 1000);

  btn.onclick = () => {

    startResendCountdown();

    showAlert(
      'otpAlert',
      'Kode OTP baru telah dikirim.',
      'info'
    );

  };

}

// ============================================
// LOGOUT
// ============================================

const logoutBtn =
  document.getElementById('logoutConfirmBtn');

if (logoutBtn) {

  logoutBtn.addEventListener('click', () => {

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');

    window.location.href =
      '../auth/login.html';

  });

}

// ============================================
// REMEMBER EMAIL
// ============================================

const rememberedEmail =
  localStorage.getItem('rememberedEmail');

if (rememberedEmail) {

  const emailInput =
    document.getElementById('email');

  if (emailInput) {

    emailInput.value = rememberedEmail;

    const cb =
      document.querySelector(
        '.remember-wrap input[type="checkbox"]'
      );

    if (cb) cb.checked = true;

  }

}