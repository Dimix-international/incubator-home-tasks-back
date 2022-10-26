export const settings = {
    MONGO_URI: process.env.mongoURI || 'mongodb://127.0.0.1:27017',
    JWT_SECRET: process.env.JWT_SECRET || '123'
}