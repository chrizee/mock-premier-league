const {validationResult} = require('express-validator');

const Team = require('../models/team');

//@desc get all teams
exports.index = (req, res) => {
    Team.find({}, 'name date')
        .then(teams => {
            res.status(200).json({success: true, message: "successful", teams});
        })
        .catch(err => res.status(500).json({success: false, message: "successful"}));
}
 
exports.store = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({success: false, message: "Validation failed", errors});
    }

    const {name} = req.body;
    Team.findOne({name})
        .then(team => {
            if(team) {
                return res.status(400).json({success: false, message: "A team with that name already exist"})
            }
            const newTeam = new Team({name});
            newTeam.save()
            .then(team => res.status(201).json({success: true, message: "Team created successfully", team}))
            .catch(err => res.status(500).json({success: false, message: "Unable to save"}))        
        })
        .catch(err => {
            res.status(500).json({success: false, message: "Something went wrong. Please try again"});
        })
        
}

exports.update = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({success: false, message: "Validation failed", errors});
    }

    const {name} = req.body;
    //check if a team with the new name already exist
    Team.find({name})
        .then(teams => {
            if(Array.isArray(teams) && teams.length) {
                return res.status(400).json({success: false, message: "A team with that name already exist"});
            } else {
                //check if the team exist
                Team.findById(req.params.id)
                    .then(team => {
                        if(team) {
                            team.name = name;
                            team.save()
                                .then(team => res.status(200).json({success: true, message: "Team updated successfully", team}))
                                .catch(err => res.status(500).json({success: false, message: "Error updating team. Please try again"}))                    
                        } else {
                            return res.status(400).json({success: false, message: "No team found"});
                        }              
                    })
                    .catch(err => {
                        return res.status(500).json({success: false, message: "Team cannot be found. Please try again"});
                    })
            }
        })
        .catch(err => res.status(500).json({success: false, message: "Something went wrong. Please try again"}));        
}

exports.delete = (req, res) => {
    Team.findById(req.params.id)
        .then(team => {
            if(team){
                team.remove()
                .then(() => res.status(200).json({success: true, message: "Team deleted successfully"}))
                .catch(err => res.status(500).json({success: false, message: "Error deleting team. Please try again"}));            
            } else {
                res.status(204).json({success: false, message: "No team found"});
            }
        })
        .catch(err => res.status(500).json({success: false, message: "something went wrong. Please try again."}))
}