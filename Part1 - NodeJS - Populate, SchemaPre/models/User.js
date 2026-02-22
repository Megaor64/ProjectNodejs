import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: [true, "Email is a required field."],
        unique: true
    },
    password: { type: String, required: true }
}, { timestamps: true })

// Method 2 to delete referenced Movies from Movie collection(Model)
userSchema.pre("findOneAndDelete", async function () {
    const filter = this.getFilter()
    const id = filter._id
    const Movie = mongoose.model("Movie")
    await Movie.deleteMany({ createdBy: id })
})

export const User = mongoose.model('User', userSchema)