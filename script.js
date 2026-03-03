// script.js - Ultimate Robust Version for CD Logistics
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ========== DOM ELEMENTS ==========
    const header = document.querySelector('header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    const typingElement = document.getElementById('typing-text');
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const navLinks = document.querySelectorAll('nav ul li a');

    // Helper: check if mobile view
    const isMobile = () => window.innerWidth <= 768;

    // ========== TYPING ANIMATION (only on homepage) ==========
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
                isDeleting = true;
                timeout = setTimeout(typeEffect, 1500);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                timeout = setTimeout(typeEffect, 400);
            } else {
                const speed = isDeleting ? 70 : 120;
                timeout = setTimeout(typeEffect, speed);
            }
        }
        typeEffect();
    }

    // ========== MOBILE MENU TOGGLE ==========
    if (mobileMenuBtn && nav) {
        // Toggle menu on button click
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            nav.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                // Close any open dropdowns when menu closes
                document.querySelectorAll('.dropdown.show').forEach(drop => drop.classList.remove('show'));
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (nav.classList.contains('active') && !nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close menu when a navigation link (without dropdown) is clicked
        nav.querySelectorAll('ul > li > a').forEach(link => {
            link.addEventListener('click', function(e) {
                // If this link is a dropdown toggle (has sibling dropdown), don't close menu yet
                const parentLi = this.closest('li');
                if (parentLi && parentLi.querySelector('.dropdown')) {
                    return; // handled separately
                }
                if (isMobile()) {
                    closeMobileMenu();
                }
            });
        });
    }

    function closeMobileMenu() {
        if (!nav) return;
        nav.classList.remove('active');
        if (mobileMenuBtn) {
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
        document.querySelectorAll('.dropdown.show').forEach(drop => drop.classList.remove('show'));
    }

    // ========== DROPDOWN HANDLING (mobile click toggles) ==========
    // Get all list items that contain a dropdown (without using :has)
    const allListItems = document.querySelectorAll('nav ul li');
    const dropdownParents = Array.from(allListItems).filter(li => li.querySelector('.dropdown'));

    dropdownParents.forEach(parent => {
        const link = parent.querySelector('a');
        const dropdown = parent.querySelector('.dropdown');

        if (!link || !dropdown) return;

        link.addEventListener('click', function(e) {
            if (isMobile()) {
                e.preventDefault(); // prevent navigation
                e.stopPropagation();

                // Close other dropdowns
                dropdownParents.forEach(other => {
                    if (other !== parent) {
                        const otherDropdown = other.querySelector('.dropdown');
                        if (otherDropdown) otherDropdown.classList.remove('show');
                    }
                });

                // Toggle this dropdown
                dropdown.classList.toggle('show');
            }
        });

        // When a dropdown item is clicked, close the mobile menu (after navigation)
        dropdown.querySelectorAll('a').forEach(itemLink => {
            itemLink.addEventListener('click', function() {
                if (isMobile()) {
                    // Small delay to allow navigation
                    setTimeout(closeMobileMenu, 150);
                }
            });
        });
    });

    // Close dropdowns when resizing from mobile to desktop
    window.addEventListener('resize', function() {
        if (!isMobile()) {
            document.querySelectorAll('.dropdown.show').forEach(drop => drop.classList.remove('show'));
            if (nav) nav.classList.remove('active');
            if (mobileMenuBtn) {
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        }
    });

    // ========== NAVBAR SCROLL EFFECT ==========
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.backgroundColor = '#ffffff';
                header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
            } else {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
            }
        });
    }

    // ========== SMOOTH SCROLL FOR HASH LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || !href) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (isMobile()) closeMobileMenu();
            }
        });
    });

    // ========== ACTIVE NAV LINK ==========
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ========== DARK MODE TOGGLE ==========
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
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

    // ========== SCROLL REVEAL ANIMATIONS ==========
    const revealElements = document.querySelectorAll(
        '.section-title, .about-content, .services-grid, .features-grid, .portfolio-grid, .cta-content'
    );
    if (revealElements.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -30px 0px' });

        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // ========== HANDLE HASH ON PAGE LOAD ==========
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
