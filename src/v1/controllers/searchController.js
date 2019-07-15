const Team = require('../models/team');
const Fixture = require('../models/fixture');

exports.search = (req, res) => {
    let entity = req.query.entity;
    if(entity) {
        entity = entity.toLowerCase();
        delete req.query.entity;
        let searchObj = {};
        for(let key in req.query) {
            if(key.toLowerCase().includes("date")) {
                searchObj[key] = req.query[key].trim();
            } else {
                searchObj[key] = { $regex: '.*' + req.query[key].trim() + '.*', $options: 'i'}            
            }
        }
        if(Object.keys(searchObj).length > 0) {
            if(entity == 'team' || entity == 'teams') {            
                return Team.find(searchObj)
                    .then(teams => res.status(200).json({success: true, message: "successful", teams}))
                    .catch(() => res.status(500).json({success: false, message: "Something went wrong. Please check the format and try again"}));
            }
            if(entity == 'fixtures' || entity == 'fixture') {
                return Fixture.find(searchObj)
                    .then(fixtures => res.status(200).json({success: true, message: "successful", fixtures}))
                    .catch(() => res.status(500).json({success: false, message: "Something went wrong. Please check the format and try again"}));
            }            
        }
        return res.status(400).json({success: false, message: "Invalid search format"});
    } else {
        return res.status(400).json({success: false, message: "Invalid search format"});
    }
    
}