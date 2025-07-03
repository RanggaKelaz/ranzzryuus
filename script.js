// Global Variables
let isLoggedIn = false;
let maintenanceMode = false;
let visitorCount = 0;
let pageViews = 0;

// Admin Credentials
const ADMIN_CREDENTIALS = {
    username: 'ranz',
    password: 'ranzryuu'
};

// Default Bio Content
const DEFAULT_BIO = `
<p>Selamat datang di dunia bayangan. Saya adalah Ranz, seorang yang hidup dalam kegelapan namun mencari cahaya.</p>
<p>Dalam perjalanan ini, saya berbagi cerita, pengalaman, dan pemikiran tentang kehidupan yang penuh misteri.</p>
`;

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Show loading screen
    showLoadingScreen();
    
    // Load saved data
    loadSavedData();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Update statistics
    updateStatistics();
    
    // Hide loading screen after 3 seconds
    setTimeout(() => {
        hideLoadingScreen();
    }, 3000);
}

function showLoadingScreen() {
    const loading = document.getElementById('loading');
    const mainContent = document.getElementById('main-content');
    
    if (loading) loading.classList.remove('hidden');
    if (mainContent) mainContent.classList.add('hidden');
}

function hideLoadingScreen() {
    const loading = document.getElementById('loading');
    const mainContent = document.getElementById('main-content');
    
    if (loading) loading.classList.add('hidden');
    if (mainContent) mainContent.classList.remove('hidden');
    
    // Check maintenance mode
    if (maintenanceMode) {
        showMaintenanceMode();
    }
}

function initializeEventListeners() {
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section') || this.textContent.toLowerCase().replace(' ', '');
            showSection(targetSection);
            setActiveNavLink(this);
        });
    });
    
    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update page views
    pageViews++;
    updateStatistics();
}

function setActiveNavLink(activeLink) {
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to clicked link
    activeLink.classList.add('active');
}

// WhatsApp Integration
function openWhatsApp() {
    const phoneNumber = '6281234567890'; // Replace with actual WhatsApp number
    const message = encodeURIComponent('Halo, saya butuh bantuan dari Ranz Shadow.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
}

// FAQ Functionality
function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector('i');
    
    if (answer.classList.contains('active')) {
        answer.classList.remove('active');
        if (icon) icon.style.transform = 'rotate(0deg)';
    } else {
        // Close all other FAQs
        const allAnswers = document.querySelectorAll('.faq-answer');
        const allIcons = document.querySelectorAll('.faq-question i');
        
        allAnswers.forEach(ans => ans.classList.remove('active'));
        allIcons.forEach(ic => ic.style.transform = 'rotate(0deg)');
        
        // Open clicked FAQ
        answer.classList.add('active');
        if (icon) icon.style.transform = 'rotate(180deg)';
    }
}

// Admin Login
function adminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        isLoggedIn = true;
        showAdminDashboard();
        showNotification('Login berhasil!', 'success');
        
        // Clear form
        document.getElementById('login-form').reset();
    } else {
        showNotification('Username atau password salah!', 'error');
    }
}

function showAdminDashboard() {
    const loginForm = document.getElementById('admin-login');
    const dashboard = document.getElementById('admin-dashboard');
    
    if (loginForm) loginForm.classList.add('hidden');
    if (dashboard) dashboard.classList.remove('hidden');
    
    // Load current bio to editor
    loadBioToEditor();
    
    // Update maintenance toggle
    const maintenanceToggle = document.getElementById('maintenance-toggle');
    if (maintenanceToggle) {
        maintenanceToggle.checked = maintenanceMode;
        updateMaintenanceStatus();
    }
}

function adminLogout() {
    isLoggedIn = false;
    
    const loginForm = document.getElementById('admin-login');
    const dashboard = document.getElementById('admin-dashboard');
    
    if (loginForm) loginForm.classList.remove('hidden');
    if (dashboard) dashboard.classList.add('hidden');
    
    showNotification('Logout berhasil!', 'success');
}

// Maintenance Mode
function toggleMaintenance() {
    const toggle = document.getElementById('maintenance-toggle');
    if (toggle) {
        maintenanceMode = toggle.checked;
        
        updateMaintenanceStatus();
        saveData();
        
        if (maintenanceMode) {
            showMaintenanceMode();
            showNotification('Mode maintenance diaktifkan!', 'warning');
        } else {
            hideMaintenanceMode();
            showNotification('Mode maintenance dinonaktifkan!', 'success');
        }
    }
}

function updateMaintenanceStatus() {
    const status = document.getElementById('maintenance-status');
    if (status) {
        status.textContent = maintenanceMode ? 'Aktif' : 'Nonaktif';
        status.style.color = maintenanceMode ? '#dc3545' : '#28a745';
    }
}

function showMaintenanceMode() {
    const overlay = document.getElementById('maintenance-overlay');
    if (overlay) overlay.classList.remove('hidden');
}

function hideMaintenanceMode() {
    const overlay = document.getElementById('maintenance-overlay');
    if (overlay) overlay.classList.add('hidden');
}

