import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    shortDescription: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    blogId: {
        type: String,
        required: true,
    },
    blogName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
});

export default mongoose.model('Posts', PostSchema);