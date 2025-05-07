import mongoose from "mongoose";

const URL=process.env.MONGO_URL
const connectDb=async()=>{
try {
    await mongoose.connect(`${URL}/mernAuth`)
    console.log("DATABASE SUCCESSFULLY CONNECTED");
    
} catch (error) {
    console.log("❌ DATABASE Connection issue:", error.message);

}

}


export default connectDb