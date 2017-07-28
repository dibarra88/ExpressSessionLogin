const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const router = express.Router();

const userList = [{ userName: 'test', password: 'test' },
{ userName: 'admin', password: 'admin' },
{ userName: 'tester', password: 'tester' }]

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))

router.get('/', function (req, res, next) {
    res.render("login")
})

//check if username enter is in our list (exists)
function isCurrentUser(userName) {
    var tmp = userList.filter(function (n) {
        return n.userName === userName;
    })[0]
    return tmp;        //return user if found
}

router.post('/', function (req, res, next) {
    var user = isCurrentUser(req.body.userName);
    if (user) {
        if (user.password === req.body.password) { //check passwords match
            req.session.userName = user.userName;   //start a session
            req.session.loggedIn = true;
            //res.render('index', { name: user.userName, views:req.session.views });
         req.session.message = req.body.userName;
        res.redirect('/')
        }
        else {
            res.render('login', { error: "Please enter correct username and/or password" });
        }
    }
    else {       //user doesn't exist so send to register
        res.render('login', {error:'Invalid username'})
    }

})
router.post('/register', function (req, res, next) {
        res.render('register')
})
router.post('/createAccount', function(req, res,next){
        var user = isCurrentUser(req.body.userName);
    if (user) {
        res.render('login', { error: "Username already exists" });
    }
    else {
        //create new user
        userList.push({ userName: req.body.userName, password: req.body.password });
        req.session.userName = req.body.userName;   //start a session
        req.session.loggedIn = true;
        req.session.message = req.body.userName;
        res.redirect('/')
    }
})


module.exports = router;