document.addEventListener('DOMContentLoaded', async () => {
    console.log('Site loaded');

    loadHeader();

    await loadTours();

    initInteractiveElements();
});

const mockTours = [
    {
        id: 1,
        title: "Monaco & Monte-Carlo Half-Day Tour",
        description: "Experience luxury and glamour on this half-day tour to Monaco and Monte Carlo. Visit the Prince's Palace, the Monte Carlo Casino, and enjoy breathtaking views.",
        price: 89,
        duration: "Half Day (5 hours)",
        groupSize: "Small Group (max 8)",
        image: "assets/monaco-tour.jpg",
        popular: true,
        rating: 4.9,
        reviews: 128
    },
    {
        id: 2,
        title: "Cannes & Antibes Full Day Tour",
        description: "Discover the glamour of Cannes and the charm of Antibes. Walk the famous Croisette Boulevard, visit the Film Festival Palace.",
        price: 129,
        duration: "Full Day (9 hours)",
        groupSize: "Small Group (max 8)",
        image: "assets/cannes-tour.jpg",
        popular: true,
        rating: 4.8,
        reviews: 96
    },
    {
        id: 3,
        title: "Saint-Tropez & Port Grimaud",
        description: "Visit the legendary Saint-Tropez and the charming 'Venice of Provence'. See celebrity yachts, explore narrow streets.",
        price: 149,
        duration: "Full Day (10 hours)",
        groupSize: "Small Group (max 8)",
        image: "assets/saint-tropez-tour.jpg",
        popular: false,
        rating: 4.7,
        reviews: 74
    }
];

const API_BASE_URL = 'http://localhost:5000/api';

async function loadTours() {
    const container = document.getElementById('tours-container');
    if (!container) return;

    container.innerHTML = '<div class="loading">Loading tours...</div>';

    try {
        const response = await fetch(`${API_BASE_URL}/tours`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        const tours = result.data || result;

        if (tours && tours.length > 0) {
            console.log('✅ Using backend data:', tours.length, 'tours');
            displayTours(tours.slice(0, 3));
        } else {
            throw new Error('Backend returned empty data');
        }

    } catch (error) {
        console.log('⚠️ Backend unavailable, using mock data:', error.message);
        displayTours(mockTours);
    }
}

async function fetchWithTimeout(url, timeout = 3000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

function displayTours(tours) {
    const container = document.getElementById('tours-container');

    container.innerHTML = tours.map(tour => `
        <div class="tour-card" data-id="${tour.id}">
            ${tour.popular ? '<div class="tour-badge">🔥 Popular</div>' : ''}
            <img src="${tour.image}" 
                 alt="${tour.title}" 
                 class="tour-image"
                 onerror="this.src='https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80'">
            <div class="tour-content">
                <h3 class="tour-title">${tour.title}</h3>
                <p class="tour-description">${tour.description.substring(0, 100)}...</p>
                <div class="tour-meta">
                    <span class="tour-duration">${tour.duration || 'Full Day'}</span>
                    <span class="tour-group">${tour.groupSize || 'Small Group'}</span>
                </div>
                <div class="tour-price">€${tour.price}</div>
                <button class="btn btn-primary view-details" data-id="${tour.id}">
                    View Details
                </button>
            </div>
        </div>
    `).join('');
}

function initInteractiveElements() {
    document.addEventListener('click', (e) => {
        const tourCard = e.target.closest('.tour-card');
        const viewBtn = e.target.closest('.view-details');

        if (tourCard && !viewBtn) {
            const tourId = tourCard.dataset.id;
            showTourModal(tourId);
        }

        if (viewBtn) {
            const tourId = viewBtn.dataset.id;
            showTourDetails(tourId);
        }

        if (e.target.matches('.btn-primary') && e.target.getAttribute('href') === '#tours') {
            e.preventDefault();
            document.getElementById('tours').scrollIntoView({ behavior: 'smooth' });
        }

        if (e.target.closest('.language-switcher')) {
            const switcher = e.target.closest('.language-switcher');
            switcher.classList.toggle('active');
        }
    });

    initMobileMenu();
}

function showTourDetails(tourId) {
    window.location.href = `tour.html?id=${tourId}`;
}

function showTourModal(tourId) {
    console.log('Showing modal for tour:', tourId);
}

function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }
}

export function loadHeader() {
    const header = document.getElementById('main-header');
    if (header) {
        header.innerHTML = `
            <nav class="main-nav">
                <div class="container">
                    <div class="nav-left">
                        <a href="/" class="logo">
                            <img src="images/logos/logo.jpg" alt="Nice Tours" class="logo-image">
                            <span class="logo-text">Nice Tours</span>
                        </a>
                    </div>
                    
                    <div class="nav-links">
                        <a href="index.html" class="nav-link active">Home</a>
                        <a href="smallgroup-tours.html?category=small-group" class="nav-link">Smallgroup tours</a>
                        <a href="private-tours.html?category=private" class="nav-link">Private tours</a>
                        <a href="shore-excursions.html?category=shore-excursion" class="nav-link">Shore excursions</a>
                        <a href="destinations.html?category=destination" class="nav-link">Our destinations</a>
                        
                        <div class="language-switcher">
                            <button class="language-toggle" aria-label="Change language">
                                <span class="language-current">EN</span>
                                <i class="fas fa-chevron-down"></i>
                            </button>
                            <div class="language-dropdown">
                                <button class="language-option" data-lang="en">English</button>
                                <button class="language-option" data-lang="fr">Français</button>
                                <button class="language-option" data-lang="de">Deutsch</button>
                                <button class="language-option" data-lang="ru">Русский</button>
                            </div>
                        </div>
                    </div>
                    
                    <button class="mobile-menu-btn" aria-label="Menu">☰</button>
                </div>
            </nav>
        `;

        initLanguageSwitcher();
        initNavigation();
    }
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });
}

function initLanguageSwitcher() {
    const switcher = document.querySelector('.language-switcher');
    const toggle = document.querySelector('.language-toggle');
    const currentLang = document.querySelector('.language-current');
    const options = document.querySelectorAll('.language-option');

    if (!switcher) return;

    document.addEventListener('click', (e) => {
        if (!switcher.contains(e.target)) {
            switcher.classList.remove('active');
        }
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.dataset.lang;
            currentLang.textContent = lang.toUpperCase();
            switcher.classList.remove('active');

            console.log('Language changed to:', lang);

            if (lang !== 'en') {
                alert('Language switcher is currently a placeholder. Real functionality will be implemented later.');
            }
        });
    });
}


export { loadTours };