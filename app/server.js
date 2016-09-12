var Hapi    = require('hapi');
var routes  = require('./routes.js');
var RaspiCam = require("raspicam");

var opts = {
  mode: "timelapse",
  output: "/home/pi/node-raspicam-web/public/img/image%06d.jpg",
  timelapse: 60 * 1000,
  timeout: 0,
  width: 800,
  height: 600
}
var camera = null;

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

  opts.timelapse = interval * 1000;
  camera = new RaspiCam( opts );

  camera.on("start", function() {
    console.log("Camera started");
  });

  camera.on("read", function(err, timestamp, filename) {
    console.log("Camera read");
    d = new Date(timestamp).toLocaleString();
    f = "/img/" + filename;
    updateLastImage(d, f);
    io.emit('image:updated', JSON.stringify(data));
  });

  camera.on("stop", function() {
    console.log("Camera stopped");
  });

  camera.on("exit", function() {
    console.log("Camera exited");
  });

  camera.start();
}

function stop() {
  data.message = "Stopped";
  camera.stop();
}

function updateLastImage(timestamp, url) {
  data.lastImageTakenAt = timestamp;
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

