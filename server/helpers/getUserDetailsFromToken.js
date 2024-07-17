const jwt=require('jsonwebtoken')
const getUserDetailsFromToken=async(token)=>{
    if(!token){
        return{
            message:"session out",
            logout:true,
        }
    }
    const decode=await jwt.verify(token,process.env.JWT_SECREAT_KEY)



    return decode.id
}
module.exports=getUserDetailsFromToken