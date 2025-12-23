// Detect mobile device
const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Global error handler to prevent page crashes
let errorCount = 0;
const MAX_ERRORS = 10;

window.addEventListener('error', function(event) {
    errorCount++;
    console.error('Global error caught:', event.error);
    
    // If too many errors, disable problematic features
    if (errorCount > MAX_ERRORS) {
        console.warn('Too many errors detected, disabling advanced features');
        // Disable carousel auto-play
        document.querySelectorAll('.carousel-container').forEach(container => {
            container.style.pointerEvents = 'none';
        });
    }
    
    // Prevent the error from breaking the page
    event.preventDefault();
    return true;
});

window.addEventListener('unhandledrejection', function(event) {
    errorCount++;
    console.error('Unhandled promise rejection:', event.reason);
    
    // If too many errors, disable problematic features
    if (errorCount > MAX_ERRORS) {
        console.warn('Too many promise rejections, disabling advanced features');
    }
    
    // Prevent the rejection from breaking the page
    event.preventDefault();
});

// Carousel functionality
class Carousel {
    constructor(carouselId) {
        // carouselId is the ID of the track element (e.g., "signs-carousel")
        this.track = document.getElementById(carouselId);
        if (!this.track) {
            console.error(`Carousel track not found: ${carouselId}`);
            return;
        }
        
        // Refresh items list to get all current images
        this.items = this.track.querySelectorAll('.carousel-item');
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        
        if (this.items.length === 0) {
            console.log(`No images found for carousel: ${carouselId}`);
            return;
        }
        
        console.log(`Initializing carousel ${carouselId} with ${this.items.length} images`);
        
        // Set initial position
        this.goToSlide(0);
        
        this.init();
    }
    
    // Refresh items list (call this if images are added dynamically)
    refreshItems() {
        this.items = this.track.querySelectorAll('.carousel-item');
        if (this.currentIndex >= this.items.length) {
            this.currentIndex = 0;
        }
    }
    
    init() {
        // Only auto-play on desktop - disable on mobile to prevent issues
        if (!isMobileDevice) {
            // Set up auto-play
            this.startAutoPlay();
            
            // Pause on hover - find the container parent (desktop only)
            const container = this.track.closest('.carousel-container');
            if (container) {
                container.addEventListener('mouseenter', () => this.stopAutoPlay());
                container.addEventListener('mouseleave', () => this.startAutoPlay());
            }
        } else {
            // On mobile, just show the first image, no auto-play
            console.log('Mobile device detected - auto-play disabled for carousel');
        }
    }
    
