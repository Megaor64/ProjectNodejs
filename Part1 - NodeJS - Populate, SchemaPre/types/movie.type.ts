import { Document, Types } from 'mongoose';

export interface IMovie extends Document {
	title: string;
	year?: number;
	genre?: string;
	imageUrl?: string | null;
	imagePublicId?: string | null;
	createdBy: Types.ObjectId;
}