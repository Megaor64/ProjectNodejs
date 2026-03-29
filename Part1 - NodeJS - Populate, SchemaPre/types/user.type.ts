import { Document } from 'mongoose';

export interface IUser extends Document{
	name: string;
	email: string;
	password: string;
	verificationCode: string | null;
	isVerified: boolean;
}
