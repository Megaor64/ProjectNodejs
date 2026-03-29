import mongoose, { Model } from "mongoose"
import { IMovie } from "../types/movie.type.js"

const movieSchema = new mongoose.Schema<IMovie>({
    title: { type: String, required: true },
    year: Number,
    genre: String,
    imageUrl: { type: String, default: null },
    imagePublicId: { type: String, default: null },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true //We need this for mongodb queries
    }
}, { timestamps: true })

export const Movie: Model<IMovie> = mongoose.model<IMovie>("Movie", movieSchema)