import mongoose, { Model } from 'mongoose';
import { IUser } from '../types/user.type.js';

const userSchema = new mongoose.Schema<IUser>(
	{
		name: { type: String, required: true },
		email: {
			type: String,
			required: [true, 'Email is a required field.'],
			unique: true,
		},
		verificationCode: String,
		isVerified: { type: Boolean, default: false },
		password: { type: String, required: true },
	},
	{ timestamps: true },
);

// Method to delete referenced Movies from Movie collection(Model)
userSchema.pre('findOneAndDelete', async function () {
	const filter = this.getFilter();
	const id = filter._id;
	const Movie = mongoose.model('Movie');
	await Movie.deleteMany({ createdBy: id });
});

userSchema.set('toJSON', {
	transform: (_doc, ret) => {
		const {
			password: _p,
			verificationCode: _v,
			...rest
		} = ret as unknown as Record<string, unknown>;
		return rest;
	},
});

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);