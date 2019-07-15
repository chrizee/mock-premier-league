require('dotenv').config();
const mongoose = require('mongoose');
const Team = require('./src/v1/models/team');
const Fixture = require('./src/v1/models/fixture');
//db config
const db = process.env.DATABASE_URI;
//connect to mongo
mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true
})
.then(() => {})
.catch(() => {})

const seed = async function() {
    let teams = [];
    for(let i = 0; i < 10; i++) {
        teams[i] = {name: "Team " + i};
    }
    try {
        await Fixture.deleteMany({});
        await Team.deleteMany({});        
        const matchDate = '2022-12-12 12:45:30';
        const insertedTeams = await Team.insertMany(teams);
        let fixtures = [];
        if(insertedTeams.length > 1) {            
            for(let x = 0; x < insertedTeams.length; x++) {
                for(let y = 0; y < insertedTeams.length; y++) {
                    if(x == y) continue;
                    fixtures.push({homeTeamId: insertedTeams[x]['_id'], awayTeamId: insertedTeams[y]['_id'], matchDate})
                }
            }
            const insertedFixtures = await Fixture.insertMany(fixtures)
            console.log("%s fixtures created for %s teams", insertedFixtures.length, insertedTeams.length);            
            process.exit();
        }
        console.log("%s teams created, no fixture created", insertedTeams.length);
        process.exit();
    } catch (error) {
        console.log('err',error);
        process.exit();
    }
}();
