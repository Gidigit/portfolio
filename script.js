document.addEventListener('DOMContentLoaded', function() {
    // ========== CONSTANTS AND CONFIGURATION ==========
    const CONFIG = {
        roleChangeInterval: 3000,
        scrollOffset: 100,
        typingSpeed: 100,
        erasingSpeed: 50,
        animationThreshold: 0.1
    };

    const ROLES = ["Web Developer", "FrontEnd Developer", "UI/UX Designer"];

    // ========== DOM ELEMENTS ==========
    const elements = {
        menuToggle: document.getElementById('menu-icon'),
        navLinks: document.querySelector('.navbar'),
        body: document.body,
        roleElement: document.getElementById('role'),
        header: document.querySelector('.header'),
        contactForm: document.querySelector('.contact form'),
        sections: document.querySelectorAll('section[id]')
    };

    // ========== STATE MANAGEMENT ==========
    let state = {
        lastScrollY: window.scrollY,
        currentRoleIndex: 0,
        isDeleting: false,
        roleText: '',
        typingSpeed: CONFIG.typingSpeed
    };

    // ========== MAIN INITIALIZATION ==========
    function init() {
        initMenuToggle();
        initRoleAnimation();
        initScrollAnimations();
        initHeaderEffects();
        initNavHighlighting();
        initFormValidation();
        initIntersectionObserver();
        initThemeToggle();
        initSmoothScrolling();
        initConsoleGreeting();
    }

    // ========== MENU TOGGLE FUNCTIONALITY ==========
    function initMenuToggle() {
        if (!elements.menuToggle || !elements.navLinks) return;

        const toggleMenu = () => {
            elements.navLinks.classList.toggle('active');
            elements.menuToggle.classList.toggle('bx-x');
            elements.body.classList.toggle('no-scroll');
        };

        elements.menuToggle.addEventListener('click', toggleMenu);

        // Close menu when clicking on nav links
        document.querySelectorAll('.navbar a').forEach(link => {
            link.addEventListener('click', () => {
                elements.navLinks.classList.remove('active');
                elements.menuToggle.classList.remove('bx-x');
                elements.body.classList.remove('no-scroll');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!elements.navLinks.contains(e.target) && 
                !elements.menuToggle.contains(e.target) && 
                elements.navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    }

    // ========== ROLE CHANGING ANIMATION ==========
    function initRoleAnimation() {
        if (!elements.roleElement) return;
        
        // Choose one of the two animation methods below:
        // initRoleFadeAnimation(); // Smooth fade transition
        initRoleTypewriterAnimation(); // Typewriter effect
    }

    function initRoleFadeAnimation() {
        function changeRole() {
            // Fade out current role
            elements.roleElement.classList.remove('active');
            
            setTimeout(() => {
                // Update text content
                elements.roleElement.textContent = ROLES[state.currentRoleIndex];
                
                // Fade in new role
                setTimeout(() => {
                    elements.roleElement.classList.add('active');
                }, 50);
                
                // Update index for next role
                state.currentRoleIndex = (state.currentRoleIndex + 1) % ROLES.length;
            }, 500);
        }
        
        // Initialize with first role
        elements.roleElement.textContent = ROLES[state.currentRoleIndex];
        setTimeout(() => {
            elements.roleElement.classList.add('active');
            state.currentRoleIndex = (state.currentRoleIndex + 1) % ROLES.length;
        }, 100);
        
        // Start the role change process
        setInterval(changeRole, CONFIG.roleChangeInterval);
    }

    function initRoleTypewriterAnimation() {
        function typeWriter() {
            const currentRole = ROLES[state.currentRoleIndex];
            
            if (state.isDeleting) {
                // Remove characters
                state.roleText = currentRole.substring(0, state.roleText.length - 1);
            } else {
                // Add characters
                state.roleText = currentRole.substring(0, state.roleText.length + 1);
            }
            
            elements.roleElement.textContent = state.roleText;
            
            // Determine typing speed
            let typeSpeed = state.typingSpeed;
            
            if (state.isDeleting) {
                typeSpeed /= 2; // Faster when deleting
            }
            
            // Check if complete
            if (!state.isDeleting && state.roleText === currentRole) {
                typeSpeed = 2000; // Pause at end of word
                state.isDeleting = true;
            } else if (state.isDeleting && state.roleText === '') {
                state.isDeleting = false;
                state.currentRoleIndex = (state.currentRoleIndex + 1) % ROLES.length;
                typeSpeed = 500; // Pause before starting next word
            }
            
            setTimeout(typeWriter, typeSpeed);
        }
        
        // Start the typewriter effect
        typeWriter();
    }

    // ========== SCROLL ANIMATIONS ==========
    function initScrollAnimations() {
        const animatableElements = document.querySelectorAll('.timeline-item, .services-box, .testimonial-item');
        
        // Initialize elements
        animatableElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(50px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });

        // Scroll event handler
        const animateOnScroll = () => {
            animatableElements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.3;
                
                if (elementPosition < screenPosition) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        };

        window.addEventListener('scroll', animateOnScroll);
        setTimeout(animateOnScroll, 500);
    }

    // ========== HEADER SCROLL EFFECT ==========
    function initHeaderEffects() {
        if (!elements.header) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > CONFIG.scrollOffset) {
                elements.header.classList.add('scrolled');
                
                // Hide header on scroll down, show on scroll up
                if (window.scrollY > state.lastScrollY && window.scrollY > 200) {
                    elements.header.style.transform = 'translateY(-100%)';
                } else {
                    elements.header.style.transform = 'translateY(0)';
                }
            } else {
                elements.header.classList.remove('scrolled');
                elements.header.style.transform = 'translateY(0)';
            }
            
            state.lastScrollY = window.scrollY;
        });
    }

    // ========== ACTIVE NAV LINK ON SCROLL ==========
    function initNavHighlighting() {
        function activateNavLink() {
            const scrollY = window.pageYOffset;
            
            elements.sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - CONFIG.scrollOffset;
                const sectionId = section.getAttribute('id');
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelector(`.navbar a[href="#${sectionId}"]`)?.classList.add('active');
                } else {
                    document.querySelector(`.navbar a[href="#${sectionId}"]`)?.classList.remove('active');
                }
            });
        }
        
        window.addEventListener('scroll', activateNavLink);
    }

    // ========== FORM VALIDATION ==========
    function initFormValidation() {
        if (!elements.contactForm) return;
        
        elements.contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const inputs = this.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red';
                    
                    // Remove error style after delay
                    setTimeout(() => {
                        input.style.borderColor = '';
                    }, 2000);
                }
            });
            
            if (isValid) {
                simulateFormSubmission(this);
            }
        });
    }

    function simulateFormSubmission(form) {
        const submitBtn = form.querySelector('input[type="submit"]');
        const originalText = submitBtn.value;
        
        // Simulate form submission
        submitBtn.value = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Message sent successfully! (This is a demo)');
            form.reset();
            submitBtn.value = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }

    // ========== INTERSECTION OBSERVER FOR ANIMATIONS ==========
    function initIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;
        
        const observerOptions = {
            threshold: CONFIG.animationThreshold,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        document.querySelectorAll('.home-content > *, .timeline-item, .services-box, .testimonial-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // ========== THEME TOGGLE FUNCTIONALITY ==========
    function initThemeToggle() {
        // Check for saved theme preference or respect OS preference
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
        
        // Apply the theme
        if (currentTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        }
        
        // Create and add theme toggle button
        const themeToggle = document.createElement('button');
        themeToggle.id = 'theme-toggle';
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = currentTheme === 'dark' ? '<i class="bx bx-sun"></i>' : '<i class="bx bx-moon"></i>';
        themeToggle.setAttribute('aria-label', 'Toggle theme');
        
        // Add toggle to header
        if (elements.header) {
            elements.header.appendChild(themeToggle);
            
            // Toggle theme on click
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                themeToggle.innerHTML = newTheme === 'dark' ? '<i class="bx bx-sun"></i>' : '<i class="bx bx-moon"></i>';
            });
        }
    }

    // ========== SMOOTH SCROLLING FOR ANCHOR LINKS ==========
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement && elements.header) {
                    const headerHeight = elements.header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ========== CONSOLE GREETING ==========
    function initConsoleGreeting() {
        console.log(
            `%cHello! 👋%c\nWelcome to Gideon Ngeno's portfolio.\nThis site is built with modern HTML, CSS, and JavaScript.`,
            'color: #00e6cc; font-size: 18px; font-weight: bold;',
            'color: #f5f5f7; font-size: 14px;'
        );
    }

    // ========== INJECT ADDITIONAL STYLES ==========
    function injectStyles() {
        const additionalStyles = `
            /* No scroll when menu is open */
            body.no-scroll {
                overflow: hidden;
            }
            
            /* Theme toggle button */
            .theme-toggle {
                background: var(--card-bg);
                border: 1px solid var(--glass-border);
                color: var(--text-color);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-left: 1rem;
            }
            
            .theme-toggle:hover {
                background: var(--main-color);
                color: var(--bg-color);
            }
            
            /* Close icon for menu */
            #menu-icon.bx-x {
                transform: rotate(180deg);
            }
            
            /* Light theme variables */
            [data-theme="light"] {
                --bg-color: #f5f5f7;
                --second-bg-color: #e8e8e8;
                --text-color: #333333;
                --main-color: #007a6d;
                --section-bg-color: #ffffff;
                --heading-color: #222222;
                --card-bg: rgba(255, 255, 255, 0.8);
                --glass-bg: rgba(245, 245, 247, 0.8);
                --glass-border: rgba(0, 0, 0, 0.1);
            }
            
            /* Animate-in class for intersection observer */
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            /* Header scroll effect */
            .header {
                transition: transform 0.3s ease, background 0.3s ease, padding 0.3s ease;
            }
            
            .header.scrolled {
                background: rgba(10, 10, 10, 0.95) !important;
                backdrop-filter: blur(12px) saturate(180%) !important;
                padding: 0.7rem 5% !important;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            }
            
            [data-theme="light"] .header.scrolled {
                background: rgba(245, 245, 247, 0.95) !important;
            }

            /* Role animation styles */
            #role {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.5s ease, transform 0.5s ease;
            }
            
            #role.active {
                opacity: 1;
                transform: translateY(0);
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = additionalStyles;
        document.head.appendChild(styleSheet);
    }

    // ========== START EVERYTHING ==========
    injectStyles();
    init();
});
