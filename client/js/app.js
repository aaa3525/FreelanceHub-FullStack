// API Base URL
const API_BASE = 'http://localhost:3000/api';

// Global state
let allServices = [];
let currentDragService = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupModal();
    loadServices();
    setupDragAndDrop();
    setupDashboardTabs();
});

// Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            showPage(page);
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Load page-specific data
            if (page === 'dashboard') {
                loadDashboard();
            }
        });
    });
    // Explore Services button on home page
const exploreBtn = document.querySelector('.cta-btn');
if (exploreBtn) {
    exploreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('services');
        navLinks.forEach(l => l.classList.remove('active'));
        document.querySelector('[data-page="services"]')?.classList.add('active');
    });
}
    // Mobile menu toggle
    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinksContainer.classList.toggle('show');
        });
    }
}

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(`${pageId}-page`).classList.add('active');
}

// Load services from API
async function loadServices() {
    try {
        const response = await fetch(`${API_BASE}/services`);
        if (!response.ok) throw new Error('Failed to load services');
        allServices = await response.json();
        displayServices(allServices);
        setupFilters();
    } catch (error) {
        console.error('Error loading services:', error);
        showToast('Failed to load services', 'error');
    }
}

// Display services
function displayServices(services) {
    const container = document.getElementById('services-container');
    if (!container) return;
    
    if (services.length === 0) {
        container.innerHTML = '<p class="no-results">No services found</p>';
        return;
    }
    
    container.innerHTML = services.map(service => `
        <div class="service-card" data-id="${service.id}" draggable="true">
            <img src="${service.image}" alt="${service.title}" loading="lazy">
            <div class="service-info">
                <span class="category">${service.category}</span>
                <h3>${service.title}</h3>
                <p>${service.description.substring(0, 80)}...</p>
                <div class="price">$${service.price}</div>
                <div class="rating">${'★'.repeat(Math.floor(service.rating))}${service.rating % 1 ? '½' : ''} (${service.rating})</div>
                <div class="card-actions">
                    <button class="btn-save" onclick="saveService(${service.id})">Save</button>
                    <button class="btn-hire" onclick="showHireModal(${service.id})">Hire</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Re-attach drag events
    attachDragEvents();
}

// Setup search and filters
function setupFilters() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');
    
    const filterServices = () => {
        let filtered = [...allServices];
        
        // Search
        const searchTerm = searchInput?.value.toLowerCase() || '';
        if (searchTerm) {
            filtered = filtered.filter(s => 
                s.title.toLowerCase().includes(searchTerm) || 
                s.description.toLowerCase().includes(searchTerm)
            );
        }
        
        // Category filter
        const category = categoryFilter?.value;
        if (category && category !== 'all') {
            filtered = filtered.filter(s => s.category === category);
        }
        
        // Sort
        const sortValue = sortBy?.value;
        if (sortValue === 'price-asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'price-desc') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortValue === 'rating-desc') {
            filtered.sort((a, b) => b.rating - a.rating);
        }
        
        displayServices(filtered);
    };
    
    if (searchInput) searchInput.addEventListener('input', filterServices);
    if (categoryFilter) categoryFilter.addEventListener('change', filterServices);
    if (sortBy) sortBy.addEventListener('change', filterServices);
}

// Save service
async function saveService(serviceId) {
    try {
        const response = await fetch(`${API_BASE}/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ serviceId })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Service saved successfully!', 'success');
        } else {
            showToast(data.error || 'Failed to save service', 'error');
        }
    } catch (error) {
        console.error('Error saving service:', error);
        showToast('Failed to save service', 'error');
    }
}

