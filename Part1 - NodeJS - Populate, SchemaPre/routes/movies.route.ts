import express, { Router } from "express"
import { createMovie, deleteMovieById, getMovies, getMoviesByUser } from "../controllers/movies.controller.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { uploadSingle } from "../middlewares/uploadMiddleware.js"
import { validateRequest } from "../middlewares/validateRequest.js"
import {
  createMovieBodySchema,
  userIDParamSchema,
  movieIDParamSchema,
} from "../validation/movie.schemas.js"

const router: Router = express.Router()

router.get("/", getMovies)
router.post(
  "/",
  authMiddleware,
  uploadSingle,
  validateRequest(createMovieBodySchema, "body"),
  createMovie
)
router.get("/:userID", validateRequest(userIDParamSchema, "params"), getMoviesByUser)
router.delete(
  "/:movieID",
  validateRequest(movieIDParamSchema, "params"),
  authMiddleware,
  deleteMovieById
)

export default router