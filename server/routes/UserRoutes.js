const {Router} =require('express')
//const {registerUser,cheackEmail,checkPassword,userDetails,logout,updateUserData,searchUser}=require("../controller/userController")
const {registerUser,cheackEmail,checkPassword,userDetails,logout,updateProfilePic,updateUser}=require('../controller/userController')
const router=Router()
router.post('/register',registerUser)
router.post('/email',cheackEmail)
router.post('/password',checkPassword)
router.get('/user',userDetails)
router.get('/logout',logout)
router.post('/update-user-profile',updateProfilePic)
router.post('/update-user',updateUser)
/* 
router.post('/search-user',searchUser)
*/
module.exports=router