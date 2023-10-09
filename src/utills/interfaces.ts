import mongoose, { Schema, model, Model, Document, ObjectId } from 'mongoose';
export type UploadType = {
    fileName: string;
    fileType: string;
    url: string;
    size: number;
};
export interface PostInterface extends Document {
    userId: ObjectId;
    groupId: ObjectId;
    content: string;
    postType: string;
    profilePicture: string;
    fullName: string;
    commentCount: number;
    image?: string[];
    video?: string[];
    audio?: string[];
    file?: string[];
    likes?: ObjectId[];
    likesCount: number;
    comments?: Comment[];
    reposts?: Repost[];
    emoji?: string;
    createdAt: Date;
    visibleTo: string[];
}

export interface Comment extends Document {
    postId: ObjectId;
    body: string;
    createdBy: ObjectId;
    profileImage: string;
    likes?: string[];
    createdAt: Date;
    updatedAt: Date;
    likesCount: number;
    commentCount: number;
    image?: string[];
    emoji?: string;

}
export interface Repost extends Document {
    postId: ObjectId;
    body: string;
    createdBy: ObjectId;
    profileImage: string;
    likes?: string[];
    createdAt: Date;
    updatedAt: Date;
    likesCount: number;
    image?: string;
    mediaUrls?: string[];
    emoji?: string;

}