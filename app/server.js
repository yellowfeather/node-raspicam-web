var Hapi    = require('hapi');
var routes  = require('./routes.js');
var server  = new Hapi.Server();

data = {
  message: 'Not started',
  interval: 60,
  startedAt: null,
  lastImageTakenAt: null,
  lastImageUrl: null
};

function start(interval) {
  data.message = "Started";
  data.interval = interval;
  data.startedAt = new Date().toLocaleString();
  data.lastImageTakenAt = null;
  data.lastImageUrl = null;

  showGiraffe = true;
  tick();
  timer = setInterval(tick, data.interval * 1000);
}

function stop() {
  data.message = "Stopped";
  clearInterval(timer);
}

function updateLastImage(url) {
  data.lastImageTakenAt = new Date().toLocaleString();
  data.lastImageUrl = url;
}

server.connection({
  port: process.env.PORT || 9090
});

var socketio = require('socket.io');

server.route(routes);

function tick() {
  console.log("tick");
  imageurl = showGiraffe ? '/img/giraffe.jpg' : '/img/leopard.jpg';
  updateLastImage(imageurl);
  io.emit('image:updated', JSON.stringify(data));
  showGiraffe = !showGiraffe;
}

function socketSetup (socket) {

  console.log("socketSetup connected!")

  socket.on("start", function(data) {
    console.log("start server.js called, data: ", data);
    start(data);
  });

  socket.on("stop", function() {
    console.log("stop server.js called");
    stop();
    io.emit('image:updated', JSON.stringify(data));
  });
}

function init (listener, callback) {
  io = socketio(listener);
  io.on('connection', socketSetup);

  callback();
}

module.exports = {
  server: server,
  init: init
};

