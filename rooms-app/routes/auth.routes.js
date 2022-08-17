const router = require("express").Router();
const bcryptjs = require('bcryptjs')
const saltRounds = 10
const User = require('../models/User.model')

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard')

/* Signup page */
router.get("/signup", isLoggedOut, (req, res) => {
  console.log('req session', req.session)
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res) => {
  // console.log(req.body)
  const {fullName, email, password} = req.body

  bcryptjs
  .genSalt(saltRounds)
  .then(salt => bcryptjs.hash(password, salt))
  .then(hashedPassword => {
    // console.log(`Pw hash: ${hashedPassword}`)
    return User.create({
      fullName,
      email, 
      passwordHash: hashedPassword
    })
  })
  .then(() => {
    // console.log('Newly created user is: ', userFromDB)
    res.redirect('/auth/login')
  })
  .catch(error => res.render("auth/signup", { errorMessage: error }))
});

  /* Profile page */
router.get("/profile", isLoggedIn, (req, res) => {
  console.log('profile page', req.session);
  const { email, fullName } = req.session.currentUser;
  res.render("auth/profile", { email, fullName });
});

  /* Login page */
router.get('/login', isLoggedOut, (req, res) => {
  console.log('req session', req.session)
  res.render('auth/login')
})

router.post('/login', isLoggedOut, (req, res) => {
  // console.log(req.body)
  const { email, password } = req.body;

 // Check for empty fields
  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }
  // 1. if the user is registered ==> meaning the user with provided email/username already exist in our app,
  User.findOne({ email })
      .then(user => {
        if (!user) {
          // 3. send an error message to the user if any of above is not valid,
          res.render('auth/login', { errorMessage: 'Email is not registered. Try with another email.' });
          return;
          // 2. if the password provided by the user is valid,
        } else if (bcryptjs.compareSync(password, user.passwordHash)) {
          // 4. if both are correct, let the user in the app.
          req.session.currentUser = user;
          res.render('auth/profile', user);
        } else {
          // 3. send an error message to the user if any of above is not valid,
          res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(err => console.log(err))
})

  /* Logout page */
router.post('/logout', isLoggedIn, (req, res) => {
  res.clearCookie('connect.sid');
  req.session.destroy(()=>{
    res.redirect('/auth/login')
  })
})

module.exports = router;