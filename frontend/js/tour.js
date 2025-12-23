import { loadHeader } from './main.js';

document.addEventListener('DOMContentLoaded', async () => {
    loadHeader();

    const urlParams = new URLSearchParams(window.location.search);
    const tourId = urlParams.get('id');

    console.log('Current URL:', window.location.href);
    console.log('Tour ID from query:', tourId);

    if (!tourId) {
        console.error('❌ No tour ID found in URL');

        const pathId = window.location.pathname.split('/').pop().replace('.html', '');
        const hashId = window.location.hash.replace('#', '');

        const finalId = tourId || pathId || hashId;

        if (finalId && finalId !== 'tour') {
            console.log('Found ID in URL path/hash:', finalId);
            await loadTourDetails(finalId);
        } else {
            showError('Please select a tour from our catalog.');
            return;
        }
    } else {
        await loadTourDetails(tourId);
    }
});


async function loadTourDetails(tourId) {
    try {
        console.log('🔍 Loading tour with ID:', tourId);

        const isObjectId = /^[0-9a-fA-F]{24}$/.test(tourId);
        console.log('Is ObjectId?', isObjectId);

        const apiUrl = `http://localhost:5000/api/tours/${tourId}`;
        console.log('API URL:', apiUrl);

        const response = await fetch(apiUrl);

        if (!response.ok) {
            if (response.status === 404) {
                console.log('Tour not found by ID, trying to find by index...');

                const allToursResponse = await fetch('http://localhost:5000/api/tours');
                const allData = await allToursResponse.json();
                const allTours = allData.data || allData;

                const index = parseInt(tourId);
                if (!isNaN(index) && allTours[index]) {
                    console.log('Found tour by index:', index);
                    const tour = allTours[index];
                    populateTourPage(tour);
                    initBooking(tour);
                    return;
                }

                throw new Error('Tour not found in the database');
            }
            throw new Error(`Server error: ${response.status}`);
        }

        const tour = await response.json();
        console.log('✅ Tour data loaded:', tour);

        populateTourPage(tour);
        initBooking(tour);

    } catch (error) {
        console.error('❌ Failed to load tour:', error);
        showError(error.message || 'Failed to load tour details. Please try again.');
    }
}

function populateTourPage(tour) {
    console.log('Populating page with tour:', tour);

    const titleElement = document.getElementById('tour-title');
    const breadcrumbElement = document.getElementById('tour-title-breadcrumb');

    if (titleElement) titleElement.textContent = tour.title;
    if (breadcrumbElement) breadcrumbElement.textContent = tour.title;

    const descriptionElement = document.getElementById('tour-full-description');
    if (descriptionElement) descriptionElement.textContent = tour.description;

    const price = tour.basePrice || 99;
    const priceElement = document.getElementById('tour-price');
    if (priceElement) priceElement.textContent = price;

    const durationElement = document.getElementById('tour-duration');
    const groupElement = document.getElementById('tour-group');

    if (durationElement) {
        durationElement.innerHTML = `<i class="far fa-clock"></i> ${tour.duration || 'Full Day'}`;
    }

    if (groupElement) {
        groupElement.innerHTML = `<i class="fas fa-users"></i> ${tour.groupSize || 'Small Group'}`;
    }

    const ratingElement = document.getElementById('tour-rating');
    if (ratingElement && tour.rating) {
        ratingElement.textContent = tour.rating;
    }

    const mainImage = document.getElementById('tour-main-image');
    if (mainImage) {
        if (tour.coverImage) {
            let imagePath = tour.coverImage;
            if (!imagePath.startsWith('http') && !imagePath.startsWith('/')) {
                imagePath = `/${imagePath}`;
            }
            mainImage.src = imagePath;
        } else {
            mainImage.src = '/images/default-tour.jpg';
        }
        mainImage.alt = tour.title;
    }

    const includesList = document.getElementById('tour-includes');
    if (includesList) {
        if (tour.includes && Array.isArray(tour.includes) && tour.includes.length > 0) {
            includesList.innerHTML = tour.includes.map(item =>
                `<li>${item}</li>`
            ).join('');
        } else {
            includesList.innerHTML = `
                <li>Professional licensed guide</li>
                <li>Transportation in comfortable vehicle</li>
                <li>Bottled water</li>
                <li>Hotel pickup and drop-off (central Nice)</li>
            `;
        }
    }

    const scheduleContainer = document.getElementById('tour-schedule');
    if (scheduleContainer) {
        if (tour.highlights && Array.isArray(tour.highlights) && tour.highlights.length > 0) {
            const times = ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '04:00 PM'];
            scheduleContainer.innerHTML = tour.highlights.map((highlight, index) => {
                const time = times[index] || `${9 + index * 2}:00 ${index < 2 ? 'AM' : 'PM'}`;
                return `
                    <div class="timeline-item">
                        <div class="timeline-time">${time}</div>
                        <div class="timeline-activity">${highlight}</div>
                    </div>
                `;
            }).join('');
        } else {
            scheduleContainer.innerHTML = `
                <div class="timeline-item">
                    <div class="timeline-time">09:00 AM</div>
                    <div class="timeline-activity">Hotel pickup in Nice</div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-time">10:00 AM</div>
                    <div class="timeline-activity">First destination exploration</div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-time">01:00 PM</div>
                    <div class="timeline-activity">Lunch break (optional)</div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-time">03:00 PM</div>
                    <div class="timeline-activity">Continue tour of attractions</div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-time">06:00 PM</div>
                    <div class="timeline-activity">Return to Nice and hotel drop-off</div>
                </div>
            `;
        }
    }

    updatePriceCalculation();
}

