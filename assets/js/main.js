// ===== MAIN.JS =====
// Non-critical JavaScript for GM Painting Contractors website

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('GM Painting Contractors website loaded');
    
    // Initialize all modules
    initModalSystem();
    initGallery();
    initFormValidation();
    initImageOptimization();
    initServiceCards();
    initReviewCarousel();
    initScrollAnimations();
    initPerformanceMonitoring();
    initErrorHandling();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize third-party integrations
    initThirdPartyIntegrations();
});

// ===== MODAL SYSTEM =====
function initModalSystem() {
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close, [data-modal-close]');
    
    // Open modal
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                openModal(modal);
            }
        });
    });
    
    // Close modal
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });
    
    // Close modal on outside click
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.active');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
    
    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus trap for accessibility
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
        
        // Dispatch custom event
        const event = new CustomEvent('modalOpened', { detail: { modal: modal } });
        document.dispatchEvent(event);
    }
    
    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Return focus to trigger
        const trigger = document.querySelector(`[data-modal-target="#${modal.id}"]`);
        if (trigger) {
            trigger.focus();
        }
        
        // Dispatch custom event
        const event = new CustomEvent('modalClosed', { detail: { modal: modal } });
        document.dispatchEvent(event);
    }
}

// ===== GALLERY SYSTEM =====
function initGallery() {
    const galleries = document.querySelectorAll('.gallery');
    
    galleries.forEach(gallery => {
        const mainImage = gallery.querySelector('.gallery-main-image');
        const thumbnails = gallery.querySelectorAll('.gallery-thumbnail');
        const prevBtn = gallery.querySelector('.gallery-prev');
        const nextBtn = gallery.querySelector('.gallery-next');
        const counter = gallery.querySelector('.gallery-counter');
        
        let currentIndex = 0;
        const images = Array.from(thumbnails);
        
        // Update gallery display
        function updateGallery() {
            if (mainImage && images[currentIndex]) {
                const img = images[currentIndex];
                const fullSizeSrc = img.getAttribute('data-fullsize') || img.src;
                
                // Load high-res image
                const loader = new Image();
                loader.src = fullSizeSrc;
                loader.onload = () => {
                    mainImage.src = fullSizeSrc;
                    mainImage.alt = img.alt || 'Gallery image';
                    
                    // Update active thumbnail
                    thumbnails.forEach((thumb, index) => {
                        thumb.classList.toggle('active', index === currentIndex);
                    });
                    
                    // Update counter
                    if (counter) {
                        counter.textContent = `${currentIndex + 1} / ${images.length}`;
                    }
                    
                    // Update ARIA labels
                    mainImage.setAttribute('aria-label', `Image ${currentIndex + 1} of ${images.length}: ${img.alt || ''}`);
                };
            }
        }
        
        // Thumbnail click
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                currentIndex = index;
                updateGallery();
            });
            
            thumb.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    currentIndex = index;
                    updateGallery();
                }
            });
        });
        
        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                updateGallery();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % images.length;
                updateGallery();
            });
        }
        
        // Keyboard navigation
        gallery.addEventListener('keydown', (e) => {
            if (document.activeElement.closest('.gallery') === gallery) {
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        currentIndex = (currentIndex - 1 + images.length) % images.length;
                        updateGallery();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        currentIndex = (currentIndex + 1) % images.length;
                        updateGallery();
                        break;
                    case 'Home':
                        e.preventDefault();
                        currentIndex = 0;
                        updateGallery();
                        break;
                    case 'End':
                        e.preventDefault();
                        currentIndex = images.length - 1;
                        updateGallery();
                        break;
                }
            }
        });
        
        // Swipe support for touch devices
        let touchStartX = 0;
        let touchEndX = 0;
        
        gallery.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        gallery.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left
                    currentIndex = (currentIndex + 1) % images.length;
                } else {
                    // Swipe right
                    currentIndex = (currentIndex - 1 + images.length) % images.length;
                }
                updateGallery();
            }
        }
        
        // Initialize gallery
        updateGallery();
    });
}

