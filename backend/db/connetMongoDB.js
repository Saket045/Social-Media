import mongoose from 'mongoose'

const connectToMongoDB=async(req,res)=>{
try{
    const conn=await mongoose.connect(process.env.MONGOURI)
    console.log(`MongoDB connected ${conn.connection.host}`)
}
catch(error){
     console.log(`Error ${error.message}`)
}
}
export default connectToMongoDB;
