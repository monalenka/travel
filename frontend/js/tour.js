import { loadHeader, loadFooter } from './main.js';
import { mockTours } from './mock-tours.js';

document.addEventListener('DOMContentLoaded', async () => {
    loadHeader();
    loadFooter();

    const urlParams = new URLSearchParams(window.location.search);
    const tourId = parseInt(urlParams.get('id')) || 1;

    await loadTourDetails(tourId);

    initBooking();

    showSimilarTours(tourId);

    initModal();
});

async function loadTourDetails(tourId) {
    try {
        let tour;

        if (window.API_AVAILABLE) {
            const response = await fetch(`/api/tours/${tourId}`);
            tour = await response.json();
        } else {
            tour = mockTours.find(t => t.id === tourId) || mockTours[0];
        }

        populateTourPage(tour);

    } catch (error) {
        console.error('Failed to load tour:', error);
        const tour = mockTours.find(t => t.id === tourId) || mockTours[0];
        populateTourPage(tour);
    }
}

function populateTourPage(tour) {
    document.getElementById('tour-title').textContent = tour.title;
    document.getElementById('tour-title-breadcrumb').textContent = tour.title;
    document.getElementById('tour-full-description').textContent = tour.description;
    document.getElementById('tour-price').textContent = tour.price;
    document.getElementById('tour-duration').innerHTML = `<i class="far fa-clock"></i> ${tour.duration}`;
    document.getElementById('tour-group').innerHTML = `<i class="fas fa-users"></i> ${tour.groupSize}`;

    if (tour.rating) {
        document.getElementById('tour-rating').textContent = tour.rating;
        document.getElementById('tour-reviews').textContent = `(${tour.reviews} reviews)`;
    }

    const mainImage = document.getElementById('tour-main-image');
    if (tour.image && tour.image.startsWith('http')) {
        mainImage.src = tour.image;
    } else {
        mainImage.src = `assets/${tour.image || 'default-tour.jpg'}`;
    }
    mainImage.alt = tour.title;

    const includesList = document.getElementById('tour-includes');
    if (tour.includes) {
        includesList.innerHTML = tour.includes.map(item =>
            `<li>${item}</li>`
        ).join('');
    }

    const scheduleContainer = document.getElementById('tour-schedule');
    if (tour.schedule) {
        scheduleContainer.innerHTML = tour.schedule.map(item => {
            const [time, activity] = item.split(' - ');
            return `
                <div class="timeline-item">
                    <div class="timeline-time">${time}</div>
                    <div class="timeline-activity">${activity}</div>
                </div>
            `;
        }).join('');
    }

    updatePriceCalculation();
}

function updatePriceCalculation() {
    const price = parseInt(document.getElementById('tour-price').textContent) || 0;
    const guests = parseInt(document.getElementById('tour-guests').value) || 2;
    const subtotal = price * guests;
    const total = subtotal + 10;

    document.getElementById('subtotal').textContent = `€${subtotal.toFixed(2)}`;
    document.getElementById('total-price').textContent = `€${total.toFixed(2)}`;
}

function initBooking() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    document.getElementById('tour-date').min = minDate;
    document.getElementById('tour-date').value = minDate;

    document.getElementById('tour-date').addEventListener('change', () => {
        console.log('Selected date:', document.getElementById('tour-date').value);
    });

    document.querySelector('.counter .minus').addEventListener('click', () => {
        const input = document.getElementById('tour-guests');
        let value = parseInt(input.value);
        if (value > 1) {
            input.value = value - 1;
            updatePriceCalculation();
        }
    });

    document.querySelector('.counter .plus').addEventListener('click', () => {
        const input = document.getElementById('tour-guests');
        let value = parseInt(input.value);
        if (value < 8) {
            input.value = value + 1;
            updatePriceCalculation();
        }
    });

    document.getElementById('book-now-btn').addEventListener('click', () => {
        showBookingModal();
    });
}

function showSimilarTours(currentTourId) {
    const similarTours = mockTours
        .filter(tour => tour.id !== currentTourId)
        .slice(0, 3);

    const container = document.getElementById('similar-tours');

    if (similarTours.length > 0) {
        container.innerHTML = similarTours.map(tour => `
            <div class="tour-card" data-id="${tour.id}">
                <img src="${tour.image || 'default-tour.jpg'}" 
                     alt="${tour.title}" class="tour-image">
                <div class="tour-content">
                    <h3 class="tour-title">${tour.title}</h3>
                    <p class="tour-description">${tour.description.substring(0, 80)}...</p>
                    <div class="tour-price">€${tour.price}</div>
                    <a href="tour.html?id=${tour.id}" class="btn btn-primary">View Details</a>
                </div>
            </div>
        `).join('');
    }
}

function initModal() {
    const modal = document.getElementById('booking-modal');
    const closeBtn = document.querySelector('.close-modal');

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

    const tourTitle = document.getElementById('tour-title').textContent;
    const price = document.getElementById('tour-price').textContent;
    const guests = document.getElementById('tour-guests').value;
    const date = document.getElementById('tour-date').value;
    const total = document.getElementById('total-price').textContent;

    form.innerHTML = `
        <div class="booking-summary">
            <h3>${tourTitle}</h3>
            <div class="summary-details">
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Travelers:</strong> ${guests} person(s)</p>
                <p><strong>Total:</strong> ${total}</p>
            </div>
        </div>
        
        <div class="form-group">
            <label for="full-name">Full Name *</label>
            <input type="text" id="full-name" required>
        </div>
        
        <div class="form-group">
            <label for="email">Email *</label>
            <input type="email" id="email" required>
        </div>
        
        <div class="form-group">
            <label for="phone">Phone Number *</label>
            <input type="tel" id="phone" required>
        </div>
        
        <div class="form-group">
            <label for="special-requests">Special Requests</label>
            <textarea id="special-requests" rows="3"></textarea>
        </div>
        
        <div class="form-group">
            <label class="checkbox">
                <input type="checkbox" required>
                I agree to the <a href="#">terms and conditions</a>
            </label>
        </div>
        
        <button type="submit" class="btn btn-primary">Confirm Booking</button>
    `;

    form.onsubmit = async (e) => {
        e.preventDefault();

        const formData = {
            tourId: new URLSearchParams(window.location.search).get('id'),
            date: date,
            guests: guests,
            total: total.replace('€', ''),
            customer: {
                name: document.getElementById('full-name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                requests: document.getElementById('special-requests').value
            }
        };

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Booking confirmed! Check your email for confirmation.');
                modal.classList.remove('active');
                //на страницу подтверждения
                // window.location.href = 'booking-confirmation.html';
            } else {
                alert('Failed to book. Please try again.');
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert('Network error. Please try again.');
        }
    };

    modal.classList.add('active');
}