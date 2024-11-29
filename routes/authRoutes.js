const express = require("express");
const {
  register,
  login,
  addFavourite,
  getFavourites,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/addfav/:userId", addFavourite);
router.get("/getfav/:userId", getFavourites);
module.exports = router;