    goToSlide(index) {
        // Refresh items in case new ones were added
        this.refreshItems();
        
        if (this.items.length === 0) return;
        
        // Ensure index is within bounds
        if (index < 0) index = this.items.length - 1;
        if (index >= this.items.length) index = 0;
        
        this.currentIndex = index;
        const translateX = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${translateX}%)`;
        
        console.log(`Carousel slide ${this.currentIndex + 1} of ${this.items.length}`);
    }
    
    next() {
        if (this.items.length === 0) return;
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this.goToSlide(this.currentIndex);
    }
    
    prev() {
        if (this.items.length === 0) return;
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.goToSlide(this.currentIndex);
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, 4000); // Change slide every 4 seconds
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Background images removed - using solid colors only

// Shuffle array function (Fisher-Yates algorithm)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Load background images from Misc folder for specific sections
async function loadSectionBackgrounds() {
    try {
        const response = await fetch('images/manifest.json');
        if (response.ok) {
            const manifest = await response.json();
            if (manifest.misc && manifest.misc.length > 0) {
                const images = manifest.misc;
                
                // Apply background image to hero section (logo and "Design.Create.Repeat." area)
                if (images.length > 0) {
                    const heroSection = document.querySelector('.hero');
                    if (heroSection) {
                        // Use different image for mobile vs desktop
                        let imageIndex = 0; // Default: first image for desktop
                        if (isMobileDevice && images.length > 1) {
                            // For mobile, use the second image (index 1) if available
                            imageIndex = 1;
                        }
                        
                        const imageData = images[imageIndex];
                        const imagePath = imageData.path || imageData;
                        const fullImagePath = imagePath.startsWith('http') ? imagePath : (imagePath.startsWith('/') ? imagePath : `./${imagePath}`);
                        
                        heroSection.style.backgroundImage = `
                            linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.5) 100%),
                            url('${fullImagePath}')
                        `;
                        heroSection.style.backgroundSize = 'cover';
                        heroSection.style.backgroundPosition = 'center';
                        
                        // Use scroll attachment on mobile for better performance
                        if (isMobileDevice) {
                            heroSection.style.backgroundAttachment = 'scroll';
                        } else {
                            heroSection.style.backgroundAttachment = 'fixed';
                        }
                        
                        console.log(`Applied background to hero (${isMobileDevice ? 'mobile' : 'desktop'}): ${fullImagePath}`);
                    }
                }
                
                // Apply image to trust section (Bringing Your Vision to Life)
                // Use first image on mobile, second image on desktop
                const trustSection = document.querySelector('.trust-section');
                if (trustSection) {
                    let imageIndex = 1; // Default: second image for desktop
                    if (isMobileDevice && images.length > 0) {
                        imageIndex = 0; // First image for mobile
                    } else if (!isMobileDevice && images.length > 1) {
                        imageIndex = 1; // Second image for desktop
                    } else if (images.length > 0) {
                        imageIndex = 0; // Fallback to first image
                    }
                    
                    if (images[imageIndex]) {
                        const imageData = images[imageIndex];
                        const imagePath = imageData.path || imageData;
                        const fullImagePath = imagePath.startsWith('http') ? imagePath : (imagePath.startsWith('/') ? imagePath : `./${imagePath}`);
                        
                        // Set background-size and position based on device type
                        if (isMobileDevice) {
                            // Mobile: darker overlay (10% more opacity) and ensure it covers full height
                            trustSection.style.backgroundImage = `
                                linear-gradient(135deg, rgba(50, 50, 50, 0.77) 0%, rgba(40, 40, 40, 0.66) 100%),
                                url('${fullImagePath}')
                            `;
                            trustSection.style.backgroundSize = 'cover, 225% auto';
                            trustSection.style.backgroundPosition = 'center calc(50% + 25px), center calc(50% - 50px)';
                            trustSection.style.backgroundAttachment = 'scroll';
                            trustSection.style.backgroundRepeat = 'no-repeat';
                        } else {
                            // Desktop: original overlay
                            trustSection.style.backgroundImage = `
                                linear-gradient(135deg, rgba(50, 50, 50, 0.7) 0%, rgba(40, 40, 40, 0.6) 100%),
                                url('${fullImagePath}')
                            `;
                            trustSection.style.backgroundSize = 'cover';
                            trustSection.style.backgroundPosition = 'center';
                            trustSection.style.backgroundAttachment = 'fixed';
                        }
                        
                        console.log(`Applied background to trust section (${isMobileDevice ? 'mobile' : 'desktop'}, image ${imageIndex}): ${fullImagePath}`);
                    }
                }
                
                // Apply third image to CTA section (Ready to Start Your Project?)
                if (images.length > 2) {
                    const ctaSection = document.querySelector('.cta-section');
                    if (ctaSection && images[2]) {
                        const imagePath = images[2].path || images[2];
                        ctaSection.style.backgroundImage = `
                            linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.6) 100%),
                            url('${imagePath}')
                        `;
                        ctaSection.style.backgroundSize = 'cover';
                        ctaSection.style.backgroundPosition = 'center';
                        ctaSection.style.backgroundAttachment = 'fixed';
                        console.log(`Applied background to CTA section: ${imagePath}`);
                    }
                }
                
                // Apply second image to about hero section (About Design.Create.Repeat.)
                if (images.length > 1) {
                    const aboutHeroSection = document.querySelector('.about-hero');
                    if (aboutHeroSection && images[1]) {
                        const imagePath = images[1].path || images[1];
                        aboutHeroSection.style.backgroundImage = `
                            linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.5) 100%),
                            url('${imagePath}')
                        `;
                        aboutHeroSection.style.backgroundSize = 'cover';
                        aboutHeroSection.style.backgroundPosition = 'center';
                        aboutHeroSection.style.backgroundAttachment = 'fixed';
                        console.log(`Applied background to about hero section: ${imagePath}`);
                    }
                }
                
                // Apply background images to commitment list items (Consultation, Design, Production, Delivery)
                if (images.length > 0) {
                    const commitmentListItems = document.querySelectorAll('.commitment-list li');
                    commitmentListItems.forEach((item, index) => {
                        // Cycle through available images
                        const imageIndex = index % images.length;
                        const imagePath = images[imageIndex].path || images[imageIndex];
                        item.style.backgroundImage = `url('${imagePath}')`;
                        console.log(`Applied background to commitment list item ${index + 1}: ${imagePath}`);
                    });
                }
            }
        }
    } catch (error) {
        console.log('Could not load background images from manifest');
    }
}

// Load service card background images
async function loadServiceCardBackgrounds() {
    try {
        const response = await fetch('images/manifest.json');
        if (response.ok) {
            const manifest = await response.json();
            const serviceCategories = ['signs', 'jewelry', 'decor', 'personalized', 'stickers', 'stencils', 'custom', 'events'];
            
            console.log('Loading service card backgrounds...');
            serviceCategories.forEach(category => {
                const bgKey = `${category}-bg`;
                const serviceCard = document.querySelector(`.service-card[data-target="${category}"]`);
                
                if (manifest[bgKey] && manifest[bgKey].length > 0) {
                    // Use the first image from the folder
                    let imagePath = manifest[bgKey][0].path || manifest[bgKey][0];
                    // Encode the path to handle spaces and special characters
                    imagePath = encodeURI(imagePath);
                    
                    if (serviceCard) {
                        // Apply overlay directly to the background image
                        const fullImagePath = imagePath.startsWith('http') ? imagePath : (imagePath.startsWith('/') ? imagePath : `./${imagePath}`);
                        serviceCard.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${fullImagePath}')`;
                        serviceCard.style.backgroundSize = 'cover';
                        serviceCard.style.backgroundPosition = 'center';
                        serviceCard.style.backgroundRepeat = 'no-repeat';
                        console.log(`✅ Applied background to ${category} service card: ${fullImagePath}`);
                    } else {
                        console.warn(`⚠️ Service card not found for category: ${category}`);
                    }
                } else {
                    console.log(`ℹ️ No background image found for ${category} (folder: service-${category})`);
                }
            });
        } else {
            console.error('Failed to fetch manifest.json');
        }
    } catch (error) {
        console.error('Error loading service card background images:', error);
    }
}

