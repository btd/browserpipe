var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    Window = mongoose.model('Window'),
    List = mongoose.model('List')

//Home
exports.home = function (req, res) {
    if (req.isAuthenticated()){ 

		var browsers = req.user.browsers;
	    var listboards = req.user.listboards;
	    q.all([ List.getAll(req.user), Window.getAllActiveByBrowsers(browsers) ])
	        .spread(function (lists, windows) {	        	
	            //We only load the ones from opened containers
	            var containerFilters = _(listboards).map(function (listboard) {
	                return _.map(listboard.containers, 'filter');
	            }).flatten().value();

	            return Item.findAllByFilters(
                    req.user,
                    containerFilters
                ).then(function (items) {
                    return [windows, listboards, lists, items];
                });
	        }).spread(function(windows, listboards, lists, items){
	        	res.render('main/home', {                            
                    user: req.user,
                    browsers: req.user.browsers,
                    windows: windows,
                    listboards: listboards,
                    items: items,
                    lists: lists
                });
	        }).fail(function (err) {	        	
	            res.render('500')
	        }).done();
    }
    else
        res.render('main/index')
}

//Chrome Extension
exports.chromeExtension = function (req, res) {
    res.contentType('application/x-chrome-extension');
    res.sendfile('app/extensions/chrome/build/1.0/extension.crx');   
}



