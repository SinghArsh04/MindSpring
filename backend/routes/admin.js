const express = require('express');
const router = express.Router();


const {
    createCategory,
    showAllCategories,
    getCategoryPageDetails,
} = require('../controllers/category');

const {getAllUsers,getUserbyId,deleteUser} = require('../controllers/manageusers')


router.get('/getAllUsers', getAllUsers)
router.post('/createCategory', createCategory);
router.get('/showAllCategories', showAllCategories);
router.post("/getCategoryPageDetails", getCategoryPageDetails)
router.get("/getUserbyId/:id", getUserbyId)
router.get("/deleteUser/:id",deleteUser)

module.exports = router;