function updatePriceCalculation() {
    const priceElement = document.getElementById('tour-price');
    const guestsElement = document.getElementById('tour-guests');

    if (!priceElement || !guestsElement) return;

    const price = parseInt(priceElement.textContent) || 0;
    const guests = parseInt(guestsElement.value) || 2;
    const subtotal = price * guests;
    const total = subtotal + 10; // Service

    const subtotalRow = document.querySelector('.total-row:first-child span:first-child');
    if (subtotalRow) {
        subtotalRow.textContent = `Tour Price (${guests} person${guests > 1 ? 's' : ''})`;
    }

    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total-price');

    if (subtotalElement) subtotalElement.textContent = `€${subtotal.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `€${total.toFixed(2)}`;
}

function initBooking(tour) {
    console.log('Initializing booking for tour:', tour);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    const dateInput = document.getElementById('tour-date');

    if (dateInput) {
        dateInput.min = minDate;
        dateInput.value = minDate;
    }

    const minusBtn = document.querySelector('.counter .minus');
    const plusBtn = document.querySelector('.counter .plus');
    const guestsInput = document.getElementById('tour-guests');

    if (minusBtn && guestsInput) {
        minusBtn.addEventListener('click', () => {
            let value = parseInt(guestsInput.value);
            if (value > 1) {
                guestsInput.value = value - 1;
                updatePriceCalculation();
            }
        });
    }

    if (plusBtn && guestsInput) {
        plusBtn.addEventListener('click', () => {
            let value = parseInt(guestsInput.value);
            const maxGuests = parseInt(guestsInput.max) || 8;
            if (value < maxGuests) {
                guestsInput.value = value + 1;
                updatePriceCalculation();
            }
        });
    }

    const bookBtn = document.getElementById('book-now-btn');
    if (bookBtn) {
        bookBtn.addEventListener('click', () => {
            showBookingModal();
        });
    }

    updatePriceCalculation();
}

async function showSimilarTours(currentTourId) {
    try {
        console.log('Loading similar tours, excluding:', currentTourId);

        const response = await fetch('http://localhost:5000/api/tours');
        if (!response.ok) throw new Error('Failed to load tours');

        const result = await response.json();
        const allTours = result.data || result;

        const similarTours = allTours
            .filter(tour => tour._id !== currentTourId)
            .slice(0, 3);

        const container = document.getElementById('similar-tours');
        if (!container) return;

        if (similarTours.length > 0) {
            container.innerHTML = similarTours.map(tour => `
                <div class="tour-card">
                    <img src="${tour.coverImage ?
                    (tour.coverImage.startsWith('http') ? tour.coverImage : `/${tour.coverImage}`) :
                    '/images/default-tour.jpg'}" 
                         alt="${tour.title}" 
                         class="tour-image">
                    <div class="tour-content">
                        <h3 class="tour-title">${tour.title}</h3>
                        <p class="tour-description">${(tour.description || '').substring(0, 80)}...</p>
                        <div class="tour-price">
                            €${tour.basePrice || '99'}
                        </div>
                        <a href="tour.html?id=${tour._id}" class="btn btn-primary">
                            View Details
                        </a>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p style="text-align: center;">No similar tours available.</p>';
        }

    } catch (error) {
        console.error('Failed to load similar tours:', error);
        const container = document.getElementById('similar-tours');
        if (container) {
            container.innerHTML = '<p style="text-align: center;">Unable to load similar tours.</p>';
        }
    }
}

