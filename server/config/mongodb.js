import mongoose from "mongoose";

const connectDB = async ()=>{
    mongoose.connection.on('connected',() => {
    console.log("Ket noi db thanh cong !");

    })


await mongoose.connect(`${process.env.MONGODB_URI}/restaurant`)
}


export default connectDB ;