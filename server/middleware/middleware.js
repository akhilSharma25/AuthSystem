import jwt from "jsonwebtoken"


export const userAuth=async(req ,res,next)=>{

    const {token}=req.cookies;
    // console.log(token);
    

    if(!token){
        return res.status(404).json({message:"Not Authorized Login Again",success:false})

    }
 


    try {

        const tokenDecode=jwt.verify(token,process.env.JWT_SECRET)
        if (!req.body) {
            req.body = {}; // ensure req.body exists
          }
        //   console.log("Token:", token);
        //   console.log("Decoded Token:", tokenDecode);
        //   console.log("User ID:", req.body);
        if(tokenDecode.id){
            req.body.userId = tokenDecode.id
            // console.log("User ID:", req.body);

        }else{
            return res.status(404).json({message:"Not Authorized Login Again",success:false})

        }

        next()
    } catch (error) {
        return res.status(401).json({message:error.message,success:false})

    }
}