var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    Tag = mongoose.model('Tag'),
    Dashboard = mongoose.model('Dashboard'),
    Item = mongoose.model('Item')

//No dashboard
exports.showEmpty = showDashboard;

//Show dashboard
exports.show = showDashboard;

//Create dashboard
exports.create = function (req, res) {
    var dashboard = new Dashboard({ label: req.body.label, user: req.user });
    req.user.currentDashboard = dashboard;
    q.all([dashboard.saveWithPromise(),
            req.user.saveWithPromise()])
        .spread(function () {
            res.json({ _id: dashboard._id })
        },function (err) {
            res.json(400, err.errors);
        }).done()
}

//Update dashboard
exports.update = function (req, res) {

    var dashboard = req.currentDashboard;
    dashboard.label = req.body.label
    dashboard.saveWithPromise().then(function () {
        res.json({ _id: dashboard._id })
    },function (err) {
        //TODO: send corresponding number error
        res.json(err.errors)
    }).done()


}

//Find dashboard by id
exports.dashboard = function (req, res, next, id) {
    Dashboard
        .findOne({ _id: id })
        .exec(function (err, dashboard) {
            if (err) return next(err)
            req.currentDashboard = dashboard
            next()
        })
}

function showDashboard(req, res) {
    q.all([
            Dashboard.getAll(req.user),
            Tag.getAll(req.user)
        ]).spread(function (dashboards, tags) {
            //We only load the ones from opened containers

            var containerFilters = _(dashboards).map(function (dashboard) {
                return _.map(dashboard.containers, 'filter');
            }).flatten().value();

            Item.getAllByFilters(
                    req.user,
                    containerFilters
                ).then(function (items) {
                    res.render('main/home', {
                            currentDashboardId: ((req.currentDashboard && req.currentDashboard.id) || req.user.currentDashboard.id),
                            user: req.user,
                            dashboards: dashboards,
                            items: items,
                            tags: tags}
                    );
                }, function (error) {
                    res.render('500')
                });
        },function () {
            res.render('500')
        }).done();

}

//Delete item
exports.destroy = function (req, res) {
    var dashboard = req.currentDashboard;
    dashboard.remove(function (err) {
        res.json({ _id: dashboard._id })
    })

}