/*
  script.js - Complete interactivity for CD Logistics
  - Typing effect in hero
  - Mobile menu toggle with dropdown accordion
  - Dark mode toggle
  - Active link highlighting
  - Smooth scroll for anchor links
*/

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ---------- TYPING EFFECT ----------
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        const phrases = [
            'Construction Excellence',
            'Logistics Solutions',
            'Design Innovation',
            'Your Trusted Partner',
            'Building South Sudan'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let currentText = '';

        function type() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                currentText = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                currentText = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }

            typingElement.textContent = currentText;

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                setTimeout(type, 2000); // pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(type, 500);
            } else {
                const speed = isDeleting ? 50 : 100;
                setTimeout(type, speed);
            }
        }

        type();
    }

    // ---------- MOBILE MENU TOGGLE ----------
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    const header = document.querySelector('header');

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            nav.classList.toggle('nav-open');
            // Change icon (assuming font-awesome)
            const icon = menuBtn.querySelector('i');
            if (icon) {
                if (nav.classList.contains('nav-open')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!header.contains(event.target) && nav.classList.contains('nav-open')) {
                nav.classList.remove('nav-open');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // ---------- DROPDOWN HANDLING (MOBILE) ----------
    function setupMobileDropdowns() {
        const isMobile = window.innerWidth <= 992;
        const dropdownItems = document.querySelectorAll('nav ul li:has(ul.dropdown)');

        dropdownItems.forEach((item) => {
            // Remove any existing toggle buttons to avoid duplicates
            const existingToggle = item.querySelector('.dropdown-toggle');
            if (existingToggle) existingToggle.remove();

            if (isMobile) {
                // Create toggle button
                const link = item.querySelector('a');
                const toggleBtn = document.createElement('button');
                toggleBtn.className = 'dropdown-toggle';
                toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
                toggleBtn.setAttribute('aria-label', 'Toggle dropdown');
                
                // Insert after link
                link.parentNode.insertBefore(toggleBtn, link.nextSibling);

                // Toggle dropdown on button click
                toggleBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    item.classList.toggle('dropdown-open');
                });

                // Ensure link still works
                link.addEventListener('click', function(e) {
                    // Allow normal navigation
                });
            } else {
                item.classList.remove('dropdown-open'); // reset
            }
        });
    }

    // Initial setup
    setupMobileDropdowns();

    // Re-run on resize
    window.addEventListener('resize', function() {
        setupMobileDropdowns();
        // Also close mobile nav if resizing to desktop
        if (window.innerWidth > 992 && nav.classList.contains('nav-open')) {
            nav.classList.remove('nav-open');
            const icon = menuBtn?.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });

    // ---------- DARK MODE TOGGLE ----------
    const darkToggle = document.querySelector('.dark-mode-toggle');
    if (darkToggle) {
        // Check localStorage
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            darkToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            darkToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }

        darkToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                darkToggle.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('darkMode', 'enabled');
            } else {
                darkToggle.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }

    // ---------- ACTIVE LINK HIGHLIGHT ----------
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav ul li a');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ---------- SMOOTH SCROLL FOR ANCHOR LINKS (services page) ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ---------- CLOSE MOBILE MENU ON LINK CLICK ----------
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 992 && nav.classList.contains('nav-open')) {
                nav.classList.remove('nav-open');
                const icon = menuBtn?.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });
});

// ---------- CONTACT FORM SUCCESS MESSAGE ----------
// Show success message if redirected after Netlify form submission
const urlParams = new URLSearchParams(window.location.search);
const formSuccess = document.getElementById('formSuccess');
if (urlParams.has('success') && urlParams.get('success') === 'true' && formSuccess) {
    formSuccess.classList.add('show');
    // Remove the query parameter from URL without reloading
    window.history.replaceState({}, document.title, window.location.pathname);
}
