import { Request, Response } from "express"
import { Movie } from "../models/Movie.js"
import { deleteFromCloudinary, uploadToCloudinary } from "../services/cloudinary.service.js"

export const createMovie = async (req: Request, res: Response): Promise<void> => {
    try {
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, "movies")
            req.body.imageUrl = result.secure_url
            req.body.imagePublicId = result.public_id
        }
        const movie = new Movie({
            ...req.body,
            createdBy: req.user!.id
        })
        await movie.save()
        res.status(201).json({
            status: 201,
            message: "New movie created successfuly",
            data: null
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 500,
            message: "Failed creating a new movie",
            data: null
        })
    }
}

export const getMovies = async (_req: Request, res: Response): Promise<void> => {
    try {
        const movies = await Movie.find().populate("createdBy", "name email")
        res.status(200).json({
            status: 200,
            message: "All movies fetched",
            data: movies
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 500,
            message: "Failed fetching movies",
            data: null
        })
    }
}

export const getMoviesByUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userID
        const movies = await Movie.find({ createdBy: userId })
        res.status(200).json({
            status: 200,
            message: `All movies of user with id: ${userId} fetched`,
            data: movies
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 500,
            message: "Failed fetching movies",
            data: null
        })
    }
}

export const deleteMovieById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id: userID } = req.user!
        const { movieID } = req.params

        const movie = await Movie.findById(movieID)

        if (!movie) {
            res.status(400).json({
                status: 400,
                message: "Movie not found",
                data: null
            })
            return
        }

        const imagePublicId = movie.imagePublicId
        if (imagePublicId) {
            await deleteFromCloudinary(imagePublicId)
        }

        // console.log(String(movie.createdBy), userID)
        if (String(movie.createdBy) !== userID) {
            res.status(401).json({
                status: 401,
                message: "Permission denied",
                data: null
            })
            return
        }

        await Movie.findByIdAndDelete(movieID)
        res.status(200).json({
            status: 200,
            message: "Movie is successfuly deleted",
            data: null
        })
    } catch (error) {
        const err = error as { kind?: string; }
        if (err.kind === "ObjectId") {
            res.status(500).json({
                status: 500,
                message: "Id is not mongoose standart Id for casting",
                data: null
            })
            return
        }
        res.status(500).json({
            status: 500,
            message: "Server Error",
            data: null
        })
    }
}

