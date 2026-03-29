import express from 'express'
import mongoConnect from "./config/db.js"
import dotenv from "dotenv"
import rateLimit from "express-rate-limit"
import cors from "cors";

dotenv.config()

// routes
import authRoute from "./routes/auth.route.js"
import usersRoute from "./routes/users.route.js"
import moviesRoute from "./routes/movies.route.js"

const app = express()

// אפשרות 1 - למצב פיתוח בלבד
// app.use(cors())

// אפשרות 2 - ללא הגדרות נוקשות
// app.use(cors({ origin: "http://127.0.0.1:5500" }))

// אפשרות 3 - מספר מקורות
// step 1 - define origins
const allowedOrigins = ["http://127.0.0.1:5500", "http://localhost:5173"]

// step 2 - define function to accept origins or throw error
const corsOptions = {
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: function (origin: string | undefined, callback: (err: Error | null, accept?: boolean) => void) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Origin not allowed"))
        }
    },
}

// step 3 - use options in cors
app.use(cors(corsOptions))


const globalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15m
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: "יותר מדי בקשות"
})

// We add this when we reverse proxy to our backend as a service..
// For production mode
app.set("trust proxy", 1)

app.use(globalLimiter)

app.use(express.json())

app.get("/health", (_, res) => {
    res.send("Server is live")
})

const blockedOriginForPost = ["http://127.0.0.1:5500"]

// Block POST from specific origin(s)
app.use((req, res, next) => {
    const origin = req.get("Origin")
    const isBlockedOrigin = Array.isArray(blockedOriginForPost)
        ? blockedOriginForPost.includes(origin!)
        : origin === blockedOriginForPost
    // console.log(req.method === "GET")
    if ((req.method === "GET" || req.method === "POST" || req.method === "PUT" || req.method === "DELETE") && origin && isBlockedOrigin) {
        return res.status(403).json({ message: `${req.method} not allowed from this origin` })
    }
    next()
})

app.use("/auth", authRoute)
app.use("/users", usersRoute)
app.use("/movies", moviesRoute)

app.use("/", (_, res) => {
    res.send("fallback..404 - not found")
})

mongoConnect().then(() => app.listen(3005, () => console.log("Server is running..."))).catch(console.error)