const express = require('express');
const {authmiddleware} = require('./middleware');
const app = express();
const jwt=require('jsonwebtoken')

app.use(express.json());

const USERS=[]
const NOTES=[]
const port = 3000;  

app.post('/signup', (req, res) => {
  const username=req.body.username;
  const password=req.body.password;

  if(!username || !password){
    res.status(400).json({message: "username and password required"})
    return
  }
  const userExsist=USERS.find(user=>user.username===username);
  if(userExsist){
    res.status(401).json({
        message: "user already exists"
    })
    return
  }
  USERS.push({username,password})
  res.json({message: 'user created'});

});
app.post('/signin', (req, res) => {
    const username=req.body.username;
    const password=req.body.password;

  if(!username || !password){
    res.status(400).json({message: "username and password required"})
    return
  }
  const userExsist=USERS.find(user=>user.username===username);
  if(!userExsist){
    res.status(401).json({
        message: "user not found"
    })
    return
  }
  if(userExsist.password !== password){
    res.status(401).json({
        message: "invalid password"
    })
    return
  }
  const token=jwt.sign({username:userExsist.username},"pass123")
  res.json({token: token});
});
app.post('/notes', authmiddleware, (req, res) => {
  const username=req.username;
  const title=req.body.title;
  const description=req.body.description;

  if(!title || !description){
    res.status(400).json({message: "title and description required"})
    return
  }
  NOTES.push({
    title:title,
    description:description,
    username:username
  })
  res.status(200).json({
    message: "new note added"
  })
});
app.get('/notes', authmiddleware, (req, res) => {
  const username=req.username;
  const userNote=NOTES.filter(note=>note.username===username)
  res.status(200).json(userNote);
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});