const draftController = require('/Users/i/Draft-Saver-Service/src/controllers/draftController');
const express = require('express');
const router = express.Router();

router.post('/save', draftController.saveDraft);
router.get('/drafts', draftController.getDrafts);

module.exports = router;