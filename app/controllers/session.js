
//var passport = require('passport')

var User = require('../models/user');

var sessionConfig = require('../session-config');

module.exports = function(app) {
    var sessionController = new SessionController();
    //patch a bit create action
    var oldCreateSession = sessionController.create;

    sessionController.create = function(req, res) {
        sessionConfig.sessionCreate(req, res, function() {
            oldCreateSession(req, res);
        })
    };

	app.resource('sessions', sessionController);
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

				// so now i know that it is my user save it in session
                if(req.session) {
                    req.session.currentUser = user;
                    req.currentUser = user;
                }

                // send back assossiated session id
                res.json({ sid: req.sessionID });
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

