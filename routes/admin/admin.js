const express = require("express");
const router = express.Router();
const Seller = require("../../models/admin/Seller");
const { Post } = require("../../models/Post");
const Evaluation = require("../../models/admin/Evaluation");
const { validationResult } = require("express-validator");
const multer = require("multer");
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const { s3Upload } = require("../../functions/s3upload");

const {
  postNewItem,
  changeClothingStatus,
} = require("../../functions/postFunctions");
const {
  getAllUsers,
  getAllUnregisteredUsers,
  getUnregisteredCount,
  deleteUnregisteredUser,
  verifyUser,
  movePostsToShop,
  editPost,
  deletePost,
  getUnpublishedPosts,
  getUnpublishedCount,
} = require("../../functions/admins/admin");
const AuthController = require("../../controllers/authController");

router.get("/seller", AuthController.authAdmin, async (req, res) => {
  const seller = await Seller.find();
  res.status(200).json(seller);
});

router.get("/seller/:sellerId", AuthController.authAdmin, async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.sellerId);
    res.json(seller);
  } catch (err) {
    res.json(err);
  }
});

router.get("/sellername/:name", async (req, res) => {
  const sellerName = req.params.name;

  const getAllSellers = await Seller.find({
    username: { $regex: req.params.name, $options: "i" },
  });

  return res.status(200).json({ success: true, getAllSellers });

  // const getSellerByName = getAllSellers.username
});

router.patch(
  "/seller/:sellerId",
  AuthController.authAdmin,
  async (req, res) => {
    const id = req.params.sellerId;
    const { username, email, phone_number } = req.body;
    try {
      const seller = await Seller.findOneAndUpdate(
        { _id: id },
        { username, email, phone_number },
        { new: true }
      );
      if (seller) {
        return res.status(200).json({ success: true, seller });
      } else {
        return res.status(404).json({ errors: [{ msg: "Seller not found." }] });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ errors: [{ msg: "Server Error." }] });
    }
  }
);

