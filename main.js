/**
 * Portfolio - Main JavaScript
 * Animações, interações e funcionalidades avançadas
 */

(() => {
    'use strict';

    // ========================================
    // CONFIG & UTILITIES
    // ========================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = () => window.innerWidth < 768;

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

    // ========================================
    // SCROLL PROGRESS
    // ========================================
    const scrollProgress = $('#scroll-progress .scroll-progress__bar');
    if (scrollProgress && !prefersReducedMotion) {
        let ticking = false;
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = `${clamp(progress, 0, 100)}%`;
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateProgress);
                ticking = true;
            }
        }, { passive: true });
    }

    // ========================================
    // NAVIGATION
    // ========================================
    const nav = $('.navegacao');
    const menuToggle = $('.menu-toggle');
    const menu = $('#menu-principal');
    const menuLinks = $$('.menu-link');

    // Scroll effect on nav
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
        lastScroll = currentScroll;
    }, { passive: true });

    // Mobile menu toggle
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isOpen);
            menu.classList.toggle('open');
            document.body.style.overflow = isOpen ? '' : 'hidden';
        });

        // Close on link click
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                menu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('open')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                menu.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    // Active nav link on scroll
    const sections = $$('section[id]');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                menuLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px', threshold: 0.1 });
    sections.forEach(s => navObserver.observe(s));

    // ========================================
    // REVEAL ANIMATIONS (IntersectionObserver)
    // ========================================
    if (!prefersReducedMotion) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

        $$('[data-reveal]').forEach(el => revealObserver.observe(el));
    } else {
        $$('[data-reveal]').forEach(el => el.classList.add('revealed'));
    }

    // ========================================
    // COUNTER ANIMATION (Hero Stats)
    // ========================================
    const statValues = $$('.stat__value[data-count]');
    if (statValues.length && !prefersReducedMotion) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count, 10);
                    const duration = 2000;
                    const startTime = performance.now();

                    const animate = (now) => {
                        const progress = clamp((now - startTime) / duration, 0, 1);
                        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                        el.textContent = Math.floor(target * eased);
                        if (progress < 1) requestAnimationFrame(animate);
                        else el.textContent = target;
                    };
                    requestAnimationFrame(animate);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        statValues.forEach(el => counterObserver.observe(el));
    } else {
        statValues.forEach(el => el.textContent = el.dataset.count);
    }

    // ========================================
    // PROJECT FILTER
    // ========================================
    const filterBtns = $$('.filter-btn');
    const projectCards = $$('.projetos-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update active button
            filterBtns.forEach(b => {
                b.classList.toggle('active', b === btn);
                b.setAttribute('aria-selected', b === btn);
            });

            // Filter cards with animation
            projectCards.forEach((card, i) => {
                const category = card.dataset.category;
                const show = filter === 'all' || category === filter;

                if (show) {
                    card.hidden = false;
                    // Stagger animation
                    requestAnimationFrame(() => {
                        card.style.transitionDelay = `${i * 50}ms`;
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => { card.hidden = true; }, 300);
                }
            });
        });
    });

    // ========================================
    // TESTIMONIALS SLIDER
    // ========================================
    const sliderTrack = $('.depoimentos-track');
    const sliderPrev = $('[data-slider-prev]');
    const sliderNext = $('[data-slider-next]');
    const sliderDots = $('[data-slider-dots]');
    const testimonialCards = $$('.depoimento-card');

    let currentSlide = 0;
    let slideWidth = 100; // percentage
    let autoSlideInterval;

    function updateSlider() {
        if (!sliderTrack) return;
        sliderTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
        updateDots();
    }

    function updateDots() {
        if (!sliderDots) return;
        $$('button', sliderDots).forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = clamp(index, 0, testimonialCards.length - 1);
        updateSlider();
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    if (sliderPrev && sliderNext && testimonialCards.length > 1) {
        sliderPrev.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
        sliderNext.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });

        // Create dots
        testimonialCards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
            dot.addEventListener('click', () => { goToSlide(i); resetAutoSlide(); });
            sliderDots.appendChild(dot);
        });

        // Auto slide
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 5000);
        }
        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        // Pause on hover
        const slider = $('.depoimentos-slider');
        if (slider) {
            slider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
            slider.addEventListener('mouseleave', startAutoSlide);
        }

        // Touch swipe support
        let touchStartX = 0;
        sliderTrack.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
        sliderTrack.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? nextSlide() : prevSlide();
                resetAutoSlide();
            }
        }, { passive: true });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { prevSlide(); resetAutoSlide(); }
            if (e.key === 'ArrowRight') { nextSlide(); resetAutoSlide(); }
        });

        startAutoSlide();
        updateDots();
    }

    // ========================================
    // FORMULÁRIO ÚNICO (SINGLE PAGE)
    // ========================================
    const form = $('#formulario');
    const formSuccess = $('#form-success');
    let submitBtn = null;

    function validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            const errorEl = $('#' + field.id + '-error') || $('#tipo-error');
            if (!field.value.trim() || (field.type === 'checkbox' && !field.checked) || (field.type === 'radio' && !form.querySelector(`input[name="${field.name}"]:checked`))) {
                field.classList.add('error');
                if (errorEl) errorEl.textContent = 'Este campo é obrigatório';
                isValid = false;
            } else {
                field.classList.remove('error');
                if (errorEl) errorEl.textContent = '';
            }
        });

        return isValid;
    }

    // Real-time validation
    $$('.campo-form, .radio-option input, .checkbox-label input').forEach(field => {
        field.addEventListener('input', () => {
            field.classList.remove('error');
            const errorEl = $('#' + field.id + '-error') || $('#tipo-error');
            if (errorEl) errorEl.textContent = '';
        });

        field.addEventListener('blur', () => validateForm());
    });

    // Form submit
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!validateForm()) return;

            submitBtn = form.querySelector('.botao-form');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Simulate network delay
            await new Promise(r => setTimeout(r, 1000));

            // Collect form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Send to WhatsApp
            enviarWhatsApp(data);

            // Show success inline
            formSuccess.hidden = false;
            formSuccess.classList.add('visible');
            form.reset();
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;

            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    function enviarWhatsApp(data) {
        const telefone = '5567991459350';
        const nome = data.nome || 'Cliente';
        const whatsapp = data.whatsapp || 'Não informado';
        const tipo = data.tipo || 'Não especificado';
        const prazo = data.prazo || 'Não informado';
        const mensagem = data.mensagem || 'Sem detalhes';

        const tipoLabels = {
            landing: 'Landing Page (1 página)',
            institucional: 'Site Institucional (5-10 páginas)',
            ecommerce: 'E-commerce / Catálogo',
            outro: 'Outro / Personalizado'
        };

        const prazoLabels = {
            urgente: 'Urgente (1-2 semanas)',
            normal: 'Normal (3-4 semanas)',
            flexivel: 'Flexível (sem pressa)'
        };

        const texto = `Olá! Me chamo ${nome}.

📱 WhatsApp: ${whatsapp}
🎯 Tipo: ${tipoLabels[tipo] || tipo}
⏱️ Prazo: ${prazoLabels[prazo] || prazo}

📝 Detalhes:
${mensagem}`;

        const msgFormatada = encodeURIComponent(texto);
        const url = `https://wa.me/${telefone}?text=${msgFormatada}`;
        window.open(url, '_blank');
    }

    // Reset form handler
    const formReset = $('#form-reset');
    if (formReset) {
        formReset.addEventListener('click', () => {
            formSuccess.hidden = true;
            formSuccess.classList.remove('visible');
        });
    }

    // ========================================
    // FLOATING CARDS PARALLAX
    // ========================================
    const floatCards = $$('[data-float]');
    if (floatCards.length && !prefersReducedMotion) {
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
        }, { passive: true });

        function animateFloat() {
            floatCards.forEach((card, i) => {
                const speed = 0.3 + i * 0.1;
                const x = mouseX * speed;
                const y = mouseY * speed;
                card.style.transform = `translate(${x}px, ${y}px)`;
            });
            requestAnimationFrame(animateFloat);
        }
        animateFloat();
    }

    // ========================================
    // SMOOTH SCROLL FOR ANCHORS
    // ========================================
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = $(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = nav.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                window.scrollTo({ top: targetPosition, behavior: 'smooth' });

                // Update URL without scroll
                history.pushState(null, '', targetId);
            }
        });
    });

    // ========================================
    // LAZY LOAD IMAGES (fallback for browsers without native support)
    // ========================================
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        $$('img[loading="lazy"]').forEach(img => {
            img.addEventListener('load', () => img.classList.add('loaded'));
        });
    } else {
        // Fallback IntersectionObserver
        const lazyImages = $$('img[loading="lazy"]');
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    lazyObserver.unobserve(img);
                }
            });
        });
        lazyImages.forEach(img => lazyObserver.observe(img));
    }

    // ========================================
    // CANVAS BACKGROUND ANIMATION
    // ========================================
    const canvas = $('#bg-canvas');
    if (canvas && !prefersReducedMotion) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId = null;
        let mouseX = 0, mouseY = 0;
        let width = 0, height = 0;
        const particleCount = isMobile() ? 35 : 60;
        const connectionDistance = 140;
        const mouseInfluence = 180;

        // Colors from CSS variables
        const colors = {
            particle: 'rgba(34, 197, 94, 0.6)',
            particleDim: 'rgba(34, 197, 94, 0.15)',
            line: 'rgba(34, 197, 94, 0.08)',
            lineActive: 'rgba(34, 197, 94, 0.25)',
            glow: 'rgba(34, 197, 94, 0.1)'
        };

        class Particle {
            constructor() { this.reset(true); }
            reset(init = false) {
                this.x = init ? Math.random() * width : Math.random() * width;
                this.y = init ? Math.random() * height : Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.radius = Math.random() * 1.5 + 0.5;
                this.baseRadius = this.radius;
                this.opacity = Math.random() * 0.4 + 0.1;
            }
            update() {
                // Mouse attraction
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouseInfluence && dist > 0) {
                    const force = (mouseInfluence - dist) / mouseInfluence * 0.02;
                    this.vx += (dx / dist) * force;
                    this.vy += (dy / dist) * force;
                }
                // Velocity decay
                this.vx *= 0.99;
                this.vy *= 0.99;
                // Position update
                this.x += this.vx;
                this.y += this.vy;
                // Wrap edges
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
                // Subtle pulse
                this.radius = this.baseRadius + Math.sin(Date.now() * 0.001 + this.x * 0.01) * 0.3;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = colors.particle;
                ctx.globalAlpha = this.opacity;
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            // Recreate particles on resize
            particles = Array.from({ length: particleCount }, () => new Particle());
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < connectionDistance) {
                        const opacity = (1 - dist / connectionDistance) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = colors.line;
                        ctx.globalAlpha = opacity;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            // Subtle glow at mouse position
            if (mouseX > 0 && mouseY > 0) {
                const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 300);
                gradient.addColorStop(0, colors.glow);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
            }
            particles.forEach(p => { p.update(); p.draw(); });
            drawConnections();
            animationId = requestAnimationFrame(animate);
        }

        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });

        // Pause when tab hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animate();
            }
        });

        // Init
        window.addEventListener('resize', resize, { passive: true });
        resize();
        animate();
    }

    // ========================================
    // PERFORMANCE: Passive listeners already used
    // ========================================

    // ========================================
    // INIT
    // ========================================
    // Add loaded class to body for CSS transitions
    document.body.classList.add('loaded');

    console.log('🚀 Portfolio carregado com sucesso!');
})();