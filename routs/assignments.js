// apiRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db.js');

// Create (POST) ein neues Assignment
router.post('/assignments', async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO activities (act_designation, act_wage) VALUES (?, ?)', [name, 20]);
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Read (GET) alle Assignments
router.get('/assignments', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM activities');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Read (GET) ein bestimmtes Assignment nach ID
router.get('/assignments/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const [rows] = await pool.query('SELECT * FROM activities WHERE act_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching item:', err);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Update (PUT) ein Assignment nach ID
router.put('/assignments/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  try {
    const [result] = await pool.query('UPDATE activities SET act_designation = ? WHERE act_id = ?', [name, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ id, name });
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete (DELETE) ein Assignment nach ID
router.delete('/assignments/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const [result] = await pool.query('DELETE FROM activities WHERE act_id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;
