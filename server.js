const express=require('express');
const app=express();
const server=require('http') .Server(app);
const io=require("socket.io")(server)
const { v4:uuidv4}=require('uuid');
const {ExpressPeerServer}=require('peer');
const peerServer=ExpressPeerServer(server,{
    debug:true
});
app.use(express.static('public'));
app.set('view engine','pug')
app.use('/peerjs',peerServer);


app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`);
})

app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room})
})

io.on('connection',socket=>{
    socket.on('join-room',(roomId,userId)=>{   //this one listnes for the client and if any one joins the room a message is printerd in the console using the the socket.emit('join-room') on the client side
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected",userId)
    })
})





server.listen(80,()=>{
    console.log('the server started listning on the port 80')
});