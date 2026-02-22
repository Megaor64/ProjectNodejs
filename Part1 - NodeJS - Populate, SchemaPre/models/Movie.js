import mongoose from "mongoose"

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    year: Number,
    genre: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true //We need this for mongodb queries
    }
}, { timestamps: true })

export const Movie = mongoose.model("Movie", movieSchema)