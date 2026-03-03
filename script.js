// script.js - Fixed & Enhanced Multi-Page JavaScript for CD Logistics
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    /* -------------------- GLOBAL VARIABLES -------------------- */
    const header = document.querySelector('header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav'); // The <nav> element itself
    const navLinks = document.querySelectorAll('nav ul li a');
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const typingElement = document.getElementById('typing-text');

    // Helper to detect mobile width (matches CSS breakpoint)
    const isMobile = () => window.innerWidth <= 768;

    /* -------------------- TYPING ANIMATION (index.html only) -------------------- */
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
                // Finished typing, pause then delete
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
    if (mobileMenuBtn && nav) {
        // Toggle menu on button click
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nav.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                // Close any open dropdowns when closing menu
                document.querySelectorAll('.dropdown.show').forEach(drop => drop.classList.remove('show'));
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('active') && 
                !nav.contains(e.target) && 
                !mobileMenuBtn.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close menu when a navigation link (not dropdown toggle) is clicked
        nav.querySelectorAll('ul > li > a').forEach(link => {
            link.addEventListener('click', (e) => {
                // If the clicked link has a dropdown, we handle it separately; otherwise close menu
                const parentLi = link.closest('li');
                if (parentLi && parentLi.querySelector('.dropdown')) {
                    // Dropdown toggle – handled separately
                    return;
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
        // Also close any open dropdowns
        document.querySelectorAll('.dropdown.show').forEach(drop => drop.classList.remove('show'));
    }

    /* -------------------- DROPDOWN HANDLING (mobile click toggle) -------------------- */
    const dropdownParents = document.querySelectorAll('nav ul li:has(ul.dropdown)');
    dropdownParents.forEach(parent => {
        const link = parent.querySelector('a');
        const dropdown = parent.querySelector('.dropdown');

        if (!link || !dropdown) return;

        link.addEventListener('click', (e) => {
            // Only handle on mobile
            if (isMobile()) {
                e.preventDefault(); // Prevent navigation to services.html
                e.stopPropagation();

                // Close other dropdowns
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

        // When a dropdown link is clicked, close mobile menu (after navigation)
        dropdown.querySelectorAll('a').forEach(itemLink => {
            itemLink.addEventListener('click', () => {
                if (isMobile()) {
                    // Small delay to allow navigation, then close menu
                    setTimeout(closeMobileMenu, 100);
                }
            });
        });
    });

    // Close all dropdowns when resizing from mobile to desktop
    window.addEventListener('resize', () => {
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

    /* -------------------- SMOOTH SCROLL FOR HASH LINKS -------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || !href) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // If mobile menu is open, close it
                if (isMobile()) closeMobileMenu();
            }
        });
    });

    /* -------------------- SET ACTIVE NAV LINK BASED ON CURRENT PAGE -------------------- */
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    /* -------------------- DARK MODE TOGGLE -------------------- */
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
                    observer.unobserve(entry.target); // animate only once
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -30px 0px' });

        revealElements.forEach(el => {
            // Only set initial styles if not already set by CSS
            if (!el.style.opacity) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }
            observer.observe(el);
        });
    }

    /* -------------------- HANDLE PAGE LOAD WITH HASH IN URL -------------------- */
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
