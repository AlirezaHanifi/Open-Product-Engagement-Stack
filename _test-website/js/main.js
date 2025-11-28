/**
 * ============================================
 * ANALYTICS TEST WEBSITE - MAIN JAVASCRIPT
 * ============================================
 * 
 * This file handles:
 * 1. Custom event tracking for Matomo
 * 2. User interaction tracking
 * 3. Form submission tracking
 * 4. Page interaction analytics
 * 5. User engagement metrics
 */

// Initialize tracking counter
let clickCount = 0;
let timerInterval = null;
let timerSeconds = 0;

/**
 * Track custom event in Matomo
 * @param {string} category - Event category
 * @param {string} action - Event action
 * @param {string} name - Event name (optional)
 * @param {number} value - Event value (optional)
 */
function trackEvent(category, action, name = '', value = 0) {
    if (window._paq) {
        if (name && value) {
            window._paq.push(['trackEvent', category, action, name, value]);
        } else if (name) {
            window._paq.push(['trackEvent', category, action, name]);
        } else {
            window._paq.push(['trackEvent', category, action]);
        }
        console.log(`[Matomo] Event tracked: ${category} / ${action}${name ? ' / ' + name : ''}`);
    }
}

/**
 * Track funnel step
 * @param {string} step - Funnel step name
 * @param {string} value - Step value (optional)
 */
function trackFunnelStep(step, value = '') {
    if (window._paq) {
        window._paq.push(['trackEvent', 'Funnel', step, value]);
        console.log(`[Matomo] Funnel step tracked: ${step}${value ? ' - ' + value : ''}`);
    }
}

/**
 * Track ecommerce product view
 * @param {object} product - Product object
 */
function trackProductView(product) {
    if (window._paq) {
        window._paq.push(['setEcommerceView', 
            product.sku,
            product.name,
            product.category,
            product.price
        ]);
        console.log(`[Matomo] Product view tracked: ${product.name}`);
    }
}

/**
 * Initialize click counter button
 */
function initClickCounter() {
    const clickBtn = document.getElementById('click-counter');
    if (clickBtn) {
        clickBtn.addEventListener('click', function() {
            clickCount++;
            this.textContent = `Click Me (${clickCount} times)`;
            trackEvent('Button Interactions', 'Click Counter', 'Button Clicked', clickCount);
            
            // Track milestone events
            if (clickCount === 5) {
                trackEvent('Milestones', 'Click Milestone', 'Reached 5 Clicks', 5);
            } else if (clickCount === 10) {
                trackEvent('Milestones', 'Click Milestone', 'Reached 10 Clicks', 10);
            }
        });
    }
}

/**
 * Initialize feature buttons tracking
 */
function initFeatureButtons() {
    const featureButtons = document.querySelectorAll('.feature-btn');
    featureButtons.forEach(button => {
        button.addEventListener('click', function() {
            const feature = this.getAttribute('data-feature');
            trackEvent('Feature Exploration', 'Feature Button Clicked', feature);
            alert(`You clicked on: ${feature}`);
        });
    });
}

/**
 * Initialize blog post read buttons
 */
function initBlogReadButtons() {
    const readButtons = document.querySelectorAll('.read-btn');
    readButtons.forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.getAttribute('data-post');
            const postTitle = this.closest('.blog-post').querySelector('h2').textContent;
            trackEvent('Content Engagement', 'Blog Post Interest', postTitle);
            alert(`You're interested in: ${postTitle}`);
        });
    });
}

/**
 * Initialize action buttons
 */
function initActionButtons() {
    // Scroll tracker
    const scrollTracker = document.getElementById('scroll-tracker');
    if (scrollTracker) {
        scrollTracker.addEventListener('click', function() {
            const scrollPercentage = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
            trackEvent('User Engagement', 'Scroll Tracking', `Scroll Depth: ${scrollPercentage}%`, scrollPercentage);
            alert(`You've scrolled ${scrollPercentage}% down the page`);
        });
    }

    // Timer button
    const timerBtn = document.getElementById('timer-btn');
    if (timerBtn) {
        timerBtn.addEventListener('click', function() {
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
                trackEvent('User Engagement', 'Timer Completed', `Spent ${timerSeconds} seconds`, timerSeconds);
                trackGoal(1, timerSeconds); // Track as goal
                alert(`Timer completed! You spent ${timerSeconds} seconds.`);
                this.textContent = 'Start Timer';
                timerSeconds = 0;
            } else {
                this.textContent = 'Stop Timer';
                timerSeconds = 0;
                timerInterval = setInterval(() => {
                    timerSeconds++;
                    if (timerSeconds % 10 === 0) {
                        // Track every 10 seconds
                        trackEvent('User Engagement', 'Timer Running', `Timer: ${timerSeconds}s`, timerSeconds);
                    }
                }, 1000);
            }
        });
    }

    // Goal button
    const goalBtn = document.getElementById('goal-btn');
    if (goalBtn) {
        goalBtn.addEventListener('click', function() {
            trackEvent('Conversions', 'Goal Completed', 'User Goal Achievement');
            trackGoal(2, 100); // Goal ID 2 with value 100
            alert('Goal completed! This action was tracked.');
        });
    }
}

