import { userModel } from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import transporter from "../utils/nodemailer.js"
import { Password_RESET_TEMPLATE } from "../utils/emailTemplate.js"



export const register=async(req,res)=>{
    try {
        const {name,email,password}=req.body
        console.log("BODY:", req.body); // 👀 Check this in terminal


        if(!name || !email || !password){
            return res.status(400).json({message:"All the Fields are required",success:false})
        }

        const userExist= await userModel.findOne({email});
        if(userExist){
            return res.status(409).json({message:"User is already existed",success:false})

        }

        const hashPassword=await bcrypt.hash(password,10)
        // console.log(hashPassword);

        const user=new userModel({
            name,
            email,password:hashPassword
        })

        await user.save();
      
        const token=jwt.sign({
            id:user._id,

        },
        process.env.JWT_SECRET,{
            expiresIn:'7d'
        }
    )
    // console.log(token);
    

    res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        sameSite:process.env.NODE_ENV==='production'?'none':'strict',
        maxAge:7*24*60*60*1000
    })

    //sending welcome email
    const mailOptions={
        from:process.env.SENDER_EMAIL,
        to:email,
        subject:'Welcome to 404 Not Found',
        text:`Welcome to 404 Not Found website. Your account has been
        created with email id: ${email}`
    }
    await transporter.sendMail(mailOptions)
    .then(() => {
      console.log("✅ Email sent successfully!");
    })
    .catch((error) => {
      console.error("❌ Email sending failed:", error.message);
    });
      return res.status(201).json({ message: "User register successfully", success: true });


        


        


        
    } catch (error) {
        console.log(error);

                    return res.status(401).json({message:error.message,success:false})

    }
}



export const login=async(req,res)=>{
    try {
        const {email,password}=req.body


        if( !email || !password){
            return res.status(400).json({message:"All the Fields are required",success:false})
        }

        const userExist= await userModel.findOne({email});

        if(!userExist){
            return res.status(409).json({message:"User doesn't  existed",success:false})

        }

        const isMatch=await bcrypt.compare(password,userExist.password);

        if(!isMatch){
            return res.status(401).json({message:"Invalid credentials",success:false})

        }


      
        const token=jwt.sign({
            id:userExist._id,

        },
        process.env.JWT_SECRET,{
            expiresIn:'7d'
        }
    )

    res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        sameSite:process.env.NODE_ENV==='production'?'none':'strict',
        maxAge:7*24*60*60*1000
    })

    

    return res.status(200).json({    message: "Login successful",  
         success: true });


    } catch (error) {
        console.log(error);
        
        return res.status(401).json({message:"Invalid Credentials",success:false})

    }
}

export const logout=async(req,res)=>{
try {
    
    res.clearCookie('token',{
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        sameSite:process.env.NODE_ENV==='production'?'none':'strict',
    })

    return res.status(200).json({message:"Logged Out",success:true})

} catch (error) {
    return res.status(401).json({message:error.message,success:false})

}
}

export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);

        // Check if the user is already verified
        if (user.isVerify) {
            return res.status(409).json({ message: "Account already Verified", success: false });
        }

        // Generate OTP (6 digits)
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        // Set OTP and expiry time
        const OTP_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + OTP_EXPIRY_TIME;

        // Save the user document
        await user.save();

        // Set up mail options
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Your OTP for verifying your account is ${otp}. Please enter this OTP to complete your registration. The OTP will expire in 24 hours.`
        };

        // Send OTP email
        await transporter.sendMail(mailOptions);

        return res.status(201).json({ message: "Verification OTP sent to your email", success: true });

    } catch (error) {
        console.error(error);  // Log the error for debugging
        return res.status(401).json({ message: error.message, success: false });
    }
};


export const verifyEmail = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        console.log("Received userId:", userId);
        console.log("Received OTP:", otp);
        if (!userId || !otp) {
            return res.status(400).json({ message: "Something is missing", success: false });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        if (!user.verifyOtp || user.verifyOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP", success: false });
        }

        if (new Date(user.verifyOtpExpireAt) < Date.now()) {
            return res.status(400).json({ message: "OTP Expired", success: false });
        }

        user.isVerify = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.status(200).json({ message: "Email verified successfully", success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, success: false });
    }
};


export const isAuthenticated=async(req,res)=>{
    try {
        return res.json({success:true})
    } catch (error) {
        return res.status(401).json({message:error.message,success:false})

    }
}


//send password reset otp

export const sendResetOtp=async(req,res)=>{
    const {email}=req.body
    // console.log(email);
    
    if(!email){
        return res.status(400).json({message:"Email is required",success:false})

    }

    try {
        const user=await userModel.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found",success:false})

        }

        const otp=  String( Math.floor( 100000+ Math.random()*900000))

        user.resetOtp=otp;
        user.resetOtpExpireAt=Date.now()+15*60*1000
     
        await user.save()
     
     
        const mailOptions={
         from:process.env.SENDER_EMAIL,
         to:user.email,
         subject:'Password Reset OTP',
        //  text:`Your OTP for resetting your password is ${otp}.
        //  Use this OTP to proceed with reset your password`
        html:Password_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        }
         
     
         await transporter.sendMail(mailOptions)
         return res.status(201).json({message:"Otp Send to ur email",success:true})

    } catch (error) {
        return res.status(401).json({message:error.message,success:false})

    }
}

//reset user password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    console.log(req.body);
  
    // Validate input
    if (!otp || !email || !newPassword) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }
  
    try {
      // Check if the user exists
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found", success: false });
      }
  
      // Check if OTP is valid
      if (user.resetOtp !== otp) {
        return res.status(400).json({ message: "Invalid OTP", success: false });
      }
  
      // Check if OTP is expired
      if (Date.now() > user.resetOtpExpireAt) {
        return res.status(401).json({ message: "OTP expired", success: false });
      }
  
      // Hash new password and save it
      const hashPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashPassword;
      user.resetOtp = "";  // Clear OTP after successful reset
      user.resetOtpExpireAt = 0;  // Clear OTP expiration time
      await user.save();
  
      // Return success response
      return res.status(200).json({ message: "Password reset successfully", success: true });
  
    } catch (error) {
      // Handle any error during the process
      console.error(error);
      return res.status(500).json({ message: "An error occurred during password reset", success: false });
    }
  };
  