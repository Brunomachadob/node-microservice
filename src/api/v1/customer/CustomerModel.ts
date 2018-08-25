import * as mongoose from 'mongoose';

var exampleSchema = new mongoose.Schema({
    name: { type: String, required: true }
});

export default mongoose.model('Customer', exampleSchema);