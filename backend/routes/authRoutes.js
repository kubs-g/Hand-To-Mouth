const express = require('express');
const routes = express.Router();
const {signup,login}= require('../controllers/authController')
const authenticate = require('../middleware/authMiddleware');
//const {isAdmin} = require('../middleware/roleMiddleware');


routes.post('/singup',signup);
routes.post('/login',login);


module.exports = routes