const express=require('express')
const authController=require('../controllers/authController')
const multer = require('multer');
//const ProductModel=require('../models/product')


const router=express.Router()
  
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.post('/verifyEmail',authController.verifyEmail)     
router.post('/register',upload.single('image'),authController.register)
router.post('/login',authController.login)  
router.post('/forgot-password',authController.forgotPassword) 
router.post('/reset-password/:id/:token',authController.resetPassword)
router.put('/profile',upload.single('image'),authController.editProfile) 
router.delete('/delete-account',authController.deleteAccount)    


router.get('/dashboard',authController.getStudent)
router.post('/createStudent',upload.single('image'),authController.createStudent)
router.get('/updateStudent/:id',authController.updateStudent)
router.put('/editStudent/:id',upload.single('image'),authController.editStudent)
router.delete('/deleteStudent/:id',authController.deleteStudent)





module.exports=router