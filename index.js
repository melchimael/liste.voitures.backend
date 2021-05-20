const port = 3001;
require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')
const server = require('http').createServer(app)
const jwt = require('jsonwebtoken')
const io = require('socket.io')(server,{cors:{origin: "http://localhost:3000"}})
app.use(express.json())
app.use(cors({origin:'http://localhost:3000', credentials:true}))
app.use(cookieParser())
app.use(express.static('public'))
const usersModel = require('./models/users')
const voitureModel = require('./models/voitures')
const commentModel = require('./models/commentaires')
mongoose.connect("mongodb+srv://melchimael:cyh46AzHWNWitOih@reservation.6ijx7.mongodb.net/listevoitures?retryWrites=true&w=majority",{
    useNewUrlParser:true,
})
const checkUser = (req,res,next)=>{
    const cookie = req.cookies.user
    // console.log(cookie)
    try {
           const decode = jwt.verify(cookie,process.env.ACCESS_TOKEN_SECRET)
           req.headers.decode = decode
           req.headers.valid = true
        }
    catch{
        req.headers.valid = false
        console.log('err')
    }
    next()
}
app.post('/getInfoUser',checkUser,async(req,res)=>{
    res.send({...req.headers.decode,mdp:""})
})
app.post('/checkIfOnline',checkUser,(req,res)=>{
    res.send(req.headers.valid)
})

app.post('/getComments',async(req,res)=>{
    // res.send(req.body)
    commentModel.find({voitureId:req.body.voitureId}).exec((err,result)=>{
        res.send(result)
    })
    // if(req.headers.valid){
        
    // }else{
    //     res.send("You are a bad Hacker")
    // }
})

app.post('/comment',async(req,res)=>{
    const comment = new commentModel({
        userId:req.body.userId,
        commentaire:req.body.commentaire,
        voitureId:mongoose.Types.ObjectId(req.body.id),
        nomUser:req.body.nom,
        date:new Date()
    })
    try{
        comment.save();
    }catch(err)
    {
        console.log(err)
    }
    res.send("OK")
})

app.post('/disconnect',checkUser,(req,res)=>{
    if(req.headers.valid){
        res.clearCookie("user")
        res.send("utilisateur déconnecté")
    }else{
        res.send("error")
    }
})

app.post('/cookietest',checkUser,(req,res)=>{
    // console.log(req)
    console.log(req.headers.decode)
    console.log(req.headers.valid)
    // console.log(req.cookies)
})
app.post("/login",async(req,res)=>{
     const user = await usersModel.findOne({nom:req.body.nom}).lean()
        if(!user){
            res.send("Le nom d'utilisateur n'est pas reconnu")
        }else{
          if(await bcrypt.compare(req.body.mdp, user.mdp)){
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
          //   const userInfo = JSON.stringify(user)
                res.cookie("user",accessToken,{httpOnly:true,sameSite:"none", secure:true})
                res.send({message:"OK"})
            }else{
                res.send("Veuillez verifier le mot de passe")
            }
        }
//    const user = {
//         nom : req.body.nom,
//         mdp : req.body.mdp
//     }
//     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
//     res.json({accessToken : accessToken})
})
app.post("/addUser",async(req,res)=>{
    const user = new usersModel({
        nom:req.body.nom,
        mdp: await bcrypt.hash(req.body.mdp,10) 
    })
    try{
        user.save();
    }catch(err)
    {
    console.log(err)
    }
    res.send(req.body)
})

app.post("/getvoitures",async(req,res)=>{
    voitureModel.find({}).exec((err,result)=>{
        res.send(result)
    })
})
// commentModel.find({voitureId:"60a66fc4ef25192386b8fb8c"}).exec((err,result)=>{
//     console.log(result)
// })
io.on('connection', socket => {
    socket.on('comment',data => {
        const comment = new commentModel({
            userId:data.userId,
            commentaire:data.commentaire,
            voitureId:mongoose.Types.ObjectId(data.id),
            nomUser:data.nom,
            date:new Date()
        })
        try{
            comment.save();
            io.sockets.emit('comment'+data.id,data)
        }catch(err)
        {
            console.log(err)
        }
        // console.log(data)
    })
})
server.listen(port, ()=>{
    console.log("SERVER ONLINE");
})

