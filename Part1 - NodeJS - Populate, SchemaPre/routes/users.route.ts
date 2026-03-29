import express, { Router } from "express"
import { updateUser, deleteUser, getUserById, getUsers } from "../controllers/users.controller.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { checkPermissions } from "../middlewares/checkPermissions.js"
import { validateRequest } from "../middlewares/validateRequest.js"
import { getUserByIdParamsSchema, updateUserBodySchema } from "../validation/user.schemas.js"

const router: Router = express.Router()

// Get - get all users
// router.get("/", authMiddleware, getUsers)
// Temp Change
router.get("/", getUsers)

// Get - get singular user
router.get("/:id", validateRequest(getUserByIdParamsSchema, "params"), authMiddleware, getUserById)

// PUT - updating a user, when requesting need
// to trnasfer in the body request all the user object
// PATCH  - updating a user, when requesting
// need to transfer in the body request only the requested properties to update
router.patch("/:id", validateRequest(getUserByIdParamsSchema, "params"), validateRequest(updateUserBodySchema, "body"), authMiddleware, checkPermissions, updateUser)

// DELETE - deleting user by id
router.delete("/:id", validateRequest(getUserByIdParamsSchema, "params"), authMiddleware, checkPermissions, deleteUser)

// module.exports = router;
export default router;