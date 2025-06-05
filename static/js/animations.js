/* GSAP Animation Controller for Portfolio */

// Initialize GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Simple animation controller
class PortfolioAnimations {
    constructor() {
        this.scrollProgress = null;
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupAnimations();
            });
        } else {
            this.setupAnimations();
        }
    }

    setupAnimations() {
        this.createScrollProgress();
        this.setupScrollAnimations();
        this.setupHeroAnimations();
        this.setupProjectAnimations();
    }

    createScrollProgress() {
        // Remove any existing scroll progress elements
        const existingProgress = document.querySelectorAll('.scroll-progress');
        existingProgress.forEach(el => el.remove());
        
        // Create scroll progress bar
        this.scrollProgress = document.createElement('div');
        this.scrollProgress.className = 'scroll-progress';
        document.body.appendChild(this.scrollProgress);

        // Position under navbar and animate width
        gsap.to(this.scrollProgress, {
            width: '100%',
            ease: "none",
            scrollTrigger: {
                trigger: 'body',
                start: "top top",
                end: "bottom bottom",
                scrub: 0.1
            }
        });
    }    setupScrollAnimations() {
        // Simple reveal animations
        gsap.utils.toArray('.reveal-section').forEach(section => {
            gsap.fromTo(section, 
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                        once: true
                    }
                }
            );
        });        // Improved stagger animations - set initial state and animate in (like home page)
        gsap.utils.toArray('.stagger-container').forEach(container => {
            const items = container.querySelectorAll('.stagger-item');
            if (items.length === 0) return;
            
            // First, make items visible (keep opacity 0)
            gsap.set(items, { visibility: 'visible' });
            
            // Then animate them in with a timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: "top bottom", // As soon as container enters viewport
                    once: true
                }
            });
            
            tl.to(items, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.3,
                ease: "power2.out",
                stagger: 0.22,
                clearProps: "transform,scale"
            });
        });
    }

    setupHeroAnimations() {
        // Simple hero entrance
        const tl = gsap.timeline();
        
        tl.fromTo('.hero-title',
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
        )
        .fromTo('.hero-subtitle',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
            "-=0.5"
        )
        .fromTo('.hero-description',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
            "-=0.3"
        )
        .fromTo('.hero-actions',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
            "-=0.3"
        );
    }

    setupProjectAnimations() {
        // Simple project card hover
        gsap.utils.toArray('.project-card').forEach(card => {
            const img = card.querySelector('.project-image img');
            
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -5,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                if (img) {
                    gsap.to(img, {
                        scale: 1.05,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                if (img) {
                    gsap.to(img, {
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });
        });
    }

    // Simple scroll to section
    scrollToSection(targetId) {
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const portfolioAnimations = new PortfolioAnimations();
    window.scrollToSection = portfolioAnimations.scrollToSection.bind(portfolioAnimations);
    
    // Force ScrollTrigger to recalculate when content is loaded
    // This is critical for the project cards animation
    setTimeout(() => {
        if (window.ScrollTrigger) {
            window.ScrollTrigger.refresh();
            console.log("ScrollTrigger refreshed");
        }
        
        // Also add a function to manually show stagger items if needed
        window.showStaggerItems = function() {
            const items = document.querySelectorAll('.stagger-item');
            gsap.to(items, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.3,
                visibility: 'visible',
                stagger: 0.22,
                ease: "power2.out"
            });
        };
    }, 300);
});
