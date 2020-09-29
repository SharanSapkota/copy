const express = require("express");
const router = express.Router();
const Profile = require("../models/Profiles");
const UserDetails = require("../models/UserDetails");
const Users = require("../models/Users");

router.get("/", async (req, res) => {
  try {
    const getAllProfile = await Profile.find();
    res.json(getAllProfile);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/", async (req, res) => {
  const {
    userId,
    profile_picture,
    clothes_listed,
    followers,
    following,
    reviews
  } = req.body;

  const postProfile = {};

  if (clothes_listed) {
    postProfile.clothes_listed = req.body.clothes_listed;
  }
  if (followers) {
    postProfile.followers = req.body.followers;
  }
  if (following) {
    postProfile.following = req.body.following;
  }
  if (reviews) {
    postProfile.reviews = req.body.reviews;
  }

  try {
    const Profiles = new Profile(postProfile);

    const savedProfile = await Profiles.save();
    res.json(savedProfile);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/:username", async (req, res) => {
  let username = req.params.username;

  const getUser = await Users.findOne({ username }).select("-password");

  if (getUser && getUser.role == 1) {
    const getUserDetails = await UserDetails.findOne({ user: getUser.id });
    console.log(getUserDetails);
  }

  // try {
  //   const getProfileByUsername = await Profile.findOne({username});
  //   res.json(getProfileByUsername);
  // } catch (err) {
  //   res.json({ message: err });
  // }
});

// router.delete('/:profileId', async(req, res) => {

//     try{
//         const
//     }
// })

module.exports = router;
