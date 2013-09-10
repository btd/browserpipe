var app = require('./api/server');

var port = process.env.PORT || 4001;

app.listen(port);

console.log("Listboard.it API application started on port " + port);