// Initialize carousels when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load background images first
        try {
            await loadSectionBackgrounds();
        } catch (error) {
            console.error('Error loading section backgrounds:', error);
        }
        
        // Load service card backgrounds
        try {
            await loadServiceCardBackgrounds();
        } catch (error) {
            console.error('Error loading service card backgrounds:', error);
        }
        
        // Load images for each carousel category
        const categories = ['signs', 'jewelry', 'decor', 'personalized', 'stickers', 'stencils', 'custom', 'events'];
        
        // Load all images with error handling for each category
        try {
            await Promise.allSettled(categories.map(category => 
                loadCarouselImages(category).catch(error => {
                    console.error(`Error loading images for ${category}:`, error);
                    return null; // Continue even if one category fails
                })
            ));
        } catch (error) {
            console.error('Error loading carousel images:', error);
        }
        
        // On mobile, use shorter timeout and simpler initialization
        const waitTime = isMobileDevice ? 200 : 500;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        // Initialize carousels after images are loaded
        categories.forEach(category => {
            try {
                const carouselId = `${category}-carousel`;
                const carouselTrack = document.getElementById(carouselId);
                if (carouselTrack) {
                    // Only initialize if there are actual images (not just placeholder)
                    const images = carouselTrack.querySelectorAll('.carousel-item');
                    const hasImages = images.length > 0;
                    
                    if (hasImages) {
                        console.log(`Found ${images.length} images for ${category}, initializing carousel...`);
                        
                        // On mobile, skip waiting for all images to load - just initialize immediately
                        if (isMobileDevice) {
                            try {
                                // Simple initialization on mobile - no waiting
                                setTimeout(() => {
                                    try {
                                        carousels[category] = new Carousel(carouselId);
                                    } catch (error) {
                                        console.error(`Error initializing carousel for ${category}:`, error);
                                    }
                                }, 100);
                            } catch (error) {
                                console.error(`Error setting up carousel for ${category}:`, error);
                            }
                        } else {
                            // Desktop: Wait for images to fully load
                            const imagePromises = Array.from(images).map(item => {
                                try {
                                    const img = item.querySelector('img') || item;
                                    if (img.tagName === 'IMG' && img.complete && img.naturalWidth > 0) return Promise.resolve();
                                    if (img.tagName === 'IMG') {
                                        return new Promise((resolve) => {
                                            img.onload = resolve;
                                            img.onerror = resolve; // Continue even if some images fail
                                            setTimeout(resolve, 3000); // Timeout after 3 seconds
                                        });
                                    }
                                    return Promise.resolve(); // For placeholders or non-img elements
                                } catch (error) {
                                    console.error(`Error processing image in ${category}:`, error);
                                    return Promise.resolve(); // Continue even on error
                                }
                            });
                            
                            Promise.all(imagePromises).then(() => {
                                try {
                                    console.log(`Initializing carousel for ${category}`);
                                    carousels[category] = new Carousel(carouselId);
                                } catch (error) {
                                    console.error(`Error initializing carousel for ${category}:`, error);
                                }
                            }).catch(error => {
                                console.error(`Error waiting for images in ${category}:`, error);
                            });
                        }
                    } else {
                        console.log(`No images found for ${category}`);
                    }
                }
            } catch (error) {
                console.error(`Error setting up carousel for ${category}:`, error);
            }
        });
        
        // Set up carousel navigation buttons
        try {
            setupCarouselButtons();
        } catch (error) {
            console.error('Error setting up carousel buttons:', error);
        }
    } catch (error) {
        console.error('Critical error during page initialization:', error);
        // Ensure page content is still visible even if JavaScript fails
        document.body.style.display = 'block';
    }
});

