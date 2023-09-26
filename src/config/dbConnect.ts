import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.set("strictQuery", true);

const dbConnect = () => {
    mongoose
        .connect(process.env.MONGO_URL! as string)
        .then(() => console.log("DB Connected"))
        .catch((err) => console.log(err));
};



// function dbConnect(): Promise<void> {
//     return new Promise((resolve, reject) => {
//         mongoose.connect(process.env.MONGO_URL as string,)
//             .then(() => {
//                 console.log('Connected to MongoDB');
//                 resolve();
//             })
//             .catch((err) => {
//                 console.log('Error connecting to MongoDB:', err);
//                 reject(err);
//             });
//     });
// }
export default dbConnect;