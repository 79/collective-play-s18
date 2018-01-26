let port = process.env.PORT || 8000;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function () {
  console.log('Server listening at port: ', port);
});

app.use(express.static('public'));

let io = require('socket.io').listen(server);

io.sockets.on('connection',
  function (socket) {

    console.log("We have a new client: " + socket.id);

    // Listen for username
    socket.on('username', function(username){
      let message = {
        id : socket.id,
        username : username,
      }

      io.sockets.emit('username', message);
    });

    // Listen for data from this client
    socket.on('data', function(data) {
      let message = {
        id: socket.id,
        data : data
      }

      io.sockets.emit('message', message);
    });

    // Listen for this client to disconnect
    socket.on('disconnect', function() {
      io.sockets.emit('disconnected', socket.id);
    });
  }
);
