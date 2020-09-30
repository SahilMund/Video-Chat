# PeerJS: Simple peer-to-peer with WebRTC #


PeerJS provides a complete, configurable, and easy-to-use peer-to-peer API built on top of WebRTC, supporting both data channels and media streams.


## Setup


**Include the library**

  with npm:

    npm install peerjs
    
and the usage:
  ```js
  import Peer from 'peerjs';
  ```


**Create a Peer**  
```javascript
const peer = new Peer('pick-an-id'); 
// You can pick your own id or omit the id if you want to get a random one from the server.
```

## Data connections
**Connect**
```javascript
const conn = peer.connect('another-peers-id');
conn.on('open', () => {
  conn.send('hi!');
});
```
**Receive**
```javascript
peer.on('connection', (conn) => {
  conn.on('data', (data) => {
    // Will print 'hi!'
    console.log(data);
  });
  conn.on('open', () => {
    conn.send('hello!');
  });
});
```

## Media calls
**Call**
```javascript
navigator.mediaDevices.getUserMedia({video: true, audio: true}, (stream) => {
  const call = peer.call('another-peers-id', stream);
  call.on('stream', (remoteStream) => {
    // Show stream in some <video> element.
  });
}, (err) => {
  console.error('Failed to get local stream', err);
});

```
**Answer**
```javascript
peer.on('call', (call) => {
  navigator.mediaDevices.getUserMedia({video: true, audio: true}, (stream) => {
    call.answer(stream); // Answer the call with an A/V stream.
    call.on('stream', (remoteStream) => {
      // Show stream in some <video> element.
    });
  }, (err) => {
    console.error('Failed to get local stream', err);
  });
});
```


## Links

### [Documentation / API Reference](https://peerjs.com/docs.html)

### [PeerServer](https://github.com/peers/peerjs-server)


PeerJS is licensed under the [MIT License](https://tldrlegal.com/l/mit).

