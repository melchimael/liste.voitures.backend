const port = 3001;
require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
app.use(express.json())
app.use(cors({origin:'http://localhost:3000', credentials:true}))
app.use(cookieParser())
const usersModel = require('./models/users')
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
app.post('/checkIfOnline',checkUser,(req,res)=>{
    res.send(req.headers.valid)
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

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
        if (err) return res.sendStatus(403)
        req.user = user 
        next()
    })
}

app.listen(port, ()=>{
    console.log("SERVER ONLINE");
})

