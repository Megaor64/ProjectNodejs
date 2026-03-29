import { Request, Response, NextFunction } from "express"

export const checkPermissions = (req: Request, res: Response, next: NextFunction) => {
    const { id: userIdFromToken } = req.user!
    const { id: userIdFromUrl } = req.params

    if (String(userIdFromToken) !== String(userIdFromUrl)) {
        return res.status(401).json({
            status: 401,
            message: `No permission`,
            data: null
        })
    }

    next()
}