function showError(message) {
    console.error('Showing error:', message);

    const mainContent = document.querySelector('.tour-main-content');
    const sidebar = document.querySelector('.tour-booking-sidebar');
    const similarTours = document.querySelector('.similar-tours');

    if (sidebar) sidebar.style.display = 'none';
    if (similarTours) similarTours.style.display = 'none';

    if (mainContent) {
        mainContent.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; background: white; border-radius: 10px; box-shadow: var(--shadow);">
                <i class="fas fa-exclamation-circle" style="font-size: 4rem; color: var(--primary); margin-bottom: 20px;"></i>
                <h2 style="color: var(--dark); margin-bottom: 15px;">Tour Not Available</h2>
                <p style="color: var(--text); margin-bottom: 30px; font-size: 1.1rem;">${message}</p>
                <a href="private-tours.html" class="btn btn-primary" style="padding: 12px 30px;">
                    <i class="fas fa-arrow-left"></i> Back to All Tours
                </a>
            </div>
        `;
    }
}

function initModal() {
    const modal = document.getElementById('booking-modal');
    const closeBtn = document.querySelector('.close-modal');

    if (!modal || !closeBtn) {
        console.warn('Modal elements not found');
        return;
    }

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

function showBookingModal() {
    const modal = document.getElementById('booking-modal');
    const form = document.getElementById('booking-form');

    if (!modal || !form) return;

    const tourTitle = document.getElementById('tour-title')?.textContent || 'Tour';
    const price = document.getElementById('tour-price')?.textContent || '99';
    const guests = document.getElementById('tour-guests')?.value || '2';
    const date = document.getElementById('tour-date')?.value || new Date().toISOString().split('T')[0];
    const total = document.getElementById('total-price')?.textContent || '€208.00';

    form.innerHTML = `
        <div style="background: var(--light); padding: 20px; border-radius: 10px; margin-bottom: 25px;">
            <h3 style="margin-top: 0; color: var(--dark);">${tourTitle}</h3>
            <div style="color: var(--text);">
                <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>Travelers:</strong> ${guests} person${guests > 1 ? 's' : ''}</p>
                <p><strong>Total:</strong> ${total}</p>
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--dark);">Full Name *</label>
            <input type="text" id="full-name" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px;">
        </div>
        
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--dark);">Email *</label>
            <input type="email" id="email" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px;">
        </div>
        
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--dark);">Phone Number</label>
            <input type="tel" id="phone" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px;">
        </div>
        
        <div style="margin-bottom: 25px;">
            <label style="display: flex; align-items: flex-start; gap: 10px; color: var(--text);">
                <input type="checkbox" required style="margin-top: 3px;">
                <span>I agree to the <a href="#" style="color: var(--primary); text-decoration: none;">terms and conditions</a></span>
            </label>
        </div>
        
        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 15px; font-size: 1.1rem;">
            <i class="fas fa-calendar-check"></i> Confirm Booking
        </button>
        
        <p style="text-align: center; margin-top: 15px; color: var(--text); font-size: 0.9rem;">
            You'll receive confirmation by email within 24 hours.
        </p>
    `;

    form.onsubmit = async (e) => {
        e.preventDefault();

        const bookingData = {
            tourTitle: tourTitle,
            date: date,
            guests: parseInt(guests),
            total: total,
            customerName: document.getElementById('full-name').value,
            customerEmail: document.getElementById('email').value,
            customerPhone: document.getElementById('phone').value
        };

        console.log('Booking submitted:', bookingData);

        await new Promise(resolve => setTimeout(resolve, 1500));

        alert('✅ Thank you! Your booking request has been received.\nWe will contact you shortly to confirm.');
        modal.classList.remove('active');
    };

    modal.classList.add('active');
}

if (typeof window !== 'undefined') {
    window.updatePriceCalculation = updatePriceCalculation;
    window.showBookingModal = showBookingModal;
}