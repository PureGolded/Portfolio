// Main JavaScript for Portfolio Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page loader
    initPageLoader();
    
    // Initialize all components after a short delay
    setTimeout(() => {
        initNavigation();
        initScrollAnimations();
        initScrollProgress();
        initMobileMenu();
        initSmoothScrolling();
        initScrollToTop();
        initPageTransitions();
    }, 200);
});

// Page loader functionality
function initPageLoader() {
    const pageLoader = document.querySelector('.page-loader');
    if (!pageLoader) return;
    
    // Function to hide loader
    function hideLoader() {
        if (pageLoader.classList.contains('fade-out')) return;
        
        pageLoader.classList.add('fade-out');
        setTimeout(() => {
            if (pageLoader.parentNode) {
                pageLoader.parentNode.removeChild(pageLoader);
            }
        }, 600);
    }
    
    // Wait for resources and minimum time
    const minLoadTime = 600;
    const maxLoadTime = 2000;
    const startTime = Date.now();
    
    let resourcesLoaded = false;
    let cssLoaded = false;
    
    // Check if page is loaded
    if (document.readyState === 'complete') {
        resourcesLoaded = true;
    } else {
        window.addEventListener('load', () => {
            resourcesLoaded = true;
        });
    }
    
    // Check if CSS is loaded by looking for the css-loaded class
    function checkCSSLoaded() {
        if (document.body.classList.contains('css-loaded')) {
            cssLoaded = true;
        } else {
            setTimeout(checkCSSLoaded, 50);
        }
    }
    checkCSSLoaded();
    
    // Force hide after max time
    setTimeout(hideLoader, maxLoadTime);
    
    // Check if we can hide loader
    const checkInterval = setInterval(() => {
        const timeElapsed = Date.now() - startTime;
        
        if ((resourcesLoaded && cssLoaded && timeElapsed >= minLoadTime) || timeElapsed >= maxLoadTime) {
            clearInterval(checkInterval);
            hideLoader();
        }
    }, 50);
}

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    
    // Add scrolled class to navbar on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all animation elements
    const animateElements = document.querySelectorAll(
        '.fade-in, .slide-in-left, .slide-in-right, .scale-in, .reveal-section'
    );
    
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Stagger animation for lists
    const staggerContainers = document.querySelectorAll('.stagger-container');
    staggerContainers.forEach(container => {
        const items = container.querySelectorAll('.stagger-item');
        
        const staggerObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    items.forEach(item => {
                        item.classList.add('visible');
                    });
                }
            });
        }, observerOptions);
        
        staggerObserver.observe(container);
    });
}

// Scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll to top functionality
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scroll-top');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', debounce(() => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }, 100));
    }
}

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Page transition effects
function initPageTransitions() {
    // Add loaded class after DOM is ready
    setTimeout(() => {
        const pageTransition = document.querySelector('.page-transition');
        if (pageTransition) {
            pageTransition.classList.add('loaded');
        }
    }, 100);
    
    // Simple navigation transitions
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only handle internal navigation
            if (this.href && this.href.startsWith(window.location.origin)) {
                // Add a simple fade effect before navigation
                document.body.style.opacity = '0.8';
                setTimeout(() => {
                    document.body.style.opacity = '1';
                }, 200);
            }
        });
    });
}

// Create smooth transition overlay
function createTransitionOverlay() {
    // Remove existing overlay if present
    const existingOverlay = document.querySelector('.transition-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    // Create new overlay
    const overlay = document.createElement('div');
    overlay.className = 'transition-overlay';
    document.body.appendChild(overlay);
    
    // Trigger fade in using CSS class
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Export functions for use in other scripts
window.portfolioJS = {
    initScrollAnimations,
    initSmoothScrolling,
    debounce,
    throttle
};

// Make scrollToTop globally available
window.scrollToTop = scrollToTop;
