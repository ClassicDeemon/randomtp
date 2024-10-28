const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('./db');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

// Input validation function
const validateLoginInput = (username, password) => {
    if (!username || !password) {
        return 'Username and password are required';
    }
    if (typeof username !== 'string' || typeof password !== 'string') {
        return 'Invalid input type';
    }
    return null;
};

// User authentication function
async function authenticateUser(username, password) {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        console.log("User: ", rows);
        
        const user = rows[0];
        if (!user) return null;

        console.log("Passwort: ", password);
        console.log("UserPasswort: ", user.password);

        const passwordMatch = await bcrypt.compareSync(password, user.password);
        console.log("PassMatch", passwordMatch);
        if (!passwordMatch) return null;

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;

    } catch (error) {
        console.error('Database query error:', error.message);
        throw new Error('Database query failed');
    }
}

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        console.log("UserPass", req.body);
        const validationError = validateLoginInput(username, password);
        if (validationError) {
            return res.status(400).json({
                status: 'error',
                message: validationError
            });
        }

        // Rate limiting (you'll need to implement this)
        // if (isRateLimited(username)) {
        //     return res.status(429).json({
        //         status: 'error',
        //         message: 'Too many login attempts. Please try again later.'
        //     });
        // }

        const user = await authenticateUser(username, password);
        if (!user) {
            console.warn(`Failed login attempt for username: ${username}`);
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        // Create token with user data
        const token = jwt.sign(
            {
                userId: user.id,
                username: user.username,
                power: user.power
            },
            secretKey,
            {
                expiresIn: '1h',
                algorithm: 'HS256'
            }
        );

        // Send response
        res.json({
            status: 'success',
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    power: user.power
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
});

// Refresh token route (optional but recommended)
router.post('/refresh-token', async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({
                status: 'error',
                message: 'Token is required'
            });
        }

        const decoded = jwt.verify(token, secretKey);
        const newToken = jwt.sign(
            {
                userId: decoded.userId,
                username: decoded.username,
                power: decoded.power
            },
            secretKey,
            { expiresIn: '1h' }
        );

        res.json({
            status: 'success',
            data: { token: newToken }
        });

    } catch (error) {
        res.status(401).json({
            status: 'error',
            message: 'Invalid token'
        });
    }
});

module.exports = router;