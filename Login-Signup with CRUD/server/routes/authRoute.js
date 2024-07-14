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
     
router.post('/register',upload.single('image'),authController.register)
router.post('/login',authController.login)  
router.put('/profile',upload.single('image'),authController.editProfile)   
router.delete('/delete-account',authController.deleteAccount)    


router.get('/dashboard',authController.getProduct)
router.post('/createProduct',upload.single('image'),authController.createProduct)
router.get('/updateProduct/:id',authController.updateProduct)
router.put('/editProduct/:id',upload.single('image'),authController.editProduct)
router.delete('/deleteProduct/:id',authController.deleteProduct)
//router.get('/get-current-password',authController.getCurrentPassword);
// router.get('/logout', (req, res) => {
//   res.clearCookie('token')
//   return res.status(200).json({ status: "successful" })
// })

/*router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.status(200).json({ status: "successful" })
})*/







module.exports=router