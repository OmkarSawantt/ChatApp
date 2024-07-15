const {Router} =require('express')
//const {registerUser,cheackEmail,checkPassword,userDetails,logout,updateUserData,searchUser}=require("../controller/userController")
const {registerUser}=require('../controller/userController')
const router=Router()
router.post('/register',registerUser)
/* router.post('/email',cheackEmail)
router.post('/password',checkPassword)
router.get('/user',userDetails)
router.get('/logout',logout)
router.post('/update-user',updateUserData)
router.post('/search-user',searchUser)
*/
module.exports=router