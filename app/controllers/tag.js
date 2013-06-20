var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    Tag = mongoose.model('Tag')


//Create tag
exports.create = function (req, res) {
    if (req.isAuthenticated()) {
        var tag = new Tag(req.body)
        tag.user = req.user
        q.all([tag.saveWithPromise()])
            .spread(function () {
                res.json({ _id: tag._id })
            },function (err) {
                //TODO: send corresponding number error
                res.json(err.errors)
            }).done()
    }
    else
        res.send("invalid request")
}

//Update tag
exports.update = function (req, res) {
    if (req.isAuthenticated() && req.currentTag) {
        var tag = req.currentTag;
        if (req.body.label)
            tag.label = req.body.label
        if (req.body.path)
            tag.path = req.body.path
        tag.saveWithPromise().then(function () {
            res.json({ _id: tag._id })
        },function (err) {
            //TODO: send corresponding number error
            res.json(err.errors)
        }).done()
    }
    else
        res.send("invalid request")
}

//Find tag by id
exports.tag = function (req, res, next, id) {
    Tag
        .findOne({ _id: id })
        .exec(function (err, tag) {
            if (err) return next(err)
            req.currentTag = tag
            next()
        })
}


// Listing of Tags
/*exports.index = function(req, res){
 Tag
 .find({user: req.user})
 //.populate('user', 'label', 'path')
 .sort({'path': -1}) // sort by date
 // .limit(perPage)
 // .skip(perPage * page)
 .exec(function(err, tags) {
 // TODO manage errors propertly
 if (err) throw err
 res.send(tags)
 })
 }*/

/*// Get a tag and its children
 exports.getTagAndChildren = function(req, res){
 var parentPath = _.initial(req.tagPath.path.substring(0, req.tagPath.path.length - 1).split(".")).join(".");
 Tag.getTagAndChildrenByPath(req.user, parentPath, req.tagPath, function(tags){
 res.send(tags)
 }, function(err) {
 throw err
 })
 }*/

/*// Delete an tag
 exports.destroy = function(req, res){
 var tag = req.tag
 tag.remove(function(err){
 // req.flash('notice', 'Deleted successfully')
 res.redirect('/tags')
 })
 }*/
