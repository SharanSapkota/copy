const express = require("express");
const { Evaluation, Rejections } = require("../../models/admin/Evaluation");
const evalFunctions = require("./functions/evaluations");

const router = express.Router();

// Get All Evaluation
const AuthController = require("../../controllers/authController");

router.get("/", AuthController.authAdmin, async (req, res) => {
  console.log(Evaluation);
  const getAllEvaluation = await Evaluation.find().populate("seller");

  res.status(200).json(getAllEvaluation);
});

router.get("/maintenance", AuthController.authAdmin, async (req, res) => {
  const getAllMaintenance = await Evaluation.find({
    "maintenance.status": true,
  });
  res.status(200).json(getAllMaintenance);
});

router.get("/dryclean", AuthController.authAdmin, async (req, res) => {
  const getAllDryClean = await Evaluation.find({ "dry_cleaning.status": true });
  res.status(200).json(getAllDryClean);
});

router.post(
  "/",
  AuthController.authAdmin,

  async (req, res) => {
    console.log("inside post evaluation");
    const { seller, items } = req.body;

    console.log(req.body);

    if (!seller || !items) {
      res
        .status(404)
        .json({ success: false, message: "seller or item is empty" });
    }

    // if(seller){

    //     evaluationDestructure.seller = req.body.seller
    // }

    try {
      let arr = [];

      items.forEach(async (post) => {
        const evaluationDestructure = {};
        evaluationDestructure.seller = req.body.seller;

        if (post.category) {
          console.log("category");
          evaluationDestructure.category = post.category;
        }
        if (post.selling_price) {
          evaluationDestructure.selling_price = post.selling_price;
        }

        if (post.color) {
          console.log("color");
          evaluationDestructure.color = post.color;
        }

        if (post.detail) {
          evaluationDestructure.detail = post.detail;
        }
        if (post.brand) {
          console.log("brand");
          evaluationDestructure.brand = post.brand;
        }
        if (post.date_of_receipt) {
          evaluationDestructure.date_of_receipt = post.date_of_receipt;
        }
        if (post.date_of_pickup) {
          evaluationDestructure.date_of_pickup = post.date_of_pickup;
        }

        const postEvaluation = new Evaluation(evaluationDestructure);
        await postEvaluation.save();
        arr.push(postEvaluation);
      });

      console.log(arr);
      res.status(200).json({ success: true,  evaluations: [...arr] });
    } catch (err) {
      res.status(404).json({ message: err });
    }
  }
);

//Get Evaluation By Id
router.get("/:evaluationId", async (req, res) => {
  const id = req.params.evaluationId;
  console.log(id);
  try {
    const getById = await evalFunctions.getEvalById(id);
    res.status(200).json(getById);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.patch(
  "/maintenancecomplete/:evaluationId",
  AuthController.authAdmin,
  async (req, res) => {
    try {
      const data = await Evaluation.findOneAndUpdate(
        { _id: req.params.evaluationId },
        {
          "maintenance.receivedDate": Date.now(),
        }
      );
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(200).send(err);
    }
  }
);

router.patch(
  "/drycleaningcomplete/:evaluationId",
  AuthController.authAdmin,
  async (req, res) => {
    try {
      const data = await Evaluation.findOneAndUpdate(
        { _id: req.params.evaluationId },
        {
          "dry_cleaning.receivedDate": Date.now(),
        }
      );
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(200).send(err);
    }
  }
);

router.patch("/:evaluationId", AuthController.authAdmin, async (req, res) => {
  const {
    category,
    color,
    brand,
    detail,
    selling_price,
  } = req.body;

  const evaluationDestructure = {};

  if (color) {
    evaluationDestructure.color = color;
  }
  if (detail) {
    evaluationDestructure.detail = detail;
  }
  if (brand) {
    evaluationDestructure.brand = brand;
  }
  if (category) {
    evaluationDestructure.category = category;
  }
  if (selling_price) {
    evaluationDestructure.selling_price = selling_price;
  }
  

  try {
    const patchAll = await Evaluation.findOneAndUpdate(
      { _id: req.params.evaluationId },
      { $set: evaluationDestructure },
      { new: true }
    ).populate("seller");
    res.status(200).json({success: true, evaluation: patchAll });
  } catch (err) {
    res.status(404).json({ success: false, errors: [{ msg: err}] });
  }
});

router.delete("/:evaluationId", AuthController.authAdmin, async (req, res) => {
  const deleteId = req.params.evaluationId;
  const data = await Evaluation.findById(deleteId);
  if (data != null) {
    data.remove();
    res.status(200).json({ message: "deleted" });
  } else {
    res.status(400).json({ message: "Evaluation not found" });
  }
});

router.patch(
  "/reject/:evaluationId",
  AuthController.authAdmin,
  async (req, res) => {
    const rejectId = req.params.evaluationId;
    try {
      await Evaluation.findOne({ _id: rejectId }, function (err, result) {
        let swap = new Rejections(result.toJSON()); //or result.toObject

        result.remove();
        swap.save();
        res.status(200).json(swap);
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
);

module.exports = router;
