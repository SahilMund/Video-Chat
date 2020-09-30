const express = require('express');
const app = express();

// creating a server that can be used with socket.io
const server = require('http').Server(app)

// custom peerjs server setup
const {ExpressPeerServer} = require('peer');

const peerServer = ExpressPeerServer(server ,{
    debug:true
})

// configuring our server with socket.io
const io = require('socket.io')(server)

// renaming v4 function as uuidV4 -and this is gonna give us a dynamic url
const {v4:uuidV4} = require('uuid');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/peerjs',peerServer);


app.get('/',(req,res)=>{
   res.redirect(`/${uuidV4()}`);
})

app.get('/:room',(req,res)=>{
    res.render('room',{roomId : req.params.room});
})

// This is gonna run any time when an user connects to our webpage
io.on('connection',socket =>{
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected',userId)

        socket.on('disconnect',()=>{
            socket.to(roomId).broadcast.emit('user-disconnected',userId)
        })
    })
})







const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running on port ${port}.....`))