// ===== FORM VALIDATION =====
function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        const submitBtn = form.querySelector('[type="submit"]');
        
        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearError);
            
            // Remove placeholder on focus for better UX
            input.addEventListener('focus', function() {
                if (this.hasAttribute('data-placeholder')) {
                    this.setAttribute('placeholder', '');
                }
            });
            
            input.addEventListener('blur', function() {
                if (this.hasAttribute('data-placeholder') && !this.value) {
                    this.setAttribute('placeholder', this.getAttribute('data-placeholder'));
                }
            });
        });
        
        // Form submission
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // Disable submit button
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span class="spinner"></span>Sending...';
                }
                
                try {
                    // Form submission logic
                    const formData = new FormData(this);
                    const response = await submitForm(formData);
                    
                    if (response.success) {
                        showFormSuccess(this, response.message);
                    } else {
                        showFormError(this, response.message);
                    }
                } catch (error) {
                    showFormError(this, 'Network error. Please try again.');
                } finally {
                    // Re-enable submit button
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Send Message';
                    }
                }
            }
        });
        
        function validateField() {
            const field = this;
            const value = field.value.trim();
            const fieldName = field.name;
            let isValid = true;
            let message = '';
            
            // Required validation
            if (field.hasAttribute('required') && !value) {
                isValid = false;
                message = 'This field is required';
            }
            
            // Email validation
            if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    message = 'Please enter a valid email address';
                }
            }
            
            // Phone validation
            if (fieldName === 'phone' && value) {
                const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
                if (!phoneRegex.test(value)) {
                    isValid = false;
                    message = 'Please enter a valid phone number';
                }
            }
            
            // Set field state
            setFieldState(field, isValid, message);
            
            return isValid;
        }
        
        function clearError() {
            const field = this;
            field.classList.remove('error');
            
            const errorElement = field.parentElement.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
        }
        
        function setFieldState(field, isValid, message) {
            field.classList.toggle('error', !isValid);
            
            // Remove existing error message
            const existingError = field.parentElement.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            // Add new error message
            if (!isValid && message) {
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.textContent = message;
                errorElement.setAttribute('role', 'alert');
                field.parentElement.appendChild(errorElement);
            }
        }
        
        function validateForm(form) {
            let isValid = true;
            const fields = form.querySelectorAll('input, textarea, select');
            
            fields.forEach(field => {
                if (!validateField.call(field)) {
                    isValid = false;
                }
            });
            
            return isValid;
        }
    });
}

// ===== IMAGE OPTIMIZATION =====
function initImageOptimization() {
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Load image
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    // Load srcset
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                        img.removeAttribute('data-srcset');
                    }
                    
                    // Handle WebP with fallback
                    if (img.dataset.webp && img.dataset.fallback) {
                        const webp = new Image();
                        webp.onload = () => {
                            img.src = img.dataset.webp;
                        };
                        webp.onerror = () => {
                            img.src = img.dataset.fallback;
                        };
                        webp.src = img.dataset.webp;
                        
                        delete img.dataset.webp;
                        delete img.dataset.fallback;
                    }
                    
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px 0px',
            threshold: 0.01
        });
        
        // Observe all lazy images
        document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => {
            imageObserver.observe(img);
        });
        
        // Background images
        document.querySelectorAll('[data-bg]').forEach(element => {
            imageObserver.observe(element);
        });
    } else {
        // Fallback for older browsers
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
        });
    }
    
    // Responsive image handling
    function handleResponsiveImages() {
        const images = document.querySelectorAll('img[data-sizes]');
        
        images.forEach(img => {
            const viewportWidth = window.innerWidth;
            const sizes = JSON.parse(img.dataset.sizes);
            
            // Find appropriate image size
            let selectedSize = sizes[sizes.length - 1]; // Default to largest
            
            for (const size of sizes) {
                if (viewportWidth <= size.maxWidth) {
                    selectedSize = size;
                    break;
                }
            }
            
            // Update image if needed
            if (img.dataset.currentSize !== selectedSize.url) {
                img.src = selectedSize.url;
                img.dataset.currentSize = selectedSize.url;
            }
        });
    }
    
    // Debounced resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResponsiveImages, 250);
    });
    
    // Initial check
    handleResponsiveImages();
}

