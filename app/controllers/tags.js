
var mongoose = require('mongoose')
  , Tag = mongoose.model('Tag')
  , _ = require('underscore')


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

// Get a tag and its children
exports.getTagAndChildren = function(req, res){
  var parentPath = _.initial(req.tagPath.path.substring(0, req.tagPath.path.length - 1).split(".")).join(".");
  Tag.getTagAndChildrenByPath(req.user, parentPath, req.tagPath, function(tags){
    res.send(tags)
  }, function(err) {
    throw err
  })
}


// Create a tag
exports.create = function (req, res) {
  var tag = new Tag(req.body)
  tag.user = req.user
  tag.save(function(err){
    if (err)
      res.send(err.errors)  //TODO: send corresponding number error
    else
      res.send(tag._id)
  })
}

/*// Edit an tag
exports.edit = function (req, res) {
  res.render('tags/edit', {
    title: 'Edit '+req.tag.title,
    tag: req.tag
  })
}*/

/*// Update tag
exports.update = function(req, res){
  var tag = req.tag

  tag = _.extend(tag, req.body)

  tag.save(function(err, doc) {
    if (err) {
      res.render('tags/edit', {
          title: 'Edit Tag'
        , tag: tag
        , errors: err.errors
      })
    }
    else {
      res.redirect('/tags/'+tag._id)
    }
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
