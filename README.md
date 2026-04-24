# FreelanceHub - Full Stack Web Application

A full-stack freelance services marketplace built with HTML, CSS, JavaScript, and Express.js (Node.js), inspired by platforms like Fiverr and Upwork.

## Features
- Browse freelance services/gigs dynamically
- Search services by title
- Filter by category, price, and rating
- Sort by price or rating
- Save services for later
- Hire freelancers (simulated)
- Drag and Drop to save/hire services
- Modal popups for service details and confirmations
- User Dashboard to view saved and hired services
- Fully responsive mobile-first design

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/services | Get all services |
| GET | /api/services/:id | Get single service by ID |
| POST | /api/services | Add a new service (bonus) |
| POST | /api/save | Save a service |
| POST | /api/hire | Hire a freelancer |
| GET | /api/saved | Get all saved services |
| GET | /api/hired | Get all hired services |

## Project Structure
/FreelanceHub
│── /client
│   ├── index.html
│   ├── /css
│   │   └── style.css
│   └── /js
│       └── app.js
│
│── /server
│   ├── server.js
│   ├── /routes
│   │   └── api.js
│   ├── /controllers
│   │   └── freelanceControllers.js
│   └── /data
│       ├── services.json
│       ├── saved.json
│       └── hired.json
│
│── package.json
│── README.md
## Setup Instructions

1. **Clone the repository**
git clone https://github.com/aaa3525/FreelanceHub-FullStack.git
cd FreelanceHub-FullStack
2. **Install dependencies**
npm install
3. **Start the backend server**
node server/server.js
4. **Open the frontend**

Open `client/index.html` in your browser, or right-click and select "Open with Live Server" in VS Code.

5. **Server runs on**
http://localhost:3000
## Technologies Used
- **Frontend:** HTML5, CSS3 (Flexbox, Grid, CSS Variables), Vanilla JavaScript, Fetch API
- **Backend:** Node.js, Express.js
- **Data Storage:** JSON files
- **Version Control:** Git & GitHub
