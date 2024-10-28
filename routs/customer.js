const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection configuration
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// GET all customers
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM customers');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: 'Unable to fetch customers. Please try again later.' });
    }
});

// GET customer by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM customers WHERE customer_id = ?', 
            [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Customer not found.' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).json({ error: 'Unable to fetch the customer. Please try again later.' });
    }
});

// POST new customer
router.post('/', async (req, res) => {
    const { 
        customer_name, 
        customer_email, 
        customer_phone, 
        customer_address, 
        customer_city, 
        customer_zip 
    } = req.body;

    try {
        const [result] = await pool.query(
            'INSERT INTO customers (customer_name, customer_email, customer_phone, customer_address, customer_city, customer_zip) VALUES (?, ?, ?, ?, ?, ?)',
            [customer_name, customer_email, customer_phone, customer_address, customer_city, customer_zip]
        );
        
        res.status(201).json({ 
            message: 'Customer created successfully.',
            customer_id: result.insertId 
        });
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({ error: 'Unable to create customer. Please check the provided data and try again.' });
    }
});

// PUT update customer
router.put('/:id', async (req, res) => {
    const { 
        customer_name, 
        customer_email, 
        customer_phone, 
        customer_address, 
        customer_city, 
        customer_zip 
    } = req.body;

    try {
        const [result] = await pool.query(
            'UPDATE customers SET customer_name = ?, customer_email = ?, customer_phone = ?, customer_address = ?, customer_city = ?, customer_zip = ? WHERE customer_id = ?',
            [customer_name, customer_email, customer_phone, customer_address, customer_city, customer_zip, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Customer not found.' });
        }
        
        res.json({ message: 'Customer updated successfully.' });
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({ error: 'Unable to update customer. Please check the provided data and try again.' });
    }
});

// DELETE customer
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM customers WHERE customer_id = ?', 
            [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Customer not found.' });
        }

        res.json({ message: 'Customer deleted successfully.' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ error: 'Unable to delete customer. Please try again later.' });
    }
});

module.exports = router;