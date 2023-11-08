const express = require('express');
const accountController = require('../controllers/accountController');
const loginValidator = require('../middlewares/loginValidator');
const registerValidator = require('../middlewares/registerValidator');
const authenticator = require('../middlewares/authenticator');

const router = express.Router();

router.get('/login', authenticator.authenticated, accountController.showLoginPage);
router.get('/logout', authenticator.authenticate, accountController.logoutHandle);
router.get('/register', authenticator.authenticated, accountController.showRegisterPage);
router.get('/update', authenticator.authenticate, accountController.showUpdatePage);

router.post('/login', loginValidator, accountController.loginHandle);
router.post('/register', registerValidator, accountController.registerHandle);
router.post('/update', registerValidator, accountController.updateHandle);

module.exports = router;