// Show hire modal
function showHireModal(serviceId) {
    const service = allServices.find(s => s.id === serviceId);
    if (!service) return;
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <div class="modal-service-detail">
            <h2>${service.title}</h2>
            <p>${service.description}</p>
            <p><strong>Price:</strong> $${service.price}</p>
            <p><strong>Rating:</strong> ${service.rating} ★</p>
        </div>
        <form id="hire-form" class="hire-form">
            <input type="text" id="client-name" placeholder="Your Name" required>
            <input type="email" id="client-email" placeholder="Your Email" required>
            <button type="submit">Confirm Hire</button>
        </form>
    `;
    
    document.getElementById('modal').style.display = 'block';
    
    const form = document.getElementById('hire-form');
    form.onsubmit = async (e) => {
        e.preventDefault();
        const clientName = document.getElementById('client-name').value;
        const clientEmail = document.getElementById('client-email').value;
        
        await hireService(serviceId, clientName, clientEmail);
        closeModal();
    };
}

// Hire service
async function hireService(serviceId, clientName, clientEmail) {
    try {
        const response = await fetch(`${API_BASE}/hire`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ serviceId, clientName, clientEmail })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Service hired successfully!', 'success');
            if (document.getElementById('dashboard-page').classList.contains('active')) {
                loadDashboard();
            }
        } else {
            showToast(data.error || 'Failed to hire service', 'error');
        }
    } catch (error) {
        console.error('Error hiring service:', error);
        showToast('Failed to hire service', 'error');
    }
}

// Load dashboard
async function loadDashboard() {
    await Promise.all([loadSavedServices(), loadHiredServices()]);
}

async function loadSavedServices() {
    try {
        const response = await fetch(`${API_BASE}/saved`);
        if (!response.ok) throw new Error('Failed to load saved services');
        const services = await response.json();
        
        const container = document.getElementById('saved-container');
        if (!container) return;
        
        if (services.length === 0) {
            container.innerHTML = '<p class="no-results">No saved services yet</p>';
            return;
        }
        
        container.innerHTML = services.map(service => `
            <div class="service-card">
                <img src="${service.image}" alt="${service.title}">
                <div class="service-info">
                    <h3>${service.title}</h3>
                    <div class="price">$${service.price}</div>
                    <button class="btn-hire" onclick="showHireModal(${service.id})">Hire Now</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading saved services:', error);
    }
}

async function loadHiredServices() {
    try {
        const response = await fetch(`${API_BASE}/hired`);
        if (!response.ok) throw new Error('Failed to load hired services');
        const hires = await response.json();
        
        const container = document.getElementById('hired-container');
        if (!container) return;
        
        if (hires.length === 0) {
            container.innerHTML = '<p class="no-results">No hired services yet</p>';
            return;
        }
        
        container.innerHTML = hires.map(hire => `
            <div class="service-card">
                <img src="${hire.service.image}" alt="${hire.service.title}">
                <div class="service-info">
                    <h3>${hire.service.title}</h3>
                    <div class="price">$${hire.service.price}</div>
                    <p><strong>Hired by:</strong> ${hire.client.name}</p>
                    <p><small>${new Date(hire.hiredAt).toLocaleDateString()}</small></p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading hired services:', error);
    }
}

// Drag and Drop functionality
function setupDragAndDrop() {
    const dashboardBtn = document.querySelector('[data-page="dashboard"]');
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', () => {
            setTimeout(() => setupDropZones(), 100);
        });
    }
}

function attachDragEvents() {
    const cards = document.querySelectorAll('.service-card[draggable="true"]');
    cards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
    });
}

function handleDragStart(e) {
    const card = e.target.closest('.service-card');
    if (card) {
        currentDragService = parseInt(card.dataset.id);
        e.dataTransfer.setData('text/plain', currentDragService);
        card.classList.add('dragging');
    }
}

function handleDragEnd(e) {
    const card = e.target.closest('.service-card');
    if (card) card.classList.remove('dragging');
    currentDragService = null;
}

function setupDropZones() {
    const dropZones = document.querySelectorAll('.dashboard-tabs .tab-btn');
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => e.preventDefault());
        zone.addEventListener('drop', handleDrop);
        zone.classList.add('drop-zone');
    });
}

async function handleDrop(e) {
    e.preventDefault();
    const serviceId = currentDragService || parseInt(e.dataTransfer.getData('text/plain'));
    if (!serviceId) return;
    
    const target = e.target.closest('.tab-btn');
    if (target) {
        const tab = target.dataset.tab;
        if (tab === 'saved') {
            await saveService(serviceId);
        } else if (tab === 'hired') {
            const service = allServices.find(s => s.id === serviceId);
            if (service) {
                showHireModal(serviceId);
            }
        }
        showToast(`Service dropped to ${tab} section`, 'success');
    }
}

// Dashboard tabs
function setupDashboardTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            // Update active button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show active tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tab}-tab`).classList.add('active');
        });
    });
}

// Modal
function setupModal() {
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close-modal');
    
    closeBtn.onclick = closeModal;
    window.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.background = type === 'success' ? '#10b981' : '#ef4444';
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

// Make functions global for onclick handlers
window.saveService = saveService;
window.showHireModal = showHireModal;