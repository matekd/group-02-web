var express = require('express');
var router = express.Router();
var Child = require('../models/child');

// Return a list of all children
router.get('/api/children', function(req, res, next) {
    Child.find(function(err, children) {
        if (err) { return next(err); }
        res.json({'children': children});
    });
});

// Create a new child
router.post('/api/children', function(req, res, next) {
    var child = new Child(req.body);
    child.save(function(err) {
        if (err) { return next(err); }
        res.status(201).json(child);
    });
});

// Return the child with the given ID
router.get('/api/children/:child_id', function(req, res, next) {
    var id = req.params.child_id;
    Child.findById(id, function(err, child) {
        if (err) { return next(err); }
        if (child === null) {
            return res.status(404).json({'message': 'Child not found'});
        }
        res.json(child);
    });
});

// Delete the child with the given ID
router.delete('/api/children/:child_id', function(req, res, next) {
    var id = req.params.id;
    Child.findOneAndDelete({_id: id}, function(err, child) {
        if (err) { return next(err); }
        if (child === null) {
            return res.status(404).json({'message': 'Child not found'});
        }
        res.json(child);
    });
});

// Update the child with given ID
router.put('/api/children/:child_id', function(req, res, next) {
    var id = req.params.child_id;
    Child.findById(id, function(err, child) {
        if (err) {return next(err); }
        if (child === null) {
            return res.status(404).json({"message" : "Child not found"});
        }
        child.username         = req.body.username;
        child.child_password = req.body.child_password;
        child.parent_password  = req.body.parent_password;
        child.balance          = req.body.balance;
        child.save();
        res.json(child);
    });
});

// Partially update child with given ID
router.patch('/api/children/:child_id', function(req, res, next) {
    var id = req.params.child_id;
    Child.findById(id, function(err, child) {
        if (err) {return next(err); }
        if (child === null) {
            return res.status(404).json({"message" : "Child not found"});
        }
        child.username         = ( req.body.username         || child.username );
        child.child_password = ( req.body.child_password || child.child_password );
        child.parent_password  = ( req.body.parent_password  || child.parent_password );
        child.balance          = ( req.body.balance          || child.balance );
        child.save();
        res.json(child);
    });
});

module.exports = router;