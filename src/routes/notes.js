const express = require('express');
const router = express.Router();
const notesService = require('../services/dynamodb');

// Get note by date
router.get('/:userId/:date', async (req, res) => {
    try {
        const note = await notesService.getNoteByDate(req.params.userId, req.params.date);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json(note);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch note' });
    }
});

// Save or update a note
router.post('/', async (req, res) => {
    const { date, dayRank, notes, userId } = req.body;

    console.log(req.body);

    if (!userId || !date || !dayRank || !notes) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const savedNote = await notesService.saveNote(userId, date, dayRank.toString(), notes);
        res.json(savedNote);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save note' });
    }
});

module.exports = router;