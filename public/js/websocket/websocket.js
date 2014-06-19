var io = require('socket.io-client');

var socket; //socket.io client socket

var loadServerEvents = function() {
    require('../events/user')(socket);
    require('../events/item')(socket);
};

exports.initialize = function(){
    //Saves reference to the socket
    var url = location.protocol+'//'+location.host;
    socket = io.connect(url);
    loadServerEvents();
}

exports.send = function(key, data){
    socket.emit(key, data);
}


