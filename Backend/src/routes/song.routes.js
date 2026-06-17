const express = require('express');
const songController = require('../controller/song.controller');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

/**
 * POST: /api/songs/
 */
router.post('/', upload.single('song'), songController.uploadSong);

/**
 * POST: /api/songs/
 * desc ;- returns a song of a particular mood based on the mood recieved in query
 */ 
router.get('/', songController.getSong); 

module.exports = router;

