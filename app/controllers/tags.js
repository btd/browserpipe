
var mongoose = require('mongoose')
  , Tag = mongoose.model('Tag')
  , _ = require('underscore')

// New tag
exports.new = function(req, res){
  res.render('tags/new', {
      title: 'New Tag'
    , tag: new Tag({})
  })
}

// Create an tag
exports.create = function (req, res) {
  var tag = new Tag(req.body)
  tag.user = req.user

  tag.save(function(err){
    if (err) {
      res.render('tags/new', {
          title: 'New Tag'
        , tag: tag
        , errors: err.errors
      })
    }
    else {
      res.redirect('/tags/'+tag._id)
    }
  })
}

// Edit an tag
exports.edit = function (req, res) {
  res.render('tags/edit', {
    title: 'Edit '+req.tag.title,
    tag: req.tag
  })
}

// Update tag
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
}

// View an tag
exports.show = function(req, res){
  res.render('tags/show', {
    title: req.tag.title,
    tag: req.tag,
    comments: req.comments
  })
}

// Delete an tag
exports.destroy = function(req, res){
  var tag = req.tag
  tag.remove(function(err){
    // req.flash('notice', 'Deleted successfully')
    res.redirect('/tags')
  })
}

// Listing of Tags
exports.index = function(req, res){
  Tag
    .find({user: req.user})
    .populate('user', 'label', 'path')
    .sort({'createdAt': -1}) // sort by date
    // .limit(perPage)
    // .skip(perPage * page)
    .exec(function(err, tags) {
      // TODO manage errors propertly
      if (err) throw err
      res.send(tags)
    })
}