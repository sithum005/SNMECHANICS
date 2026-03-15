// Lightbox Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Scroll Animations using Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 50);
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

    // Lightbox Functionality for Gallery
    setupLightbox();
});

function setupLightbox() {
    const galleryContainer = document.querySelector('#gallery-grid');
    if (!galleryContainer) return;

    // Create Lightbox DOM elements
    const lightboxOverlay = document.createElement('div');
    lightboxOverlay.id = 'lightbox-overlay';
    lightboxOverlay.className = 'fixed inset-0 bg-[#030712]/95 z-[100] hidden items-center justify-center opacity-0 transition-opacity duration-300 backdrop-blur-md';
    
    const lightboxImg = document.createElement('img');
    lightboxImg.id = 'lightbox-img';
    lightboxImg.className = 'max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl transform scale-95 transition-transform duration-300';
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
    closeBtn.className = 'absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200';
    
    // Add controls
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>';
    prevBtn.className = 'absolute left-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/5 hover:bg-white/20 transition-colors duration-200';

    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>';
    nextBtn.className = 'absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/5 hover:bg-white/20 transition-colors duration-200';

    lightboxOverlay.appendChild(prevBtn);
    lightboxOverlay.appendChild(lightboxImg);
    lightboxOverlay.appendChild(nextBtn);
    lightboxOverlay.appendChild(closeBtn);
    document.body.appendChild(lightboxOverlay);

    // Get all gallery images
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item img'));
    let currentIndex = 0;

    // Open Lightbox
    galleryItems.forEach((img, index) => {
        img.parentNode.addEventListener('click', () => {
            currentIndex = index;
            updateLightboxImage();
            
            lightboxOverlay.classList.remove('hidden');
            lightboxOverlay.classList.add('flex');
            // small delay to allow display flex to apply before opacity transition
            setTimeout(() => {
                lightboxOverlay.classList.remove('opacity-0');
                lightboxImg.classList.remove('scale-95');
                lightboxImg.classList.add('scale-100');
            }, 10);
            
            document.body.style.overflow = 'hidden'; // prevent background scrolling
        });
    });

    // Update Image Function
    function updateLightboxImage() {
        lightboxImg.src = galleryItems[currentIndex].src;
    }

    // Close Lightbox
    const closeLightbox = () => {
        lightboxOverlay.classList.add('opacity-0');
        lightboxImg.classList.remove('scale-100');
        lightboxImg.classList.add('scale-95');
        
        setTimeout(() => {
            lightboxOverlay.classList.add('hidden');
            lightboxOverlay.classList.remove('flex');
        }, 300); // match transition duration
        
        document.body.style.overflow = 'auto'; // restore scrolling
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) closeLightbox();
    });

    // Navigation
    const goPrev = () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : galleryItems.length - 1;
        updateLightboxImage();
    };

    const goNext = () => {
        currentIndex = (currentIndex < galleryItems.length - 1) ? currentIndex + 1 : 0;
        updateLightboxImage();
    };

    prevBtn.addEventListener('click', goPrev);
    nextBtn.addEventListener('click', goNext);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightboxOverlay.classList.contains('hidden')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'ArrowRight') goNext();
        }
    });
}
