import Joi from "joi";

// createMovieBodySchema - for POST /movies
export const createMovieBodySchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  year: Joi.number().integer().min(1900).max(2100).optional(),
  genre: Joi.string().max(100).optional(),
}).options({ stripUnknown: true });

// userIDParamSchema - for GET /movies/:userID
export const userIDParamSchema = Joi.object({
  userID: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
}).options({ stripUnknown: true });

// movieIDParamSchema - for DELETE /movies/:movieID
export const movieIDParamSchema = Joi.object({
  movieID: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
}).options({ stripUnknown: true });
