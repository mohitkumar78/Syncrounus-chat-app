import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const connectdb = async () => {
    try {
        await mongoose.connect(`${process.env.CONNECTION_STRING}`)
        console.log('connected sucessfully')
    } catch (error) {
        console.log("Error is Occur while connecting databse")
    }
}

export default connectdb;