// Bio Management
function loadBioToEditor() {
    const bioDescription = document.getElementById('bio-description');
    const bioEditor = document.getElementById('bio-editor');
    
    if (bioDescription && bioEditor) {
        bioEditor.value = bioDescription.innerHTML.trim();
    }
}

function saveBio() {
    const bioEditor = document.getElementById('bio-editor');
    const bioDescription = document.getElementById('bio-description');
    
    if (bioEditor && bioDescription) {
        const newBio = bioEditor.value.trim();
        
        if (newBio) {
            // Convert line breaks to paragraphs
            const formattedBio = newBio.split('\n').map(line => 
                line.trim() ? `<p>${line.trim()}</p>` : ''
            ).join('');
            
            bioDescription.innerHTML = formattedBio;
            saveData();
            showNotification('Bio berhasil disimpan!', 'success');
        } else {
            showNotification('Bio tidak boleh kosong!', 'error');
        }
    }
}

function resetBio() {
    const bioEditor = document.getElementById('bio-editor');
    const bioDescription = document.getElementById('bio-description');
    
    if (bioEditor && bioDescription) {
        bioDescription.innerHTML = DEFAULT_BIO;
        bioEditor.value = DEFAULT_BIO.replace(/<p>/g, '').replace(/<\/p>/g, '\n').trim();
        
        saveData();
        showNotification('Bio berhasil direset!', 'success');
    }
}

function deleteBio() {
    if (confirm('Apakah Anda yakin ingin menghapus bio?')) {
        const bioEditor = document.getElementById('bio-editor');
        const bioDescription = document.getElementById('bio-description');
        
        if (bioEditor && bioDescription) {
            bioDescription.innerHTML = '<p>Bio belum diatur.</p>';
            bioEditor.value = '';
            
            saveData();
            showNotification('Bio berhasil dihapus!', 'success');
        }
    }
}

// Statistics
function updateStatistics() {
    // Increment visitor count on first visit
    if (!sessionStorage.getItem('visited')) {
        visitorCount++;
        sessionStorage.setItem('visited', 'true');
    }
    
    // Update display
    const visitorCountElement = document.getElementById('visitor-count');
    const pageViewsElement = document.getElementById('page-views');
    
    if (visitorCountElement) visitorCountElement.textContent = visitorCount;
    if (pageViewsElement) pageViewsElement.textContent = pageViews;
    
    saveData();
}

// Data Persistence
function saveData() {
    const bioDescription = document.getElementById('bio-description');
    const data = {
        maintenanceMode: maintenanceMode,
        visitorCount: visitorCount,
        pageViews: pageViews,
        bioContent: bioDescription ? bioDescription.innerHTML : DEFAULT_BIO
    };
    
    localStorage.setItem('ranzShadowData', JSON.stringify(data));
}

function loadSavedData() {
    const savedData = localStorage.getItem('ranzShadowData');
    
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            
            maintenanceMode = data.maintenanceMode || false;
            visitorCount = data.visitorCount || 0;
            pageViews = data.pageViews || 0;
            
            // Load bio content
            if (data.bioContent) {
                const bioDescription = document.getElementById('bio-description');
                if (bioDescription) {
                    bioDescription.innerHTML = data.bioContent;
                }
            }
        } catch (e) {
            console.error('Error loading saved data:', e);
        }
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Admin shortcut: Ctrl + Shift + A
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        showSection('admin');
        const adminLink = document.querySelector('[data-section="admin"]');
        if (adminLink) setActiveNavLink(adminLink);
    }
    
    // Home shortcut: Ctrl + H
    if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        showSection('home');
        const homeLink = document.querySelector('[data-section="home"]');
        if (homeLink) setActiveNavLink(homeLink);
    }
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        showNotification('🎮 Konami Code activated! You found the easter egg!', 'success');
        konamiCode = [];
        
        // Add special effect
        document.body.style.animation = 'rainbow 2s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }
});

// Performance optimization: Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// CSRF Token Management
function generateCSRFToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function getCSRFToken() {
    let token = sessionStorage.getItem('csrf_token');
    if (!token) {
        token = generateCSRFToken();
        sessionStorage.setItem('csrf_token', token);
    }
    return token;
}

function validateCSRFToken(token) {
    const storedToken = sessionStorage.getItem('csrf_token');
    return token === storedToken;
}

// Add CSRF token to forms
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = 'csrf_token';
        csrfInput.value = getCSRFToken();
        form.appendChild(csrfInput);
    });
});

// Enhanced admin login with CSRF protection
function adminLoginSecure(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const csrfToken = formData.get('csrf_token');
    
    // Validate CSRF token
    if (!validateCSRFToken(csrfToken)) {
        showNotification('CSRF token mismatch. Please refresh the page.', 'error');
        return;
    }
    
    const username = formData.get('username');
    const password = formData.get('password');
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        isLoggedIn = true;
        showAdminDashboard();
        showNotification('Login berhasil!', 'success');
        
        // Generate new CSRF token for next request
        sessionStorage.setItem('csrf_token', generateCSRFToken());
        
        // Clear form
        form.reset();
    } else {
        showNotification('Username atau password salah!', 'error');
    }
}

