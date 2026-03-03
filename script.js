// script.js - Enhanced, robust multi-page JavaScript for CD Logistics
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    /* -------------------- GLOBAL VARIABLES -------------------- */
    const isMobile = () => window.innerWidth <= 768;
    const header = document.querySelector('header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    const mainNavList = document.querySelector('nav > ul'); // direct child ul of nav
    const dropdownParents = document.querySelectorAll('nav > ul > li:has(ul.dropdown)');
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const typingElement = document.getElementById('typing-text');

    /* -------------------- HELPER FUNCTIONS -------------------- */
    function closeMobileMenu() {
        if (mainNavList && mainNavList.classList.contains('active')) {
            mainNavList.classList.remove('active');
            if (mobileMenuBtn) {
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
            // Also close any open mobile dropdowns
            document.querySelectorAll('.dropdown.show').forEach(drop => drop.classList.remove('show'));
        }
    }

    function toggleMobileMenu(force) {
        if (!mainNavList || !mobileMenuBtn) return;
        const willBeActive = force !== undefined ? force : !mainNavList.classList.contains('active');
        mainNavList.classList.toggle('active', willBeActive);
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-times', willBeActive);
            icon.classList.toggle('fa-bars', !willBeActive);
        }
        if (!willBeActive) {
            // Close dropdowns when menu closes
            document.querySelectorAll('.dropdown.show').forEach(drop => drop.classList.remove('show'));
        }
    }

    /* -------------------- TYPING ANIMATION (only on homepage) -------------------- */
    if (typingElement) {
        const words = ['Construction', 'Architecture', 'Logistics', 'Property Management'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let timeout;

        function typeEffect() {
            const currentWord = words[wordIndex];
            let displayText = '';

            if (isDeleting) {
                displayText = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                displayText = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            typingElement.textContent = displayText;

            if (!isDeleting && charIndex === currentWord.length) {
                // Finished typing word, pause then delete
                isDeleting = true;
                timeout = setTimeout(typeEffect, 1500);
            } else if (isDeleting && charIndex === 0) {
                // Finished deleting, move to next word
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                timeout = setTimeout(typeEffect, 400);
            } else {
                // Continue typing/deleting
                const speed = isDeleting ? 70 : 120;
                timeout = setTimeout(typeEffect, speed);
            }
        }
        typeEffect();
    }

    /* -------------------- MOBILE MENU TOGGLE -------------------- */
    if (mobileMenuBtn && mainNavList) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mainNavList.classList.contains('active') &&
                !mainNavList.contains(e.target) &&
                !mobileMenuBtn.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close menu when a nav link (non-dropdown) is clicked
        mainNavList.querySelectorAll('li > a:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                if (isMobile()) closeMobileMenu();
            });
        });
    }

    /* -------------------- DROPDOWN HANDLING (DESKTOP & MOBILE) -------------------- */
    // For desktop: hover is handled by CSS; we just need to prevent interference.
    // For mobile: click toggles dropdown.

    dropdownParents.forEach(parent => {
        const link = parent.querySelector('a');
        const dropdown = parent.querySelector('.dropdown');

        if (!dropdown) return;

        // Add caret only if not present (we already have in HTML)
        // On mobile, prevent default navigation on parent link
        if (link) {
            link.addEventListener('click', (e) => {
                if (isMobile()) {
                    e.preventDefault();
                    e.stopPropagation();

                    // Close other open dropdowns
                    dropdownParents.forEach(other => {
                        if (other !== parent) {
                            const otherDropdown = other.querySelector('.dropdown');
                            if (otherDropdown) otherDropdown.classList.remove('show');
                        }
                    });

                    // Toggle current dropdown
                    dropdown.classList.toggle('show');
                }
            });
        }

        // Optional: close dropdown when clicking a link inside it
        dropdown.querySelectorAll('a').forEach(itemLink => {
            itemLink.addEventListener('click', () => {
                if (isMobile()) {
                    dropdown.classList.remove('show');
                    closeMobileMenu(); // close entire mobile menu after navigation
                }
            });
        });
    });

    // Close all dropdowns when resizing from mobile to desktop
    window.addEventListener('resize', () => {
        if (!isMobile()) {
            document.querySelectorAll('.dropdown.show').forEach(drop => drop.classList.remove('show'));
            // Also close mobile menu if open
            if (mainNavList && mainNavList.classList.contains('active')) {
                closeMobileMenu();
            }
        }
    });

    /* -------------------- NAVBAR SCROLL EFFECT -------------------- */
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.backgroundColor = '#ffffff';
                header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
            } else {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
            }
        });
    }

    /* -------------------- SMOOTH SCROLL FOR ANCHOR LINKS (same-page) -------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // If mobile menu is open, close it after clicking
                if (isMobile()) closeMobileMenu();
            }
        });
    });

    /* -------------------- BUTTON RIPPLE EFFECT (optional, subtle) -------------------- */
    const buttons = document.querySelectorAll('.btn:not(.no-ripple)');
    if (buttons.length) {
        // Add ripple style once
        if (!document.getElementById('ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                .btn {
                    position: relative;
                    overflow: hidden;
                }
                .btn .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background-color: rgba(255, 255, 255, 0.6);
                    width: 10px;
                    height: 10px;
                    transform: scale(0);
                    animation: ripple-animation 0.5s ease-out;
                    pointer-events: none;
                }
                @keyframes ripple-animation {
                    to {
                        transform: scale(20);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        buttons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.left = (e.clientX - rect.left) + 'px';
                ripple.style.top = (e.clientY - rect.top) + 'px';
                ripple.style.position = 'absolute';
                ripple.style.width = ripple.style.height = '10px';
                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 500);
            });
        });
    }

    /* -------------------- DARK MODE TOGGLE (simple class toggle) -------------------- */
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const icon = darkModeToggle.querySelector('i');
            if (document.body.classList.contains('dark-mode')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });
    }

    /* -------------------- SCROLL REVEAL ANIMATIONS -------------------- */
    const revealElements = document.querySelectorAll(
        '.section-title, .about-content, .services-grid, .features-grid, .portfolio-grid, .cta-content'
    );

    if (revealElements.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    // Optional: unobserve after first reveal
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -30px 0px' });

        revealElements.forEach(el => {
            // Set initial styles if not already set (avoid overriding existing styles)
            if (!el.style.opacity) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }
            observer.observe(el);
        });
    }

    /* -------------------- SET ACTIVE NAV LINK BASED ON CURRENT PAGE -------------------- */
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    /* -------------------- ENSURE NO CONFLICTS WITH HASH LINKS -------------------- */
    // If URL has hash, scroll to it after page load (with slight delay)
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
    }
});

    /* ==================== NETLIFY FORM HANDLER WITH SUCCESS POPUP ==================== */
    const contactForm = document.getElementById("contactForm");
    const formSuccess = document.getElementById("formSuccess");

    if (contactForm && formSuccess) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent default

            const formData = new FormData(contactForm);

            fetch("/", {
                method: "POST",
                body: formData
            })
            .then(() => {
                formSuccess.classList.add("show");  // fade-in
                contactForm.reset();
                setTimeout(() => formSuccess.classList.remove("show"), 5000); // fade-out after 5s
            })
            .catch((error) => alert("Oops! There was a problem: " + error));
        });
    }

});
