const express = require('express');
const jwt = require('jsonwebtoken'); 
const router = express.Router();

const secretKey = process.env.SECRET_KEY;

router.get('/', (req, res) => {  
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ valid: false });
    }
  
    jwt.verify(token, secretKey, (err) => {
      if (err) {
        return res.status(401).json({ valid: false });
      }
      return res.json({ valid: true });
    });
});

module.exports = router;