// ===== SERVICE CARDS =====
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        // Hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
            card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.25)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
        
        // Focus for keyboard navigation
        card.addEventListener('focus', () => {
            card.style.outline = '2px solid var(--accent)';
            card.style.outlineOffset = '4px';
        });
        
        card.addEventListener('blur', () => {
            card.style.outline = 'none';
        });
        
        // Click handler for service details
        card.addEventListener('click', function(e) {
            if (!e.target.closest('a') && !e.target.closest('button')) {
                const serviceId = this.getAttribute('data-service-id');
                if (serviceId) {
                    showServiceDetails(serviceId);
                }
            }
        });
        
        // Keyboard activation
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const serviceId = card.getAttribute('data-service-id');
                if (serviceId) {
                    showServiceDetails(serviceId);
                }
            }
        });
    });
    
    // Service details modal
    function showServiceDetails(serviceId) {
        // This would fetch service details from API or JSON
        console.log('Showing details for service:', serviceId);
        
        // For now, show a simple alert
        // In production, this would open a modal with detailed information
        const serviceTitles = {
            'interior': 'Interior Painting',
            'exterior': 'Exterior Painting',
            'roof': 'Roof Waterproofing',
            'woodwork': 'Woodwork Restoration',
            'specialized': 'Specialized Coatings',
            'maintenance': 'Property Maintenance'
        };
        
        const title = serviceTitles[serviceId] || 'Service Details';
        alert(`More information about ${title} coming soon!`);
    }
}

