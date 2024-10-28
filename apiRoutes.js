const express = require('express');
const router = express.Router();
const activities = require('./routs/assignments.js'); 
const customer = require('./routs/customer.js');
const checkToken = require('./routs/check-token.js'); 


router.use('/activities', activities);
router.use('/customers', customer);
router.use('/check-Token', checkToken);

module.exports = router;
