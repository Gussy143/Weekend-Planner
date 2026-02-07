/**
 * iOS-Style Navigation Controller
 * Minimal, smooth screen transitions
 */

// Screen navigation state
const screens = {
    'home': document.getElementById('screen-home'),
    'trip-detail': document.getElementById('screen-trip-detail'),
    'create-trip': document.getElementById('screen-create-trip'),
    'join-trip': document.getElementById('screen-join-trip'),
    'schedule': null // Placeholder for future screen
};

let currentScreen = 'home';

/**
 * Navigate to a different screen with iOS-like transition
 */
function navigateTo(screenId) {
    if (!screens[screenId]) {
        console.warn(`Screen "${screenId}" not found`);
        return;
    }
    
    // Hide current screen
    const current = screens[currentScreen];
    if (current) {
        current.classList.remove('active');
    }
    
    // Show new screen
    const next = screens[screenId];
    next.classList.add('active');
    
    // Scroll to top smoothly
    window.scrollTo({
        top: 0,
        behavior: 'instant'
    });
    
    currentScreen = screenId;
}

/**
 * Initialize navigation handlers
 */
function initNavigation() {
    // Handle all elements with data-navigate attribute
    document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-navigate]');
        if (target) {
            const targetScreen = target.getAttribute('data-navigate');
            navigateTo(targetScreen);
        }
    });
    
    // Handle browser back button
    window.addEventListener('popstate', () => {
        navigateTo('home');
    });
}

/**
 * Optional: Add haptic feedback on iOS devices
 */
function addHapticFeedback() {
    if ('vibrate' in navigator) {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.list-item, .primary-button, .nav-back, .nav-action')) {
                navigator.vibrate(10); // Very light tap
            }
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initNavigation();
        addHapticFeedback();
    });
} else {
    initNavigation();
    addHapticFeedback();
}

// Prevent pull-to-refresh on iOS
let touchStartY = 0;
document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop === 0 && touchY > touchStartY) {
        e.preventDefault();
    }
}, { passive: false });