// ===== REVIEW CAROUSEL =====
function initReviewCarousel() {
    const carousels = document.querySelectorAll('.reviews-carousel');
    
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        const dotsContainer = carousel.querySelector('.carousel-dots');
        
        if (!track || slides.length === 0) return;
        
        let currentIndex = 0;
        let slideWidth = slides[0].offsetWidth;
        let autoSlideInterval;
        
        // Create dots if container exists
        if (dotsContainer) {
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot';
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
            updateDots();
        }
        
        // Navigation functions
        function goToSlide(index) {
            currentIndex = (index + slides.length) % slides.length;
            updateCarousel();
        }
        
        function nextSlide() {
            goToSlide(currentIndex + 1);
        }
        
        function prevSlide() {
            goToSlide(currentIndex - 1);
        }
        
        function updateCarousel() {
            slideWidth = slides[0].offsetWidth;
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            
            // Update active slide attributes
            slides.forEach((slide, index) => {
                slide.setAttribute('aria-hidden', index !== currentIndex);
                slide.classList.toggle('active', index === currentIndex);
            });
            
            // Update dots
            updateDots();
            
            // Update ARIA live region
            updateLiveRegion();
        }
        
        function updateDots() {
            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll('.carousel-dot');
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                    dot.setAttribute('aria-current', index === currentIndex);
                });
            }
        }
        
        function updateLiveRegion() {
            let liveRegion = carousel.querySelector('.carousel-live-region');
            if (!liveRegion) {
                liveRegion = document.createElement('div');
                liveRegion.className = 'carousel-live-region sr-only';
                liveRegion.setAttribute('aria-live', 'polite');
                liveRegion.setAttribute('aria-atomic', 'true');
                carousel.appendChild(liveRegion);
            }
            
            const slide = slides[currentIndex];
            const reviewer = slide.querySelector('.reviewer-name')?.textContent || '';
            liveRegion.textContent = `Now showing review by ${reviewer}`;
        }
        
        // Auto-slide
        function startAutoSlide() {
            if (carousel.hasAttribute('data-autoplay')) {
                const interval = parseInt(carousel.getAttribute('data-interval') || '5000');
                autoSlideInterval = setInterval(nextSlide, interval);
            }
        }
        
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }
        
        // Event listeners
        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
        }
        
        // Keyboard navigation
        carousel.addEventListener('keydown', (e) => {
            if (document.activeElement.closest('.reviews-carousel') === carousel) {
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        prevSlide();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        nextSlide();
                        break;
                    case 'Home':
                        e.preventDefault();
                        goToSlide(0);
                        break;
                    case 'End':
                        e.preventDefault();
                        goToSlide(slides.length - 1);
                        break;
                }
            }
        });
        
        // Pause autoplay on hover/focus
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
        carousel.addEventListener('focusin', stopAutoSlide);
        carousel.addEventListener('focusout', startAutoSlide);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            updateCarousel();
        });
        
        // Initialize
        updateCarousel();
        startAutoSlide();
        updateLiveRegion();
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // Intersection Observer for scroll animations
    if ('IntersectionObserver' in window) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Stagger children animations
                    const children = entry.target.querySelectorAll('[data-animate-child]');
                    children.forEach((child, index) => {
                        child.style.animationDelay = `${index * 0.1}s`;
                        child.classList.add('animate-in');
                    });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe elements with animation classes
        document.querySelectorAll('.fade-in, .slide-up, .scale-in').forEach(el => {
            fadeObserver.observe(el);
        });
        
        // Sticky header observer
        const header = document.querySelector('header');
        if (header) {
            const headerObserver = new IntersectionObserver(
                ([e]) => {
                    header.classList.toggle('stuck', e.intersectionRatio < 1);
                },
                { threshold: [1] }
            );
            
            headerObserver.observe(document.querySelector('.sticky-sentinel') || document.createElement('div'));
        }
        
        // Progress indicator
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            const progressObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const target = entry.target;
                            const progress = target.querySelector('.progress-fill');
                            const value = target.getAttribute('data-progress') || '0';
                            
                            if (progress) {
                                setTimeout(() => {
                                    progress.style.width = `${value}%`;
                                }, 300);
                            }
                        }
                    });
                },
                { threshold: 0.5 }
            );
            
            document.querySelectorAll('.progress-indicator').forEach(el => {
                progressObserver.observe(el);
            });
        }
    }
    
    // Smooth scroll to sections
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                const mobileOverlay = document.getElementById('mobileOverlay');
                if (mobileOverlay && mobileOverlay.classList.contains('active')) {
                    mobileOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
                
                // Smooth scroll
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Focus management for accessibility
                setTimeout(() => {
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                    targetElement.removeAttribute('tabindex');
                }, 1000);
            }
        });
    });
}

// ===== PERFORMANCE MONITORING =====
function initPerformanceMonitoring() {
    // Performance metrics
    if ('PerformanceObserver' in window) {
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            console.log('LCP:', lastEntry.startTime);
            // Send to analytics if needed
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay
        const fidObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                console.log('FID:', entry.processingStart - entry.startTime);
                // Send to analytics if needed
            });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        
        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    console.log('CLS:', entry.value);
                    // Send to analytics if needed
                }
            });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
    
    // Resource timing
    if ('performance' in window) {
        const resources = performance.getEntriesByType('resource');
        resources.forEach(resource => {
            if (resource.initiatorType === 'img') {
                console.log(`Image loaded: ${resource.name}, took ${resource.duration}ms`);
            }
        });
    }
    
    // Network status monitoring
    function updateConnectionStatus() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (connection) {
            const speed = connection.effectiveType;
            const saveData = connection.saveData;
            
            // Adjust content based on connection
            if (speed === 'slow-2g' || speed === '2g' || saveData) {
                document.documentElement.classList.add('save-data');
                console.log('Slow connection detected, enabling data-saving mode');
                
                // Disable autoplay videos
                document.querySelectorAll('video[autoplay]').forEach(video => {
                    video.autoplay = false;
                    video.controls = true;
                });
                
                // Load lower quality images
                document.querySelectorAll('img[data-low-quality]').forEach(img => {
                    if (img.dataset.lowQuality) {
                        img.src = img.dataset.lowQuality;
                    }
                });
            }
        }
    }
    
    // Listen for connection changes
    if ('connection' in navigator) {
        navigator.connection.addEventListener('change', updateConnectionStatus);
    }
    updateConnectionStatus();
}

