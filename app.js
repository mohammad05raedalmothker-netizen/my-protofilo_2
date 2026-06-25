/**
   Google AI Studio Inspired Interactive JS
   Mohammad Raed Almothker Portfolio
*/

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Trigger hero entrance immediately after first paint
    requestAnimationFrame(() => {
        document.body.classList.add('loaded');
    });

    // --- Theme System ---
    const themeBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (currentTheme === 'dark' || (!currentTheme && systemPrefersDark)) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
        });
    }

    // --- Mobile Menu Toggle ---
    const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navOverlay = document.getElementById('nav-overlay');
    const menuIconOpen = `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16m-7 6h7"></path></svg>`;
    const menuIconClose = `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>`;

    function setMobileMenu(open) {
        if (!navMenu || !mobileToggleBtn) return;
        navMenu.classList.toggle('active', open);
        if (navOverlay) {
            navOverlay.classList.toggle('active', open);
            navOverlay.setAttribute('aria-hidden', open ? 'false' : 'true');
        }
        mobileToggleBtn.innerHTML = open ? menuIconClose : menuIconOpen;
        document.body.classList.toggle('menu-open', open);
    }

    if (mobileToggleBtn && navMenu) {
        mobileToggleBtn.addEventListener('click', () => {
            setMobileMenu(!navMenu.classList.contains('active'));
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => setMobileMenu(false));
        });

        if (navOverlay) {
            navOverlay.addEventListener('click', () => setMobileMenu(false));
        }

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) setMobileMenu(false);
        });
    }

    // --- Scroll effects (throttled via rAF) ---
    const header = document.getElementById('main-header');
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');
    const heroOrbs = document.querySelectorAll('.hero-orb');
    let scrollTicking = false;

    function updateScrollEffects() {
        const scrollY = window.scrollY;

        if (header) {
            header.classList.toggle('scrolled', scrollY > 40);
        }

        if (scrollProgress) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            scrollProgress.style.width = docHeight > 0 ? `${(scrollY / docHeight) * 100}%` : '0%';
        }

        if (backToTopBtn) {
            backToTopBtn.classList.toggle('visible', scrollY > 500);
        }

        if (!prefersReducedMotion && heroOrbs.length && scrollY < window.innerHeight) {
            const parallax = scrollY * 0.12;
            heroOrbs.forEach((orb, i) => {
                const direction = i % 2 === 0 ? 1 : -1;
                orb.style.transform = `translateY(${parallax * direction}px)`;
            });
        }

        highlightNavLink();
        scrollTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(updateScrollEffects);
            scrollTicking = true;
        }
    }, { passive: true });

    updateScrollEffects();

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    }

    function highlightNavLink() {
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('href') === `#${currentSectionId}`);
        });
    }

    // --- Mouse spotlight on glass cards ---
    const glassCards = document.querySelectorAll('.glass-card');
    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });

    // --- Tech marquee clone ---
    const techTrack = document.querySelector('.tech-track');
    if (techTrack) {
        Array.from(techTrack.children).forEach(logo => {
            techTrack.appendChild(logo.cloneNode(true));
        });
    }

    // --- Section header stagger ---
    document.querySelectorAll('.reveal .section-header').forEach(header => {
        Array.from(header.children).forEach((child, index) => {
            child.style.setProperty('--header-stagger', index);
            child.classList.add('reveal-header-item');
        });
    });

    // --- Grid item stagger ---
    const staggerContainers = document.querySelectorAll(
        '.bento-grid, .services-grid, .timeline, .skills-bar-list, .skills-tag-cloud, .stats-grid, .process-grid, .contact-info'
    );
    staggerContainers.forEach(container => {
        Array.from(container.children).forEach((child, index) => {
            child.style.setProperty('--stagger-index', index);
            child.classList.add('reveal-item');
        });
    });

    // --- Scroll reveal observer ---
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('active');

            if (entry.target.id === 'about' || entry.target.querySelector('.skill-bar-fill')) {
                animateSkillBars();
            }

            if (entry.target.id === 'stats' || entry.target.querySelector('.stat-number')) {
                animateCounters();
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(element => revealObserver.observe(element));

    // --- Skill bars ---
    let skillBarsAnimated = false;
    function animateSkillBars() {
        if (skillBarsAnimated) return;
        document.querySelectorAll('.skill-bar-fill').forEach((fill, i) => {
            setTimeout(() => {
                fill.style.width = fill.getAttribute('data-width');
            }, prefersReducedMotion ? 0 : i * 120);
        });
        skillBarsAnimated = true;
    }

    // --- Stat counters ---
    let countersAnimated = false;
    function animateCounters() {
        if (countersAnimated) return;

        document.querySelectorAll('.stat-number[data-target]').forEach((counter, i) => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const suffix = counter.getAttribute('data-suffix') || '';
            const delay = prefersReducedMotion ? 0 : i * 100;

            if (prefersReducedMotion) {
                counter.textContent = target + suffix;
                return;
            }

            counter.classList.add('counting');
            const duration = 1600;
            const startTime = performance.now() + delay;

            function updateCounter(currentTime) {
                if (currentTime < startTime) {
                    requestAnimationFrame(updateCounter);
                    return;
                }

                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 4);
                counter.textContent = Math.round(target * eased) + suffix;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.classList.remove('counting');
                    counter.classList.add('counted');
                }
            }

            requestAnimationFrame(updateCounter);
        });

        countersAnimated = true;
    }

    // --- Project filter with staggered re-entry ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.bento-card[data-category]');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            let visibleIndex = 0;

            projectCards.forEach(card => {
                if (card.filterTimeout) clearTimeout(card.filterTimeout);

                const categories = card.getAttribute('data-category').split(' ');
                const shouldShow = filterValue === 'all' || categories.includes(filterValue);

                if (shouldShow) {
                    card.style.display = 'flex';
                    card.offsetHeight;
                    card.classList.remove('filter-hide');
                    card.classList.add('filter-show');
                    card.style.setProperty('--stagger-index', visibleIndex);
                    card.style.transitionDelay = prefersReducedMotion ? '0ms' : `${visibleIndex * 60}ms`;
                    visibleIndex += 1;
                } else {
                    card.style.transitionDelay = '0ms';
                    card.classList.remove('filter-show');
                    card.classList.add('filter-hide');
                    card.filterTimeout = setTimeout(() => {
                        if (card.classList.contains('filter-hide')) {
                            card.style.display = 'none';
                        }
                    }, prefersReducedMotion ? 0 : 450);
                }
            });
        });
    });

    // --- Bento diagram node flow ---
    const bentoDiagrams = document.querySelectorAll('.bento-diagram');
    bentoDiagrams.forEach(diagram => {
        const nodes = diagram.querySelectorAll('.diagram-node');
        if (nodes.length <= 1) return;

        let currentNodeIndex = 0;
        setInterval(() => {
            nodes[currentNodeIndex].classList.remove('active-node');
            currentNodeIndex = (currentNodeIndex + 1) % nodes.length;
            nodes[currentNodeIndex].classList.add('active-node');
        }, prefersReducedMotion ? 5000 : 2200);
    });

    // --- Contact form → WhatsApp ---
    const WHATSAPP_NUMBER = '962775296594';
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('contact-form-status');
    const submitBtn = document.getElementById('form-submit-button');

    function buildWhatsAppMessage(name, email, subject, message) {
        const lines = [
            'Hi Mohammad,',
            '',
            `Name: ${name}`,
            `Email: ${email}`,
        ];

        if (subject) {
            lines.push(`Subject: ${subject}`);
        }

        lines.push('', 'Message:', message);
        return lines.join('\n');
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const subjectInput = document.getElementById('form-subject');
            const messageInput = document.getElementById('form-message');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const subject = subjectInput.value.trim();
            const message = messageInput.value.trim();

            if (!name || !email || !message) {
                showStatus('Please fill in all required fields.', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showStatus('Please enter a valid email address.', 'error');
                return;
            }

            const btnText = submitBtn.querySelector('.btn-text');
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            if (btnText) btnText.textContent = 'Opening WhatsApp...';

            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                buildWhatsAppMessage(name, email, subject, message)
            )}`;

            setTimeout(() => {
                window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                showStatus('WhatsApp opened with your details. Just press send!', 'success');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                if (btnText) btnText.textContent = 'Send Message';
                contactForm.querySelectorAll('.form-control').forEach(input => input.blur());
            }, 400);
        });
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function showStatus(message, type) {
        if (!formStatus) return;

        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';

        if (type === 'success') {
            setTimeout(() => {
                formStatus.style.display = 'none';
                formStatus.className = 'form-status';
            }, 5000);
        }
    }
});
