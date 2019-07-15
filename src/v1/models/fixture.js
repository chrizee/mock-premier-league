const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FixtureSchema = new Schema({
    homeTeamId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Team'
    },
    awayTeamId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Team'
    },
    homeTeamScore: {
        type: Number
    },
    awayTeamScore: {
        type: Number
    },
    matchDate: {
        type: Date
    },
    link: {
        type: String
    },
    match_played: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Fixture', FixtureSchema);