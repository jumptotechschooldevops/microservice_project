/* =============================================
   NAVIGATION
   ============================================= */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu= document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// Active nav link
(function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* =============================================
   SCROLL REVEAL
   ============================================= */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* =============================================
   FAQ ACCORDION
   ============================================= */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// FAQ nav category links
document.querySelectorAll('.faq-nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      const offset = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    document.querySelectorAll('.faq-nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

/* =============================================
   COURSE FILTER TABS
   ============================================= */
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.dataset.filter;
    document.querySelectorAll('.course-card').forEach(card => {
      if (filter === 'all' || card.dataset.level === filter) {
        card.style.display = 'flex';
        card.style.animation = 'fadeIn .3s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* =============================================
   CONTACT FORM VALIDATION
   ============================================= */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const fields = [
      { id: 'fname',   msg: 'First name is required.' },
      { id: 'lname',   msg: 'Last name is required.' },
      { id: 'email',   msg: 'A valid email is required.', validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      { id: 'subject', msg: 'Please select a subject.' },
      { id: 'message', msg: 'Message must be at least 20 characters.', validate: v => v.trim().length >= 20 },
    ];

    fields.forEach(({ id, msg, validate }) => {
      const group = document.getElementById(id)?.closest('.form-group');
      const input = document.getElementById(id);
      if (!group || !input) return;
      const val = input.value.trim();
      const errEl = group.querySelector('.form-error');
      const isOk = val && (validate ? validate(val) : true);
      group.classList.toggle('error', !isOk);
      if (errEl) errEl.textContent = msg;
      if (!isOk) valid = false;
    });

    if (valid) {
      const successMsg = document.getElementById('formSuccess');
      if (successMsg) successMsg.classList.add('show');
      contactForm.reset();
      contactForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
      setTimeout(() => successMsg?.classList.remove('show'), 5000);
    }
  });

  // Clear error on input
  contactForm.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => el.closest('.form-group')?.classList.remove('error'));
  });
}

/* =============================================
   TERMINAL TYPEWRITER (hero page)
   ============================================= */
(function initTerminal() {
  const terminal = document.getElementById('terminalBody');
  if (!terminal) return;

  const lines = [
    { type: 'cmd',  text: 'whoami',                 delay: 600  },
    { type: 'out',  text: 'linux-student',           delay: 300  },
    { type: 'cmd',  text: 'uname -r',                delay: 700  },
    { type: 'out',  text: '6.5.0-45-generic',        delay: 300  },
    { type: 'cmd',  text: 'ls /courses',             delay: 800  },
    { type: 'out',  text: 'fundamentals/  sysadmin/  scripting/', delay: 300 },
    { type: 'out',  text: 'networking/    devops/    rhcsa-prep/', delay: 100 },
    { type: 'cmd',  text: 'echo "Ready to learn!"',  delay: 900  },
    { type: 'success', text: 'Ready to learn!',      delay: 300  },
    { type: 'cmd',  text: '',                         delay: 500, cursor: true },
  ];

  let total = 0;
  lines.forEach(line => {
    total += line.delay;
    setTimeout(() => {
      if (line.cursor) return; // cursor already rendered
      const el = document.createElement('div');
      el.innerHTML = line.type === 'cmd'
        ? `<span class="prompt">student@linuxpro:~$ </span><span class="cmd">${line.text}</span>`
        : `<span class="${line.type}">${line.text}</span>`;
      terminal.appendChild(el);
      terminal.scrollTop = terminal.scrollHeight;
    }, total);
  });
})();

/* =============================================
   COUNTER ANIMATION
   ============================================= */
function animateCounter(el, target, duration = 1600) {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    el.textContent = Math.floor(progress * target).toLocaleString() + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString() + (el.dataset.suffix || '');
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target, parseInt(e.target.dataset.target), 1800);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));
async function loadCourses() {

  try {

    const response = await fetch('/api/courses')

    const courses = await response.json()

    console.log('Courses:', courses)

  } catch (error) {

    console.error('Course Error:', error)
  }
}

async function loadStudents() {

  try {

    const response = await fetch('/api/students')

    const students = await response.json()

    console.log('Students:', students)

  } catch (error) {

    console.error('Student Error:', error)
  }
}

loadCourses()
loadStudents()
