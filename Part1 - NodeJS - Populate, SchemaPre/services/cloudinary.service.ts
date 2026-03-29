import cloudinary from "../config/cloudinary.js"

export async function uploadToCloudinary(buffer: Buffer, folder: string = "movies"): Promise<{
    secure_url: string, public_id: string
}> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            folder,
            resource_type: 'image'
        },
            (error, result) => {
                if (error) return reject(error)
                resolve(result!)
            })
        stream.end(buffer)
    })
}

export async function deleteFromCloudinary(publicId: string): Promise<unknown> {
    return cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
}