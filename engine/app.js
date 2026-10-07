// engine/app.js — Verine landing page application logic

(function () {
    'use strict';

    // ── DOM refs ──────────────────────────────────────────────────────────
    const cursor = document.getElementById('cursor');
    const scrollTopBtn = document.getElementById('scrollTop');

    const interactiveElements = document.querySelectorAll(
        'a, button, .mission-card, .scroll-top'
    );

    const fadeElements = document.querySelectorAll('.fade-in');

    const nav = document.querySelector('nav');

    const form = document.getElementById('waitlistForm');
    const emailInput = document.getElementById('emailInput');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');

    // ── Custom Cursor: ring + dot, accent on hover, click pulse ─────────
    function initCursor() {
        // Native cursor now — no custom cursor layer.
    }

    // ── Scroll reveal via IntersectionObserver ────────────────────────────
    function initScrollReveal() {
        if (!fadeElements.length) return;

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );

        fadeElements.forEach(function (el) {
            observer.observe(el);
        });

        // Card hover glow follows mouse position inside each card.
        var cards = document.querySelectorAll('[data-card]');
        cards.forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    var x = ((e.clientX - rect.left) / rect.width) * 100;
                    var y = ((e.clientY - rect.top) / rect.height) * 100;
                    card.style.setProperty('--mx', x + '%');
                    card.style.setProperty('--my', y + '%');
                }
            });
        });
    }

    // ── Navbar background on scroll ───────────────────────────────────────
    function initNavScroll() {
        if (!nav) return;

        window.addEventListener(
            'scroll',
            function () {
                nav.style.background = window.scrollY > 50
                    ? 'rgba(10, 10, 15, 0.95)'
                    : 'rgba(10, 10, 15, 0.8)';
            },
            { passive: true }
        );
    }

    // ── Scroll-to-top button ───────────────────────────────────────────────
    function initScrollTop() {
        if (!scrollTopBtn) return;

        var throttle = 0;

        window.addEventListener(
            'scroll',
            function () {
                // Throttle scroll handler for scroll-top visibility
                if (Date.now() - throttle < 60) return;
                throttle = Date.now();

                if (window.scrollY > 400) {
                    scrollTopBtn.classList.add('visible');
                } else {
                    scrollTopBtn.classList.remove('visible');
                }
            },
            { passive: true }
        );

        scrollTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ── Waitlist form with client-side validation ─────────────────────────
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showMessage(text, type) {
        if (!formMessage) return;
        formMessage.textContent = text || '';
        formMessage.className = 'form-message' + (type ? ' ' + type : '');
    }

    function initWaitlistForm() {
        if (!form || !emailInput || !submitBtn) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var email = emailInput.value.trim();

            if (!email) {
                showMessage('Please enter your email address.', 'error');
                emailInput.focus();
                return;
            }

            if (!isValidEmail(email)) {
                showMessage('That doesn\'t look like a valid email.', 'error');
                emailInput.focus();
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            showMessage('', '');

            var self = this;
            // Replace this timeout with a real fetch() call when you have a backend.
            setTimeout(function () {
                showMessage(
                    'You\'re on the list. We\'ll be in touch before February 2027.',
                    'success'
                );
                emailInput.value = '';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Get Early Access';
            }, 900);
        });

        emailInput.addEventListener('input', function () {
            if (formMessage.classList.contains('error') ||
                formMessage.classList.contains('success')) {
                showMessage('', '');
            }
        });
    }

    // ── Bootstrap ──────────────────────────────────────────────────────────
    function init() {
        initCursor();
        initScrollReveal();
        initNavScroll();
        initScrollTop();
        initWaitlistForm();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
