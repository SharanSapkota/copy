const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const Profile = require("../models/Profiles");
const UserDetails = require("../models/UserDetails");
const Users = require("../models/Users");
const AWSS3 = require("../lib/aws-s3");

const { getProfileById } = require("../functions/profileFunctions");

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

//GET PROFILE BY ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const profile = await getProfileById(id);
  console.log(profile);

  if (profile) return res.json(profile);
});

module.exports = router;
