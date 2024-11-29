const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const favouriteSchema = new mongoose.Schema(
  {
    movieId: { type: String, required: true },
    movieData: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    genreName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  favourites: [favouriteSchema],
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", UserSchema);
