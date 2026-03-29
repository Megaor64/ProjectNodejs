import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../models/User.js"
import dotenv from "dotenv"
import { sendVerificationEmail } from "../utils/mailer.js"

dotenv.config()

function generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body

        const hashed = await bcrypt.hash(password, 10)

        const code = generateCode()

        const user = await User.create({
            name,
            email,
            verificationCode: code,
            password: hashed
        })

        try {
            await sendVerificationEmail(email, code)
            console.log(`[Register] Verification email sent successfully to email ${email}`)
        } catch (error) {
            console.log(`[Register] Failed to send verification email to ${email}`, (error as Error).message)
        }

        res.status(200).json({
            status: 200,
            message: "Verification code sent.",
            data: user
        })
    } catch (error) {
        const err = error as {
            code?: string;
            keyValue?: { email?: string }
        }
        const { code, keyValue } = err
        console.log(code, keyValue)
        if (String(code) === "11000") {
            const { email } = keyValue || {}
            if (email) {
                res.status(500).json({
                    status: 500,
                    message: "Cannot register with this email",
                    data: null
                })
                return
            }
        }
        res.status(500).json({
            status: 500,
            message: "Failed register a new user",
            data: null
        })
    }
}

export async function verifyEmail(req: Request, res: Response): Promise<void> {
    try {
        const { email, code } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return
        }

        if (user.verificationCode !== code) {
            res.status(400).json({ message: "Invalid code" });
            return
        }

        user.isVerified = true;
        user.verificationCode = null;

        await user.save();

        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            res.status(400).json({
                status: 400,
                message: "Invalid credentials",
                data: null
            })
            return
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            res.status(400).json({
                status: 400,
                message: "Invalid credentials",
                data: null
            })
            return
        }

        if (!user.isVerified) {
            res.status(400).json({
                status: 400,
                message: "User is not verified",
                data: null
            })
            return
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "30m" }
        )

        res.status(200).json({
            status: 200,
            message: "Login successfully",
            data: token
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Failed register a new user",
            data: null
        })
    }
}