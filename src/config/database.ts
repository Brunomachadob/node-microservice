import * as mongoose from 'mongoose';

const mongodbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/ms-db';

export default {
    connect: () => mongoose.connect(mongodbUrl, { useNewUrlParser: true })
};