
var mongoose = require('mongoose')
  , Folder = mongoose.model('Folder')
  , _ = require('underscore')

// New folder
exports.new = function(req, res){
  res.render('folders/new', {
      title: 'New Folder'
    , folder: new Folder({})
  })
}

// Create an folder
exports.create = function (req, res) {
  var folder = new Folder(req.body)
  folder.user = req.user

  folder.save(function(err){
    if (err) {
      res.render('folders/new', {
          title: 'New Folder'
        , folder: folder
        , errors: err.errors
      })
    }
    else {
      res.redirect('/folders/'+folder._id)
    }
  })
}

// Edit an folder
exports.edit = function (req, res) {
  res.render('folders/edit', {
    title: 'Edit '+req.folder.title,
    folder: req.folder
  })
}

// Update folder
exports.update = function(req, res){
  var folder = req.folder

  folder = _.extend(folder, req.body)

  folder.save(function(err, doc) {
    if (err) {
      res.render('folders/edit', {
          title: 'Edit Folder'
        , folder: folder
        , errors: err.errors
      })
    }
    else {
      res.redirect('/folders/'+folder._id)
    }
  })
}

// View an folder
exports.show = function(req, res){
  res.render('folders/show', {
    title: req.folder.title,
    folder: req.folder,
    comments: req.comments
  })
}

// Delete an folder
exports.destroy = function(req, res){
  var folder = req.folder
  folder.remove(function(err){
    // req.flash('notice', 'Deleted successfully')
    res.redirect('/folders')
  })
}

// Listing of Folders
exports.index = function(req, res){
  Folder
    .find({user: req.user})
    .populate('user', 'label', 'path')
    .sort({'createdAt': -1}) // sort by date
    // .limit(perPage)
    // .skip(perPage * page)
    .exec(function(err, folders) {
      // TODO manage errors propertly
      if (err) throw err
      res.send(folders)
    })
}