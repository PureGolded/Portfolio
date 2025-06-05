/* 
 * Unified GSAP Animation Controller for Portfolio
 * Provides smooth, scroll-based animations with consistent timing
 */

// Initialize GSAP and ScrollTrigger plugins
gsap.registerPlugin(ScrollTrigger);

// Main Animation Controller
class PortfolioAnimator {
    constructor() {
        // Animation state tracking
        this.initialized = false;
        this.scrollProgress = null;
        this.preloader = null;
        this.animationTimelines = [];        this.config = {
            revealDistance: 20, // Reduced from 50 for faster H2 animations
            standardDuration: 0.8, // Reduced from 1.2 for faster H2 animations
            staggerTime: 0.15,
            ease: "power2.out",
            scrollScrub: 0.3
        };

        // Initialize animation system
        this.init();
    }

    init() {
        // Set up preloader and wait for content
        this.setupPreloader();

        // Initialize when DOM is fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupAnimations();
            });
        } else {
            this.setupAnimations();
        }

        // Add window load handler for final adjustments
        window.addEventListener('load', () => this.onFullLoad());
    }

    setupPreloader() {
        // Prevent Flash of Unstyled Content by keeping body invisible
        if (!document.body.classList.contains('js-loading')) {
            document.body.classList.add('js-loading');
        }
        
        // Hide all animatable elements
        this.hideAllElements();
    }

    hideAllElements() {
        // Find all elements that will be animated
        const animatableElements = document.querySelectorAll('.reveal-section, .stagger-item, .hero-title, .hero-subtitle, .hero-description, .hero-actions');
        
        // Set initial hidden state with GSAP 
        gsap.set(animatableElements, {
            opacity: 0,
            y: this.config.revealDistance,
            visibility: 'hidden'
        });
    }    setupAnimations() {
        this.initialized = true;
        
        // Core animation setup
        this.createScrollProgress();
        this.setupScrollBasedAnimations();
        this.setupInitialHeroAnimation();
        
        // We'll setup card hover effects with a slight delay after scroll animations
        // This ensures stagger animations complete before hover effects are applied
        setTimeout(() => {
            this.setupCardHoverEffects();
        }, 500);

        // Mark as initialized
        document.body.classList.add('animations-ready');
    }

    onFullLoad() {
        // Final adjustments after all assets are loaded
        document.body.classList.remove('js-loading');
        ScrollTrigger.refresh();
        
        // Make sure hero section is visible immediately
        this.animateHeroElements();
        
        // Force refresh scroll triggers with slight delay
        setTimeout(() => {
            ScrollTrigger.refresh(true);
            this.checkVisibleElements();
        }, 300);
    }

    createScrollProgress() {
        // Remove any existing progress elements
        const existingProgress = document.querySelectorAll('.scroll-progress');
        existingProgress.forEach(el => el.remove());
        
        // Create new progress bar
        this.scrollProgress = document.createElement('div');
        this.scrollProgress.className = 'scroll-progress';
        document.body.appendChild(this.scrollProgress);

        // Animate based on scroll position
        gsap.to(this.scrollProgress, {
            width: '100%',
            ease: "none",
            scrollTrigger: {
                trigger: 'body',
                start: "top top",
                end: "bottom bottom",
                scrub: 0.2
            }
        });
    }

    setupScrollBasedAnimations() {
        // Handle all reveal sections
        this.setupRevealSections();
        
        // Handle all stagger containers
        this.setupStaggerContainers();
    }

    setupRevealSections() {
        // Find all sections that should reveal on scroll
        gsap.utils.toArray('.reveal-section').forEach(section => {
            // Create timeline for this section
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%", // Triggers when section is 85% from top of viewport
                    toggleActions: "play none none none", // play, reverse, restart on scroll
                    once: false, // Animate every time it comes into view
                }
            });
            
            // Add reveal animation to timeline
            tl.to(section, {
                opacity: 1,
                y: 0,
                visibility: 'visible',
                duration: this.config.standardDuration,
                ease: this.config.ease
            });
            
            // Store timeline for future reference
            this.animationTimelines.push(tl);
        });
    }    setupStaggerContainers() {
        // Find all containers that have staggered children
        gsap.utils.toArray('.stagger-container').forEach(container => {
            const items = container.querySelectorAll('.stagger-item');
            if (items.length === 0) return;
            
            // Create timeline for this container
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: "top 90%", // Starts animation when container reaches 90% from top
                    toggleActions: "play none none none",
                    once: false, // Always animate
                }
            });
            
            // First ensure items are visible but transparent
            tl.set(items, { visibility: 'visible' });
            
            // Then animate them in with stagger
            tl.to(items, {
                opacity: 1,
                y: 0, 
                scale: 1,
                stagger: this.config.staggerTime,
                duration: this.config.standardDuration,
                ease: this.config.ease,
                // Do NOT clear the transform props to maintain consistent state
                // for hover animations
            });
            
            // Store timeline
            this.animationTimelines.push(tl);
        });
    }

    setupInitialHeroAnimation() {
        // Create sequence for hero section elements
        this.heroTimeline = gsap.timeline({ paused: true });
        
        // Build animation sequence
        this.heroTimeline
            .to('.hero-title', {
                opacity: 1,
                y: 0,
                visibility: 'visible',
                duration: 1.2,
                ease: "power2.out"
            })
            .to('.hero-subtitle', {
                opacity: 1,
                y: 0,
                visibility: 'visible',
                duration: 1,
                ease: "power2.out"
            }, "-=0.6")
            .to('.hero-description', {
                opacity: 1,
                y: 0,
                visibility: 'visible',
                duration: 1,
                ease: "power2.out"
            }, "-=0.7")
            .to('.hero-actions', {
                opacity: 1,
                y: 0,
                visibility: 'visible',
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.7");
    }

    animateHeroElements() {
        // Play the hero animation if it exists
        if (this.heroTimeline) {
            this.heroTimeline.play();
        }
    }    setupCardHoverEffects() {
        // Add hover effects to all project cards
        gsap.utils.toArray('.project-card').forEach(card => {
            const img = card.querySelector('.project-image img');
            
            // Set initial card state to ensure consistency
            gsap.set(card, { 
                y: 0,
                scale: 1,
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                clearProps: "transform" // Clear any transform from stagger animations
            });
            
            if (img) {
                gsap.set(img, { scale: 1 });
            }
            
            // Mouse enter effect
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -8,
                    scale: 1.01,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                    duration: 0.4,
                    ease: "power2.out"
                });
                
                if (img) {
                    gsap.to(img, {
                        scale: 1.05,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                }
            });
            
            // Mouse leave effect
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    scale: 1,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    duration: 0.4,
                    ease: "power2.out"
                });
                
                if (img) {
                    gsap.to(img, {
                        scale: 1,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                }
            });
        });
    }    checkVisibleElements() {
        // Force all elements in viewport to become visible
        const allAnimatables = document.querySelectorAll('.reveal-section, .stagger-item');
        allAnimatables.forEach(el => {
            // Check if element is in viewport
            const rect = el.getBoundingClientRect();
            const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
            const isInViewport = !(rect.bottom < 0 || rect.top - viewHeight >= 0);
            
            // If element should be visible but isn't, make it visible
            if (isInViewport && window.getComputedStyle(el).opacity === "0") {
                gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    visibility: 'visible', 
                    duration: this.config.standardDuration,
                    ease: this.config.ease
                });
            }
        });
        
        // Add specific fix for project cards that are already visible
        // This ensures they have the correct resting position
        gsap.utils.toArray('.project-card').forEach(card => {
            const rect = card.getBoundingClientRect();
            const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
            const isInViewport = !(rect.bottom < 0 || rect.top - viewHeight >= 0);
            
            if (isInViewport) {
                // Make sure the card is at its proper resting position
                gsap.set(card, {
                    y: 0,
                    scale: 1,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                });
            }
        });
    }

    scrollToSection(targetId) {
        const target = document.querySelector(targetId);
        if (target) {
            gsap.to(window, {
                duration: 1, 
                scrollTo: {
                    y: target,
                    offsetY: 80
                },
                ease: "power2.inOut"
            });
        }
    }
}

// Initialize singleton animation controller
document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollToPlugin for smooth scrolling
    gsap.registerPlugin(ScrollToPlugin);
    
    // Create animation controller
    const portfolioAnimator = new PortfolioAnimator();
    
    // Expose scroll function to global scope
    window.scrollToSection = portfolioAnimator.scrollToSection;
    
    console.log("Unified animation system initialized");
});
