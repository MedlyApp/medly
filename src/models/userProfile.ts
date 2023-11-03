import mongoose, { Document, Schema } from 'mongoose';

export interface UserProfileInterface extends Document {
    userId: string;
    about: string;
    experience: Record<string, string>,
    education: Record<string, string>,
    certification: Record<string, string>,

}

const profileData = new Schema<UserProfileInterface>({
    userId: { type: String, ref: 'User' },
    about: { type: String },

    experience: [{
        company: { type: String },
        jobRole: { type: String },
        year: { type: Number },
        location: { type: String },
        description: { type: String },
    }],

    education: [{
        schoolName: { type: String },
        degere: { type: String },
        year: { type: Number },
        qualificationObtain: { type: String },
    }],
    certification: [{
        title: { type: String },
        certificate: { type: String },
        issueYear: { type: Number },
    }],

},
    { timestamps: true }
);

export const Profile = mongoose.model<UserProfileInterface>('Profile', profileData)