var app = require("./server")

// Start the app by listening on <port>
var port = process.env.PORT || 4000
app.listen(port)
console.log("Tagnfile.it application started on port "+port);