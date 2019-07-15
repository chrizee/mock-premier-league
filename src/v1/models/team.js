const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    name: {
        type: String,
        required: true
    },    
    date: {
        type: Date,
        default: Date.now
    }//,
    //fixtures: [{ type: Schema.Types.ObjectId, ref: 'Fixture' }]
});

module.exports = mongoose.model('Team', TeamSchema);