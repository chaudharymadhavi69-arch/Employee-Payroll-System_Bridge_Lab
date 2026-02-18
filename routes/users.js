const express = require('express');
const router = express.Router();

// Mock Data
const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' }
];

// Get all users (Renders the 'users.ejs' template)
router.get('/', (req, res) => {
    res.render('users', { 
        title: 'Users List', 
        users: users 
    });
});

// Get specific user by ID (Returns JSON data)
router.get('/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('User not found');
    }
});

module.exports = router;
