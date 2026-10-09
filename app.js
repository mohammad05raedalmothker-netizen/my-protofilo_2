document.addEventListener('DOMContentLoaded', () => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;

  // Theme follows the visitor's system setting
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const applyTheme = () => body.classList.toggle('dark-mode', mq.matches);
  applyTheme();
  mq.addEventListener('change', applyTheme);

  // Responsive navigation
  const menuButton = document.querySelector('.menu-btn');
  const nav = document.getElementById('site-nav');
  const setMenuOpen = open => {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('open', open);
  };
  menuButton.addEventListener('click', () => setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) setMenuOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      menuButton.focus();
    }
  });
  window.matchMedia('(min-width: 769px)').addEventListener('change', event => {
    if (event.matches) setMenuOpen(false);
  });

  // Reveal the project architecture in sequence when it enters the viewport
  const architecture = document.querySelector('.brain-architecture');
  if (architecture && !reduce) {
    architecture.classList.add('motion-ready');
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          architecture.classList.add('is-visible');
          revealObserver.disconnect();
        }
      }, { threshold: 0.2 });
      revealObserver.observe(architecture);
    } else {
      architecture.classList.add('is-visible');
    }
  }

  // Hero workflow demo
  const nodes = [...document.querySelectorAll('#flow .node')];
  const timer = document.getElementById('flow-time');
  const times = [0, 0.4, 1.1, 1.9];
  let step = 0;
  function paint() {
    nodes.forEach((n, i) => {
      n.classList.toggle('is-active', i === step);
      n.classList.toggle('is-done', i < step);
    });
    timer.textContent = times[step].toFixed(1) + 's';
  }
  paint();
  if (!reduce) {
    setInterval(() => { step = (step + 1) % nodes.length; paint(); }, 1800);
  } else {
    step = nodes.length - 1; paint();
  }

  // Project filter
  const chips = document.querySelectorAll('.chip');
  const projects = document.querySelectorAll('.project');
  const projectCount = document.getElementById('project-count');
  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => {
      const selected = c === chip;
      c.classList.toggle('is-on', selected);
      c.setAttribute('aria-pressed', String(selected));
    });
    const f = chip.dataset.filter;
    projects.forEach(p => { p.hidden = !(f === 'all' || p.dataset.category.split(' ').includes(f)); });
    const visibleCount = [...projects].filter(project => !project.hidden).length;
    projectCount.textContent = visibleCount + (visibleCount === 1 ? ' project' : ' projects');
  }));

  // Contact form -> WhatsApp
  const WHATSAPP = '962775296594';
  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-form-status');
  const btn = document.getElementById('form-submit-button');
  const say = (msg, type) => { status.textContent = msg; status.className = 'form-status ' + type; };
  const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form['form-name'].value.trim();
    const email = form['form-email'].value.trim();
    const subject = form['form-subject'].value.trim();
    const message = form['form-message'].value.trim();
    if (!name || !email || !message) return say('Fill in your name, email and message.', 'error');
    if (!validEmail(email)) return say('Enter a valid email address, for example name@company.com.', 'error');

    const lines = ['Hi Mohammad,', '', 'Name: ' + name, 'Email: ' + email];
    if (subject) lines.push('Subject: ' + subject);
    lines.push('', 'Message:', message);
    const url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n'));

    btn.disabled = true;
    btn.textContent = 'Opening WhatsApp...';
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
      say('WhatsApp opened with your details. Press send to finish.', 'success');
      form.reset();
      btn.disabled = false;
      btn.textContent = 'Send via WhatsApp';
    }, 400);
  });
});
