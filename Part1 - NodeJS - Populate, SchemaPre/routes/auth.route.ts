import express, { Router } from "express"
import { login, register, verifyEmail } from "../controllers/auth.controller.js"
import { validateRequest } from "../middlewares/validateRequest.js"
import { registerSchema, verifySchema, loginSchema } from "../validation/auth.schemas.js"

const router: Router = express.Router()

router.post("/register", validateRequest(registerSchema, "body"), register)
router.post("/verify", validateRequest(verifySchema, "body"), verifyEmail)
router.post("/login", validateRequest(loginSchema, "body"), login)

// module.exports = router;
export default router;