const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const Profile = require("../models/Profiles");
const UserDetails = require("../models/UserDetails");
const Users = require("../models/Users");
const AWSS3 = require("../lib/aws-s3");

router.get("/", async (req, res) => {
  try {
    const getAllProfile = await Profile.find();
    res.json(getAllProfile);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/:id", async (req, res) => {
  let userId = req.params.id;
  let { profile_picture } = req.body;

  let profileFields = {};

  profile_picture
    ? (profileFields.profile_picture = profile_picture)
    : (profileFields.profile_picture = "http://www.gravatar.com/avatar/?d=mp");
  if (userId) profileFields.userId = userId;

  try {
    const Profiles = new Profile(profileFields);

    const savedProfile = await Profiles.save();
    res.json(savedProfile);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post(
  "/profile_picture",
  upload.single("profile_picture"),
  async (req, res) => {
    const profile_picture = req.file;

    try {
      if (profile_picture) {
        AWSS3(profile_picture, 500, 500, "pp");
      }
    } catch (err) {
      res.json({ message: err });
    }
  }
);

router.get("/:username", async (req, res) => {
  let username = req.params.username;

  const getUser = await Users.findOne({ username: username }).select("id");

  if (getUser) {
    const profile = await Profile.findOne({ userId: getUser.id });

    if (profile) {
      res.status(200).json({
        success: true,
        msg: "Profile found.",
        profile: profile
      });
    } else {
      res.status(400).json({ errors: { msg: "Profile not found." } });
    }
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