/**
 * Initialize form submission tracking
 */
function initFormTracking() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Track form submission
            trackEvent('Form Submissions', 'Contact Form', data.subject, 1);
            trackEvent('Form Details', 'Interest', data.interest);
            trackGoal(3, 50); // Conversion goal

            // Show success message
            const formMessage = document.getElementById('form-message');
            if (formMessage) {
                formMessage.textContent = `Thank you ${data.name}! Your message has been received.`;
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';
            }

            // Reset form
            setTimeout(() => {
                this.reset();
                if (formMessage) {
                    formMessage.style.display = 'none';
                }
            }, 3000);

            console.log('Form data tracked:', data);
        });
    }
}

/**
 * Initialize social button tracking
 */
function initSocialTracking() {
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const socialPlatform = this.textContent;
            trackEvent('Social Engagement', 'Social Button Click', socialPlatform);
            alert(`You clicked on: ${socialPlatform}`);
        });
    });
}

/**
 * Track page scroll depth
 */
function trackScrollDepth() {
    let scrollDepthTracked = {};

    window.addEventListener('scroll', function() {
        const scrollPercentage = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        
        // Track at 25%, 50%, 75%, 100%
        const milestones = [25, 50, 75, 100];
        milestones.forEach(milestone => {
            if (scrollPercentage >= milestone && !scrollDepthTracked[milestone]) {
                scrollDepthTracked[milestone] = true;
                trackEvent('Page Engagement', 'Scroll Depth', `${milestone}%`, milestone);
            }
        });
    });
}

/**
 * Track time on page
 */
function trackTimeOnPage() {
    let timeOnPageSeconds = 0;
    
    setInterval(function() {
        timeOnPageSeconds += 10;
        
        // Track every 30 seconds
        if (timeOnPageSeconds % 30 === 0) {
            trackEvent('User Engagement', 'Time on Page', `${timeOnPageSeconds} seconds`, timeOnPageSeconds);
        }
    }, 10000); // Every 10 seconds
}

/**
 * Track link clicks
 */
function trackLinkClicks() {
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && !link.classList.contains('social-btn') && !link.classList.contains('feature-btn')) {
            const href = link.getAttribute('href');
            const text = link.textContent;
            if (href && !href.startsWith('#')) {
                trackEvent('Link Clicks', 'Navigation', text || href);
            }
        }
    });
}

/**
 * Track page visibility changes (tab focus)
 */
function trackPageVisibility() {
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            trackEvent('User Behavior', 'Page Hidden', document.title);
        } else {
            trackEvent('User Behavior', 'Page Visible', document.title);
        }
    });
}

/**
 * Initialize all tracking and event listeners
 */
function initializeTracking() {
    console.log('[Analytics] Initializing tracking system...');

    // Wait for Matomo to load
    setTimeout(() => {
        if (window._paq) {
            console.log('[Analytics] Matomo loaded successfully');
            
            // Initialize all tracking features
            initClickCounter();
            initFeatureButtons();
            initBlogReadButtons();
            initActionButtons();
            initFormTracking();
            initSocialTracking();
            trackScrollDepth();
            trackTimeOnPage();
            trackLinkClicks();
            trackPageVisibility();

            // Track initial page load
            trackEvent('Page Load', 'Page Loaded', document.title);

            console.log('[Analytics] All tracking features initialized');
        } else {
            console.warn('[Analytics] Matomo not loaded. Some tracking features may not work.');
        }
    }, 500);
}

/**
 * Handle page unload to track session end
 */
window.addEventListener('beforeunload', function() {
    if (window._paq) {
        trackEvent('User Behavior', 'Page Unload', document.title);
    }
});

/**
 * Start tracking when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTracking);
} else {
    initializeTracking();
}

// Log tracking information in console
console.log('[Analytics] Tracking system loaded. Monitoring user interactions...');
console.log('[Analytics] All user interactions, clicks, and events will be sent to Matomo.');