// ===== ERROR HANDLING =====
function initErrorHandling() {
    // Global error handler
    window.addEventListener('error', function(e) {
        console.error('Global error:', e.error);
        
        // Send to error tracking service (e.g., Sentry)
        // logError(e.error);
        
        // Show user-friendly message for critical errors
        if (e.error.message.includes('Failed to fetch')) {
            showNetworkError();
        }
    });
    
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        // logError(e.reason);
    });
    
    // Network error handler
    function showNetworkError() {
        // Check if error notification already exists
        if (!document.querySelector('.network-error')) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'network-error';
            errorDiv.setAttribute('role', 'alert');
            errorDiv.innerHTML = `
                <p>⚠️ Network connection issue detected. Some features may not work properly.</p>
                <button onclick="this.parentElement.remove()">Dismiss</button>
            `;
            document.body.appendChild(errorDiv);
            
            // Auto-remove after 10 seconds
            setTimeout(() => {
                if (errorDiv.parentElement) {
                    errorDiv.remove();
                }
            }, 10000);
        }
    }
    
    // Form submission error handling
    async function submitForm(formData) {
        try {
            // Replace with your actual form submission endpoint
            const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                return {
                    success: true,
                    message: 'Message sent successfully!'
                };
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            throw error;
        }
    }
    
    function showFormSuccess(form, message) {
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.setAttribute('role', 'alert');
        successDiv.innerHTML = `
            <p>✅ ${message}</p>
            <p>We'll get back to you within 24 hours.</p>
        `;
        
        // Insert before form
        form.parentElement.insertBefore(successDiv, form);
        
        // Hide form
        form.style.display = 'none';
        
        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Clear form after success (optional)
        setTimeout(() => {
            form.reset();
            form.style.display = 'block';
            successDiv.remove();
        }, 5000); // Show success for 5 seconds
    }
    
    function showFormError(form, message) {
        // Show error near submit button
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error-message';
            errorDiv.setAttribute('role', 'alert');
            errorDiv.textContent = message;
            
            // Insert after submit button
            submitBtn.parentElement.insertBefore(errorDiv, submitBtn.nextSibling);
            
            // Remove after 5 seconds
            setTimeout(() => {
                if (errorDiv.parentElement) {
                    errorDiv.remove();
                }
            }, 5000);
        }
    }
}

// ===== EVENT LISTENERS SETUP =====
function setupEventListeners() {
    // Back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.innerHTML = '↑';
    document.body.appendChild(backToTopBtn);
    
    // Show/hide back to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Print page button (for service quotes)
    const printBtn = document.querySelector('.print-page');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
    
    // Share page functionality
    const shareBtn = document.querySelector('.share-page');
    if (shareBtn && navigator.share) {
        shareBtn.style.display = 'block';
        shareBtn.addEventListener('click', async () => {
            try {
                await navigator.share({
                    title: document.title,
                    text: 'Check out GM Painting Contractors',
                    url: window.location.href
                });
            } catch (error) {
                console.log('Sharing cancelled or failed:', error);
            }
        });
    }
    
    // Dark/light mode toggle (if implemented)
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update button text
            themeToggle.innerHTML = newTheme === 'dark' ? '🌙' : '☀️';
            themeToggle.setAttribute('aria-label', `Switch to ${newTheme === 'dark' ? 'light' : 'dark'} mode`);
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            themeToggle.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
            themeToggle.setAttribute('aria-label', `Switch to ${savedTheme === 'dark' ? 'light' : 'dark'} mode`);
        }
    }
    
    // Cookie consent (if needed)
    const cookieConsent = document.querySelector('.cookie-consent');
    if (cookieConsent) {
        const acceptBtn = cookieConsent.querySelector('.accept-cookies');
        const declineBtn = cookieConsent.querySelector('.decline-cookies');
        
        // Check if consent already given
        if (!localStorage.getItem('cookiesAccepted')) {
            cookieConsent.style.display = 'block';
        }
        
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                localStorage.setItem('cookiesAccepted', 'true');
                cookieConsent.style.display = 'none';
                // Initialize analytics here
            });
        }
        
        if (declineBtn) {
            declineBtn.addEventListener('click', () => {
                localStorage.setItem('cookiesAccepted', 'false');
                cookieConsent.style.display = 'none';
            });
        }
    }
}

