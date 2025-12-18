import { loadHeader, loadFooter } from './main.js';

document.addEventListener('DOMContentLoaded', async () => {
    loadHeader();
    loadFooter();

    setActiveNavLink();

    await loadAllTours();

    initSorting();

    initPagination();

    initMobileMenu();
});

async function loadAllTours() {
    const container = document.getElementById('all-tours-container');
    if (!container) return;

    try {
        const response = await fetch('/api/tours');
        const tours = await response.json();

        window.allTours = tours;

        displayTours(tours);

    } catch (error) {
        console.error('Failed to load tours:', error);
        container.innerHTML = `
            <div class="error-message">
                <p>Failed to load tours. Please try again later.</p>
                <button onclick="loadAllTours()" class="btn btn-primary">Retry</button>
            </div>
        `;
    }
}

function displayTours(tours) {
    const container = document.getElementById('all-tours-container');

    if (tours.length === 0) {
        container.innerHTML = `
            <div class="no-tours">
                <p>No tours found.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = tours.map(tour => createTourCard(tour)).join('');

    addTourCardListeners();
}

function createTourCard(tour) {
    return `
        <div class="tour-card" data-id="${tour.id}" data-price="${tour.price}" 
             data-duration="${tour.duration || 'full'}" data-popular="${tour.popular || 0}">
            <div class="tour-badge">${tour.popular ? '🔥 Popular' : '⭐ New'}</div>
            <img src="${tour.image || 'default-tour.jpg'}" 
                 alt="${tour.title}" class="tour-image">
            <div class="tour-content">
                <div class="tour-meta">
                    <span class="tour-duration">⏱️ ${tour.duration || 'Full Day'}</span>
                    <span class="tour-group">👥 ${tour.groupSize || 'Small Group'}</span>
                </div>
                <h3 class="tour-title">${tour.title}</h3>
                <p class="tour-description">${tour.description.substring(0, 120)}...</p>
                
                <div class="tour-footer">
                    <div class="tour-price">
                        <span class="price">€${tour.price}</span>
                        <span class="per-person">per person</span>
                    </div>
                    <button class="btn btn-primary view-details" data-id="${tour.id}">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `;
}

function initSorting() {
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const sortType = this.dataset.sort;
            let tours = [...(window.allTours || [])];

            if (tours.length > 0) {
                const sortedTours = sortTours(tours, sortType);
                displayTours(sortedTours);
            }
        });
    });
}

function sortTours(tours, sortType) {
    const sorted = [...tours];

    switch (sortType) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'popular':
        default:
            return sorted.sort((a, b) => (b.popular || 0) - (a.popular || 0));
    }
}

function addTourCardListeners() {
    document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const tourId = this.dataset.id;
            showTourDetails(tourId);
        });
    });

    document.querySelectorAll('.tour-card').forEach(card => {
        card.addEventListener('click', function (e) {
            if (!e.target.closest('.view-details')) {
                const tourId = this.dataset.id;
                showTourDetails(tourId);
            }
        });
    });
}

function showTourDetails(tourId) {
    window.location.href = `tour.html?id=${tourId}`;
}

function initPagination() {
}

function setActiveNavLink() {
    const toursLink = document.getElementById('tours-link');
    if (toursLink) {
        toursLink.classList.add('active');
    }

    document.querySelectorAll('.nav-link[href="/tours.html"]')
        .forEach(link => link.classList.add('active'));
}

function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuBtn.textContent = '☰';
            });
        });
    }
}