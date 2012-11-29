
//var passport = require('passport')

var User = require('../models/user')

module.exports = function(app) {
	app.resource('sessions', new SessionController());
}

var SessionController = function() {
	return {
		//index: function(req, res){
			
		//},
		//new: function(req, res) {
		//},
		create: function(req, res){
			var userInfo = req.body;
			User.authenticate(userInfo.email, userInfo.password, function(err, user) {
				if(err) 
					return res.json(500, { error: err });

				if(!user)
					return res.json(404, { error: "user not found"}); //TODO take errors with codes and messages in one module

				req.login(user, function(err) {
					if(err) return res.json(500, { error: err });

					return res.json({ result: 'ok'});
				});
			});
		}/*,
		show: function(req, res){
			
		},
		edit: function(req, res){
			
		},
		update: function(req, res){
			
		},
		destroy: function(req, res){
			
		},
		load: function(id, fn) {

		}*/
	}
}

