const express = require('express')
const app = express()
const path = require('path')
const mustacheExpress = require('mustache-express');
const session = require('express-session')
const router = express.Router()
const loginRoute = require('./routes/login')

app.engine('mustache', mustacheExpress());
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(express.static(path.join(__dirname, 'static')))

// Start a session
app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: true
}))
app.use("/login", loginRoute);

app.use(function(req, res, next){
  var activeSession = req.session;
  if(activeSession){
    if(activeSession.loggedIn){ // don't do anything
      next()
    }
    else{
      res.redirect('/login') //no active session > login
    }
  }
  else{
    res.redirect('/login')
  }
})

app.use(function(req, res, next){
  if(req.session.views){
    req.session.views += 1;
  }else{
    req.session.views = 1;
  }
  next()
})

app.get("/", function(req, res, next){
  res.render("index" ,{name:req.session.message, views:req.session.views})
})

app.post("/logout", function(req, res, next){
  req.session.destroy();
  res.redirect('/login')
})

app.listen(3000, function(){
  console.log("App running on port 3000")
})