// ===== THIRD-PARTY INTEGRATIONS =====
function initThirdPartyIntegrations() {
    // Google Maps integration (if needed)
    if (document.querySelector('#map')) {
        loadGoogleMaps();
    }
    
    // WhatsApp integration
    const whatsappButtons = document.querySelectorAll('[data-whatsapp]');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const phone = this.getAttribute('data-whatsapp') || '27790349035';
            const message = encodeURIComponent(this.getAttribute('data-message') || 'Hi, I would like to get a quote for painting services.');
            const url = `https://wa.me/${phone}?text=${message}`;
            window.open(url, '_blank');
        });
    });
    
    // Email integration
    const emailButtons = document.querySelectorAll('[data-email]');
    emailButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const email = this.getAttribute('data-email') || 'gareth@gmcontractors.co.za';
            const subject = encodeURIComponent(this.getAttribute('data-subject') || 'Painting Services Inquiry');
            const body = encodeURIComponent(this.getAttribute('data-body') || 'Hello, I would like more information about your painting services.');
            const url = `mailto:${email}?subject=${subject}&body=${body}`;
            window.location.href = url;
        });
    });
    
    // Social media sharing
    const socialShareButtons = document.querySelectorAll('[data-social-share]');
    socialShareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.getAttribute('data-social-share');
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            
            let shareUrl;
            switch(platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
                default:
                    return;
            }
            
            window.open(shareUrl, '_blank', 'width=600,height=400');
        });
    });
}

// ===== UTILITY FUNCTIONS =====
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
    };
}

function formatPhoneNumber(phone) {
    // Format South African phone numbers
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{3})(\d{4})$/);
    if (match) {
        return '+27 ' + match[1] + ' ' + match[2] + ' ' + match[3];
    }
    return phone;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ===== PUBLIC API (if needed) =====
// Expose some functions to global scope if needed for inline handlers
window.GMContractors = {
    openModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },
    
    closeModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },
    
    scrollToSection: function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            window.scrollTo({
                top: section.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    },
    
    requestQuote: function(serviceType) {
        // Pre-fill contact form with service type
        const serviceSelect = document.querySelector('#service');
        if (serviceSelect) {
            serviceSelect.value = serviceType;
        }
        
        // Scroll to contact form
        this.scrollToSection('contact');
        
        // Focus on name field
        setTimeout(() => {
            const nameField = document.querySelector('#name');
            if (nameField) {
                nameField.focus();
            }
        }, 1000);
    }
};

// ===== SERVICE WORKER REGISTRATION =====
// Uncomment to enable PWA features
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}
*/

// ===== ANALYTICS INTEGRATION =====
// Uncomment and configure your analytics
/*
function initAnalytics() {
    // Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'YOUR-GA-ID');
    
    // Facebook Pixel
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', 'YOUR-PIXEL-ID');
    fbq('track', 'PageView');
}
*/

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    // Main initialization
    console.log('Initializing GM Painting Contractors website');
}