router.get("/posts", AuthController.authAdmin, async (req, res) => {
  try {
    const adminPosts = await Post.find({
      seller: req.user.id,
      isPublished: true,
    });
    res.status(200).json(adminPosts);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/posts/unpublished", AuthController.authAdmin, async (req, res) => {
  const page = parseInt(req.query.page);
  const admin = req.user.id;
  const count = await getUnpublishedCount();
  const unpublishedPosts = await getUnpublishedPosts(admin, page);
  return res.json({ posts: unpublishedPosts, count });
});

router.delete(
  "/unpublished/:id",
  AuthController.authAdmin,
  async (req, res) => {
    const deleted = await deletePost(req.params.id);
    return res.json(deleted);
  }
);

router.get("/posts/ecom", AuthController.authAdmin, async (req, res) => {
  try {
    const ecomPosts = await Post.find({ $neq: { seller: req.user.id } });
    res.status(200).json(ecomPosts);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/seller", AuthController.authAdmin, async (req, res) => {
  const data = req.body;
  let usercode = req.body.username
    .split(" ")
    .map((x) => {
      return x[0].toUpperCase();
    })
    .join("");

  // console.log(usercode)

  const seller = await Seller.find({
    usercode: { $regex: "^" + usercode + "[0-9]*$" },
  }).sort({ date: -1 });

  let tempCodeEnd;

  if (seller.length == 0) {
    tempCodeEnd = "000";
  } else {
    let tempCode = seller[0].usercode.match(/\d+/g);

    let tempCodeEndA = parseInt(tempCode[0], 10);

    tempCodeEndA++;

    if (tempCodeEndA < 9) {
      tempCodeEndA = "00" + tempCodeEndA;
    } else if (tempCodeEndA < 99) {
      tempCodeEndA = "0" + tempCodeEndA;
    } else {
      tempCodeEndA = tempCodeEndA;
    }

    tempCodeEnd = tempCodeEndA;
  }

  data.usercode = usercode.concat(tempCodeEnd);

  const sellers = new Seller(data);

  try {
    const savedSeller = await sellers.save();
    res.json(savedSeller);
  } catch (err) {
    res.json({ errors: [{ msg: "Server Error." }] });
  }
});

router.patch(
  "/unpublished/:id",
  AuthController.authAdmin,
  upload.fields([{ name: "images" }, { name: "data" }]),
  async (req, res) => {
    const images = req.files["images"];
    const id = req.params.id;

    const data = JSON.parse(req.body.data);

    var tempArr = [];

    if (!id) {
      return res
        .status(500)
        .json({ success: false, errors: [{ msg: "Internal Server Error." }] });
    }

    if (images !== undefined && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        tempArr.push(await s3Upload(images[i]));
      }
      data.images = tempArr;
    }

    const result = await editPost(id, data);

    return res.status(200).json(result);
  }
);

router.patch(
  "/users/verify/:id",
  AuthController.authAdmin,
  async (req, res) => {
    const id = req.params.id;

    const result = await verifyUser(id);

    if (result.success) {
      const moved = await movePostsToShop(id);

      return res.json({ verification: result, movePosts: moved });
    }
    return res.json(result);
  }
);

router.get("/users/verified", AuthController.authAdmin, async (req, res) => {
  const verified = await getAllUsers({ role: "1" });
  return res.json({ verified });
});

router.get(
  "/users/unregistered",
  AuthController.authAdmin,
  async (req, res) => {
    const page = parseInt(req.query.page);
    const unregistered = await getAllUnregisteredUsers(page);
    const count = await getUnregisteredCount();
    return res.json({ sellers: unregistered, count });
  }
);

router.get("/users/admin", AuthController.authAdmin, async (req, res) => {
  const admin = await getAllUsers({ role: "99" });
  return res.json({ admin });
});

router.get("/users/unverified", AuthController.authAdmin, async (req, res) => {
  const unverified = await getAllUsers({ role: "2" });
  return res.json({ unverified });
});

router.delete(
  "/users/unregistered",
  AuthController.authAdmin,
  async (req, res) => {
    const deleted = await deleteUnregisteredUser(req.body.id);
    return res.json(deleted);
  }
);

router.post(
  "/direct",
  AuthController.authAdmin,
  // upload.fields([{ name: "images" }, { name: "data" }]),
  upload.fields([{ name: "data" }]),
  async (req, res) => {
    // const images = req.files["images"];

    const data = JSON.parse(req.body.data);

    // let tempArr = [];

    // if (images !== undefined) {
    //   for (let i = 0; i < images.length; i++) {
    //     tempArr.push(await s3Upload(images[i]));
    //   }
    // }

    // data.images = tempArr;

    const seller = await Seller.findOne({ usercode: data.seller_code });

    var data1 = data.category;
    if (data1.includes("-")) {
      const splittedArr = data1.split("-");
      data1 = splittedArr[0] + splittedArr[1];
    }

    const categoryCode = data1.substring(0, 2).toUpperCase();
    const errors = validationResult(data);

    if (!errors.isEmpty()) {
      console.log("errors");
      res.end();
      // res.status(422).json({ success: false, errors: errors.array() });
    } else {
      const postClothings = {};

      postClothings.seller = req.user.id;

      postClothings.platform_fee = data.selling_price * 0.3;
      postClothings.commission = data.selling_price * 0.7;

      if (data.images) {
        postClothings.images = data.images;
      }

      if (data.listing_name) {
        postClothings.listing_name = data.listing_name;
      }

      if (data.gender) {
        postClothings.gender = data.gender;
      }
      if (data.category) {
        postClothings.category = data.category;
      }
      if (data.brand) {
        postClothings.brand = data.brand;
      }
      if (data.design) {
        postClothings.design = data.design;
      }
      if (data.description) {
        postClothings.description = data.description;
      }
      if (data.purchase_price) {
        postClothings.purchase_price = data.purchase_price;
      }
      if (data.selling_price) {
        postClothings.selling_price = data.selling_price;
      }
      if (data.condition) {
        postClothings.condition = data.condition;
      }
      if (data.measurements) {
        postClothings.measurements = data.measurements;
      }
      if (data.fabric) {
        postClothings.fabric = data.fabric;
      }
      if (data.color) {
        postClothings.color = data.color;
      }
      postClothings.originalSeller = seller.id;

      var asd = seller.usercode.concat(categoryCode);

      asd = asd.concat("-");

      const dataz = await Post.find({
        item_code: { $regex: "^" + asd + "[0-9]*-[0-9]*$" },
      }).sort({ date: -1 });

      let tempCode;

      if (dataz.length == 0) {
        tempCode = "001";
      } else {
        let temp = dataz[0].item_code.match(/\d+/g);

        let tempCodeEndA = parseInt(temp[1], 10);

        tempCodeEndA++;

        if (tempCodeEndA < 10) {
          tempCodeEndA = "00" + tempCodeEndA;
        }
        if (tempCodeEndA > 9 && tempCodeEndA < 100) {
          tempCodeEndA = "0" + tempCodeEndA;
        }

        tempCode = tempCodeEndA;
      }

      asd = asd.concat(tempCode);

      asd = asd.concat("-");

      asd = asd.concat(data.box_no);

      postClothings.item_code = asd;

      postClothings.box_no = parseInt(data.box_no);
      postClothings.isPublished = false;

      const post = await postNewItem(postClothings);

      res.send({ success: true, post });
    }
  }
);

router.post(
  "/post",
  AuthController.authAdmin,
  upload.fields([{ name: "images" }, { name: "data" }]),
  async (req, res, next) => {
    const images = req.files["images"];

    const data = JSON.parse(req.body.data);

    let tempArr = [];

    if (images !== undefined) {
      for (let i = 0; i < images.length; i++) {
        tempArr.push(await s3Upload(images[i]));
      }
    }

    data.images = tempArr;

    const seller = await Seller.findOne({ usercode: data.originalSeller });

    var data1 = data.category;
    if (data1.includes("-")) {
      const splittedArr = data1.split("-");
      data1 = splittedArr[0] + splittedArr[1];
    }

    const categoryCode = data1.substring(0, 2).toUpperCase();
    const errors = validationResult(data);

    if (!errors.isEmpty()) {
      console.log("errors");
      res.end();
      // res.status(422).json({ success: false, errors: errors.array() });
    } else {
      const postClothings = {};

      postClothings.seller = req.user.id;
      postClothings.sellerType = "Seller";
      postClothings.platform_fee = data.selling_price * 0.3;
      postClothings.commission = data.selling_price * 0.7;

      if (data.images) {
        postClothings.images = data.images;
      }

      if (data.listing_name) {
        postClothings.listing_name = data.listing_name;
      }

      if (data.gender) {
        postClothings.gender = data.gender;
      }
      if (data.category) {
        postClothings.category = data.category;
      }
      if (data.brand) {
        postClothings.brand = data.brand;
      }
      if (data.design) {
        postClothings.design = data.design;
      }
      if (data.description) {
        postClothings.description = data.description;
      }
      if (data.purchase_price) {
        postClothings.purchase_price = data.purchase_price;
      }
      if (data.selling_price) {
        postClothings.selling_price = data.selling_price;
      }
      if (data.purchase_date) {
        postClothings.purchase_date = data.purchase_date;
      }
      if (data.condition) {
        postClothings.condition = data.condition;
      }
      if (data.measurements) {
        postClothings.measurements = data.measurements;
      }
      if (data.fabric) {
        postClothings.fabric = data.fabric;
      }
      if (data.color) {
        postClothings.color = data.color;
      }
      if (data.originalSeller) {
        postClothings.originalSeller = seller.id;

        var asd = data.originalSeller.concat(categoryCode);

        asd = asd.concat("-");

        const dataz = await Post.find({
          item_code: { $regex: "^" + asd + "[0-9]*-[0-9]*$" },
        }).sort({ date: -1 });

        let tempCode;

        if (dataz.length == 0) {
          tempCode = "001";
        } else {
          let temp = dataz[0].item_code.match(/\d+/g);

          let tempCodeEndA = parseInt(temp[1], 10);

          tempCodeEndA++;

          if (tempCodeEndA < 10) {
            tempCodeEndA = "00" + tempCodeEndA;
          }
          if (tempCodeEndA > 9 && tempCodeEndA < 100) {
            tempCodeEndA = "0" + tempCodeEndA;
          }

          tempCode = tempCodeEndA;
        }

        asd = asd.concat(tempCode);

        asd = asd.concat("-");

        asd = asd.concat(data.boxNumber);

        postClothings.item_code = asd;
      }

      const post = postNewItem(postClothings);

      const ePost = await Evaluation.findByIdAndUpdate(
        { _id: data.evId },
        {
          status: "completed",
        }
      );

      res.send({ success: true });
    }
  }
);

module.exports = router;
