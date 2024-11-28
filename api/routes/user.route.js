const express = require('express');
// import { deleteUser, test, updateUser, getUserListings, getUser } from '../controllers/user.controller.js';
const { deleteUser, test, updateUser, getUser } = require('../controllers/user.controller.js');
const  verifyToken  = require('../utils/verifyUser.js');


const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
// router.get('/listings/:id', verifyToken, getUserListings)
router.get('/:id', verifyToken, getUser)

module.exports = router;