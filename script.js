// script.js - Complete Multi-Page JavaScript for CD Logistics

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    /* ==================== TYPING ANIMATION FOR HERO ==================== */
    const typedTextSpan = document.getElementById('typing-text');
    if (typedTextSpan) {
        const words = ['Construction', 'Architecture', 'Logistics', 'Property Management'];
        let i = 0;
        let j = 0;
        let currentWord = '';
        let isDeleting = false;

        function type() {
            if (i < words.length) {
                if (!isDeleting && j <= words[i].length) {
                    currentWord = words[i].substring(0, j);
                    typedTextSpan.textContent = currentWord;
                    j++;
                    setTimeout(type, 150);
                } else if (isDeleting && j >= 0) {
                    currentWord = words[i].substring(0, j);
                    typedTextSpan.textContent = currentWord;
                    j--;
                    setTimeout(type, 100);
                } else {
                    if (!isDeleting) {
                        isDeleting = true;
                        setTimeout(type, 1000);
                    } else {
                        isDeleting = false;
                        i = (i + 1) % words.length;
                        j = 0;
                        setTimeout(type, 400);
                    }
                }
            }
        }
        type();
    }

    /* ==================== MOBILE MENU TOGGLE ==================== */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');

    // Helper function to close mobile menu and reset all dropdowns
    function closeMobileMenu() {
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');

            // Also close any open dropdowns
            document.querySelectorAll('.dropdown.show').forEach(drop => {
                drop.classList.remove('show');
            });
        }
    }

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            // Toggle icon between bars and times
            const icon = mobileMenuBtn.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                // When closing menu, also close any open dropdowns
                document.querySelectorAll('.dropdown.show').forEach(drop => {
                    drop.classList.remove('show');
                });
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !mobileMenuBtn.contains(event.target) && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    /* ==================== IMPROVED DROPDOWN HANDLING ==================== */
    // Get all navigation links
    const navLinks = document.querySelectorAll('nav ul li a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const parentLi = this.closest('li');
            const hasDropdown = parentLi && parentLi.querySelector('.dropdown');

            // On mobile, if this link is the parent of a dropdown, toggle it
            if (window.innerWidth <= 768 && hasDropdown) {
                e.preventDefault(); // Prevent navigation
                
                // Close other dropdowns
                navLinks.forEach(otherLink => {
                    const otherLi = otherLink.closest('li');
                    if (otherLi && otherLi !== parentLi) {
                        const otherDropdown = otherLi.querySelector('.dropdown');
                        if (otherDropdown) otherDropdown.classList.remove('show');
                    }
                });

                // Toggle current dropdown
                const dropdown = parentLi.querySelector('.dropdown');
                if (dropdown) dropdown.classList.toggle('show');
            } else {
                // For all other links (including dropdown items), close mobile menu and navigate
                closeMobileMenu();
                // Navigation happens naturally (no preventDefault)
            }
        });
    });

    // Reset dropdown classes when resizing to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            document.querySelectorAll('.dropdown.show').forEach(drop => {
                drop.classList.remove('show');
            });
        }
    });

    /* ==================== NAVBAR SCROLL EFFECT ==================== */
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.backgroundColor = '#ffffff';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
    });

    /* ==================== SMOOTH SCROLL FOR ANCHOR LINKS ==================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    /* ==================== BUTTON RIPPLE EFFECT (premium touch) ==================== */
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = btn.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = e.clientX - rect.left + 'px';
            ripple.style.top = e.clientY - rect.top + 'px';
            ripple.style.background = 'rgba(255,255,255,0.5)';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'scale(0)';
            ripple.style.width = ripple.style.height = '10px';
            ripple.style.animation = 'rippleAnim 0.5s linear';
            btn.style.position = 'relative';
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 500);
        });
    });

    // Add keyframe animation for ripple if not already present
    if (!document.querySelector('#rippleStyle')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'rippleStyle';
        styleSheet.textContent = `@keyframes rippleAnim { to { transform: scale(20); opacity: 0; } }`;
        document.head.appendChild(styleSheet);
    }

    /* ==================== DARK MODE TOGGLE (optional) ==================== */
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const icon = darkModeToggle.querySelector('i');
            if (document.body.classList.contains('dark-mode')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                // Simple dark mode styles (you can expand via CSS classes)
                document.body.style.backgroundColor = '#1a1a1a';
                document.body.style.color = '#f0f0f0';
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                document.body.style.backgroundColor = '';
                document.body.style.color = '';
            }
        });
    }

    /* ==================== SCROLL REVEAL (fade-in on scroll) ==================== */
    const revealElements = document.querySelectorAll(
        '.section-title, .about-content, .services-grid, .features-grid, .portfolio-grid, .cta-content'
    );
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
