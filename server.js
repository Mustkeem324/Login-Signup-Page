const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000; // You can change this port as needed

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/nxpro', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Create a schema for users
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

// Create a model
const User = mongoose.model('User', userSchema);

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Route for user sign up
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    // Create a new user
    const newUser = new User({
        name,
        email,
        password
    });
    // Save the user to the database
    newUser.save()
    .then(() => res.status(201).json({ message: 'User created successfully' }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Route for user sign in
app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    // Find the user by email and password
    User.findOne({ email, password })
    .then(user => {
        if (user) {
            res.status(200).json({ message: 'Sign in successful' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
