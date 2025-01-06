const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./routes/AuthRouter');
const ProductRouter = require('./routes/ProductRouter');

require('dotenv').config();
require('./models/db');
const PORT = process.env.PORT || 8080;

app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (email === ' ' || password === ' ') {
        return res.status(400).json({ message: 'Bad request' });
    }else if (user && user.password === password) {
        return res.status(200).json({ message: 'Login success' });
    } else {
        return res.status(401).json({ message: 'Login failed' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})