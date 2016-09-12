var socket = io();

var input = document.getElementsByClassName("todo")[0];
var start = document.getElementsByClassName("submit")[0];
var stop = document.getElementsByClassName("submit")[1];

start.disabled = false;
stop.disabled = true;

start.onclick = function() {
  socket.emit("start", input.value);
  start.disabled = true;
  stop.disabled = false;
};

stop.onclick = function() {
  socket.emit("stop");
  start.disabled = false;
  stop.disabled = true;
};

socket.on('image:updated', function(data) {
  console.log("image:updated socket in mainjs called")
  imagedata = JSON.parse(data);
  riot.mount('latest-image', {data: imagedata});
})
