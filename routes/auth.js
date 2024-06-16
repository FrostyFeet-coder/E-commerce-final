const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');



router.get('/register' , (req,res)=>{
    res.render('auth/signup');
})

router.post('/register' , async(req,res)=>{
    try{
        let {email,username,password, role} = req.body;
        const user = new User({email,username, role});
        const newUser = await User.register(user,password);
        // res.send(newUser);
        req.login(newUser, function(err) {
            if (err) { return next(err); }
            req.flash('success' , 'welcome, you are registered successfully')
            return res.redirect('/products');
        });
    }
    catch(e){
        req.flash('error' , e.message);
        return res.redirect('/products');
    }
})

router.get('/login' , (req,res)=>{
    res.render('auth/login');
})
        
    
router.post('/login',
    passport.authenticate('local', { 
      
       failureRedirect: '/login', 
        failureMessage: true,
        failureFlash: 'Invalid username or password.'
    }),
    function(req, res) {
        // console.log(req.user);
        req.flash('success' , `welcome back ${req.user.username}`)
        res.redirect('/products');
    }
);
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "Logged in" });
});

router.get("/logout", (req, res) => {
    req.logout(function (err) {
      if (err) {
        req.flash("error", "error in logging out");
        return next(err);
      }
      req.flash("success", "goodbye friend");
      res.redirect("/login");
    });
  });

module.exports = router;