// Load images from folder for each category
async function loadCarouselImages(category) {
    try {
        const carouselTrack = document.getElementById(`${category}-carousel`);
        if (!carouselTrack) {
            console.warn(`Carousel track not found for category: ${category}`);
            return;
        }
        
        // First, try to load from manifest.json (best method)
        try {
            const response = await fetch(`images/manifest.json`);
            if (response.ok) {
                const manifest = await response.json();
                if (manifest[category] && manifest[category].length > 0) {
                    // Randomize the order of images before adding to carousel
                    const shuffledImages = shuffleArray(manifest[category]);
                    // Use Promise.allSettled to handle async HEIC conversion - continue even if some fail
                    await Promise.allSettled(shuffledImages.map(imageData => 
                        addImageToCarousel(category, imageData.path, imageData.alt).catch(error => {
                            console.error(`Error adding image ${imageData.path} to ${category}:`, error);
                            return null; // Continue even if one image fails
                        })
                    ));
                    return; // Successfully loaded from manifest
                }
            }
        } catch (error) {
            // Manifest doesn't exist or failed to load, try alternative method
            console.log(`Manifest not found for ${category}, trying alternative loading...`, error);
        }
    
    // Alternative: Try multiple naming patterns to find images
    const commonExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.JPG', '.JPEG', '.PNG', '.WEBP', '.HEIC', '.HEIF'];
    const maxAttempts = 50; // Try up to 50 images per category
    
    let loadedCount = 0;
    const loadedPaths = new Set(); // Track loaded images to avoid duplicates
    const foundImages = []; // Collect all found images first, then shuffle
    
    // Try multiple naming patterns
    const namingPatterns = [
        (i, ext) => `${category}${i}${ext}`,           // signs1.jpg
        (i, ext) => `${category}_${i}${ext}`,         // signs_1.jpg
        (i, ext) => `${category}-${i}${ext}`,         // signs-1.jpg
        (i, ext) => `image${i}${ext}`,                // image1.jpg
        (i, ext) => `img${i}${ext}`,                  // img1.jpg
        (i, ext) => `${i}${ext}`,                     // 1.jpg
        (i, ext) => `${String(i).padStart(2, '0')}${ext}`, // 01.jpg
        (i, ext) => `${category}_${String(i).padStart(2, '0')}${ext}`, // signs_01.jpg
    ];
    
    // Try each pattern
    for (const pattern of namingPatterns) {
        for (let i = 1; i <= maxAttempts; i++) {
            for (const ext of commonExtensions) {
                const filename = pattern(i, ext);
                const imagePath = `images/${category}/${filename}`;
                
                // Skip if we've already loaded this path
                if (loadedPaths.has(imagePath)) continue;
                
                const img = new Image();
                
                // For HEIC files, we need to convert them first
                if (isHeicFile(imagePath)) {
                    // Try to fetch and convert HEIC
                    try {
                        const response = await fetch(imagePath);
                        if (response.ok) {
                            foundImages.push({ path: imagePath, alt: `${category} product ${i}` });
                            loadedPaths.add(imagePath);
                            loadedCount++;
                        }
                    } catch (error) {
                        // HEIC file doesn't exist or can't be loaded
                    }
                } else {
                    // For regular image formats, check if they exist
                    const imageLoaded = await new Promise((resolve) => {
                        img.onload = () => {
                            if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        };
                        img.onerror = () => resolve(false);
                        img.src = imagePath;
                    });
                    
                    if (imageLoaded) {
                        foundImages.push({ path: imagePath, alt: `${category} product ${i}` });
                        loadedPaths.add(imagePath);
                        loadedCount++;
                    }
                }
            }
        }
    }
    
    // Randomize and add all found images to carousel
    if (foundImages.length > 0) {
        const shuffledImages = shuffleArray(foundImages);
        await Promise.all(shuffledImages.map(imageData => 
            addImageToCarousel(category, imageData.path, imageData.alt)
        ));
    }
    
    // If no images were loaded, show placeholder
    if (loadedCount === 0 && carouselTrack.children.length === 0) {
        const placeholder = document.createElement('div');
        placeholder.className = 'carousel-item carousel-placeholder';
        placeholder.style.cssText = `
            min-width: 100%;
            background: rgba(60, 40, 25, 0.5);
            border: 2px dashed rgba(212, 175, 55, 0.3);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-light);
            font-size: 18px;
            text-align: center;
            padding: 20px;
            position: relative;
        `;
        placeholder.innerHTML = `Add images to images/${category}/ folder<br><small style="font-size: 14px; margin-top: 10px; display: block;">Supported: image1.jpg, ${category}1.jpg, 1.jpg, etc.<br>Or run: node generate-manifest.js</small>`;
        carouselTrack.appendChild(placeholder);
    }
    } catch (error) {
        console.error(`Error in loadCarouselImages for ${category}:`, error);
        // Ensure the page doesn't break - continue execution
    }
}

