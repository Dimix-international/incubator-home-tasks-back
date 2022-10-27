import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    youtubeUrl: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
});

export default mongoose.model('Blogs', BlogSchema);