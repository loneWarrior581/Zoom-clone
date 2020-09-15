// import { text } from "express";

//to identify the new user we are using here the peer js.this library provides us the accepts the userid and then it helps us way easier to stream our video
const socket = io('/')
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',  //the host on which we hosted our website will get this through the herroku 
    port: '80'//for deployment 443
});

let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true   //make it true
}).then(stream => {
    myVideoStream = stream;
    addVideostream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideostream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (useId) => {
        connectToNewUser(useId, stream);
    })
    //adding the functationality of messaging 
    let text = $('input');
    // console.log(text)

    $('html').keydown((e) => {
        if (e.which == 13 && text.val().lenght != 0) {
            console.log(text.val())
            socket.emit('message', text.val());
            text.val('');
        }
    })

    //creating the meggage to the user
    socket.on('createMessage', (message) => {
        $('ul').append(`<li class="message"><b>User</b><br>${message}</li>`);
        scrollToBottom();
    })

})

peer.on('open', id => {//opening this connection for the client to join and assigning them with the id 
    socket.emit('join-room', ROOM_ID, id);
})




const connectToNewUser = (useId, stream) => {//this is the others user joined our room and we are making a call to all the other users who joined the room
    const call = peer.call(useId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {//calling other users and adding it to the video element 
        addVideostream(video, userVideoStream)
    })
}

const addVideostream = (video, stream) => {
    const div =document.createElement('div');
    div.classList.add("video__element");
    video.srcObject = stream;
    div.appendChild(video);
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(div);
}


// //adding the functationality of messaging 
// let text = $('input');
// // console.log(text)

// $('html').keydown((e) => {
//     if (e.which == 13 && text.val().lenght != 0) {
//         console.log(text.val())
//         socket.emit('message', text.val());
//         text.val('');
//     }
// })

// //creating the meggage to the user
// socket.on('createMessage', (message) => {
//     $('ul').append(`<li class="message"><b>User</b>${message}</li>`);
// })

const scrollToBottom=()=>{
    var d=$('.main__chat__window');
    d.scrollTop(d.prop("scrollHeight"))
}

//mute button
const muteUnmute=()=>{
    const enabled=myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled=false;
        setUnmuteButton();
    }
    else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled=true;
    }
}

//html for the buttons 
const setMuteButton=()=>{
    const html=`
    <i class="mute fas fa-microphone"></i>
    <span>Mute</span>
    `
    document.querySelector(".main__mute__button").innerHTML=html;
}
const setUnmuteButton=()=>{
    const html=`
    <i class=" unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `
    document.querySelector(".main__mute__button").innerHTML=html;
}



//for the video
const playStop=()=>{
    const enabled=myVideoStream.getVideoTracks()[0].enabled;
    var avDiv=document.createElement('div');
    avDiv.id="avtar";
    avDiv.innerHTML=`<i class="fas fa-user-circle"> User  </i><span>Online<span>`;
    
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled=false;
        setPlayVideo();
        document.querySelector('.video__element').appendChild(avDiv);
    }
    
    else{
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled=true;
        element=document.getElementById("avtar");
        element.parentNode.removeChild(element);
    }
}

const setStopVideo=()=>{
    const html=`
    <i class="stop fas fa-video"></i>
    <span>Stop Video</span>
    `
    document.querySelector(".main__video__button").innerHTML=html;
}
const setPlayVideo=()=>{
    const html=`
    <i class="play fas fa-video-slash"></i>
    <span>Play Video</span>
    `
    document.querySelector(".main__video__button").innerHTML=html;
}