// Setup carousel navigation buttons
function setupCarouselButtons() {
    const prevButtons = document.querySelectorAll('.carousel-prev');
    const nextButtons = document.querySelectorAll('.carousel-next');
    
    prevButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const carouselId = btn.getAttribute('data-carousel');
            const carouselInstance = carousels[carouselId];
            if (carouselInstance) {
                carouselInstance.prev();
            }
        });
    });
    
    nextButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const carouselId = btn.getAttribute('data-carousel');
            const carouselInstance = carousels[carouselId];
            if (carouselInstance) {
                carouselInstance.next();
            }
        });
    });
}

// Store carousel instances
const carousels = {};

// Re-initialize carousels after images are potentially added
function reinitializeCarousels() {
    const categories = ['signs', 'jewelry', 'decor', 'personalized', 'stickers', 'stencils', 'custom', 'events'];
    categories.forEach(category => {
        const carouselId = `${category}-carousel`;
        const carouselElement = document.getElementById(carouselId);
        if (carouselElement && !carousels[category]) {
            carousels[category] = new Carousel(carouselId);
        }
    });
}

// Contact functionality removed - buttons now use direct mailto: links

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Service card click handlers - scroll to corresponding carousel
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card[data-target]');
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const target = card.getAttribute('data-target');
            
            // Check if we're on the about page
            if (window.location.pathname.includes('about.html')) {
                // Navigate to main page gallery section
                window.location.href = `index.html#gallery`;
            } else {
                // On main page, scroll to corresponding carousel
                const carouselSection = document.querySelector(`#gallery .carousel-section:nth-of-type(${getCarouselIndex(target)})`);
                
                if (carouselSection) {
                    const headerOffset = 80;
                    const elementPosition = carouselSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// Helper function to get carousel index based on category
function getCarouselIndex(category) {
    const categoryOrder = ['signs', 'jewelry', 'decor', 'personalized', 'stickers', 'stencils', 'custom', 'events'];
    return categoryOrder.indexOf(category) + 1; // +1 because nth-of-type is 1-indexed
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Function to convert HEIC to JPEG/PNG
async function convertHeicToWebFormat(heicFile) {
    try {
        // Check if heic2any is available
        if (typeof heic2any === 'undefined') {
            console.warn('heic2any library not loaded, skipping HEIC conversion');
            return null;
        }
        
        // This function should never be called on mobile (checked earlier), but double-check
        if (isMobileDevice) {
            console.warn('HEIC conversion skipped on mobile devices:', heicFile);
            return null;
        }
        
        console.log(`Fetching HEIC file: ${heicFile}`);
        // Fetch the HEIC file as a blob with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        let response;
        try {
            response = await fetch(heicFile, { signal: controller.signal });
            clearTimeout(timeoutId);
        } catch (fetchError) {
            clearTimeout(timeoutId);
            if (fetchError.name === 'AbortError') {
                console.error(`Timeout fetching HEIC file: ${heicFile}`);
            } else {
                console.error(`Error fetching HEIC file: ${heicFile}`, fetchError);
            }
            return null;
        }
        
        if (!response.ok) {
            console.error(`Failed to fetch HEIC file: ${heicFile} - Status: ${response.status}`);
            return null;
        }
        
        const blob = await response.blob();
        if (blob.size === 0) {
            console.error(`Empty blob for HEIC file: ${heicFile}`);
            return null;
        }
        console.log(`Fetched blob for ${heicFile}, size: ${blob.size} bytes`);
        
        // Convert HEIC to JPEG with timeout
        console.log(`Starting HEIC conversion for: ${heicFile}`);
        const conversionPromise = heic2any({
            blob: blob,
            toType: 'image/jpeg',
            quality: 0.9
        });
        
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('HEIC conversion timeout')), 15000)
        );
        
        const convertedBlob = await Promise.race([conversionPromise, timeoutPromise]);
        
        // heic2any returns an array, get the first item
        const jpegBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        if (!jpegBlob) {
            console.error(`Conversion failed for ${heicFile} - no blob returned`);
            return null;
        }
        
        // Create object URL from the converted blob
        const objectUrl = URL.createObjectURL(jpegBlob);
        console.log(`Successfully converted HEIC to JPEG: ${heicFile}`);
        return objectUrl;
    } catch (error) {
        console.error(`Error converting HEIC file ${heicFile}:`, error);
        return null;
    }
}

