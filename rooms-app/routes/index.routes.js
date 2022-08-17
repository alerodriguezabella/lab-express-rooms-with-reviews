const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  if(req.session.currentUser){
    const { email } = req.session.currentUser;
    res.render("index", {email});
  } else {
    res.render("index");
  }
});

module.exports = router;
