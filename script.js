// script.js - ultra simple, works everywhere
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ========== TYPING ANIMATION (only on homepage) ==========
    const typedText = document.getElementById('typing-text');
    if (typedText) {
        const words = ['Construction', 'Architecture', 'Logistics', 'Property Management'];
        let i = 0, j = 0, isDeleting = false;
        function type() {
            const current = words[i];
            if (isDeleting) {
                typedText.textContent = current.substring(0, j-1);
                j--;
            } else {
                typedText.textContent = current.substring(0, j+1);
                j++;
            }
            if (!isDeleting && j === current.length) {
                isDeleting = true;
                setTimeout(type, 1500);
            } else if (isDeleting && j === 0) {
                isDeleting = false;
                i = (i + 1) % words.length;
                setTimeout(type, 400);
            } else {
                setTimeout(type, isDeleting ? 70 : 120);
            }
        }
        type();
    }

    // ========== MOBILE MENU TOGGLE ==========
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            nav.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });

        // Close menu when clicking a link (except dropdown parent)
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    // If this link has a dropdown, don't close the whole menu
                    if (this.nextElementSibling && this.nextElementSibling.classList.contains('dropdown')) {
                        e.preventDefault(); // Prevent navigation on mobile
                        // Toggle this dropdown
                        this.nextElementSibling.classList.toggle('show');
                        return;
                    }
                    // Normal link: close menu after navigation
                    nav.classList.remove('active');
                    menuBtn.querySelector('i').className = 'fas fa-bars';
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (nav.classList.contains('active') && !nav.contains(e.target) && !menuBtn.contains(e.target)) {
                nav.classList.remove('active');
                menuBtn.querySelector('i').className = 'fas fa-bars';
            }
        });
    }

    // ========== RESIZE: close menu if switching to desktop ==========
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && nav && nav.classList.contains('active')) {
            nav.classList.remove('active');
            menuBtn.querySelector('i').className = 'fas fa-bars';
        }
    });
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
