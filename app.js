// Express Tutorial App
const express = require('express');
const path = require('path');
const morgan = require('morgan'); // HTTP request logger
const app = express();
const PORT = 3000;

// Set view engine to EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// --- Middleware ---
app.use(morgan('dev')); // Log requests to console
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Custom middleware example
app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

// --- Routes ---
const userRoutes = require('./routes/users');

// Home Route
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Express Tutorial', 
        message: 'Welcome to the comprehensive Express tutorial!'
    });
});

// About Route
app.get('/about', (req, res) => {
    res.render('about');
});

// Contact GET
app.get('/contact', (req, res) => {
    res.render('contact');
});

// Contact POST
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    res.send(`<h2>Thank you, ${name}!</h2><p>We have received your message: "${message}"<br>Email: ${email}</p><a href='/'>Back to Home</a>`);
});

// User Routes
app.use('/users', userRoutes);

// 404 Handler (Page not found)
app.use((req, res) => {
    res.status(404).render('404');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});