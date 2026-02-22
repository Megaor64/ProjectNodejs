import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const mongoConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        // console.log(response)
        console.log("Mongodb is connected successfuly")
    } catch (error) {
        console.error("Error connection mongodb server: ", error)
        process.exit()
    }
}

export default mongoConnect