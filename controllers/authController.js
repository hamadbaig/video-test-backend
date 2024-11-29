const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};
exports.addFavourite = async (req, res) => {
  const { userId } = req.params; // User ID passed as a route parameter
  const { movieId, movieData, name, price, genreName } = req.body; // Favourite data from request body

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create the new favourite object
    const newFavourite = { movieId, movieData, name, price, genreName };

    // Add the favourite to the user's favourites array
    user.favourites.push(newFavourite);

    // Save the updated user document
    await user.save();

    res.status(200).json({
      message: "Favourite added successfully",
      favourites: user.favourites,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding favourite", error });
  }
};
// exports.getFavourites = async (req, res) => {
//   const { userId } = req.params; // User ID passed as a route parameter

//   try {
//     // Find the user by ID and select only the favourites field
//     const user = await User.findById(userId).select("favourites");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({
//       message: "Favourites fetched successfully",
//       favourites: user.favourites,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching favourites", error });
//   }
// };
exports.getFavourites = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("favourites");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Favourites fetched successfully",
      favourites: user.favourites,
    });
  } catch (error) {
    console.error("Error fetching favourites:", error); // Log error details
    res.status(500).json({ message: "Error fetching favourites", error });
  }
};
