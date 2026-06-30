const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const studentValidator = require('../validators/studentValidator');

router.get('/', auth, studentController.getAll);
router.get('/:id', auth, studentController.getById);
router.post('/', auth, validate(studentValidator.create), studentController.create);
router.put('/:id', auth, validate(studentValidator.update), studentController.update);
router.delete('/:id', auth, studentController.remove);

module.exports = router;
