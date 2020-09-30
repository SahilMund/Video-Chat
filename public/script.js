
const socket = io('/');
const videoGrid = document.getElementById('video-grid');

// creating a custom peer server
const myPeer = new Peer(undefined,{
    path:'/peerjs',
    host:'localhost',
    port:'5000'
})

const peers ={}
const myVideo = document.createElement('video');
// mute ourselves 
myVideo.muted = true;

// connect our video
navigator.mediaDevices.getUserMedia({
    video : true,
    audio : true
}).then(stream =>{
    addVideoStream(myVideo,stream)

    // for adding others video to my webpage
    myPeer.on('call',call =>{
        call.answer(stream)
        const Video = document.createElement('video');

        call.on('stream',userVideoStream =>{
            addVideoStream(Video,userVideoStream)
        })
    })
        
    // for new user
    socket.on('user-connected',userId =>{
       connectToNewUser(userId,stream)
    })  

})

// listening to all our events

// send an event to our server
myPeer.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id)
})

socket.on('user-connected',userId =>{
    console.log('user connected :'+ userId);
})  


socket.on('user-disconnected',userId =>{
  
    if(peers[userId]) {
        console.log('user disconnected :'+ userId);
        peers[userId].close();
    }
   
})  


function  connectToNewUser(userId,stream) {
    //  call an user with a certain id and sending them our audio and video stream
    const call = myPeer.call(userId , stream)
    const Video = document.createElement('video');

    call.on('stream', userVideoStream =>{
        addVideoStream(Video,userVideoStream)
    })
    call.on('close',()=>{
        Video.remove()
    })
    peers[userId] = call
}

// this function tell the video object to use that stream
function addVideoStream(video,stream) {
    // to play our video
    video.srcObject = stream
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
    // videoGrid.append(video);
    videoGrid.appendChild(video);

}

