var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require('passport');
const upload = require("./multer");

const localStrategy = require("passport-local");
const posts = require('./posts');
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Expres' });
});

router.get("/login", function(req, res){
  res.render('login', {error: req.flash('error')});
})

router.get("/feed", function(req, res){
  res.render('feed');
})

router.get("/create", function(req,res){
  res.render('create');
})

router.post("/upload",isLoggedIn, upload.single("file"), async function(req, res, next){
  if(!req.file){
   return res.status(404).send("no files were given");
  }
  const user = await userModel.findOne({username: req.session.passport.user});
  const post = await postModel.create({
    Image: req.file.fieldname,
    imagetext: req.body.description,
    user: user._id
  });

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");

})

router.get("/profile",isLoggedIn, async function(req, res, next){
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  .populate("posts")
  
  console.log(user);
  res.render("profile", {user});
});

router.post("/register", function(req,res){
  const userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname,
  });
  userModel.register(userData, req.body.password)
    .then(function(){
      passport.authenticate("local")(req, res, function(){
        res.redirect("/profile");
      })
    })
});

router.post("/login", 
  passport.authenticate("local",{
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true
  })
,function(req, res){
});

router.get("/logout", function(req, res){
  req.logout(function(err){
    if (err){ return next(err); }
    res.redirect('/');
  });
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect("/");
}

module.exports = router;
