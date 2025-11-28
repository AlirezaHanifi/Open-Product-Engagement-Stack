let clickCount = 0;
let timerInterval = null;
let timerSeconds = 0;

function trackMatomoEvent(category, action, name = '', value = 0) {
    if (window._paq) {
        if (name && value) {
            window._paq.push(['trackEvent', category, action, name, value]);
        } else if (name) {
            window._paq.push(['trackEvent', category, action, name]);
        } else {
            window._paq.push(['trackEvent', category, action]);
        }
    }
}

function trackMatomoGoal(goalId, value = 0) {
    if (window._paq) {
        if (value > 0) {
            window._paq.push(['trackGoal', goalId, value]);
        } else {
            window._paq.push(['trackGoal', goalId]);
        }
    }
}

function initializeClickCounter() {
    const clickBtn = document.getElementById('click-counter');
    if (clickBtn) {
        clickBtn.addEventListener('click', function() {
            clickCount++;
            this.textContent = `Click Me (${clickCount} times)`;
            trackMatomoEvent('Button Interactions', 'Click Counter', 'Button Clicked', clickCount);
            
            if (clickCount === 5) {
                trackMatomoEvent('Milestones', 'Click Milestone', 'Reached 5 Clicks', 5);
            } else if (clickCount === 10) {
                trackMatomoEvent('Milestones', 'Click Milestone', 'Reached 10 Clicks', 10);
            }
        });
    }
}

function initializeFeatureButtons() {
    const featureButtons = document.querySelectorAll('.feature-btn');
    featureButtons.forEach(button => {
        button.addEventListener('click', function() {
            const feature = this.getAttribute('data-feature');
            trackMatomoEvent('Feature Exploration', 'Feature Button Clicked', feature);
            alert(`You clicked on: ${feature}`);
        });
    });
}

function initializeBlogReadButtons() {
    const readButtons = document.querySelectorAll('.read-btn');
    readButtons.forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.getAttribute('data-post');
            const postTitle = this.closest('.blog-post').querySelector('h2').textContent;
            trackMatomoEvent('Content Engagement', 'Blog Post Interest', postTitle);
            alert(`You're interested in: ${postTitle}`);
        });
    });
}

function initializeActionButtons() {
    const scrollTracker = document.getElementById('scroll-tracker');
    if (scrollTracker) {
        scrollTracker.addEventListener('click', function() {
            const scrollPercentage = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
            trackMatomoEvent('User Engagement', 'Scroll Tracking', `Scroll Depth: ${scrollPercentage}%`, scrollPercentage);
            alert(`You've scrolled ${scrollPercentage}% down the page`);
        });
    }

    const timerBtn = document.getElementById('timer-btn');
    if (timerBtn) {
        timerBtn.addEventListener('click', function() {
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
                trackMatomoEvent('User Engagement', 'Timer Completed', `Spent ${timerSeconds} seconds`, timerSeconds);
                trackMatomoGoal(1, timerSeconds);
                alert(`Timer completed! You spent ${timerSeconds} seconds.`);
                this.textContent = 'Start Timer';
                timerSeconds = 0;
            } else {
                this.textContent = 'Stop Timer';
                timerSeconds = 0;
                timerInterval = setInterval(() => {
                    timerSeconds++;
                    if (timerSeconds % 10 === 0) {
                        trackMatomoEvent('User Engagement', 'Timer Running', `Timer: ${timerSeconds}s`, timerSeconds);
                    }
                }, 1000);
            }
        });
    }

    const goalBtn = document.getElementById('goal-btn');
    if (goalBtn) {
        goalBtn.addEventListener('click', function() {
            trackMatomoEvent('Conversions', 'Goal Completed', 'User Goal Achievement');
            trackMatomoGoal(2, 100);
            alert('Goal completed! This action was tracked.');
        });
    }
}

function initializeFormTracking() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            trackMatomoEvent('Form Submissions', 'Contact Form', data.subject, 1);
            trackMatomoEvent('Form Details', 'Interest', data.interest);
            trackMatomoGoal(3, 50);

            const formMessage = document.getElementById('form-message');
            if (formMessage) {
                formMessage.textContent = `Thank you ${data.name}! Your message has been received.`;
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';
            }

            setTimeout(() => {
                this.reset();
                if (formMessage) {
                    formMessage.style.display = 'none';
                }
            }, 3000);
        });
    }
}

function initializeSocialTracking() {
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const socialPlatform = this.textContent;
            trackMatomoEvent('Social Engagement', 'Social Button Click', socialPlatform);
            alert(`You clicked on: ${socialPlatform}`);
        });
    });
}

function trackScrollDepth() {
    let scrollDepthTracked = {};

    window.addEventListener('scroll', function() {
        const scrollPercentage = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        
        const milestones = [25, 50, 75, 100];
        milestones.forEach(milestone => {
            if (scrollPercentage >= milestone && !scrollDepthTracked[milestone]) {
                scrollDepthTracked[milestone] = true;
                trackMatomoEvent('Page Engagement', 'Scroll Depth', `${milestone}%`, milestone);
            }
        });
    });
}

function trackTimeOnPage() {
    let timeOnPageSeconds = 0;
    
    setInterval(function() {
        timeOnPageSeconds += 10;
        
        if (timeOnPageSeconds % 30 === 0) {
            trackMatomoEvent('User Engagement', 'Time on Page', `${timeOnPageSeconds} seconds`, timeOnPageSeconds);
        }
    }, 10000);
}

function trackLinkClicks() {
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && !link.classList.contains('social-btn') && !link.classList.contains('feature-btn')) {
            const href = link.getAttribute('href');
            const text = link.textContent;
            if (href && !href.startsWith('#')) {
                trackMatomoEvent('Link Clicks', 'Navigation', text || href);
            }
        }
    });
}

function trackPageVisibility() {
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            trackMatomoEvent('User Behavior', 'Page Hidden', document.title);
        } else {
            trackMatomoEvent('User Behavior', 'Page Visible', document.title);
        }
    });
}

function initializeAllTracking() {
    setTimeout(() => {
        if (window._paq) {
            initializeClickCounter();
            initializeFeatureButtons();
            initializeBlogReadButtons();
            initializeActionButtons();
            initializeFormTracking();
            initializeSocialTracking();
            trackScrollDepth();
            trackTimeOnPage();
            trackLinkClicks();
            trackPageVisibility();

            trackMatomoEvent('Page Load', 'Page Loaded', document.title);
        }
    }, 500);
}

window.addEventListener('beforeunload', function() {
    if (window._paq) {
        trackMatomoEvent('User Behavior', 'Page Unload', document.title);
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAllTracking);
} else {
    initializeAllTracking();
}
