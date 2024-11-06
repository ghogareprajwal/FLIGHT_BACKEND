const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000;
const secretKey = 'jwt token';

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to the JWT Token Generation Service');
});

const users = [
    {
        email: 'test@gmail.com',
        password: '12345678'
    }
];

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
    
        const payload = { email: user.email };
    
        const token = jwt.sign(payload, secretKey);
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
