const express = require("express");
const { Evaluation, Rejections } = require("../../models/admin/Evaluation");
const evalFunctions = require("./functions/evaluations");

const router = express.Router();

// Get All Evaluation
const AuthController = require("../../controllers/authController");

router.get("/", AuthController.authAdmin, async (req, res) => {
  const getAllEvaluation = await Evaluation.find()
    .populate("seller")
    .sort({ date: -1 });

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
    const { seller, items } = req.body;

    if (!seller || !items) {
      res
        .status(404)
        .json({ success: false, message: "seller or item is empty" });
    }

    try {
      let evaluations = [];

      for (let i = 0; i < items.length; i++) {
        const evaluationDestructure = {};
        evaluationDestructure.seller = req.body.seller;

        if (items[i].category) {
          evaluationDestructure.category = items[i].category;
        }
        if (items[i].selling_price) {
          evaluationDestructure.selling_price = items[i].selling_price;
        }

        if (items[i].color) {
          evaluationDestructure.color = items[i].color;
        }

        if (items[i].detail) {
          evaluationDestructure.detail = items[i].detail;
        }
        if (items[i].brand) {
          evaluationDestructure.brand = items[i].brand;
        }
        if (items[i].date_of_receipt) {
          evaluationDestructure.date_of_receipt = items[i].date_of_receipt;
        }
        if (items[i].date_of_pickup) {
          evaluationDestructure.date_of_pickup = items[i].date_of_pickup;
        }

        const postEvaluation = new Evaluation(evaluationDestructure);
        // const saved = await postEvaluation.save();

        const post = await postEvaluation.save();
        await Evaluation.populate(post, { path: "seller" });

        evaluations.push(post);
      }

      res.status(200).json({ success: true, evaluations });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, errors: [{ message: err }] });
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
  const { category, color, brand, detail, selling_price } = req.body;

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
    res.status(200).json({ success: true, evaluation: patchAll });
  } catch (err) {
    res.status(404).json({ success: false, errors: [{ msg: err }] });
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
        try {
          let swap = new Rejections(result.toJSON()); //or result.toObject

          result.remove();
          swap.save();
          res.status(200).json({ success: true, swap });
        } catch (err) {
          return res.status(500).json({ message: err.message });
        }
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
