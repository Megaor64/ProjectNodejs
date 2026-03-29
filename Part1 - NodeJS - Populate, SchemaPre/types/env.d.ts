declare namespace NodeJS {
    interface ProcessEnv {
        MONGO_URI: string;
        JWT_SECRET: string;
        EMAIL_USER: string;
        EMAIL_PASS: string;
        CLOUDINARY_CLOUD_NAME: string;
        CLOUDINARY_API_KEY: string;
        CLOUDINARY_API_SECRET: string;
    }
}