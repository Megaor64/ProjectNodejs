/**
 * ייצוא מרכזי של כל סכמות הולידציה
 */

export {
    registerSchema,
    verifySchema,
    loginSchema
} from "./auth.schemas.js"

export {
    getUserByIdParamsSchema,
    updateUserBodySchema,
    getUsersQuerySchema
} from "./user.schemas.js"

export {
    createMovieBodySchema,
    userIDParamSchema,
    movieIDParamSchema
} from "./movie.schemas.js"