// Function to check if file is HEIC
function isHeicFile(filePath) {
    const ext = filePath.toLowerCase();
    return ext.endsWith('.heic') || ext.endsWith('.heif');
}

// Function to add image to carousel (used by loadCarouselImages)
async function addImageToCarousel(category, imagePath, altText = '') {
    const carouselTrack = document.getElementById(`${category}-carousel`);
    if (!carouselTrack) {
        console.error(`Carousel track not found for ${category}`);
        return;
    }
    
    // Remove placeholder if it exists
    const placeholder = carouselTrack.querySelector('.carousel-placeholder');
    if (placeholder) {
        placeholder.remove();
    }
    
    // Check if image already exists to avoid duplicates
    const existingImages = carouselTrack.querySelectorAll('.carousel-item img');
    for (let existingImg of existingImages) {
        const imgSrc = existingImg.src || existingImg.getAttribute('src');
        if (imgSrc && (imgSrc.includes(imagePath) || imgSrc.endsWith(imagePath))) {
            return; // Image already added
        }
    }
    
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'carousel-item';
    
    const img = document.createElement('img');
    img.alt = altText || `${category} product`;
    img.loading = 'lazy';
    
    // Handle HEIC files - skip entirely on mobile
    if (isHeicFile(imagePath)) {
        if (isMobileDevice) {
            // On mobile, skip HEIC files completely to prevent crashes
            console.warn(`Skipping HEIC file on mobile: ${imagePath}`);
            imgWrapper.style.display = 'none';
            return; // Don't add to carousel
        }
        
        console.log(`Converting HEIC file: ${imagePath}`);
        try {
            const convertedUrl = await convertHeicToWebFormat(imagePath);
            if (convertedUrl) {
                img.src = convertedUrl;
                console.log(`Successfully converted and loaded HEIC: ${imagePath}`);
            } else {
                console.error(`Failed to convert HEIC file: ${imagePath} - conversion returned null`);
                imgWrapper.style.display = 'none';
                return; // Don't add to carousel if conversion failed
            }
        } catch (error) {
            console.error(`Error processing HEIC file ${imagePath}:`, error);
            imgWrapper.style.display = 'none';
            return; // Don't add to carousel if error occurred
        }
    } else {
        img.src = imagePath;
    }
    
    // Handle image load errors gracefully
    img.onerror = function() {
        console.warn(`Failed to load image: ${imagePath}`);
        imgWrapper.style.display = 'none';
    };
    
    img.onload = function() {
        console.log(`Successfully loaded image: ${imagePath}`);
    };
    
    imgWrapper.appendChild(img);
    carouselTrack.appendChild(imgWrapper);
    console.log(`Added image to ${category} carousel: ${imagePath}`);
}

