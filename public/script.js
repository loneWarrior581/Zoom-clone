//to identify the new user we are using here the peer js.this library provides us the accepts the userid and then it helps us way easier to stream our video
const socket=io('/')
const videoGrid=document.getElementById('video-grid');
const myVideo=document.createElement('video');
myVideo.muted=true;

var peer = new Peer(undefined,{
    path:'/peerjs',
    host:'/',  //the host on which we hosted our website 
    port:'80'
});
 
let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream =>{
    myVideoStream=stream;
    addVideostream(myVideo,stream);

    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideostream(video, userVideoStream)
        })
      })

    socket.on('user-connected',(useId)=>{
        connectToNewUser(useId,stream);
    })

})

peer.on('open', id =>{//opening this connection for the clienst to join and assigning them with the id 
    socket.emit('join-room',ROOM_ID,id);
})




const connectToNewUser=(useId,stream)=>{//this is the others user joined our room and we are making a call to all the other users who joined the room
   const call=peer.call(useId,stream)
   const video=document.createElement('video')
   call.on('stream',userVideoStream =>{//calling other users and adding it to the video element 
       addVideostream(video,userVideoStream)
   })
}

const addVideostream=(video,stream)=>{
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videoGrid.append(video);
}
// https://youtu.be/ZVznzY7EjuY?t=6462