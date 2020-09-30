##  What Socket.IO is ?


Socket.IO is a library that enables real-time, bidirectional and event-based communication between the browser and the server. 
It consists of:
i.  a Node.js server
ii. a Javascript client library for the browser (which can be also run from Node.js)

<img src="https://socket.io/images/bidirectional-communication.png" alt="">


##  How does that work?

The client will try to establish a WebSocket connection if possible, and will fall back on HTTP long polling if not.

WebSocket is a communication protocol which provides a full-duplex and low-latency channel between the server and the browser.

####    Syntax:
```
const socket = io('ws://localhost:3000');

socket.on('connect', () => {
  // either with send()
  socket.send('Hello!');

  // or with emit() and custom event names
  socket.emit('salutations', 'Hello!', { 'mr': 'john' }, Uint8Array.from([1, 2, 3, 4]));
});

// handle the event sent with socket.send()
socket.on('message', data => {
  console.log(data);
});

// handle the event sent with socket.emit()
socket.on('greetings', (elem1, elem2, elem3) => {
  console.log(elem1, elem2, elem3);
});
```
Socket.IO provides additional features over a plain WebSocket object.

##  What Socket.IO is not
Socket.IO is NOT a WebSocket implementation. Although Socket.IO indeed uses WebSocket as a transport when possible, it adds additional metadata to each packet. That is why a WebSocket client will not be able to successfully connect to a Socket.IO server, and a Socket.IO client will not be able to connect to a plain WebSocket server either.


##  The server library can be installed from NPM:
```
npm install socket.io
```

## <u><b>Emit Cheatsheet</u></b> :-
```
io.on('connect', onConnect);

function onConnect(socket){

  // sending to the client
  socket.emit('hello', 'can you hear me?', 1, 2, 'abc');

  // sending to all clients except sender
  socket.broadcast.emit('broadcast', 'hello friends!');

  // sending to all clients in 'game' room except sender
  socket.to('game').emit('nice game', "let's play a game");

  // sending to all clients in 'game1' and/or in 'game2' room, except sender
  socket.to('game1').to('game2').emit('nice game', "let's play a game (too)");

  // sending to all clients in 'game' room, including sender
  io.in('game').emit('big-announcement', 'the game will start soon');

  // sending to all clients in namespace 'myNamespace', including sender
  io.of('myNamespace').emit('bigger-announcement', 'the tournament will start soon');

  // sending to a specific room in a specific namespace, including sender
  io.of('myNamespace').to('room').emit('event', 'message');

  // sending to individual socketid (private message)
  io.to(socketId).emit('hey', 'I just met you');

  // WARNING: `socket.to(socket.id).emit()` will NOT work, as it will send to everyone in the room
  // named `socket.id` but the sender. Please use the classic `socket.emit()` instead.

  // sending with acknowledgement
  socket.emit('question', 'do you think so?', function (answer) {});

  // sending without compression
  socket.compress(false).emit('uncompressed', "that's rough");

  // sending a message that might be dropped if the client is not ready to receive messages
  socket.volatile.emit('maybe', 'do you really need it?');

  // specifying whether the data to send has binary data
  socket.binary(false).emit('what', 'I have no binaries!');

  // sending to all clients on this node (when using multiple nodes)
  io.local.emit('hi', 'my lovely babies');

  // sending to all connected clients
  io.emit('an event sent to all connected clients');

};
```

## Socket.io init
```
const options = { /* ... */ };
const io = require('socket.io')(3000, options);

io.on('connection', socket => { /* ... */ });
```

### With Express
```
const app = require('express')();
const server = require('http').createServer(app);
const options = { /* ... */ };
const io = require('socket.io')(server, options);

io.on('connection', socket => { /* ... */ });

server.listen(3000);
```

##  NameSpace
A Namespace is a communication channel that allows you to split the logic of your application over a single shared connection.

<img src="https://socket.io/images/namespaces.png" alt="">

## Rooms
Within each Namespace, you can define arbitrary channels called “Rooms” that sockets can join and leave.

This is useful to broadcast data to a subset of sockets.

<img src="https://socket.io/images/rooms.png" alt="">

##  Joining and leaving
You can call join to subscribe the socket to a given channel:
```
io.on('connection', socket => {
  socket.join('some room');
});
```
And then simply use to or in (they are the same) when broadcasting or emitting:
```
io.to('some room').emit('some event');
```
You can emit to several rooms at the same time:
```
io.to('room1').to('room2').to('room3').emit('some event');
```
In that case, an union is performed: every socket that is at least in one of the rooms will get the event once (even if the socket is in two or more rooms).

You can also broadcast to a room from a given socket:
```
io.on('connection', function(socket){
  socket.to('some room').emit('some event');
});
```
In that case, every socket in the room excluding the sender will get the event.

To leave a channel you call leave in the same fashion as join. Both methods are asynchronous and accept a callback argument.

####    Default room
Each Socket in Socket.IO is identified by a random, unguessable, unique identifier Socket#id. For your convenience, each socket automatically joins a room identified by its own id.

This makes it easy to broadcast messages to other sockets:
```
io.on('connection', socket => {
  socket.on('say to someone', (id, msg) => {
    socket.to(id).emit('my message', msg);
  });
});
```
#####   Sample use cases
broadcast data to each device / tab of a given user
```
io.on('connection', async (socket) => {
  const userId = await fetchUserId(socket);

  socket.join(userId);

  // and then later
  io.to(userId).emit('hi');
});
```
send notifications about a given entity
```
io.on('connection', async (socket) => {
  const projects = await fetchProjects(socket);

  projects.forEach(project => socket.join('project:' + project.id));

  socket.on('update project', async (payload) => {
    const project = await updateProject(payload);
    io.to('project:' + project.id).emit('project updated', project);
  });
});
```
#####   Disconnection
Upon disconnection, sockets leave all the channels they were part of automatically, and no special teardown is needed on your part.

You can fetch the rooms the Socket was in by listening to the disconnecting event:
```
io.on('connection', socket => {
  socket.on('disconnecting', () => {
    const rooms = Object.keys(socket.rooms);
    // the rooms array contains at least the socket ID
  });

  socket.on('disconnect', () => {
    // socket.rooms === {}
  });
});
```
#####   Sending messages from the outside-world
In some cases, you might want to emit events to sockets in Socket.IO namespaces / rooms from outside the context of your Socket.IO processes.

There are several ways to tackle this problem, like implementing your own channel to send messages into the process.

To facilitate this use case, we created two modules:

* socket.io-redis
* socket.io-emitter
  
By implementing the Redis Adapter:
```
const io = require('socket.io')(3000);
const redis = require('socket.io-redis');
io.adapter(redis({ host: 'localhost', port: 6379 }));
```
you can then emit messages from any other process to any channel
```
const io = require('socket.io-emitter')({ host: '127.0.0.1', port: 6379 });
setInterval(function(){
  io.emit('time', new Date);
}, 5000);
```