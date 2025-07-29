const deleteBtn = document.querySelectorAll('.del')
const todoItem = document.querySelectorAll('span.not')
const todoComplete = document.querySelectorAll('span.completed')
const resubmitOrder = document.querySelectorAll('.resubmit-order')

Array.from(resubmitOrder).forEach((el)=>{
    el.addEventListener('click', submitOldOrder)
})

async function submitOldOrder(){
    const oldOrder = this.parentNode.querySelector('.prev-order p').textContent;
    const oldNotes = this.parentNode.querySelector('.prev-notes p').textContent;
    const hasOrdered = this.parentNode.querySelector('#hasOrdered').value;
    try{
        if (hasOrdered){
            const response = await fetch('orders/resubmitOrder', {
                method: 'post',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({
                    'userOrderChanges': oldOrder,
                    'notesChanges': oldNotes,
                })
            })
            location.reload()
        }else{
            console.log('resubmitting order')
            const response = await fetch('orders/resubmitOrder', {
                method: 'post',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({
                    'userOrder': oldOrder,
                    'notes': oldNotes,
                })
            })
            location.reload()
        }
    }catch(err){
        console.log(err)
    }
}

// Dropdown form functionality
function toggleForm(event) {
    const formContainer = event.currentTarget.parentElement;
    const allContainers = document.querySelectorAll('.form-container');
    
    // Close all other forms
    allContainers.forEach(container => {
        if (container !== formContainer && container.classList.contains('expanded')) {
            container.classList.remove('expanded');
        }
    });
    
    // Toggle current form
    formContainer.classList.toggle('expanded');
}

// Carousel functionality
const carousels = {};

function initCarousel(trackId) {
    const track = document.getElementById(trackId);
    if (!track) return;
    
    const items = track.querySelectorAll('.carousel-item');
    const paginationContainer = document.getElementById(trackId.replace('Track', 'Pagination'));
    
    if (items.length === 0) return;
    
    carousels[trackId] = {
        currentIndex: 0,
        totalItems: items.length,
        track: track,
        items: items
    };
    
    // Create pagination dots
    if (paginationContainer) {
        paginationContainer.innerHTML = '';
        for (let i = 0; i < items.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(trackId, i));
            paginationContainer.appendChild(dot);
        }
    }
    
    updateCarousel(trackId);
}

function updateCarousel(trackId) {
    const carousel = carousels[trackId];
    if (!carousel) return;
    
    // Ensure currentIndex is within bounds
    carousel.currentIndex = Math.max(0, Math.min(carousel.currentIndex, carousel.totalItems - 1));
    
    const translateX = -carousel.currentIndex * 100;
    carousel.track.style.transform = `translateX(${translateX}%)`;
    
    // Update pagination
    const paginationContainer = document.getElementById(trackId.replace('Track', 'Pagination'));
    if (paginationContainer) {
        const dots = paginationContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === carousel.currentIndex);
        });
    }
}

function nextSlide(trackId) {
    const carousel = carousels[trackId];
    if (!carousel) return;
    
    if (carousel.currentIndex < carousel.totalItems - 1) {
        carousel.currentIndex++;
    } else {
        carousel.currentIndex = 0; // Loop back to first
    }
    updateCarousel(trackId);
}

function prevSlide(trackId) {
    const carousel = carousels[trackId];
    if (!carousel) return;
    
    if (carousel.currentIndex > 0) {
        carousel.currentIndex--;
    } else {
        carousel.currentIndex = carousel.totalItems - 1; // Loop to last
    }
    updateCarousel(trackId);
}

function goToSlide(trackId, index) {
    const carousel = carousels[trackId];
    if (!carousel) return;
    
    carousel.currentIndex = Math.max(0, Math.min(index, carousel.totalItems - 1));
    updateCarousel(trackId);
}

// Theme toggle functionality
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update button icon
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    themeToggle.addEventListener('click', toggleTheme);
    document.body.appendChild(themeToggle);
    
    // Initialize carousels
    const tracks = document.querySelectorAll('[id$="Track"]');
    tracks.forEach(track => {
        initCarousel(track.id);
    });
});

// Touch/swipe support for mobile - Fixed to not interfere with buttons
let startX = 0;
let currentX = 0;
let isDragging = false;
let activeTrackId = null;

document.addEventListener('touchstart', function(e) {
    // Don't handle touch if it's on a button or control
    if (e.target.closest('.carousel-btn') || e.target.closest('.carousel-dot')) {
        return;
    }
    
    // Find which carousel track was touched
    const carouselItem = e.target.closest('.carousel-item');
    if (carouselItem) {
        const track = carouselItem.closest('.carousel-track');
        if (track) {
            activeTrackId = track.id;
            startX = e.touches[0].clientX;
            isDragging = true;
        }
    }
});

document.addEventListener('touchmove', function(e) {
    if (!isDragging || !activeTrackId) return;
    currentX = e.touches[0].clientX;
    e.preventDefault(); // Prevent scrolling
});

document.addEventListener('touchend', function(e) {
    if (!isDragging || !activeTrackId) return;
    isDragging = false;
    
    const diffX = startX - currentX;
    const threshold = 50;
    
    if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
            nextSlide(activeTrackId);
        } else {
            prevSlide(activeTrackId);
        }
    }
    
    activeTrackId = null;
});







