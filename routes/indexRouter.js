const express =require("express");
const router=express.Router();
const { v4:uuidv4}=require('uuid'); //for creating the the random room id

// router.get('/',(req,res)=>{
//     res.render("index");
// })

router.post()//this is for verification and storing the members in the database and showing the names in the chat and the video
//the above route is redirected to the /main route after adding the data in the datbase

app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`);
})

app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room})
})


module.exports=router;

