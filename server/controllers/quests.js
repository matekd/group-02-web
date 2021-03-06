var express = require('express');
var router = express.Router();
var Quest = require('../models/quest');


// Return a list of all quests. Also allows sorting by money_bounty
router.get('/api/quests', function(req, res, next) {
    var sort = req.query.sort_bounty;
    if (sort == 'asc') {
        Quest.find({}).sort([['money_bounty', 1]]).exec(function(err, quests) {
            if (err) { return next(err); }
            res.json({'quests': quests});
        });
    } else if (sort == 'desc') {
        Quest.find({}).sort([['money_bounty', -1]]).exec(function(err, quests) {
            if (err) { return next(err); }
            res.json({'quests': quests});
        });
    } else {
        Quest.find(function(err, quests) {
            if (err) { return next(err); }
            res.json({'quests': quests});
        });
    }
});

// Create a new quest
router.post('/api/parents/:parent_id/quests', function(req, res, next) {
    var quest = new Quest(req.body);
    quest.save(function(err) {
        if (err) { return res.status(400).json({'message': 'Bad Request'}); }
        res.status(201).json(quest);
    });
});

// Create a new quest for postman testing
router.post('/api/quests', function(req, res, next) {
    var quest = new Quest(req.body);
    quest.save(function(err) {
        if (err) { return res.status(400).json({'message': 'Bad Request'}); }
        res.status(201).json(quest);
    });
});

// Return the quest with the given ID
router.get('/api/quests/:quest_id', function(req, res, next) {
    var id = req.params.quest_id;
    Quest.findById(id, function(err, quest) {
        if (err) { return next(err); }
        if (quest === null) {
            return res.status(404).json({'message': 'Quest not found'});
        }
        res.json(quest);
    });
});

// Return all quests for the given parent
router.get('/api/parents/:parent_id/quests', function(req, res, next) {
    var id = req.params.parent_id;
    Quest.find({parent: id}, function(err, quests) {
        if (err) { return next(err); }
        if (quests === null) {
            return res.status(404).json({'message': 'Quest not found'});
        }
        res.json({'quests': quests});
    });
});

// Return a given quest for the given parent
router.get('/api/parents/:parent_id/quests/:quest_id', function(req, res, next) {
    var id = req.params.quest_id;
    Quest.findById(id, function(err, quest) {
        if (err) { return next(err); }
        if (quest === null) {
            return res.status(404).json({'message': 'Quest not found'});
        }
        res.json(quest);
    });
});

// Delete the quest with the given ID
router.delete('/api/quests/:quest_id', function(req, res, next) {
    var id = req.params.quest_id;
    Quest.findOneAndDelete({_id: id}, function(err, quest) {
        if (err) { return next(err); }
        if (quest === null) {
            return res.status(404).json({'message': 'Quest not found'});
        }
        res.json(quest);
    });
});

// Delete all quests
router.delete('/api/quests', function(req, res, next) {
    Quest.deleteMany({}, function(err, result){
        if (err) { return next(err); }
        if (result.n === 0) { 
            return res.status(404).json({'message': 'No Quests Found'});
        }
        res.json(result);
    }); 
});

// Delete the quest with the given ID for the given parent
router.delete('/api/parents/:parent_id/quests/:quest_id', function(req, res, next) {
    var id = req.params.quest_id;
    Quest.findOneAndDelete({_id: id}, function(err, quest) {
        if (err) { return next(err); }
        if (quest === null) {
            return res.status(404).json({'message': 'No Quests Found'});
        }
        res.json(quest);
    });
});

//Changes entire entity
router.put('/api/quests/:quest_id', function(req, res, next) {
    var id = req.params.quest_id;
    Quest.findById(id, function(err, quest) {
        if (err) { return next(err); }
        if (quest === null) {
            return res.status(404).json({'message': 'Quest not found'});
        }
        quest.quest_name   = req.body.quest_name;
        quest.money_bounty = req.body.money_bounty;
        quest.is_completed = req.body.is_completed;
        quest.quest_desc   = req.body.quest_desc;
        quest.date         = req.body.date;
        quest.is_pending   = req.body.is_pending;
        quest.completed_by = req.body.completed_by;
        quest.save(function(err, quest){
            if (err){
                res.status(400).json({'message': 'Bad Request'});
            } else {
                res.json(quest);
            }
        });
    });
});

//Changes specified attribute
router.patch('/api/quests/:quest_id', function(req, res, next) {
    var id = req.params.quest_id;
    Quest.findById(id, function(err, quest) {
        if (err) { return next(err); }
        if (quest === null) {
            return res.status(404).json({'message': 'Quest not found'});
        }
        quest.quest_name    = (req.body.quest_name   || quest.quest_name);
        quest.money_bounty  = (req.body.money_bounty || quest.money_bounty);
        quest.is_completed  = (req.body.is_completed || quest.is_completed);
        quest.quest_desc    = (req.body.quest_desc   || quest.quest_desc);
        quest.date          = (req.body.date         || quest.date);
        quest.completed_by  = (req.body.completed_by || quest.completed_by);
        quest.is_pending    = (req.body.is_pending   || quest.is_pending);
        quest.save(function(err, quest){
            if(err){
                res.status(400).json({'message': 'Bad Request'});
            } else {
                res.json(quest);
            }
        });
    });
});

module.exports = router;
