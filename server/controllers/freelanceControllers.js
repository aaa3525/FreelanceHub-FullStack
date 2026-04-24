const fs = require('fs');
const path = require('path');

// Data file paths
const SERVICES_FILE = path.join(__dirname, '../data/services.json');
const SAVED_FILE = path.join(__dirname, '../data/saved.json');
const HIRED_FILE = path.join(__dirname, '../data/hired.json');

// Helper to read JSON file
const readJSON = (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([]));
            return [];
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return [];
    }
};

// Helper to write JSON file
const writeJSON = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
        return false;
    }
};

// Get all services
exports.getAllServices = (req, res) => {
    try {
        const services = readJSON(SERVICES_FILE);
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch services' });
    }
};

// Get single service by ID
exports.getServiceById = (req, res) => {
    try {
        const services = readJSON(SERVICES_FILE);
        const service = services.find(s => s.id === parseInt(req.params.id));
        
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch service' });
    }
};

// Add new service (bonus)
exports.addService = (req, res) => {
    try {
        const { title, category, price, rating, description, image } = req.body;
        
        // Validation
        if (!title || !category || !price || !rating) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const services = readJSON(SERVICES_FILE);
        const newService = {
            id: services.length + 1,
            title,
            category,
            price: parseFloat(price),
            rating: parseFloat(rating),
            description: description || '',
            image: image || 'https://via.placeholder.com/300x200?text=Service'
        };
        
        services.push(newService);
        writeJSON(SERVICES_FILE, services);
        
        res.status(201).json(newService);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add service' });
    }
};

// Save service
exports.saveService = (req, res) => {
    try {
        const { serviceId } = req.body;
        
        if (!serviceId) {
            return res.status(400).json({ error: 'Service ID required' });
        }
        
        const services = readJSON(SERVICES_FILE);
        const service = services.find(s => s.id === parseInt(serviceId));
        
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        
        const savedServices = readJSON(SAVED_FILE);
        
        // Check if already saved
        if (savedServices.some(s => s.id === service.id)) {
            return res.status(400).json({ error: 'Service already saved' });
        }
        
        savedServices.push(service);
        writeJSON(SAVED_FILE, savedServices);
        
        res.status(200).json({ message: 'Service saved successfully', service });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save service' });
    }
};

// Hire service
exports.hireService = (req, res) => {
    try {
        const { serviceId, clientName, clientEmail } = req.body;
        
        if (!serviceId || !clientName || !clientEmail) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const services = readJSON(SERVICES_FILE);
        const service = services.find(s => s.id === parseInt(serviceId));
        
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        
        const hiredServices = readJSON(HIRED_FILE);
        const hireRecord = {
            id: hiredServices.length + 1,
            service,
            client: { name: clientName, email: clientEmail },
            hiredAt: new Date().toISOString()
        };
        
        hiredServices.push(hireRecord);
        writeJSON(HIRED_FILE, hiredServices);
        
        res.status(200).json({ message: 'Service hired successfully', hireRecord });
    } catch (error) {
        res.status(500).json({ error: 'Failed to hire service' });
    }
};

// Get saved services
exports.getSavedServices = (req, res) => {
    try {
        const savedServices = readJSON(SAVED_FILE);
        res.status(200).json(savedServices);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch saved services' });
    }
};

// Get hired services
exports.getHiredServices = (req, res) => {
    try {
        const hiredServices = readJSON(HIRED_FILE);
        res.status(200).json(hiredServices);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch hired services' });
    }
};