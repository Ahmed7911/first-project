import mongoose from "mongoose";

export const DB_NAME = "into-to-backend";

const connectDB = async () =>{
    try {
        const connectionInstance = await mongoose.connect
        (`${process.env.MONGODB_URI}${DB_NAME}`)
        console.log(`\n cONNECTED TO MONGOOSE db !!!
            ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log(`connection Error`,error);
        process.exit(1);
    }
}
export default connectDB;