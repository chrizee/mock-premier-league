const {validationResult} = require('express-validator');

const Fixture = require('../models/fixture');

//@desc get all fixtures
exports.index = (req, res) => {
    Fixture.find({})
        .populate('homeTeamId')
        .populate('awayTeamId')
        .then(fixtures => res.json({status: true, message: "successful", fixtures}))
        .catch(() => res.status(500).json({status: false, message: "something went wrong"}))
}

exports.show = (req, res) => {
    Fixture.findById(req.params.id)
        .populate("homeTeamId")
        .populate("awayTeamId")
        .then(fixture => res.json({status: true, message: "successful", fixture}))
        .catch(() => res.status(500).json({status: false, message: "something went wrong"}))

}

exports.completed = (req, res) => {
    Fixture.find({match_played: true})
        .populate('homeTeamId')
        .populate('awayTeamId')
        .then(fixtures => res.json({status: true, message: "successful", fixtures}))
        .catch(() => res.status(500).json({status: false, message: "something went wrong"}))
}

exports.pending = (req, res) => {
    Fixture.find({match_played: false})
        .populate('homeTeamId')
        .populate('awayTeamId')
        .then(fixtures => res.json({status: true, message: "successful", fixtures}))
        .catch(() => res.status(500).json({status: false, message: "something went wrong"}))
}

exports.store = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({success: false, message: "Validation failed", errors});
    }
    const {homeTeamId, awayTeamId, matchDate} = req.body;
    //check if that fixture exist already
    Fixture.find({homeTeamId, awayTeamId})
        .then(fixture => {
            if(Array.isArray(fixture) && fixture.length) {
                return res.status(400).json({success: false, message: "Fixture for those teams already exist"});            
            } else {
                const newFixture = new Fixture({homeTeamId, awayTeamId, matchDate, match_played: false});
                newFixture.save()
                    .then(fixture => {
                        res.status(201).json({status: true, message: "Fixture created successfully", fixture})
                    })
                    .catch(err => res.status(500).json({sussess: false, message: "Unable to save"}))        
            }
            
        })
        .catch(() => res.status(500).json({success: false, message: "Something went wrong. Please try again"}))
}

exports.update = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({success: false, message: "Validation failed", errors});
    }
    const {homeTeamScore, awayTeamScore, matchDate} = req.body;
    Fixture.findById(req.params.id)
        .then(fixture => {
            if(fixture) {
                if(fixture.match_played) {
                    return res.status(400).json({success: false, message: "You cannot update a match that has been marked as played"});
                }
                if(matchDate) {
                    fixture.matchDate = matchDate;
                }
                if(homeTeamScore != null && awayTeamScore != null) {
                    fixture.homeTeamScore = homeTeamScore;
                    fixture.awayTeamScore = awayTeamScore;
                    fixture.match_played = true;
                }
                fixture.save()
                    .then(fixture => res.status(200).json({success: true, message: "Fixture updated successfully", fixture}))
                    .catch(() => res.status(500).json({success: false, message: "Error updating fixture"}))
            } else {
                return res.status(400).json({success: false, message: "Fixture not found"});
            }
        })
        .catch(() => res.status(500).json({success: false, message: "Something went wrong. Please try again"}))
}

exports.delete = (req, res) => {
    Fixture.findById(req.params.id)
        .then(fixture => {
            if(fixture) {
                fixture.remove()
                    .then(() => res.status(200).json({success: true, message: "Fixture deleted successfully"}))
                    .catch(err => res.status(500).json({success: false, message: "Error deleting fixture. Please try again"}))
            } else {
                res.status(204).json({success: false, message: "No fixture found"});
            }
        })
        .catch(() => res.status(500).json({success: false, message: "Something went wrong. Please try again"}))
}

exports.generateLink = (req, res) => {
    Fixture.findById(req.params.id)
        .then(fixture => {
            if(fixture) {
                const url = req.protocol + '://' + req.hostname + req.baseUrl + '/' + req.params.id;                
                fixture.link = url;
                fixture.save()
                    .then((fixture) => res.status(200).json({success: true, message: "Unique link generated for fixture", fixture}))
                    .catch(err => res.status(500).json({success: false, message: "Error generating link. Please try again"}))
            } else {
                res.status(204).json({success: false, message: "No fixture found"});
            }
        })
        .catch(() => res.status(500).json({success: false, message: "Something went wrong. Please try again"}))
}